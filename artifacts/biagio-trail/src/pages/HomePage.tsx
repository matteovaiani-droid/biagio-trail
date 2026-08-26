import { ArrowRight, Clock3, Heart, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { TrailCard } from '@/components/TrailCard';
import { trails, type Trail } from '@/data/trails';

type HomePageProps = {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  unit: 'km' | 'mi';
};

export function HomePage({ favorites, onToggleFavorite, unit }: HomePageProps) {
  const featured = trails[1];
  const nearYou = [trails[3], trails[5], trails[0]];
  return (
    <div data-testid="page-home">
      <div className="hero-layout">
        <section className="hero-copy">
          <div className="eyebrow">Una guida sul campo per l’Italia</div>
          <h1 className="hero-title serif">Trova la tua <em>via</em> d’uscita.</h1>
          <p className="hero-subtitle">Sentieri tranquilli, distanze reali e panorami che restano con te. Scegli un percorso per questa mattina.</p>
          <div style={{ display: 'flex', gap: '.55rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
            <Link href="/trails" className="action-button" data-testid="link-explore-trails">Esplora tutti i sentieri <ArrowRight size={15} /></Link>
            <Link href="/favorites" className="text-link" style={{ padding: '.8rem .35rem' }} data-testid="link-home-saved">I tuoi sentieri salvati <Heart size={13} /></Link>
          </div>
        </section>
        <section className="hero-art" style={{ backgroundImage: `linear-gradient(180deg, rgba(17, 54, 65, .04) 20%, rgba(11, 39, 47, .83) 100%), url("${featured.image}")` }} data-testid="card-featured-trail">
          <span className="feature-pin"><Sparkles size={11} style={{ display: 'inline', marginRight: '.25rem' }} /> NOTA DI CAMPO 04</span>
          <div className="hero-art-content">
            <div className="eyebrow" style={{ color: 'hsl(45 90% 67%)' }}>La scelta di questa mattina limpida</div>
            <h2 className="hero-art-title serif">{featured.name}</h2>
            <div className="hero-meta">
              <span className="glass-chip"><MapPin size={11} style={{ display: 'inline', marginRight: '.24rem' }} />{featured.region}</span>
              <span className="glass-chip"><Clock3 size={11} style={{ display: 'inline', marginRight: '.24rem' }} />{featured.duration}</span>
              <span className="glass-chip">{{ Easy: 'Facile', Moderate: 'Moderato', Demanding: 'Impegnativo' }[featured.difficulty]}</span>
            </div>
            <Link href={`/trails/${featured.id}`} className="text-link" style={{ color: 'hsl(45 90% 67%)', marginTop: '.85rem' }} data-testid="link-featured-trail">Leggi la nota del percorso <ArrowRight size={14} /></Link>
          </div>
        </section>
      </div>

      <section className="home-quote">
        <p>“Il sentiero non ti chiede di essere pronto. Ti chiede di cominciare.”</p>
        <span>— Dal taccuino di Biagio, Dolomiti di Brenta</span>
      </section>

      <div className="section-heading">
        <div><div className="eyebrow">Nei dintorni, con intenzione</div><h2>Piccoli inizi, grande respiro</h2></div>
        <Link href="/trails" className="text-link" data-testid="link-see-all-trails">Vedi tutti <ArrowRight size={14} /></Link>
      </div>
      <div className="trail-grid">
        {nearYou.map((trail: Trail) => <TrailCard key={trail.id} trail={trail} isFavorite={favorites.includes(trail.id)} onToggleFavorite={onToggleFavorite} unit={unit} />)}
      </div>
    </div>
  );
}