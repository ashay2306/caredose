import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Calendar, 
  User, 
  Plus, 
  Eye, 
  Building, 
  Pill, 
  Download, 
  X,
  Check
} from 'lucide-react';
import { Prescription, FamilyMember, Medicine } from '../types/medicare';

interface PrescriptionVaultProps {
  prescriptions: Prescription[];
  members: FamilyMember[];
  medicines: Medicine[];
  selectedMemberId: string | 'all';
  onAddPrescription: (rx: Omit<Prescription, 'id'>) => void;
}

export const PrescriptionVault: React.FC<PrescriptionVaultProps> = ({
  prescriptions,
  members,
  medicines,
  selectedMemberId,
  onAddPrescription,
}) => {
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Add Prescription Form
  const [title, setTitle] = useState('');
  const [profileId, setProfileId] = useState(members[0]?.id || 'mem-1');
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [clinic, setClinic] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('2027-04-15');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'
  );

  const visiblePrescriptions = selectedMemberId === 'all'
    ? prescriptions
    : prescriptions.filter((p) => p.profileId === selectedMemberId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !doctorName) return;

    onAddPrescription({
      title,
      profileId,
      doctorName,
      specialty: specialty || 'Physician',
      clinic: clinic || 'City Hospital',
      date,
      validUntil,
      diagnosis: diagnosis || 'General check-up',
      notes,
      imageUrl,
      medicineNames: ['Metformin 500mg', 'Atorvastatin 20mg'],
    });

    setAddModalOpen(false);
    setTitle('');
    setDoctorName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Prescription Vault & Medical Records
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Store doctor notes, digital prescriptions, and valid consultation dates safely in Firebase Cloud Storage.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Prescription</span>
        </button>
      </div>

      {/* Grid of Prescription Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visiblePrescriptions.map((rx) => {
          const patient = members.find((m) => m.id === rx.profileId) || members[0];

          return (
            <div
              key={rx.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: patient.avatarColor }}
                    />
                    <span className="font-semibold text-slate-800">{patient.name}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{patient.relationship}</span>
                  </div>

                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Valid until {rx.validUntil}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-900">{rx.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-700">{rx.doctorName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rx.specialty}</span>
                  </div>
                </div>

                {/* Clinic & Diagnosis */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rx.clinic}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Prescribed on: {rx.date}</span>
                  </div>
                  {rx.diagnosis && (
                    <div className="text-[11px] text-teal-800 font-medium pt-1">
                      Diagnosis: {rx.diagnosis}
                    </div>
                  )}
                </div>

                {/* Linked Medicines Tags */}
                {rx.medicineNames && rx.medicineNames.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">Prescribed Medicines:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {rx.medicineNames.map((name, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* View Document Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Digital Rx Archive
                </span>

                <button
                  onClick={() => setSelectedRx(rx)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Prescription</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visiblePrescriptions.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Prescriptions Uploaded</h3>
          <p className="text-xs text-slate-500 mt-1">Upload your doctor consultation slips or prescriptions.</p>
        </div>
      )}

      {/* Prescription Full Viewer Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedRx.title}</h3>
                <p className="text-xs text-slate-500">
                  {selectedRx.doctorName} · {selectedRx.clinic}
                </p>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Image Preview */}
            <div className="w-full h-80 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={selectedRx.imageUrl}
                alt="Prescription Document"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
              <div className="font-semibold text-slate-800">Doctor Advice & Notes:</div>
              <p className="text-slate-600 leading-relaxed">{selectedRx.notes || 'None noted.'}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedRx(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download / Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Prescription Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Upload New Prescription</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Prescription Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiology Follow-up Rx"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Doctor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jenkins"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>
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
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  placeholder="e.g. Metro Heart Hospital"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Prescription Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>
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
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
