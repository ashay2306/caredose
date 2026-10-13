import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldAlert, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Pill,
  Send,
  Sliders,
  Check,
  X,
  HeartPulse
} from 'lucide-react';
import { FamilyMember, Medicine, DoseLog, EscalationAlert, Relationship } from '../types/medicare';

interface FamilyHubProps {
  members: FamilyMember[];
  medicines: Medicine[];
  doseLogs: DoseLog[];
  escalationLogs: EscalationAlert[];
  onAddMember: (member: Omit<FamilyMember, 'id'>) => void;
  onSelectMember: (id: string) => void;
  onSimulateEscalation: (member: FamilyMember, med?: Medicine) => void;
  initialAddOpen?: boolean;
}

export const FamilyHub: React.FC<FamilyHubProps> = ({
  members,
  medicines,
  doseLogs,
  escalationLogs,
  onAddMember,
  onSelectMember,
  onSimulateEscalation,
  initialAddOpen = false,
}) => {
  const [addModalOpen, setAddModalOpen] = useState(initialAddOpen);

  React.useEffect(() => {
    if (initialAddOpen) setAddModalOpen(true);
  }, [initialAddOpen]);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState<Relationship>('Grandparent');
  const [newAge, setNewAge] = useState(72);
  const [newGuardianName, setNewGuardianName] = useState('Rajesh Sharma (Caregiver)');
  const [newGuardianPhone, setNewGuardianPhone] = useState('+91 98201 44521');
  const [newNotes, setNewNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const colors = ['#0284c7', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddMember({
      name: newName,
      relationship: newRelationship,
      age: Number(newAge),
      avatarColor: randomColor,
      guardianName: newGuardianName,
      guardianPhone: newGuardianPhone,
      guardianEmail: 'caregiver@example.com',
      notes: newNotes,
    });

    setAddModalOpen(false);
    setNewName('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* College Project Architecture Concept Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Multi-Generational Family Care System</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Family Caregiver Command Hub
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            One account provides total oversight for elderly grandparents, parents, children, and yourself.
            If an elderly family member forgets their dose, our smart Escalation Engine automatically dispatches real-time alerts to the designated guardian.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="mt-4 sm:mt-0 relative z-10 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Family Hierarchy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((member) => {
          const memberMeds = medicines.filter((m) => m.profileId === member.id);
          
          // Compute today's logs for this member
          let totalDosesToday = 0;
          let takenToday = 0;
          let pendingToday = 0;
          let pendingMeds: Medicine[] = [];

          memberMeds.forEach((med) => {
            med.scheduleTimings.forEach((time) => {
              totalDosesToday++;
              const log = doseLogs.find(
                (l) => l.medicineId === med.id && l.scheduledDate === todayStr && l.scheduledTime === time
              );
              if (log?.status === 'taken') {
                takenToday++;
              } else {
                pendingToday++;
                if (!pendingMeds.some((m) => m.id === med.id)) {
                  pendingMeds.push(med);
                }
              }
            });
          });

          const adherencePct = totalDosesToday > 0 
            ? Math.round((takenToday / totalDosesToday) * 100) 
            : 100;

          const isGrandpaOrElderly = member.relationship === 'Grandparent' || member.age >= 65;

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Member Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl text-white font-bold text-lg flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {member.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{member.relationship}</span>
                        <span aria-hidden="true">·</span>
                        <span>{member.age} years old</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {memberMeds.length} Meds
                  </span>
                </div>

                {/* Notes or Conditions */}
                {member.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {member.notes}
                  </p>
                )}

                {/* Today's Dose Status */}
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Today's Compliance:</span>
                    <span className="font-bold text-slate-900">{takenToday}/{totalDosesToday} Taken ({adherencePct}%)</span>
                  </div>

                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{ width: `${adherencePct}%` }}
                    />
                  </div>

                  {pendingToday > 0 ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-medium pt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{pendingToday} dose(s) pending today</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>All scheduled doses confirmed!</span>
                    </div>
                  )}
                </div>

                {/* Designated Guardian / Missed Dose Escalation Profile */}
                <div className="text-xs space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-slate-700">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      Designated Guardian:
                    </span>
                    <span className="text-slate-900 font-semibold">{member.guardianName}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Contact:
                    </span>
                    <span className="font-mono text-slate-700">{member.guardianPhone}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectMember(member.id)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                >
                  View Schedule
                </button>

                {/* Live Escalation Demonstration Button */}
                <button
                  onClick={() => onSimulateEscalation(member, pendingMeds[0] || memberMeds[0])}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Demonstrate Missed Dose Escalation trigger"
                >
                  <Send className="w-3 h-3 text-rose-600" />
                  <span>Test Escalation</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-Time Escalation Alerts Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">
              Missed Dose Escalation Activity Log
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Automated Guardian Dispatch System
          </span>
        </div>

        {escalationLogs.length > 0 ? (
          <div className="space-y-3">
            {escalationLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-950">
                      ⚠️ Escalation Dispatched: {log.patientName} Missed {log.scheduledTime} Dose ({log.medicineName})
                    </h4>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      No response after {log.minutesLate} minutes. Dispatched via {log.channel} to Guardian <span className="font-semibold">{log.guardianName}</span> ({log.guardianPhone}).
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Triggered at: {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-200/60 text-rose-900">
                    DISPATCHED
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
            No escalation incidents triggered yet. Click "Test Escalation" on any member above to simulate the workflow.
          </div>
        )}
      </div>

      {/* Add Family Member Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Family Member</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grandma Rose"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Relationship</label>
                  <select
                    value={newRelationship}
                    onChange={(e) => setNewRelationship(e.target.value as Relationship)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
                  >
                    <option value="Grandparent">Grandparent</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Child">Child</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newAge}
                    onChange={(e) => setNewAge(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Designated Guardian Name</label>
                <input
                  type="text"
                  required
                  value={newGuardianName}
                  onChange={(e) => setNewGuardianName(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Guardian Phone Number (for SMS Escalation)</label>
                <input
                  type="text"
                  required
                  value={newGuardianPhone}
                  onChange={(e) => setNewGuardianPhone(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Health Notes / Allergies</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Hypertension, Penicillin allergy"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
