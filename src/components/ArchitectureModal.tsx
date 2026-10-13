import React from 'react';
import { 
  Layers, 
  Database, 
  Shield, 
  HardDrive, 
  Bell, 
  BarChart, 
  Users, 
  X, 
  CheckCircle2, 
  ExternalLink,
  Smartphone,
  Server
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                System Architecture & Project Specification
              </h2>
              <p className="text-xs text-slate-400">
                CareDose MediCare+ Full-Stack Mobile & Cloud Architecture
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Architectural Diagram Box */}
          <div className="bg-slate-950 rounded-2xl p-5 text-slate-200 font-mono text-[11px] border border-slate-800 overflow-x-auto leading-relaxed">
            <div className="text-teal-400 font-bold mb-2">// HIGH-LEVEL SYSTEM TOPOLOGY</div>
            <pre className="text-slate-300">
{`       CLIENT LAYER: Flutter / Web Applet (Responsive)
       ┌───────────────────┼────────────────────┐
     Patient           Family Caregiver       Admin / Doctor
       │                   │                    │
       └───────────────────┼────────────────────┘
                           ↓ (REST / gRPC / WebSockets)
             BACKEND & CLOUD PLATFORM
       ┌───────────────────┼────────────────────┐
       ↓                   ↓                    ↓
  Firebase Auth     Cloud Firestore       Firebase Storage
  (Multi-User)             │              (Prescription Vault)
   • Login/Register        ├── users      (Encrypted Blobs)
   • Role RBAC             ├── medicines
   • Family Linking        ├── dose_logs
                           ├── appointments
                           └── escalations
                                   │
                                   ↓
                   NOTIFICATION ESCALATION ENGINE
                 Firebase Cloud Messaging (FCM) & SMS Gateway
                  • Scheduled Cron Reminder Worker
                  • Missed Dose Escalation Trigger`}
            </pre>
          </div>

          {/* Core Architectural Components Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Firebase Services Matrix (Project Mapping)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Firebase Authentication</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Handles student, patient, and family caregiver identities with role-based access control.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Database className="w-4 h-4 text-teal-600" />
                  <span>Cloud Firestore</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  NoSQL document collections for real-time synchronization of medicines, stock counters, schedules, and adherence dose logs.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  <span>Firebase Storage</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Secure cloud storage for high-resolution prescription scans, medical documents, and medicine strip camera captures.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Bell className="w-4 h-4 text-rose-600" />
                  <span>Cloud Messaging (FCM)</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Critical delivery pipeline for local scheduled alarm chimes and cross-device missed-dose escalation to designated guardians.
                </p>
              </div>
            </div>
          </div>

          {/* College Project Viva / Defense Talking Points */}
          <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200 space-y-2">
            <h4 className="font-bold text-teal-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span>Key Defense Highlights for College Viva / Presentation</span>
            </h4>
            <ul className="space-y-1.5 text-teal-900 text-[11px] list-disc list-inside">
              <li>
                <span className="font-semibold">Beyond Simple Alarms:</span> Integrates automated stock deduction, depletion days estimation, and 1-click pharmacy order slips.
              </li>
              <li>
                <span className="font-semibold">AI Medicine Strip OCR:</span> Uses multimodal vision analysis to automatically extract pharmaceutical name, strength, and expiry dates.
              </li>
              <li>
                <span className="font-semibold">Unique Escalation Engine:</span> If an elderly grandparent fails to confirm an 8:00 PM dose within 45 minutes, an automated SMS alert is dispatched to their designated adult guardian.
              </li>
              <li>
                <span className="font-semibold">Clinical Adherence Telemetry:</span> Calculates true weekly adherence percentage (92%) and outputs exportable PDF reports for doctor consultations.
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer"
            >
              Close Architecture View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
