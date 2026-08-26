import { Bookmark, Map } from 'lucide-react';
import { Link } from 'wouter';
import { TrailCard } from '@/components/TrailCard';
import { trails } from '@/data/trails';

type FavoritesPageProps = {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  unit: 'km' | 'mi';
};

export function FavoritesPage({ favorites, onToggleFavorite, unit }: FavoritesPageProps) {
  const savedTrails = trails.filter((trail) => favorites.includes(trail.id));
  return (
    <div data-testid="page-favorites">
      <header className="page-header">
        <div className="eyebrow">Your trail notebook</div>
        <h1 className="page-title">Saved for later.</h1>
        <p className="page-description">Keep the routes that made you pause. They’ll stay here on this device, ready when the weekend opens up.</p>
      </header>
      {savedTrails.length ? (
        <>
          <div className="results-line" data-testid="text-favorites-count">{savedTrails.length} saved {savedTrails.length === 1 ? 'trail' : 'trails'}</div>
          <div className="trail-grid">{savedTrails.map((trail) => <TrailCard key={trail.id} trail={trail} isFavorite onToggleFavorite={onToggleFavorite} unit={unit} />)}</div>
        </>
      ) : (
        <div className="empty-state" data-testid="empty-favorites">
          <div className="empty-icon"><Bookmark size={21} /></div>
          <h2>Your notebook is open</h2>
          <p>Tap the heart on any route you want to remember. Build a little list of places to go next.</p>
          <Link href="/trails" className="action-button" data-testid="link-empty-explore"><Map size={15} /> Browse trails</Link>
        </div>
      )}
    </div>
  );
}