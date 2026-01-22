-- =====================================================
-- profiles 테이블 마이그레이션 (기존 Supabase에 추가 실행)
-- =====================================================
-- 이미 users 테이블이 있는 경우, profiles 테이블을 추가하고 데이터를 복사합니다.

-- 1. profiles 테이블 생성
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'unlimited', 'agency')),
  plan_started_at TIMESTAMPTZ,
  plan_expires_at TIMESTAMPTZ,
  plan_pages_limit INTEGER DEFAULT 3,
  plan_features JSONB DEFAULT '{}',
  referral_code TEXT,
  referred_by TEXT,
  referral_count INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  kakao_linked BOOLEAN DEFAULT false,
  google_linked BOOLEAN DEFAULT false,
  api_settings JSONB DEFAULT '{}',
  crm_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 기존 users 테이블 데이터를 profiles로 복사 (충돌 시 무시)
INSERT INTO profiles (id, email, name, avatar_url, role, plan, created_at, updated_at)
SELECT id, email, name, avatar_url,
  COALESCE(role, 'user'),
  COALESCE(plan, 'free'),
  created_at, updated_at
FROM users
ON CONFLICT (email) DO NOTHING;

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- 4. RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS 정책 (Service Role Key는 RLS 무시하므로 API에서는 작동함)
DROP POLICY IF EXISTS "Profiles are viewable by owner" ON profiles;
CREATE POLICY "Profiles are viewable by owner" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profiles are insertable" ON profiles;
CREATE POLICY "Profiles are insertable" ON profiles
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Profiles are updatable by owner" ON profiles;
CREATE POLICY "Profiles are updatable by owner" ON profiles
  FOR UPDATE USING (true);

-- 6. 업데이트 트리거
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 7. landing_pages 외래키를 profiles로도 연결 (선택사항)
-- ALTER TABLE landing_pages DROP CONSTRAINT IF EXISTS landing_pages_user_id_fkey;
-- ALTER TABLE landing_pages ADD CONSTRAINT landing_pages_user_id_fkey
--   FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- =====================================================
-- 실행 완료!
-- admin 페이지에서 회원 목록이 보이는지 확인하세요.
-- =====================================================
