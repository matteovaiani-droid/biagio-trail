import { Bell, Download, Ruler, Settings2 } from 'lucide-react';

export type Settings = { distanceUnit: 'km' | 'mi'; notifications: boolean; offlineMaps: boolean };

type SettingsPageProps = {
  settings: Settings;
  onUpdate: (patch: Partial<Settings>) => void;
};

export function SettingsPage({ settings, onUpdate }: SettingsPageProps) {
  return (
    <div data-testid="page-settings">
      <header className="page-header">
        <div className="eyebrow">Personalizzala</div>
        <h1 className="page-title">Impostazioni sul campo.</h1>
        <p className="page-description">Alcune preferenze semplici, per adattare la guida al tuo modo di vivere l’aria aperta.</p>
      </header>
      <div className="settings-card">
        <div className="settings-section-label">Visualizzazione sentieri</div>
        <div className="setting-row">
          <div className="setting-copy">
            <span className="setting-icon"><Ruler size={16} /></span>
            <div><div className="setting-name">Unità di distanza</div><div className="setting-description">Scegli come mostrare la lunghezza dei percorsi.</div></div>
          </div>
          <div className="segmented" role="group" aria-label="Unità di distanza">
            {(['km', 'mi'] as const).map((value) => <button type="button" className={`segment ${settings.distanceUnit === value ? 'active' : ''}`} onClick={() => onUpdate({ distanceUnit: value })} key={value} data-testid={`button-unit-${value}`}>{value}</button>)}
          </div>
        </div>
        <div className="settings-section-label">In movimento</div>
        <div className="setting-row">
          <div className="setting-copy">
            <span className="setting-icon"><Bell size={16} /></span>
            <div><div className="setting-name">Note del sentiero al mattino</div><div className="setting-description">Un promemoria discreto quando le previsioni sono buone.</div></div>
          </div>
          <button type="button" className={`switch ${settings.notifications ? 'on' : ''}`} onClick={() => onUpdate({ notifications: !settings.notifications })} aria-label="Attiva o disattiva le note del sentiero al mattino" aria-pressed={settings.notifications} data-testid="switch-notifications" />
        </div>
        <div className="setting-row">
          <div className="setting-copy">
            <span className="setting-icon"><Download size={16} /></span>
            <div><div className="setting-name">Note del percorso offline</div><div className="setting-description">Tieni disponibili i dettagli dei sentieri salvati anche senza segnale.</div></div>
          </div>
          <button type="button" className={`switch ${settings.offlineMaps ? 'on' : ''}`} onClick={() => onUpdate({ offlineMaps: !settings.offlineMaps })} aria-label="Attiva o disattiva le note del percorso offline" aria-pressed={settings.offlineMaps} data-testid="switch-offline-maps" />
        </div>
      </div>
      <div className="settings-footer">
        <Settings2 size={14} style={{ verticalAlign: 'middle', marginRight: '.3rem' }} />
        Le preferenze vengono salvate localmente su questo dispositivo. Biagio Trail è un compagno di percorso, non sostituisce le condizioni locali né il buon senso.
      </div>
    </div>
  );
}