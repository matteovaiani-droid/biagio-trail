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
        <div className="eyebrow">Make it yours</div>
        <h1 className="page-title">Field settings.</h1>
        <p className="page-description">A few quiet preferences, so the guide fits the way you move through the outdoors.</p>
      </header>
      <div className="settings-card">
        <div className="settings-section-label">Trail display</div>
        <div className="setting-row">
          <div className="setting-copy">
            <span className="setting-icon"><Ruler size={16} /></span>
            <div><div className="setting-name">Distance units</div><div className="setting-description">Choose how route length is shown.</div></div>
          </div>
          <div className="segmented" role="group" aria-label="Distance units">
            {(['km', 'mi'] as const).map((value) => <button type="button" className={`segment ${settings.distanceUnit === value ? 'active' : ''}`} onClick={() => onUpdate({ distanceUnit: value })} key={value} data-testid={`button-unit-${value}`}>{value}</button>)}
          </div>
        </div>
        <div className="settings-section-label">On the move</div>
        <div className="setting-row">
          <div className="setting-copy">
            <span className="setting-icon"><Bell size={16} /></span>
            <div><div className="setting-name">Morning trail notes</div><div className="setting-description">A gentle nudge when the forecast looks good.</div></div>
          </div>
          <button type="button" className={`switch ${settings.notifications ? 'on' : ''}`} onClick={() => onUpdate({ notifications: !settings.notifications })} aria-label="Toggle morning trail notes" aria-pressed={settings.notifications} data-testid="switch-notifications" />
        </div>
        <div className="setting-row">
          <div className="setting-copy">
            <span className="setting-icon"><Download size={16} /></span>
            <div><div className="setting-name">Offline route notes</div><div className="setting-description">Keep saved trail details available without signal.</div></div>
          </div>
          <button type="button" className={`switch ${settings.offlineMaps ? 'on' : ''}`} onClick={() => onUpdate({ offlineMaps: !settings.offlineMaps })} aria-label="Toggle offline route notes" aria-pressed={settings.offlineMaps} data-testid="switch-offline-maps" />
        </div>
      </div>
      <div className="settings-footer">
        <Settings2 size={14} style={{ verticalAlign: 'middle', marginRight: '.3rem' }} />
        Preferences are stored locally on this device. Biagio Trail is a companion for the path, not a substitute for local conditions or good judgment.
      </div>
    </div>
  );
}