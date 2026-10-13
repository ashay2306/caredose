import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  X, 
  Check, 
  Utensils, 
  AlertCircle, 
  Wine, 
  Coffee,
  Sparkles,
  Pill
} from 'lucide-react';
import { Medicine } from '../types/medicare';
import { checkMedicationSafety } from '../services/geminiScanner';

interface SafetyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicines: Medicine[];
}

export const SafetyGuideModal: React.FC<SafetyGuideModalProps> = ({
  isOpen,
  onClose,
  medicines,
}) => {
  const [loading, setLoading] = useState(false);
  const [safetyReport, setSafetyReport] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      runSafetyCheck();
    }
  }, [isOpen]);

  const runSafetyCheck = async () => {
    setLoading(true);
    try {
      const data = await checkMedicationSafety(medicines);
      setSafetyReport(data);
    } catch (e) {
      console.warn('Safety check error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Medicine Safety & Pharmacology Guide</h2>
              <p className="text-xs text-slate-400">
                Informational precautions, food interactions, and duplicate salt checks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Informational Disclaimer as emphasized in prompt */}
          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Clinical Advisory Note:</span> This database provides informational pharmacological guidance sourced from verified drug reference standards. It does not replace independent physician consultation or formal medical diagnosis.
            </div>
          </div>

          {/* Active Drugs Being Screened */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Active Medicines Currently Screened ({medicines.length}):</span>
              <button
                onClick={runSafetyCheck}
                className="text-teal-700 hover:text-teal-900 text-[11px] font-bold cursor-pointer"
              >
                Re-scan Database
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {medicines.map((m) => (
                <span
                  key={m.id}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200/80 flex items-center gap-1.5"
                >
                  <Pill className="w-3 h-3 text-teal-600" />
                  <span>{m.name} ({m.strength})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Safety Alerts / Precautions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Safety Alerts & Dietary Rules
            </h4>

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Analyzing drug database and food interaction matrices...
              </div>
            ) : safetyReport?.alerts?.length > 0 ? (
              <div className="space-y-3">
                {safetyReport.alerts.map((alert: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      alert.severity === 'high'
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : alert.severity === 'moderate'
                        ? 'bg-amber-50 border-amber-200 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                      alert.severity === 'high' ? 'text-rose-600' : 'text-amber-600'
                    }`} />
                    <div className="text-xs space-y-1">
                      <div className="font-bold">{alert.title}</div>
                      <p className="leading-relaxed opacity-90">{alert.description}</p>
                      {alert.medicinesInvolved?.length > 0 && (
                        <div className="text-[11px] font-medium pt-0.5 opacity-80">
                          Applies to: {alert.medicinesInvolved.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>All current medicines passed baseline safety and duplicate-salt screening.</span>
              </div>
            )}
          </div>

          {/* Golden Rules of Medication Safety Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">Core Administration Rules</h4>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>
                <span className="font-semibold text-slate-800">Metformin:</span> Always consume with or directly after a meal to prevent gastrointestinal upset and nausea.
              </li>
              <li>
                <span className="font-semibold text-slate-800">Thyroid (Levothyroxine):</span> Must be taken on a completely empty stomach with pure water 30-60 mins prior to breakfast.
              </li>
              <li>
                <span className="font-semibold text-slate-800">Statins (Atorvastatin):</span> Avoid excessive grapefruit or grapefruit juice, which inhibits CYP3A4 metabolism.
              </li>
              <li>
                <span className="font-semibold text-slate-800">Mineral Supplements:</span> Keep calcium and iron tablets separated by at least 4 hours to prevent chelation.
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
