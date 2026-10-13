import React, { useState } from 'react';
import { 
  X, 
  Pill, 
  Plus, 
  Trash2, 
  Clock, 
  Utensils, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { FamilyMember, Medicine, DosageForm, FoodInstruction } from '../types/medicare';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  onAddMedicine: (medicine: Omit<Medicine, 'id' | 'createdAt'>) => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  members,
  onAddMedicine,
}) => {
  const [profileId, setProfileId] = useState(members[0]?.id || 'mem-1');
  const [name, setName] = useState('');
  const [strength, setStrength] = useState('500 mg');
  const [dosageForm, setDosageForm] = useState<DosageForm>('Tablet');
  const [doseAmount, setDoseAmount] = useState('1 tablet');
  const [foodInstruction, setFoodInstruction] = useState<FoodInstruction>('After dinner');
  const [scheduleTimings, setScheduleTimings] = useState<string[]>(['20:00']);
  const [initialStock, setInitialStock] = useState<number>(30);
  const [minStockAlert, setMinStockAlert] = useState<number>(7);
  const [unitType, setUnitType] = useState('tablets');
  const [activeSalt, setActiveSalt] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [expiryDate, setExpiryDate] = useState('12/2027');
  const [safetyWarnings, setSafetyWarnings] = useState('Take with or after food. Follow doctor instructions.');

  if (!isOpen) return null;

  const handleAddTime = () => {
    setScheduleTimings([...scheduleTimings, '08:00']);
  };

  const handleRemoveTime = (index: number) => {
    if (scheduleTimings.length > 1) {
      setScheduleTimings(scheduleTimings.filter((_, i) => i !== index));
    }
  };

  const handleTimeChange = (index: number, val: string) => {
    const updated = [...scheduleTimings];
    updated[index] = val;
    setScheduleTimings(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddMedicine({
      profileId,
      name,
      strength,
      dosageForm,
      doseAmount,
      foodInstruction,
      scheduleTimings,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      currentStock: initialStock,
      initialStock,
      minStockAlert,
      unitType: dosageForm === 'Syrup' ? 'ml' : 'tablets',
      dailyFrequency: scheduleTimings.length,
      activeSalt: activeSalt || undefined,
      manufacturer: manufacturer || undefined,
      expiryDate,
      purpose: 'Prescribed medication',
      safetyWarnings,
    });

    onClose();
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Add New Medicine</h2>
              <p className="text-xs text-slate-400">
                Configure smart reminder, food timings, and automatic refill tracking
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Assign to Family Member</label>
              <select
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.relationship}, {m.age}y)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Medicine Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Metformin, Amlodipine, Paracetamol"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Strength</label>
              <input
                type="text"
                placeholder="e.g. 500 mg, 10 mg, 5 mg / 5 ml"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Dosage Form</label>
              <select
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value as DosageForm)}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Drops">Drops</option>
                <option value="Inhaler">Inhaler</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Dose Amount</label>
              <input
                type="text"
                value={doseAmount}
                onChange={(e) => setDoseAmount(e.target.value)}
                placeholder="e.g. 1 tablet, 5 ml, 2 puffs"
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Food Relation Instruction</label>
              <select
                value={foodInstruction}
                onChange={(e) => setFoodInstruction(e.target.value as FoodInstruction)}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
              >
                <option value="After dinner">After dinner</option>
                <option value="After breakfast">After breakfast</option>
                <option value="After lunch">After lunch</option>
                <option value="Before food">Before food</option>
                <option value="After food">After food</option>
                <option value="With meals">With meals</option>
                <option value="Empty stomach">Empty stomach</option>
                <option value="At bedtime">At bedtime</option>
                <option value="As directed">As directed</option>
              </select>
            </div>
          </div>

          {/* Schedule Timings */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>Daily Reminder Timings (24-Hour Format)</span>
              </label>
              <button
                type="button"
                onClick={handleAddTime}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Time Slot</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {scheduleTimings.map((time, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(idx, e.target.value)}
                    className="font-mono text-xs p-1 focus:outline-teal-500"
                  />
                  {scheduleTimings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stock Tracking (Features 3 & 4) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Purchased Stock Units</label>
              <input
                type="number"
                min="1"
                value={initialStock}
                onChange={(e) => setInitialStock(parseInt(e.target.value, 10) || 1)}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Refill Alert Minimum Threshold</label>
              <input
                type="number"
                min="1"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(parseInt(e.target.value, 10) || 1)}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
              />
            </div>
          </div>

          {/* Additional Clinical Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Active Chemical Salt (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Metformin Hydrochloride"
                value={activeSalt}
                onChange={(e) => setActiveSalt(e.target.value)}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="e.g. 11/2027"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Safety Warnings & Precautions</label>
            <input
              type="text"
              value={safetyWarnings}
              onChange={(e) => setSafetyWarnings(e.target.value)}
              className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save Medicine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
