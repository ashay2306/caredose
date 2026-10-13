import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  Pill, 
  Utensils, 
  AlertCircle, 
  Bell, 
  Sparkles, 
  Plus, 
  User, 
  ArrowRight,
  ShieldAlert,
  Volume2
} from 'lucide-react';
import { Medicine, DoseLog, FamilyMember } from '../types/medicare';

interface TodayScheduleProps {
  medicines: Medicine[];
  doseLogs: DoseLog[];
  members: FamilyMember[];
  selectedMemberId: string | 'all';
  onMarkDose: (doseLogId: string, status: 'taken' | 'skipped' | 'pending', skipReason?: string) => void;
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
  onTriggerAlarmChime: () => void;
  onSimulateEscalation: (member: FamilyMember, med: Medicine) => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({
  medicines,
  doseLogs,
  members,
  selectedMemberId,
  onMarkDose,
  onOpenAddModal,
  onOpenScanner,
  onTriggerAlarmChime,
  onSimulateEscalation,
}) => {
  const [skipModalDoseId, setSkipModalDoseId] = useState<string | null>(null);
  const [skipReasonText, setSkipReasonText] = useState('Felt nauseous / Doctor advice');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter medicines by active family member
  const visibleMedicines = selectedMemberId === 'all'
    ? medicines
    : medicines.filter((m) => m.profileId === selectedMemberId);

  // Collect all today's dose slots
  interface ScheduledSlot {
    doseLogId: string;
    medicine: Medicine;
    member: FamilyMember;
    time: string;
    status: 'taken' | 'skipped' | 'missed' | 'pending';
    takenAt?: string;
    skipReason?: string;
  }

  const todaySlots: ScheduledSlot[] = [];

  visibleMedicines.forEach((med) => {
    const member = members.find((m) => m.id === med.profileId) || members[0];
    med.scheduleTimings.forEach((time) => {
      // Find or synthesize dose log
      const existingLog = doseLogs.find(
        (log) => log.medicineId === med.id && log.scheduledDate === todayStr && log.scheduledTime === time
      );

      todaySlots.push({
        doseLogId: existingLog?.id || `log-${med.id}-${todayStr}-${time.replace(':', '')}`,
        medicine: med,
        member,
        time,
        status: existingLog ? existingLog.status : 'pending',
        takenAt: existingLog?.takenAt,
        skipReason: existingLog?.skipReason,
      });
    });
  });

  // Sort chronologically
  todaySlots.sort((a, b) => a.time.localeCompare(b.time));

  // Statistics for today
  const totalToday = todaySlots.length;
  const takenToday = todaySlots.filter((s) => s.status === 'taken').length;
  const skippedToday = todaySlots.filter((s) => s.status === 'skipped').length;
  const pendingToday = todaySlots.filter((s) => s.status === 'pending').length;
  const adherencePercent = totalToday > 0 ? Math.round((takenToday / totalToday) * 100) : 100;

  // Time groupings
  const getTimeCategory = (timeStr: string) => {
    const [h] = timeStr.split(':').map(Number);
    if (h < 12) return 'Morning (Before 12 PM)';
    if (h < 17) return 'Afternoon (12 PM - 5 PM)';
    if (h < 21) return 'Evening (5 PM - 9 PM)';
    return 'Bedtime / Night (After 9 PM)';
  };

  const categories = [
    'Morning (Before 12 PM)',
    'Afternoon (12 PM - 5 PM)',
    'Evening (5 PM - 9 PM)',
    'Bedtime / Night (After 9 PM)',
  ];

  const handleSkipConfirm = () => {
    if (skipModalDoseId) {
      onMarkDose(skipModalDoseId, 'skipped', skipReasonText);
      setSkipModalDoseId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col items-center justify-center text-teal-700">
            <span className="text-2xl font-bold">{adherencePercent}%</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">Today</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Today's Medication Schedule</span>
              <span className="text-xs font-normal text-slate-500">
                ({new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })})
              </span>
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span>{takenToday} Taken</span>
              <span aria-hidden="true">·</span>
              <span>{pendingToday} Pending</span>
              {skippedToday > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-600">{skippedToday} Skipped</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{totalToday} Total Doses</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Quick Actions */}
        <div className="w-full md:w-80 flex flex-col gap-2">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Daily Completion</span>
            <span className="font-semibold text-slate-900">{takenToday}/{totalToday} Doses</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${adherencePercent}%` }}
            />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={onOpenAddModal}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medicine</span>
            </button>
            <button
              onClick={onOpenScanner}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Scan Strip (AI)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Slots Grouped by Time */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categorySlots = todaySlots.filter((slot) => getTimeCategory(slot.time) === category);

          if (categorySlots.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{category}</span>
                <span className="text-slate-400 font-normal">({categorySlots.length} doses)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categorySlots.map((slot) => {
                  const isTaken = slot.status === 'taken';
                  const isSkipped = slot.status === 'skipped';
                  const isPending = slot.status === 'pending';
                  const isLowStock = slot.medicine.currentStock <= slot.medicine.minStockAlert;

                  return (
                    <div
                      key={slot.doseLogId}
                      className={`relative rounded-xl border p-4 transition-all ${
                        isTaken
                          ? 'bg-emerald-50/50 border-emerald-200/80 shadow-xs'
                          : isSkipped
                          ? 'bg-slate-50 border-slate-200 opacity-75'
                          : 'bg-white border-slate-200/90 shadow-sm hover:border-teal-300'
                      }`}
                    >
                      {/* Card Header: Exact Time + Patient tag */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono tracking-tight ${
                            isTaken
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-900 text-white'
                          }`}>
                            {slot.time}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <span 
                              className="w-2.5 h-2.5 rounded-full inline-block"
                              style={{ backgroundColor: slot.member.avatarColor }}
                            />
                            <span className="font-semibold text-slate-800">{slot.member.name}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500">{slot.member.relationship}</span>
                          </div>
                        </div>

                        {/* Status Icon */}
                        {isTaken && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Taken {slot.takenAt ? new Date(slot.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          </span>
                        )}

                        {isSkipped && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
                            <X className="w-3 h-3" />
                            <span>Skipped</span>
                          </span>
                        )}

                        {isPending && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>Due</span>
                          </span>
                        )}
                      </div>

