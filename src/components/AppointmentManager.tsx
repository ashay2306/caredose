import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Building, 
  Plus, 
  Bell, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { Appointment, FamilyMember, Prescription } from '../types/medicare';

interface AppointmentManagerProps {
  appointments: Appointment[];
  members: FamilyMember[];
  prescriptions: Prescription[];
  selectedMemberId: string | 'all';
  onAddAppointment: (apt: Omit<Appointment, 'id'>) => void;
  onTriggerChime: () => void;
}

export const AppointmentManager: React.FC<AppointmentManagerProps> = ({
  appointments,
  members,
  prescriptions,
  selectedMemberId,
  onAddAppointment,
  onTriggerChime,
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [alertSimulationMsg, setAlertSimulationMsg] = useState<string | null>(null);

  // Form states
  const [profileId, setProfileId] = useState(members[0]?.id || 'mem-1');
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [clinic, setClinic] = useState('');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('10:30');
  const [reason, setReason] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');

  const visibleAppointments = selectedMemberId === 'all'
    ? appointments
    : appointments.filter((a) => a.profileId === selectedMemberId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !date || !time) return;

    onAddAppointment({
      profileId,
      doctorName,
      specialty: specialty || 'Physician',
      clinic: clinic || 'City Clinic',
      date,
      time,
      reason: reason || 'Routine clinical checkup',
      status: 'upcoming',
      prescriptionId: prescriptionId || undefined,
    });

    setAddModalOpen(false);
    setDoctorName('');
    setReason('');
  };

  const handleSimulateAlert = (apt: Appointment) => {
    onTriggerChime();
    setAlertSimulationMsg(
      `🔔 Push Notification Dispatched: Appointment with ${apt.doctorName} (${apt.specialty}) scheduled for ${apt.date} at ${apt.time} at ${apt.clinic}.`
    );
    setTimeout(() => setAlertSimulationMsg(null), 5000);
  };

  const downloadICS = (apt: Appointment) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CareDose//MediCare Plus System//EN
BEGIN:VEVENT
SUMMARY:Doctor Appointment: ${apt.doctorName}
DESCRIPTION:${apt.reason} - Clinic: ${apt.clinic}
DTSTART:${apt.date.replace(/-/g, '')}T${apt.time.replace(':', '')}00Z
LOCATION:${apt.clinic}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointment-${apt.doctorName.replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner if triggered */}
      {alertSimulationMsg && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3 animate-fade-in text-teal-950">
          <Bell className="w-5 h-5 text-teal-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="text-xs">
            <span className="font-bold">Doctor Appointment Alert Simulated:</span>
            <p className="mt-0.5 text-teal-800">{alertSimulationMsg}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Doctor Appointment Reminders
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track follow-up clinical visits, attach diagnostic prescriptions, and export to Google/Apple Calendar.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {visibleAppointments.map((apt) => {
          const patient = members.find((m) => m.id === apt.profileId) || members[0];
          const linkedRx = prescriptions.find((p) => p.id === apt.prescriptionId);

          return (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 p-5 shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                {/* Header Tag */}
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: patient.avatarColor }}
                  />
                  <span className="font-semibold text-slate-800">{patient.name}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{patient.relationship}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                    Upcoming
                  </span>
                </div>

                {/* Doctor & Specialty */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {apt.doctorName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-700">{apt.specialty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {apt.clinic}
                    </span>
                  </div>
                </div>

                {/* Reason & Date */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {apt.date} at {apt.time}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>Reason: <span className="font-medium text-slate-700">{apt.reason}</span></span>
                </div>

                {linkedRx && (
                  <div className="text-[11px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 inline-flex items-center gap-1.5">
                    <FileText className="w-3 h-3" />
                    <span>Linked to Prescription: {linkedRx.title}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleSimulateAlert(apt)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Simulate push reminder chime"
                >
                  <Bell className="w-3.5 h-3.5 text-teal-600" />
                  <span>Simulate Alert</span>
                </button>

                <button
                  onClick={() => downloadICS(apt)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Export to Calendar file (.ics)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Add to Calendar</span>
                </button>
              </div>
            </div>
          );
        })}

        {visibleAppointments.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No Upcoming Appointments</h3>
            <p className="text-xs text-slate-500 mt-1">Schedule doctor follow-ups to receive automated reminders.</p>
          </div>
        )}
      </div>

      {/* Schedule Appointment Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Schedule Doctor Appointment</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Family Member</label>
                <select
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relationship})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiologist"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Clinic / Hospital</label>
                  <input
                    type="text"
                    placeholder="e.g. Metro Heart Institute"
                    value={clinic}
                    onChange={(e) => setClinic(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Reason for Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Blood pressure review & fasting sugar check"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Link Existing Prescription (Optional)</label>
                <select
                  value={prescriptionId}
                  onChange={(e) => setPrescriptionId(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
                >
                  <option value="">None</option>
                  {prescriptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.doctorName})
                    </option>
                  ))}
                </select>
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
                  Schedule Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
