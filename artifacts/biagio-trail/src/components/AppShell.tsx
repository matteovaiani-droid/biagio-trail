import { type ReactNode } from 'react';
import { useLocation, Link } from 'wouter';
import { Compass, Heart, Home, Map, Settings2, Sunrise, CloudSun } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Discover', icon: Home },
  { href: '/trails', label: 'Trails', icon: Map },
  { href: '/favorites', label: 'Saved', icon: Heart },
  { href: '/settings', label: 'Settings', icon: Settings2 },
];

export function Brand() {
  return (
    <Link href="/" className="brand-mark" data-testid="link-brand">
      <span className="brand-symbol"><Compass size={18} strokeWidth={2.4} /></span>
      <span className="wordmark">BIAGIO TRAIL</span>
    </Link>
  );
}

function Navigation({ rail = false }: { rail?: boolean }) {
  const [location] = useLocation();
  return (
    <nav className={rail ? 'rail-nav' : 'bottom-nav'} aria-label="Main navigation">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? location === '/' : location.startsWith(href);
        return (
          <Link
            href={href}
            className={`nav-item ${active ? 'active' : ''}`}
            data-testid={`link-nav-${label.toLowerCase()}`}
            key={href}
          >
            <Icon size={rail ? 17 : 19} strokeWidth={active ? 2.3 : 1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="desktop-rail">
        <Brand />
        <div className="rail-label">Your field guide</div>
        <Navigation rail />
        <div className="rail-bottom">
          <Sunrise size={17} />
          <p style={{ marginTop: '.55rem' }}>Clear mornings make good stories. Check your route, then take the long way.</p>
        </div>
      </aside>
      <header className="mobile-topbar">
        <Brand />
        <div className="weather-pill" data-testid="status-weather">
          <CloudSun size={14} />
          <span>18° · clear</span>
        </div>
      </header>
      <main className="main-area">
        <div className="content-width page-enter">{children}</div>
      </main>
      <Navigation />
    </div>
  );
}