import React from 'react';
import { 
  Clock, 
  Pill, 
  AlertCircle, 
  Utensils, 
  Check, 
  Bell, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles,
  Calendar,
  Users
} from 'lucide-react';
import { Medicine, DoseLog, FamilyMember } from '../types/medicare';

interface MedicationQuickSummaryProps {
  medicines: Medicine[];
  doseLogs: DoseLog[];
  members: FamilyMember[];
  selectedMemberId: string | 'all';
  onMarkDose: (doseLogId: string, status: 'taken' | 'skipped' | 'pending', skipReason?: string) => void;
  onTriggerAlarmChime: () => void;
}

export const MedicationQuickSummary: React.FC<MedicationQuickSummaryProps> = ({
  medicines,
  doseLogs,
  members,
  selectedMemberId,
  onMarkDose,
  onTriggerAlarmChime,
}) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
  
  const todayStr = now.toISOString().split('T')[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const tomorrowDayOfWeek = tomorrow.getDay(); // 0 = Sun, 1 = Mon ...

  const visibleMedicines = selectedMemberId === 'all'
    ? medicines
    : medicines.filter((m) => m.profileId === selectedMemberId);

  interface Dose24hItem {
    id: string;
    medicine: Medicine;
    member: FamilyMember;
    date: string;
    isToday: boolean;
    time: string;
    status: 'taken' | 'pending' | 'skipped' | 'missed';
    foodInstruction: string;
    isPastTimeToday: boolean;
  }

  const all24hDoses: Dose24hItem[] = [];

  visibleMedicines.forEach((med) => {
    const member = members.find((m) => m.id === med.profileId) || members[0];

    // Today's doses
    med.scheduleTimings.forEach((time) => {
      const existingLog = doseLogs.find(
        (log) => log.medicineId === med.id && log.scheduledDate === todayStr && log.scheduledTime === time
      );
      const isPastTimeToday = time < currentTimeString;
      const status = existingLog ? existingLog.status : (isPastTimeToday ? 'missed' : 'pending');

      all24hDoses.push({
        id: existingLog?.id || `log-${med.id}-${todayStr}-${time.replace(':', '')}`,
        medicine: med,
        member,
        date: todayStr,
        isToday: true,
        time,
        status,
        foodInstruction: med.foodInstruction,
        isPastTimeToday,
      });
    });

    // Tomorrow's doses scheduled within 24 hours (up to currentTimeString tomorrow)
    if (med.daysOfWeek.includes(tomorrowDayOfWeek)) {
      med.scheduleTimings.forEach((time) => {
        // Within 24 hours means tomorrow up to the same hour
        if (time <= currentTimeString || currentHour >= 18) {
          const existingLog = doseLogs.find(
            (log) => log.medicineId === med.id && log.scheduledDate === tomorrowStr && log.scheduledTime === time
          );
          all24hDoses.push({
            id: existingLog?.id || `log-${med.id}-${tomorrowStr}-${time.replace(':', '')}`,
            medicine: med,
            member,
            date: tomorrowStr,
            isToday: false,
            time,
            status: existingLog ? existingLog.status : 'pending',
            foodInstruction: med.foodInstruction,
            isPastTimeToday: false,
          });
        }
      });
    }
  });

  // Filter for remaining doses (not taken)
  const remainingDoses = all24hDoses.filter((d) => d.status === 'pending' || (d.isToday && d.status === 'missed'));
  const remainingToday = remainingDoses.filter((d) => d.isToday);
  const remainingTomorrow = remainingDoses.filter((d) => !d.isToday);

  // Sort remaining doses chronologically (today first, then tomorrow)
  remainingDoses.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  const nextUpcomingDose = remainingDoses[0] || null;

  // Breakdown of requirements
  const requiresFoodCount = remainingDoses.filter((d) => 
    d.foodInstruction.toLowerCase().includes('after') || d.foodInstruction.toLowerCase().includes('with')
  ).length;
  
  const emptyStomachCount = remainingDoses.filter((d) => 
    d.foodInstruction.toLowerCase().includes('empty') || d.foodInstruction.toLowerCase().includes('before')
  ).length;

  const lowStockCount = remainingDoses.filter((d) => 
    d.medicine.currentStock <= d.medicine.minStockAlert
  ).length;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Medication Quick-Summary
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Next 24 Hours
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Prioritize your day and prepare upcoming meal & dose timings
            </p>
          </div>
        </div>

        {/* Quick Badge Counter */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-right">
            <span className="text-lg font-black text-teal-400 font-mono">
              {remainingDoses.length}
            </span>
            <span className="text-xs text-slate-300 ml-1.5 font-medium">
              {remainingDoses.length === 1 ? 'dose remaining' : 'doses remaining'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Next Dose + 24h Insights */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4">
        {/* Next Immediate Dose Highlight (5 cols) */}
        <div className="md:col-span-6 lg:col-span-5 bg-slate-800/60 rounded-xl p-4 border border-slate-700/70 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Immediate Priority
              </span>
              {nextUpcomingDose && (
                <span className="font-mono text-xs text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {nextUpcomingDose.isToday ? 'Today' : 'Tomorrow'} at {nextUpcomingDose.time}
                </span>
              )}
            </div>

            {nextUpcomingDose ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-base font-bold text-white tracking-tight">
                    {nextUpcomingDose.medicine.name}
                  </h4>
                  <span className="text-xs font-semibold text-slate-300">
                    {nextUpcomingDose.medicine.strength}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span 
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: nextUpcomingDose.member.avatarColor }}
                  />
                  <span className="font-semibold text-white">{nextUpcomingDose.member.name}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{nextUpcomingDose.medicine.doseAmount}</span>
                </div>

                {/* Dietary guideline */}
                <div className="mt-2 text-xs text-teal-200 bg-teal-950/60 p-2 rounded-lg border border-teal-800/60 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="font-medium">Rule: {nextUpcomingDose.foodInstruction}</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">
                🎉 All scheduled doses for the next 24 hours are completed!
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          {nextUpcomingDose && (
            <div className="pt-3 mt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
              <button
                onClick={onTriggerAlarmChime}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 py-1 px-2 rounded hover:bg-slate-700/50 transition-colors cursor-pointer"
                title="Play gentle reminder chime"
              >
                <Bell className="w-3 h-3 text-teal-400" />
                <span>Test Chime</span>
              </button>

              <button
                onClick={() => onMarkDose(nextUpcomingDose.id, 'taken')}
                className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Mark Taken ✓</span>
              </button>
            </div>
          )}
        </div>

        {/* 24-Hour Timeline & Segment Breakdown (7 cols) */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-between space-y-3">
          {/* Timing Segments Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Remaining Today</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {remainingToday.length} <span className="text-xs font-normal text-slate-400">doses</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {remainingToday.length > 0 
                  ? remainingToday.map((d) => `${d.medicine.name} (${d.time})`).join(', ')
                  : 'All taken today!'}
              </div>
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-400" />
                <span>Tomorrow Morning</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {remainingTomorrow.length} <span className="text-xs font-normal text-slate-400">doses</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {remainingTomorrow.length > 0 
                  ? remainingTomorrow.map((d) => `${d.medicine.name} (${d.time})`).join(', ')
                  : 'None scheduled'}
              </div>
            </div>
          </div>

          {/* Clinical Preparation Guidance Chips */}
          <div className="bg-slate-800/30 p-2.5 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            {requiresFoodCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-md font-medium">
                <Utensils className="w-3 h-3" />
                {requiresFoodCount} with/after food
              </span>
            )}

            {emptyStomachCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded-md font-medium">
                <AlertCircle className="w-3 h-3" />
                {emptyStomachCount} on empty stomach
              </span>
            )}

            {lowStockCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-rose-300 bg-rose-950/70 border border-rose-800/60 px-2 py-0.5 rounded-md font-medium">
                <ShieldAlert className="w-3 h-3" />
                {lowStockCount} running low on stock
              </span>
            )}

            {selectedMemberId === 'all' && (
              <span className="text-[11px] text-slate-400 ml-auto flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Monitoring {members.length} family profiles</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
