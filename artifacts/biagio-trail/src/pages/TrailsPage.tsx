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
        <div className="eyebrow">The trail index</div>
        <h1 className="page-title">Pick a path.</h1>
        <p className="page-description">Six routes worth the early alarm, from gentle meadow loops to full Apennine days.</p>
      </header>
      <div className="search-box">
        <Search size={16} />
        <input className="search-input" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by trail, region, or province" data-testid="input-search-trails" />
      </div>
      <div className="filter-row" aria-label="Filter by difficulty">
        <SlidersHorizontal size={15} style={{ flex: '0 0 auto', margin: '.48rem .18rem 0 0', color: 'hsl(var(--muted-foreground))' }} />
        {filters.map((filter) => (
          <button className={`filter-chip ${difficulty === filter ? 'active' : ''}`} type="button" key={filter} onClick={() => setDifficulty(filter)} data-testid={`button-filter-${filter.toLowerCase()}`}>{filter}</button>
        ))}
      </div>
      <div className="results-line" data-testid="text-results-count">{filtered.length} {filtered.length === 1 ? 'trail' : 'trails'} in your field guide</div>
      {filtered.length ? (
        <div className="trail-grid">
          {filtered.map((trail) => <TrailCard key={trail.id} trail={trail} isFavorite={favorites.includes(trail.id)} onToggleFavorite={onToggleFavorite} unit={unit} />)}
        </div>
      ) : (
        <div className="empty-state" data-testid="empty-trails">
          <div className="empty-icon"><Search size={21} /></div>
          <h2>No path by that name</h2>
          <p>Try a region, a province, or clear the filters and let the mountains surprise you.</p>
          <button className="action-button" type="button" onClick={() => { setSearch(''); setDifficulty('All'); }} data-testid="button-clear-trail-filters">Clear filters</button>
        </div>
      )}
    </div>
  );
}