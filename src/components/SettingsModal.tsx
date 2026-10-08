import React, { useState } from 'react';
import { X, Key, Terminal, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { StorageService } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [apiKey, setApiKey] = useState(profile.customApiKey || '');
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    const updated = {
      ...profile,
      customApiKey: apiKey.trim(),
      apiKeyConfigured: Boolean(apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY),
    };
    StorageService.saveProfile(updated);
    onUpdateProfile(updated);
    setTestResult({ success: true, msg: 'API Key saved successfully to secure local storage.' });
  };

  const handleTestKey = async () => {
    const keyToTest = apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY;
    if (!keyToTest) {
      setTestResult({ success: false, msg: 'No API key provided. Operating in Curated Fallback Mode.' });
      return;
    }

    setTestingKey(true);
    setTestResult(null);

    try {
      const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keyToTest}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Respond with OK' }] }],
        }),
      });

      if (res.ok) {
        setTestResult({ success: true, msg: `Connection verified! Gemini (${model}) is responsive.` });
      } else {
        setTestResult({ success: false, msg: `API returned error status ${res.status}. Check key permissions.` });
      }
    } catch (e: any) {
      setTestResult({ success: false, msg: `Network or CORS error: ${e.message}` });
    } finally {
      setTestingKey(false);
    }
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all local progress, XP, and streak data?')) {
      StorageService.resetAllData();
      const fresh = StorageService.getProfile();
      onUpdateProfile(fresh);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="relative w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-2xl text-slate-900 dark:text-white space-y-5 transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-600 dark:text-phantom-cyan" />
            <h3 id="settings-modal-title" className="text-lg font-bold">Arena & AI Configuration</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Settings modal"
            className="p-1 text-slate-400 dark:text-white/50 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gemini API Key Section */}
        <div className="space-y-2">
          <label htmlFor="gemini-api-key-input" className="text-xs font-semibold text-slate-700 dark:text-white/80 block">
            Google Gemini API Key (Optional)
          </label>
          <div className="flex gap-2">
            <input
              id="gemini-api-key-input"
              aria-label="Google Gemini API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy... (leave blank for verified offline fallback)"
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/15 rounded-lg text-slate-900 dark:text-white font-mono focus:border-cyan-500 dark:focus:border-phantom-cyan outline-none"
            />
            <button
              onClick={handleSaveApiKey}
              aria-label="Save Gemini API Key"
              className="px-3.5 py-2 bg-phantom-purple hover:bg-phantom-violet text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-white/50">
            Stored only in your browser's localStorage. Never sent to any server or repository.
          </p>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={handleTestKey}
              disabled={testingKey}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/15 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-mono text-cyan-700 dark:text-phantom-cyan flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingKey ? 'animate-spin' : ''}`} />
              <span>{testingKey ? 'Testing...' : 'Test Connection'}</span>
            </button>

            {testResult && (
              <div
                className={`text-xs flex items-center gap-1 font-mono ${
                  testResult.success ? 'text-teal-600 dark:text-phantom-teal' : 'text-rose-600 dark:text-phantom-crimson'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{testResult.msg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Execution Mode Notice */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-white/70 space-y-1">
          <div className="font-semibold text-purple-700 dark:text-phantom-violet">Client-Side Safe Sandbox Active</div>
          <p className="text-[11px] leading-relaxed">
            All Python and JavaScript executions run in isolated browser sandboxes with timeout watchdogs and zero network privileges, protecting your device.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-800 dark:text-white/80">Reset Progress Data</div>
            <div className="text-[11px] text-slate-500 dark:text-white/40">Clear streak, XP, and solved case history</div>
          </div>
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-phantom-crimson/15 border border-rose-200 dark:border-phantom-crimson/30 text-rose-700 dark:text-phantom-crimson text-xs hover:bg-rose-100 dark:hover:bg-phantom-crimson/25 transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
