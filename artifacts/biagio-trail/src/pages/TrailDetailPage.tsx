import { useState } from 'react';
import { ArrowLeft, Check, Heart, MapPin, Navigation, Star } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { trails } from '@/data/trails';
import { distanceLabel } from '@/components/TrailCard';

type TrailDetailPageProps = {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  unit: 'km' | 'mi';
};

export function TrailDetailPage({ favorites, onToggleFavorite, unit }: TrailDetailPageProps) {
  const params = useParams<{ id: string }>();
  const trail = trails.find((item) => item.id === params.id);
  const [planned, setPlanned] = useState(false);
  if (!trail) {
    return <div className="empty-state"><div className="empty-icon"><MapPin size={21} /></div><h2>That path wandered off</h2><p>We couldn't find this trail in the field guide.</p><Link href="/trails" className="action-button">Back to trails</Link></div>;
  }
  const isFavorite = favorites.includes(trail.id);
  return (
    <div data-testid={`page-trail-detail-${trail.id}`}>
      <div className="detail-hero-outer">
        <section className="trail-detail-hero" style={{ backgroundImage: `url("${trail.image}")` }}>
          <Link href="/trails" className="detail-back" data-testid="link-back-trails"><ArrowLeft size={14} /> All trails</Link>
          <div className="detail-favorite">
            <button className={`favorite-button ${isFavorite ? 'active favorite-pop' : ''}`} type="button" onClick={() => onToggleFavorite(trail.id)} aria-label={isFavorite ? 'Remove from saved trails' : 'Save trail'} data-testid="button-detail-favorite">
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="detail-hero-content">
            <div className="eyebrow" style={{ color: 'hsl(45 90% 67%)' }}>{trail.region} · {trail.province}</div>
            <h1>{trail.name}</h1>
            <p><Star size={12} fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '.25rem', color: 'hsl(45 90% 67%)' }} /> {trail.rating} from {trail.reviewCount} route notes</p>
          </div>
        </section>
      </div>
      <div className="detail-content">
        <div className="stat-row">
          <div className="stat-tile"><div className="stat-tile-label">Distance</div><div className="stat-tile-value">{distanceLabel(trail.distanceKm, unit)}</div></div>
          <div className="stat-tile"><div className="stat-tile-label">Elevation</div><div className="stat-tile-value">{trail.elevationM} m</div></div>
          <div className="stat-tile"><div className="stat-tile-label">Moving time</div><div className="stat-tile-value">{trail.duration}</div></div>
          <div className="stat-tile"><div className="stat-tile-label">Effort</div><div className="stat-tile-value">{trail.difficulty}</div></div>
        </div>
        <section className="detail-panel">
          <div className="eyebrow">Route note</div>
          <h2>Go for the view.</h2>
          <p>{trail.description}</p>
          <ul className="highlight-list">{trail.highlights.map((highlight) => <li key={highlight}><Check size={15} strokeWidth={2.5} />{highlight}</li>)}</ul>
        </section>
        <section className="detail-panel map-panel">
          <div className="map-label">Route orientation</div>
          <div className="route-line" />
          <div className="map-pin start" />
          <div className="map-pin end" />
          <div style={{ position: 'absolute', bottom: '.8rem', left: '.9rem', color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--app-font-mono)', fontSize: '.61rem' }}>{trail.coordinates}</div>
        </section>
        <section className="detail-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <div><div className="eyebrow">Before you go</div><h2>Make a little plan.</h2></div>
            <Navigation size={20} color="hsl(var(--primary))" />
          </div>
          <p>Save this route, check the local forecast, and download the notes if you’ll be out of signal.</p>
          <button className="action-button full" type="button" onClick={() => setPlanned(true)} data-testid="button-plan-trail">{planned ? <><Check size={15} /> Route marked ready</> : <>Mark route ready <ArrowLeft size={15} style={{ transform: 'rotate(180deg)' }} /></>}</button>
          {planned && <div className="planning-note" data-testid="status-route-planned">Good call. Your route is ready in your saved notebook.</div>}
        </section>
      </div>
    </div>
  );
}