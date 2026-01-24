'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface DashboardData {
  stats: { totalPages: number; totalSubmissions: number; newSubmissions: number; conversionRate: number };
  pages: Array<{ id: string; title: string; slug: string; status: string; viewCount: number; submissionCount: number; newSubmissionCount: number; createdAt: string }>;
  plan: { id: string; name: string; pageLimit: number; pagesRemaining: number };
  isAdmin: boolean;
}

const notices = [
  { id: '1', important: true, title: '랜딩페이지 메이커 정식 오픈!', content: 'AI가 자동으로 카피라이팅을 작성해주는 랜딩페이지 제작 서비스입니다.', date: '2025. 01. 11.' },
  { id: '2', important: false, title: 'AI 카피라이팅 기능 업데이트', content: '더욱 자연스러운 카피를 생성할 수 있도록 업그레이드 되었습니다.', date: '2025. 01. 10.' },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const userName = session?.user?.name || '사용자';
  const userRole = (session?.user as any)?.role || 'user';
  const isAdmin = userRole === 'admin';

  useEffect(() => { fetchData(); fetchPoints(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) setData(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchPoints = async () => {
    try {
      const res = await fetch('/api/points');
      if (res.ok) {
        const data = await res.json();
        setPoints(data.points || 0);
      }
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #3182F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* 사이드바 */}
      <aside style={{
        width: collapsed ? 72 : 240,
        background: '#fff',
        borderRight: '1px solid #F2F4F6',
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        transition: 'width 0.15s ease',
        zIndex: 100,
      }}>
        {/* 로고 */}
        <div style={{ padding: collapsed ? '24px 0' : '24px 20px', textAlign: collapsed ? 'center' : 'left' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#3182F6' }}>
              {collapsed ? 'L' : '랜딩메이커'}
            </span>
          </Link>
        </div>

        {/* 유저 정보 */}
        {!collapsed && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #F2F4F6', borderBottom: '1px solid #F2F4F6' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#191F28', margin: 0 }}>{userName}</p>
            <p style={{ fontSize: 13, color: '#3182F6', fontWeight: 500, margin: '4px 0 0' }}>{points.toLocaleString()}P</p>
          </div>
        )}

        {/* 메뉴 */}
        <nav style={{ padding: '16px 12px' }}>
          <MenuItem label="공지사항" href="#notices" badge={notices.length} collapsed={collapsed} />
          <MenuItem label="대시보드" href="/dashboard" active collapsed={collapsed} />
          <MenuItem label="내 페이지" href="/pages" collapsed={collapsed} />
          <MenuItem label="고객 신청" href="/submissions" badge={data?.stats.newSubmissions || 0} collapsed={collapsed} />
          <MenuItem label="페이지 만들기" href="/create/free" isNew collapsed={collapsed} />
          <MenuItem label="샘플" href="/samples" collapsed={collapsed} />
          <MenuItem label="콘텐츠 생성" href="/content" isNew collapsed={collapsed} />
          <div style={{ height: 1, background: '#F2F4F6', margin: '16px 0' }} />
          <MenuItem label="포인트 충전" href="/points" collapsed={collapsed} />
          <MenuItem label="친구 초대" href="/referral" isNew collapsed={collapsed} />
          <MenuItem label="설정" href="/settings" collapsed={collapsed} />
          {isAdmin && (
            <>
              <div style={{ height: 1, background: '#F2F4F6', margin: '16px 0' }} />
              <div style={{ padding: collapsed ? '8px 0' : '8px 12px', marginBottom: 4 }}>
                {!collapsed && <span style={{ fontSize: 11, fontWeight: 600, color: '#ADB5BD' }}>관리자</span>}
              </div>
              <MenuItem label="회원관리" href="/admin/users" collapsed={collapsed} />
              <MenuItem label="결제내역" href="/admin/payments" collapsed={collapsed} />
            </>
          )}
        </nav>

        {/* 접기 */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          position: 'absolute', right: -14, top: 60,
          width: 28, height: 28, background: '#fff', border: '1px solid #E5E8EB',
          borderRadius: '50%', cursor: 'pointer', fontSize: 12, color: '#8B95A1',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          {collapsed ? '→' : '←'}
        </button>
      </aside>

      {/* 메인 */}
      <main style={{ flex: 1, marginLeft: collapsed ? 72 : 240, transition: 'margin 0.15s ease' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>

          {/* 공지사항 */}
          <section id="notices" style={{ marginBottom: 32 }}>
            <div style={{ background: '#3182F6', borderRadius: '16px 16px 0 0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>공지사항</span>
              {isAdmin && <Link href="/admin/notices" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, textDecoration: 'none' }}>관리 →</Link>}
            </div>
            <div style={{ background: '#fff', border: '1px solid #E5E8EB', borderTop: 'none', borderRadius: '0 0 16px 16px' }}>
              {notices.map((n, i) => (
                <div key={n.id} style={{ padding: '16px 20px', borderBottom: i < notices.length - 1 ? '1px solid #F2F4F6' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {n.important && <span style={{ background: '#FFF0F0', color: '#FF4D4D', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>중요</span>}
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>{n.title}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#6B7684', margin: '4px 0', lineHeight: 1.5 }}>{n.content}</p>
                  <span style={{ fontSize: 12, color: '#ADB5BD' }}>{n.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 헤더 */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#191F28', margin: 0 }}>대시보드</h1>
            <p style={{ fontSize: 14, color: '#6B7684', margin: '4px 0 0' }}>{userName}님, 환영합니다</p>
          </div>

          {/* 통계 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <Link href="/points" style={{ textDecoration: 'none' }}>
              <Card label="포인트 잔액" value={points.toLocaleString()} unit="P" highlight clickable />
            </Link>
            <Link href="/submissions?status=new" style={{ textDecoration: 'none' }}>
              <Card label="새 신청" value={data?.stats.newSubmissions || 0} unit="건" clickable />
            </Link>
            <Link href="/submissions" style={{ textDecoration: 'none' }}>
              <Card label="총 신청" value={data?.stats.totalSubmissions || 0} unit="건" clickable />
            </Link>
            <Link href="/pages" style={{ textDecoration: 'none' }}>
              <Card label="내 페이지" value={data?.stats.totalPages || 0} unit="개" clickable />
            </Link>
          </div>

          {/* 신청 현황 */}
          <div style={{ background: '#fff', border: '1px solid #E5E8EB', borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#191F28', margin: 0 }}>고객 신청 현황</h3>
              <Link href="/submissions" style={{ fontSize: 13, color: '#3182F6', textDecoration: 'none' }}>전체보기</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <Status label="새 신청" value={data?.stats.newSubmissions || 0} color="#3182F6" bg="#E8F3FF" />
              <Status label="연락함" value={0} color="#FF9F43" bg="#FFF4E6" />
              <Status label="완료" value={0} color="#20C997" bg="#E6FCF5" />
              <Status label="취소" value={0} color="#FF6B6B" bg="#FFF0F0" />
            </div>
          </div>

          {/* 최근 작업 */}
          <div style={{ background: '#fff', border: '1px solid #E5E8EB', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F2F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#191F28', margin: 0 }}>최근 작업</h3>
              <Link href="/pages" style={{ fontSize: 14, color: '#3182F6', textDecoration: 'none' }}>전체보기 →</Link>
            </div>
            {(data?.pages?.length || 0) > 0 ? (
              data?.pages.slice(0, 5).map((p) => (
                <div key={p.id} style={{ padding: '14px 20px', borderBottom: '1px solid #F2F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                      background: p.status === 'published' ? '#E6FCF5' : '#F2F4F6',
                      color: p.status === 'published' ? '#20C997' : '#6B7684',
                    }}>{p.status === 'published' ? '게시중' : '임시저장'}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#191F28' }}>{p.title}</span>
                    {p.newSubmissionCount > 0 && (
                      <span style={{ background: '#FFF0F0', color: '#FF6B6B', padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>NEW</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, color: '#ADB5BD' }}>{new Date(p.createdAt).toLocaleDateString('ko-KR')}</span>
                    <Link href={`/pages/${p.id}`} style={{ padding: '6px 12px', background: '#F2F4F6', color: '#4E5968', borderRadius: 8, fontSize: 13, textDecoration: 'none' }}>관리</Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 15, color: '#6B7684', marginBottom: 16 }}>아직 만든 페이지가 없어요</p>
                <Link href="/create/free" style={{
                  display: 'inline-block', padding: '12px 24px',
                  background: '#3182F6', color: '#fff', borderRadius: 12,
                  fontSize: 15, fontWeight: 600, textDecoration: 'none',
                }}>첫 페이지 만들기</Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) { aside { display: none !important; } main { margin-left: 0 !important; } }
        @media (max-width: 640px) { main > div > div:nth-child(4) { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </div>
  );
}

function MenuItem({ label, href, active, badge, isNew, collapsed }: any) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
      padding: '10px 12px', borderRadius: 8, marginBottom: 2, textDecoration: 'none',
      background: active ? '#E8F3FF' : 'transparent',
      color: active ? '#3182F6' : '#4E5968',
    }}>
      <span style={{ fontSize: 14, fontWeight: active ? 600 : 400 }}>{collapsed ? label.charAt(0) : label}</span>
      {!collapsed && (isNew || badge) && (
        <div style={{ display: 'flex', gap: 4 }}>
          {isNew && <span style={{ background: '#3182F6', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>NEW</span>}
          {badge && <span style={{ background: '#F2F4F6', color: '#6B7684', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{badge}</span>}
        </div>
      )}
    </Link>
  );
}

function Card({ label, value, unit, highlight, clickable }: { label: string; value: number | string; unit: string; highlight?: boolean; clickable?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        background: highlight ? '#3182F6' : '#fff',
        border: highlight ? 'none' : '1px solid #E5E8EB',
        borderRadius: 16, padding: 20,
        cursor: clickable ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: clickable && hover ? 'translateY(-2px)' : 'none',
        boxShadow: clickable && hover ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
      }}
      onMouseEnter={() => clickable && setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p style={{ fontSize: 13, color: highlight ? 'rgba(255,255,255,0.8)' : '#6B7684', margin: '0 0 8px' }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: highlight ? '#fff' : '#191F28', margin: 0 }}>
        {value}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>{unit}</span>
      </p>
      {clickable && highlight && (
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '8px 0 0' }}>충전하기</p>
      )}
    </div>
  );
}

function Status({ label, value, color = '#6B7684', bg = '#F2F4F6' }: { label: string; value: number; color?: string; bg?: string }) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
      <p style={{ fontSize: 12, color: '#6B7684', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700, color, margin: 0 }}>{value}</p>
    </div>
  );
}
