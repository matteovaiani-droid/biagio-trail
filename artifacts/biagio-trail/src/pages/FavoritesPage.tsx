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
        <div className="eyebrow">Il tuo taccuino dei sentieri</div>
        <h1 className="page-title">Salvati per dopo.</h1>
        <p className="page-description">Conserva i percorsi che ti hanno fatto fermare. Resteranno su questo dispositivo, pronti quando arriverà il prossimo weekend.</p>
      </header>
      {savedTrails.length ? (
        <>
          <div className="results-line" data-testid="text-favorites-count">{savedTrails.length} {savedTrails.length === 1 ? 'sentiero salvato' : 'sentieri salvati'}</div>
          <div className="trail-grid">{savedTrails.map((trail) => <TrailCard key={trail.id} trail={trail} isFavorite onToggleFavorite={onToggleFavorite} unit={unit} />)}</div>
        </>
      ) : (
        <div className="empty-state" data-testid="empty-favorites">
          <div className="empty-icon"><Bookmark size={21} /></div>
          <h2>Il tuo taccuino è pronto</h2>
          <p>Tocca il cuore su ogni percorso che vuoi ricordare. Crea una piccola lista dei luoghi da scoprire.</p>
          <Link href="/trails" className="action-button" data-testid="link-empty-explore"><Map size={15} /> Sfoglia i sentieri</Link>
        </div>
      )}
    </div>
  );
}