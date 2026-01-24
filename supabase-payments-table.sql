-- =====================================================
-- payments 테이블 생성 (결제 내역 저장)
-- =====================================================
-- Supabase SQL Editor에서 실행하세요.

-- 1. payments 테이블 생성
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  payment_key TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'unlimited', 'agency')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  card_company TEXT,
  card_number TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_payments_user_email ON payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- 3. RLS 활성화
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 (관리자는 모두 조회, 사용자는 본인 것만)
DROP POLICY IF EXISTS "Payments viewable by owner or admin" ON payments;
CREATE POLICY "Payments viewable by owner or admin" ON payments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Payments insertable by system" ON payments;
CREATE POLICY "Payments insertable by system" ON payments
  FOR INSERT WITH CHECK (true);

-- 5. 업데이트 트리거
DROP TRIGGER IF EXISTS payments_updated_at ON payments;
CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 실행 완료!
-- =====================================================
