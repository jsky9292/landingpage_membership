-- =====================================================
-- 랜딩AI SaaS - Supabase 데이터베이스 스키마
-- =====================================================
-- 이 SQL을 Supabase SQL Editor에서 실행하세요.

-- 1. 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  -- 플랜/구독 관련 필드
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'unlimited', 'agency')),
  plan_started_at TIMESTAMPTZ,
  plan_expires_at TIMESTAMPTZ,
  plan_pages_limit INTEGER DEFAULT 3, -- 플랜별 페이지 생성 제한
  plan_features JSONB DEFAULT '{}', -- 플랜별 추가 기능 설정
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 랜딩페이지 테이블
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  topic TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INTEGER DEFAULT 0,
  company_name TEXT, -- 업체명 (개인정보 동의서에 사용)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 3. 신청/문의 테이블
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'rejected')),
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_landing_pages_user_id ON landing_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_status ON landing_pages(status);
CREATE INDEX IF NOT EXISTS idx_submissions_page_id ON submissions(page_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- 5. 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. 업데이트 트리거 적용
DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS landing_pages_updated_at ON landing_pages;
CREATE TRIGGER landing_pages_updated_at
  BEFORE UPDATE ON landing_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS submissions_updated_at ON submissions;
CREATE TRIGGER submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 7. RLS (Row Level Security) 정책
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 정보만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR role = 'admin');

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- 사용자는 자신의 페이지만 CRUD 가능, 관리자는 모든 페이지 접근 가능
CREATE POLICY "Users can view own pages" ON landing_pages
  FOR SELECT USING (
    user_id::text = auth.uid()::text
    OR EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
  );

CREATE POLICY "Users can create own pages" ON landing_pages
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own pages" ON landing_pages
  FOR UPDATE USING (
    user_id::text = auth.uid()::text
    OR EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
  );

CREATE POLICY "Users can delete own pages" ON landing_pages
  FOR DELETE USING (
    user_id::text = auth.uid()::text
    OR EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
  );

-- 공개된 페이지는 누구나 볼 수 있음
CREATE POLICY "Anyone can view published pages" ON landing_pages
  FOR SELECT USING (status = 'published');

-- 신청 데이터: 페이지 소유자 또는 관리자만 접근 가능
CREATE POLICY "Page owners can view submissions" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM landing_pages lp
      WHERE lp.id = submissions.page_id
      AND (lp.user_id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'))
    )
  );

CREATE POLICY "Anyone can create submissions" ON submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Page owners can update submissions" ON submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM landing_pages lp
      WHERE lp.id = submissions.page_id
      AND (lp.user_id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'))
    )
  );

-- 8. 뷰: 페이지별 신청 통계
CREATE OR REPLACE VIEW page_stats AS
SELECT
  lp.id,
  lp.user_id,
  lp.title,
  lp.slug,
  lp.status,
  lp.view_count,
  lp.created_at,
  COUNT(s.id) as submission_count,
  COUNT(CASE WHEN s.status = 'new' THEN 1 END) as new_submission_count
FROM landing_pages lp
LEFT JOIN submissions s ON lp.id = s.page_id
GROUP BY lp.id;

-- 9. 뷰: 대시보드 통계 (사용자별)
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  u.id as user_id,
  COUNT(DISTINCT lp.id) as total_pages,
  COALESCE(SUM(lp.view_count), 0) as total_views,
  COUNT(s.id) as total_submissions,
  COUNT(CASE WHEN s.status = 'new' THEN 1 END) as new_submissions,
  CASE
    WHEN COALESCE(SUM(lp.view_count), 0) > 0
    THEN ROUND((COUNT(s.id)::numeric / SUM(lp.view_count) * 100), 1)
    ELSE 0
  END as conversion_rate
FROM users u
LEFT JOIN landing_pages lp ON u.id = lp.user_id
LEFT JOIN submissions s ON lp.id = s.page_id
GROUP BY u.id;

-- 10. 관리자 계정 생성 (이메일을 본인 이메일로 변경하세요!)
-- INSERT INTO users (email, name, role) VALUES ('admin@example.com', '관리자', 'admin');

-- =====================================================
-- 실행 완료 후 확인 사항:
-- 1. Supabase Authentication 설정에서 카카오/구글 OAuth 활성화
-- 2. .env.local에 Supabase URL과 키 입력
-- 3. 관리자 계정 INSERT 문 실행 (이메일 수정 필요)
-- =====================================================
