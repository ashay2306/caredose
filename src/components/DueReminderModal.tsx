import React, { useState } from 'react';
import { 
  Bell, 
  Pill, 
  Utensils, 
  Clock, 
  Check, 
  X, 
  AlertCircle, 
  Volume2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Medicine, FamilyMember } from '../types/medicare';
import { soundService } from '../services/soundService';

interface DueReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine;
  member: FamilyMember;
  scheduledTime: string;
  onConfirmTaken: (medId: string) => void;
  onSkip: (medId: string, reason?: string) => void;
}

export const DueReminderModal: React.FC<DueReminderModalProps> = ({
  isOpen,
  onClose,
  medicine,
  member,
  scheduledTime,
  onConfirmTaken,
  onSkip,
}) => {
  const [snoozeActive, setSnoozeActive] = useState(false);
  const [snoozeMinutes, setSnoozeMinutes] = useState(15);

  if (!isOpen) return null;

  const handleTaken = () => {
    soundService.playSuccessDing();
    onConfirmTaken(medicine.id);
    onClose();
  };

  const handleSkip = () => {
    onSkip(medicine.id, 'Skipped by patient in reminder popup');
    onClose();
  };

  const handleSnooze = (minutes: number) => {
    setSnoozeMinutes(minutes);
    setSnoozeActive(true);
    setTimeout(() => {
      onClose();
      setSnoozeActive(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Bell className="w-8 h-8 text-white animate-bounce" />
          </div>

          <div className="text-xs uppercase tracking-widest font-bold opacity-90">
            Medicine Dose Reminder
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">
            Time for {medicine.name}
          </h2>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Scheduled for {scheduledTime}</span>
          </div>
        </div>

        {/* Prescription Details (Strictly matching prompt specification) */}
        <div className="p-6 space-y-5">
          {/* Patient Tag */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Patient:</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: member.avatarColor }}
              />
              <span className="font-bold text-slate-800">{member.name}</span>
              <span className="text-slate-400">({member.relationship})</span>
            </div>
          </div>

          {/* Details Specification Grid */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2.5 rounded-lg border border-slate-100 bg-white">
              <span className="text-slate-500">Medicine Name:</span>
              <span className="font-bold text-slate-900">{medicine.name}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-lg border border-slate-100 bg-white">
              <span className="text-slate-500">Dose & Quantity:</span>
              <span className="font-bold text-slate-900">{medicine.strength} ({medicine.doseAmount})</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-lg border border-teal-100 bg-teal-50/50">
              <span className="text-teal-800 font-medium flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5" />
                Food Instruction:
              </span>
              <span className="font-bold text-teal-900">{medicine.foodInstruction}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-lg border border-slate-100 bg-white">
              <span className="text-slate-500">Current Stock Remaining:</span>
              <span className={`font-bold ${medicine.currentStock <= medicine.minStockAlert ? 'text-rose-600' : 'text-slate-800'}`}>
                {medicine.currentStock} {medicine.unitType}
              </span>
            </div>
          </div>

          {/* Precaution note */}
          {medicine.safetyWarnings && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{medicine.safetyWarnings}</span>
            </div>
          )}

          {snoozeActive ? (
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-center text-xs font-semibold text-teal-800">
              Snoozed for {snoozeMinutes} minutes! Reminder will chime again.
            </div>
          ) : (
            /* Action Buttons */
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleTaken}
                className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm tracking-wide shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>TAKEN ✓</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSnooze(15)}
                  className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Snooze (15m)</span>
                </button>

                <button
                  onClick={handleSkip}
                  className="py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>SKIP DOSE</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
