-- =====================================================
-- 플랜/구독 기능 마이그레이션
-- =====================================================
-- 기존 Supabase 데이터베이스에 플랜 필드를 추가하는 마이그레이션입니다.
-- Supabase SQL Editor에서 실행하세요.

-- 1. users 테이블에 플랜 관련 컬럼 추가
ALTER TABLE users
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'unlimited', 'agency'));

ALTER TABLE users
ADD COLUMN IF NOT EXISTS plan_started_at TIMESTAMPTZ;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS plan_pages_limit INTEGER DEFAULT 3;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS plan_features JSONB DEFAULT '{}';

-- 2. 플랜 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);
CREATE INDEX IF NOT EXISTS idx_users_plan_expires ON users(plan_expires_at);

-- 3. 플랜별 기본 설정
-- free: 3 페이지, basic: 10 페이지, pro: 무제한, enterprise: 무제한
COMMENT ON COLUMN users.plan IS '사용자 플랜 (free, basic, pro, enterprise)';
COMMENT ON COLUMN users.plan_started_at IS '플랜 시작일';
COMMENT ON COLUMN users.plan_expires_at IS '플랜 만료일 (NULL이면 무기한)';
COMMENT ON COLUMN users.plan_pages_limit IS '생성 가능한 페이지 수 제한';
COMMENT ON COLUMN users.plan_features IS '플랜별 추가 기능 설정 (JSON)';

-- 4. 기존 사용자들에게 기본 플랜 설정
UPDATE users
SET plan = 'free', plan_pages_limit = 3
WHERE plan IS NULL;

-- 5. 관리자에게는 enterprise 플랜 자동 부여
UPDATE users
SET plan = 'agency', plan_pages_limit = -1
WHERE role = 'admin';

-- =====================================================
-- 플랜별 기능 설명:
--
-- free (무료):
--   - 페이지 3개 제한
--   - 기본 테마만 사용 가능
--   - AI 생성 월 10회 제한
--
-- basic (기본):
--   - 페이지 10개 제한
--   - 모든 테마 사용 가능
--   - AI 생성 월 50회 제한
--   - 커스텀 도메인 1개
--
-- pro (프로):
--   - 페이지 무제한
--   - 모든 테마 사용 가능
--   - AI 생성 무제한
--   - 커스텀 도메인 5개
--   - 우선 지원
--
-- enterprise (엔터프라이즈):
--   - 모든 기능 무제한
--   - 전담 지원
--   - API 액세스
-- =====================================================
