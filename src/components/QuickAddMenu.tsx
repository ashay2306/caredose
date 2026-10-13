import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Pill, 
  Camera, 
  Users, 
  FileText, 
  Calendar, 
  ChevronDown 
} from 'lucide-react';

interface QuickAddMenuProps {
  onAddMedicine: () => void;
  onScanStrip: () => void;
  onAddMember: () => void;
  onAddPrescription: () => void;
  onAddAppointment: () => void;
}

export const QuickAddMenu: React.FC<QuickAddMenuProps> = ({
  onAddMedicine,
  onScanStrip,
  onAddMember,
  onAddPrescription,
  onAddAppointment,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-teal-500/20 cursor-pointer"
        title="Add medication, prescription, family member, or appointment"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>+ Add</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 text-xs animate-scale-in">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Create & Add Records
          </div>

          <button
            onClick={() => handleAction(onAddMedicine)}
            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Add Medicine</div>
              <div className="text-[10px] text-slate-400">Configure dose, timings & stock</div>
            </div>
          </button>

          <button
            onClick={() => handleAction(onScanStrip)}
            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-teal-800">Scan Strip (AI OCR)</div>
              <div className="text-[10px] text-slate-400">Camera extract name & expiry</div>
            </div>
          </button>

          <button
            onClick={() => handleAction(onAddMember)}
            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Add Family Member</div>
              <div className="text-[10px] text-slate-400">Grandparent, parent, child</div>
            </div>
          </button>

          <button
            onClick={() => handleAction(onAddPrescription)}
            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Upload Prescription</div>
              <div className="text-[10px] text-slate-400">Doctor slip to digital vault</div>
            </div>
          </button>

          <button
            onClick={() => handleAction(onAddAppointment)}
            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Schedule Appointment</div>
              <div className="text-[10px] text-slate-400">Doctor visit & calendar alert</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
