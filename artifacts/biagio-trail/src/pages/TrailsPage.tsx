import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { TrailCard } from '@/components/TrailCard';
import { trails, type Difficulty } from '@/data/trails';

type TrailsPageProps = {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  unit: 'km' | 'mi';
};

const filters: Array<'All' | Difficulty> = ['All', 'Easy', 'Moderate', 'Demanding'];
const filterLabels: Record<'All' | Difficulty, string> = { All: 'Tutti', Easy: 'Facili', Moderate: 'Moderati', Demanding: 'Impegnativi' };

export function TrailsPage({ favorites, onToggleFavorite, unit }: TrailsPageProps) {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'All' | Difficulty>('All');
  const filtered = useMemo(() => trails.filter((trail) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${trail.name} ${trail.region} ${trail.province}`.toLowerCase().includes(query);
    return matchesSearch && (difficulty === 'All' || trail.difficulty === difficulty);
  }), [search, difficulty]);

  return (
    <div data-testid="page-trails">
      <header className="page-header">
        <div className="eyebrow">L’indice dei sentieri</div>
        <h1 className="page-title">Scegli il tuo percorso.</h1>
        <p className="page-description">Sei itinerari che valgono una sveglia all’alba, dai dolci anelli nei prati alle giornate intere sugli Appennini.</p>
      </header>
      <div className="search-box">
        <Search size={16} />
        <input className="search-input" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cerca per sentiero, regione o provincia" data-testid="input-search-trails" />
      </div>
        <div className="filter-row" aria-label="Filtra per difficoltà">
        <SlidersHorizontal size={15} style={{ flex: '0 0 auto', margin: '.48rem .18rem 0 0', color: 'hsl(var(--muted-foreground))' }} />
        {filters.map((filter) => (
          <button className={`filter-chip ${difficulty === filter ? 'active' : ''}`} type="button" key={filter} onClick={() => setDifficulty(filter)} data-testid={`button-filter-${filter.toLowerCase()}`}>{filterLabels[filter]}</button>
        ))}
      </div>
      <div className="results-line" data-testid="text-results-count">{filtered.length} {filtered.length === 1 ? 'sentiero' : 'sentieri'} nella tua guida</div>
      {filtered.length ? (
        <div className="trail-grid">
          {filtered.map((trail) => <TrailCard key={trail.id} trail={trail} isFavorite={favorites.includes(trail.id)} onToggleFavorite={onToggleFavorite} unit={unit} />)}
        </div>
      ) : (
        <div className="empty-state" data-testid="empty-trails">
          <div className="empty-icon"><Search size={21} /></div>
          <h2>Nessun sentiero trovato</h2>
          <p>Prova una regione, una provincia oppure azzera i filtri e lascia che siano le montagne a sorprenderti.</p>
          <button className="action-button" type="button" onClick={() => { setSearch(''); setDifficulty('All'); }} data-testid="button-clear-trail-filters">Azzera i filtri</button>
        </div>
      )}
    </div>
  );
}