                      {/* Main Medicine Details: Exact Spec from Prompt */}
                      <div className="mt-3 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">
                              {slot.medicine.name}
                            </h3>
                            <span className="text-xs font-medium text-slate-600 px-1.5 py-0.5 rounded bg-slate-100">
                              {slot.medicine.strength}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <Pill className="w-3 h-3 text-teal-600" />
                              {slot.medicine.doseAmount} ({slot.medicine.dosageForm})
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="flex items-center gap-1 font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                              <Utensils className="w-3 h-3 text-teal-600" />
                              {slot.medicine.foodInstruction}
                            </span>
                          </div>

                          {/* Active salt & purpose */}
                          {slot.medicine.activeSalt && (
                            <p className="text-[11px] text-slate-500 pt-0.5">
                              Salt: {slot.medicine.activeSalt}
                            </p>
                          )}
                        </div>

                        {/* Stock gauge on the card */}
                        <div className="text-right shrink-0">
                          <div className={`text-xs font-semibold ${
                            isLowStock ? 'text-rose-600' : 'text-slate-600'
                          }`}>
                            {slot.medicine.currentStock} {slot.medicine.unitType} left
                          </div>
                          {isLowStock && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 inline-block mt-0.5">
                              ⚠️ Low Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Safety Precaution note if present */}
                      {slot.medicine.safetyWarnings && (
                        <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-start gap-1.5">
                          <AlertCircle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                          <span>{slot.medicine.safetyWarnings}</span>
                        </div>
                      )}

                      {/* Feature 6: Interactive Dose Confirmation Buttons */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {isPending ? (
                          <>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={onTriggerAlarmChime}
                                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Play reminder chime sound"
                              >
                                <Volume2 className="w-3 h-3 text-teal-600" />
                                <span className="hidden sm:inline">Chime</span>
                              </button>

                              {/* Simulate Escalation trigger for elderly */}
                              <button
                                onClick={() => onSimulateEscalation(slot.member, slot.medicine)}
                                className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 p-1 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                title="Test what happens if this dose is missed"
                              >
                                <ShieldAlert className="w-3 h-3" />
                                <span className="hidden sm:inline">Test Escalation</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSkipModalDoseId(slot.doseLogId)}
                                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Skip
                              </button>
                              <button
                                onClick={() => onMarkDose(slot.doseLogId, 'taken')}
                                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>TAKEN ✓</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="w-full flex items-center justify-between text-xs text-slate-500">
                            <span>
                              {isTaken ? 'Dose recorded to adherence history' : `Reason: ${slot.skipReason || 'Skipped'}`}
                            </span>
                            <button
                              onClick={() => onMarkDose(slot.doseLogId, 'pending')}
                              className="text-[11px] text-slate-400 hover:text-slate-700 underline cursor-pointer"
                            >
                              Undo Status
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {todaySlots.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No Medications Scheduled Today</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              There are no active reminders scheduled for this profile today. Add a new medicine or scan a medicine strip to get started.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium cursor-pointer"
              >
                + Add Medicine
              </button>
              <button
                onClick={onOpenScanner}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-medium cursor-pointer"
              >
                Scan Medicine Strip
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Skip Reason Dialog */}
      {skipModalDoseId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Skipped Dose</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Recording a reason helps your doctor and family caregiver understand adherence patterns.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Reason for skipping:</label>
              {[
                'Felt nauseous / Stomach discomfort',
                'Physician advised pause / Temporary hold',
                'Fasting / Empty stomach required',
                'Medicine not available / Out of stock',
                'Felt better / Symptoms resolved',
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSkipReasonText(reason)}
                  className={`w-full text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                    skipReasonText === reason
                      ? 'border-teal-500 bg-teal-50 font-medium text-teal-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSkipModalDoseId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSkipConfirm}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
