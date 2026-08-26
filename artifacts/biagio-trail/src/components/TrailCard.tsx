import { Link } from 'wouter';
import { Clock3, Heart, Mountain, Star, TrendingUp } from 'lucide-react';
import type { Trail } from '@/data/trails';

type TrailCardProps = {
  trail: Trail;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  unit: 'km' | 'mi';
};

function distanceLabel(distanceKm: number, unit: 'km' | 'mi') {
  return unit === 'km' ? `${distanceKm.toFixed(1)} km` : `${(distanceKm * 0.621371).toFixed(1)} mi`;
}

function difficultyClass(difficulty: Trail['difficulty']) {
  return difficulty.toLowerCase();
}

export function TrailCard({ trail, isFavorite, onToggleFavorite, unit }: TrailCardProps) {
  return (
    <article className="trail-card stagger-item" data-testid={`card-trail-${trail.id}`}>
      <Link href={`/trails/${trail.id}`} className="trail-card-image" style={{ backgroundImage: `url("${trail.image}")` }} data-testid={`link-trail-${trail.id}`} aria-label={`View ${trail.name}`} />
      <div className="trail-card-body">
        <div className="trail-card-region">{trail.region} · {trail.province}</div>
        <Link href={`/trails/${trail.id}`} style={{ color: 'inherit', textDecoration: 'none' }} data-testid={`link-trail-name-${trail.id}`}>
          <h3 className="trail-card-name">{trail.name}</h3>
        </Link>
        <span className={`difficulty ${difficultyClass(trail.difficulty)}`}>{trail.difficulty}</span>
        <div className="trail-card-stats">
          <span><TrendingUp size={12} />{trail.elevationM} m</span>
          <span><Mountain size={12} />{distanceLabel(trail.distanceKm, unit)}</span>
          <span><Clock3 size={12} />{trail.duration}</span>
          <span><Star size={12} fill="currentColor" />{trail.rating}</span>
        </div>
      </div>
      <button
        className={`favorite-button ${isFavorite ? 'active favorite-pop' : ''}`}
        type="button"
        aria-label={isFavorite ? `Remove ${trail.name} from saved trails` : `Save ${trail.name}`}
        onClick={() => onToggleFavorite(trail.id)}
        data-testid={`button-favorite-${trail.id}`}
      >
        <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}

export { distanceLabel };