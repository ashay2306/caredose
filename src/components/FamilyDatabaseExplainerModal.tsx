import React from 'react';
import { 
  Users, 
  ShieldAlert, 
  Pill, 
  Calendar, 
  Bell, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  HeartPulse, 
  Clock, 
  Share2, 
  ArrowRight, 
  X,
  Phone,
  RefreshCw,
  Info,
  Building,
  UserCheck
} from 'lucide-react';
import { FamilyMember, Medicine } from '../types/medicare';

interface FamilyDatabaseExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  medicines: Medicine[];
  onSelectMember: (id: string | 'all') => void;
  onTriggerDemoReminder: () => void;
  onTriggerEscalationDemo: () => void;
  onResetToIndianFamilyDB: () => void;
}

export const FamilyDatabaseExplainerModal: React.FC<FamilyDatabaseExplainerModalProps> = ({
  isOpen,
  onClose,
  members,
  medicines,
  onSelectMember,
  onTriggerDemoReminder,
  onTriggerEscalationDemo,
  onResetToIndianFamilyDB,
}) => {
  if (!isOpen) return null;

  const dadaji = members.find((m) => m.name.includes('Dadaji') || m.relationship === 'Grandparent') || members[0];
  const dadiji = members.find((m) => m.name.includes('Dadiji')) || members[1];
  const father = members.find((m) => m.name.includes('Rajesh') || m.relationship === 'Father') || members[2];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight">The Sharma Family Database</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  New User Guide & Architecture
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-generational Indian household blueprint explaining every core feature of CareDose
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-slate-800 text-xs">
          {/* Overview Banner */}
          <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50 rounded-2xl p-4.5 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Why This Database Is Pre-Configured For New Users
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Rather than facing an empty dashboard, new users explore a realistic <strong>6-member Indian family</strong> with pre-populated medical regimens, 14 days of 92% adherence history, low-stock chemist alerts, and guardian escalation protocols.
              </p>
            </div>

            <button
              onClick={() => {
                onResetToIndianFamilyDB();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs whitespace-nowrap shadow-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Clean Sharma DB</span>
            </button>
          </div>

          {/* Section 1: Family Member Hierarchy */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span>1. Multi-Generational Family Hierarchy (6 Members)</span>
              </h3>
              <span className="text-[11px] text-slate-500">Click a card to filter patient view</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.map((m) => {
                const memberMeds = medicines.filter((med) => med.profileId === m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectMember(m.id);
                      onClose();
                    }}
                    className="p-3.5 bg-slate-50 hover:bg-teal-50/50 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all text-left space-y-2 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: m.avatarColor }}
                        >
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {m.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {m.relationship} · {m.age} yrs
                          </div>
                        </div>
                      </div>

                      {m.isPrimaryCaregiver && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Primary
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {m.notes}
                    </p>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">
                        {memberMeds.length} Active {memberMeds.length === 1 ? 'Med' : 'Meds'}
                      </span>
                      <span className="text-teal-600 font-semibold group-hover:underline flex items-center gap-0.5">
                        Select Patient <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: How Every Feature Operates For A New User */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>2. How Every Feature Operates in This Database</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Feature 1: Today Schedule */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>Today's Chronological Schedule</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  All daily doses are chronologically bucketed: morning empty-stomach (Thyronorm, Pantocid), post-breakfast (Telma 40, Becosules Z), post-lunch (Shelcal, Seacod), and evening/bedtime (Glycomet-GP 1, Atorva 20, Cetzine). Marking a dose updates inventory and plays a success audio chime.
                </p>
                <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                  ⚡ Pre-loaded: Morning doses marked taken; 8:00 PM Glycomet is pending for demo.
                </div>
              </div>

              {/* Feature 2: 24-Hour Quick Summary & Notifications */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span>24-Hour Dose Summary & Web Notifications</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  The top widget calculates upcoming doses within the next 24 hours. The browser's native Notification API dispatches system push alerts with action buttons when a dose window opens, supported across desktop and mobile browsers.
                </p>
                <button
                  onClick={() => {
                    onTriggerDemoReminder();
                    onClose();
                  }}
                  className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Simulate 8:00 PM Web Push & Reminder Chime</span>
                </button>
              </div>

              {/* Feature 3: Missed Dose Escalation Engine */}
              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-950">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span>Family Guardian Escalation Protocol</span>
                </div>
                <p className="text-rose-900 leading-relaxed text-[11px]">
                  When an elderly patient like <strong>Dadaji (Ramakant Sharma)</strong> fails to confirm his 8:00 PM Glycomet-GP dose within 45 minutes, CareDose escalates: step 1 chime, step 2 repeat snooze, step 3 automated SMS/WhatsApp dispatch to <strong>Rajesh Sharma (+91 98201 44521)</strong>.
                </p>
                <button
                  onClick={() => {
                    onTriggerEscalationDemo();
                    onClose();
                  }}
                  className="w-full py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Simulate 45-Min Missed Dose SMS Escalation</span>
                </button>
              </div>

              {/* Feature 4: Inventory & Low Stock Alerts */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <span>Pill Inventory & Chemist Refill Slips</span>
                </div>
                <p className="text-amber-900 leading-relaxed text-[11px]">
                  Each medicine tracks real on-hand stock and threshold warnings. In the Sharma DB, <strong>Glycomet-GP 1 (4 doses left)</strong> and <strong>Shelcal 500 (3 doses left)</strong> are highlighted with urgent refill badges and 1-click WhatsApp order formatting.
                </p>
                <div className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-lg border border-amber-300/60">
                  📦 2 Medicines currently below threshold — ready to test refill flows.
                </div>
              </div>

              {/* Feature 5: Adherence Analytics & Clinical Export */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Adherence Analytics (92%) & CSV / PDF Export</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  CareDose computes a rolling 14-day compliance score (currently 92% Tier-1 Adherence). Users can export the entire log as raw CSV spreadsheets or generate a formatted Physician Medical Record PDF complete with doctor signature lines.
                </p>
              </div>

              {/* Feature 6: Prescription Vault & Doctor Appointments */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <span>Prescription Vault & Hospital Appointments</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Includes verified digital prescriptions and follow-ups with top Indian medical institutes: <strong>Dr. Arvind Mehta (Apollo Hospitals Mumbai)</strong>, <strong>Dr. Priya Nair (Max Super Speciality Delhi)</strong>, and <strong>Dr. Rakesh Kulkarni (Fortis Bengaluru)</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            Current Profile: <span className="font-bold text-slate-800">Rajesh Sharma (Caregiver)</span> · 6 Family Members Loaded
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onResetToIndianFamilyDB();
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Reload Sharma Data
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Start Exploring App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
