import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { AlertTriangle, Moon, Sun, Monitor, Download, Upload, Trash2, ShieldAlert } from 'lucide-react';
import { PolymorphicCard } from '../components/ui/PolymorphicCard';
import { PolymorphicButton } from '../components/ui/PolymorphicButton';
import ShareSettings from '../components/ShareSettings';

export default function Settings() {
  const { settings, updateSettings, resetData, importData, transactions, receipts, auditLog, notes, notesSavedAt, isViewOnlyMode } = useStore();
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action is irreversible.")) {
      resetData();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  const handleExport = () => {
    const data = {
      transactions, receipts, auditLog, settings, notes, notesSavedAt
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clubvault-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (window.confirm("This will overwrite your current data. Are you sure?")) {
          importData(data);
          alert("Data imported successfully!");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="page-title">Settings</h1>
      </div>

      {/* Club Profile */}
      <PolymorphicCard>
        <h3 className="card-title mb-6">Club Profile</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-medium text-text-secondary mb-1">Club Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-white/20 dark:bg-card-dark/20 border border-white/25 dark:border-white/10 rounded-[8px] text-[14px] text-text-primary dark:text-white focus:outline-none focus:border-primary"
              value={settings.clubName}
              onChange={(e) => updateSettings({ clubName: e.target.value })}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[12px] font-medium text-text-secondary mb-1">Currency</label>
              <select 
                className="w-full px-3 py-2 bg-white/20 dark:bg-card-dark/20 border border-white/25 dark:border-white/10 rounded-[8px] text-[14px] text-text-primary dark:text-white focus:outline-none focus:border-primary"
                value={settings.currency} 
                onChange={(e) => updateSettings({ currency: e.target.value })}
              >
                <option value="KES">KES (KSh)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="UGX">UGX (USh)</option>
                <option value="TZS">TZS (TSh)</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-medium text-text-secondary mb-1">Financial Year Start</label>
              <select 
                className="w-full px-3 py-2 bg-white/20 dark:bg-card-dark/20 border border-white/25 dark:border-white/10 rounded-[8px] text-[14px] text-text-primary dark:text-white focus:outline-none focus:border-primary"
                value={settings.fyStartMonth} 
                onChange={(e) => updateSettings({ fyStartMonth: parseInt(e.target.value) })}
              >
                <option value={1}>January</option>
                <option value={4}>April</option>
                <option value={7}>July</option>
                <option value={10}>October</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
              </select>
            </div>
          </div>
        </div>
      </PolymorphicCard>

      {/* Appearance */}
      <PolymorphicCard>
        <h3 className="card-title mb-6">Appearance</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            type="button"
            className={`flex-1 py-3 px-4 rounded-[8px] border text-[14px] font-medium flex items-center justify-center gap-2 transition-all ${settings.theme === 'light' ? 'border-primary text-primary bg-[#E6F1FB] dark:bg-primary/20 dark:text-white' : 'border-white/20 dark:border-white/10 text-text-secondary hover:bg-white/40 dark:hover:bg-white/5'}`}
            onClick={() => updateSettings({ theme: 'light' })}
          >
            <Sun size={18} /> Light Mode
          </button>
          <button 
            type="button"
            className={`flex-1 py-3 px-4 rounded-[8px] border text-[14px] font-medium flex items-center justify-center gap-2 transition-all ${settings.theme === 'dark' ? 'border-primary text-primary bg-primary/10 dark:bg-primary/20 dark:text-white' : 'border-white/20 dark:border-white/10 text-text-secondary hover:bg-white/40 dark:hover:bg-white/5'}`}
            onClick={() => updateSettings({ theme: 'dark' })}
          >
            <Moon size={18} /> Dark Mode
          </button>
          <button 
            type="button"
            className={`flex-1 py-3 px-4 rounded-[8px] border text-[14px] font-medium flex items-center justify-center gap-2 transition-all ${settings.theme === 'system' ? 'border-primary text-primary bg-[#E6F1FB] dark:bg-primary/20 dark:text-white' : 'border-white/20 dark:border-white/10 text-text-secondary hover:bg-white/40 dark:hover:bg-white/5'}`}
            onClick={() => updateSettings({ theme: 'system' })}
          >
            <Monitor size={18} /> System
          </button>
        </div>
      </PolymorphicCard>

      {/* Security Settings Card */}
      <PolymorphicCard className="flex flex-col gap-4">
        <h3 className="card-title flex items-center gap-2">
          <ShieldAlert size={18} className="text-primary" /> Security & Vault Lock
        </h3>
        <p className="text-[12px] text-text-secondary">Protect your financial records with a local 4-digit passcode lock and automated inactivity timeout features.</p>
        
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary dark:text-white text-[14px]">Passcode Lock Protection</div>
              <div className="text-[12px] text-text-secondary">Require PIN entry on app launch or reload.</div>
            </div>
            <button 
              type="button"
              onClick={() => updateSettings({ pinEnabled: !settings.pinEnabled })}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative border flex items-center ${settings.pinEnabled ? 'bg-primary border-primary' : 'bg-white/10 border-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute transition-all duration-300 ${settings.pinEnabled ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          {settings.pinEnabled && (
            <div className="flex flex-col sm:flex-row gap-4 border-t border-white/10 pt-4 animate-fade-in">
              <div className="flex-1">
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Set 4-Digit Passcode</label>
                <input 
                  type="password" 
                  maxLength={4}
                  placeholder="••••"
                  className="w-full px-3 py-2 bg-white/20 dark:bg-card-dark/20 border border-white/25 dark:border-white/10 rounded-[8px] text-[14px] font-mono text-text-primary dark:text-white focus:outline-none focus:border-primary"
                  value={settings.pin}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,4}$/.test(val)) {
                      updateSettings({ pin: val });
                    }
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Inactivity Auto-Lock Duration</label>
                <select 
                  className="w-full px-3 py-2 bg-white/20 dark:bg-card-dark/20 border border-white/25 dark:border-white/10 rounded-[8px] text-[14px] text-text-primary dark:text-white focus:outline-none focus:border-primary"
                  value={settings.sessionTimeoutMinutes || 5}
                  onChange={(e) => updateSettings({ sessionTimeoutMinutes: parseInt(e.target.value) })}
                >
                  <option value={1}>1 Minute</option>
                  <option value={5}>5 Minutes</option>
                  <option value={10}>10 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </PolymorphicCard>

      {/* Share Settings - Only for full access users */}
      {!isViewOnlyMode && <ShareSettings />}

      {/* Data */}
      <PolymorphicCard>
        <h3 className="card-title mb-6">Data Management</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 border border-white/10 dark:border-white/5 rounded-[8px]">
            <div>
              <div className="font-medium text-text-primary dark:text-white text-[14px]">Export Data</div>
              <div className="text-[12px] text-text-secondary">Download a JSON backup of all your data.</div>
            </div>
            <PolymorphicButton variant="glass" onClick={handleExport}>
              <Download size={16} /> Export JSON
            </PolymorphicButton>
          </div>

          <div className="flex items-center justify-between p-4 border border-white/10 dark:border-white/5 rounded-[8px]">
            <div>
              <div className="font-medium text-text-primary dark:text-white text-[14px]">Import Data</div>
              <div className="text-[12px] text-text-secondary">Restore from a previous backup file.</div>
            </div>
            <label className="cursor-pointer">
              <PolymorphicButton as="span" variant="glass">
                <Upload size={16} /> Import JSON
              </PolymorphicButton>
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-expense/30 bg-expense/5 rounded-[8px] mt-4">
            <div>
              <div className="font-medium text-expense text-[14px] flex items-center gap-2">
                <AlertTriangle size={16} /> Danger Zone
              </div>
              <div className="text-[12px] text-expense/80">Permanently delete all data. This cannot be undone.</div>
            </div>
            <PolymorphicButton variant="primary" className="!bg-expense hover:!bg-expense/90" onClick={handleClearData}>
              <Trash2 size={16} /> Reset All Data
            </PolymorphicButton>
          </div>
          {cleared && <p className="text-[12px] text-income font-medium mt-1">All data has been successfully cleared.</p>}
        </div>
      </PolymorphicCard>

    </div>
  );
}
