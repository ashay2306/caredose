import React, { useState, useEffect } from 'react';
import { 
  FamilyMember, 
  Medicine, 
  DoseLog, 
  Prescription, 
  Appointment, 
  EscalationAlert,
  AuthUser 
} from './types/medicare';
import { 
  INITIAL_MEMBERS, 
  INITIAL_MEDICINES, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_APPOINTMENTS, 
  generatePastDoseLogs 
} from './data/initialData';
import { soundService } from './services/soundService';
import { notificationService } from './services/notificationService';
import { Navbar } from './components/Navbar';
import { TodaySchedule } from './components/TodaySchedule';
import { StockAndRefills } from './components/StockAndRefills';
import { FamilyHub } from './components/FamilyHub';
import { AdherenceDashboard } from './components/AdherenceDashboard';
import { PrescriptionVault } from './components/PrescriptionVault';
import { AppointmentManager } from './components/AppointmentManager';
import { MedicineScannerModal } from './components/MedicineScannerModal';
import { AddMedicineModal } from './components/AddMedicineModal';
import { SafetyGuideModal } from './components/SafetyGuideModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { EscalationModal } from './components/EscalationModal';
import { DueReminderModal } from './components/DueReminderModal';
import { AuthModal } from './components/AuthModal';

const INITIAL_USER: AuthUser = {
  id: 'usr-alex',
  name: 'Alex Rivera',
  email: 'alex.rivera@familycare.com',
  role: 'family_caregiver',
  avatarColor: '#4f46e5',
  createdAt: '2026-09-01T00:00:00Z',
};

export default function App() {
  // Current user state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('caredose_current_user');
    if (!saved) return INITIAL_USER;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.name && (parsed.name.includes('Sharma') || parsed.name.includes('Rajesh'))) {
        return INITIAL_USER;
      }
      return parsed;
    } catch {
      return INITIAL_USER;
    }
  });

  // Load state from localStorage or initial starting data
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('caredose_members');
    if (!saved) return INITIAL_MEMBERS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some((m: FamilyMember) => m.name.includes('Sharma') || m.name.includes('Ramakant'))) {
        return INITIAL_MEMBERS;
      }
      return parsed;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('caredose_medicines');
    if (!saved) return INITIAL_MEDICINES;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some((m: Medicine) => m.name.includes('Glycomet') || m.name.includes('Thyronorm'))) {
        return INITIAL_MEDICINES;
      }
      return parsed;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(() => {
    const saved = localStorage.getItem('caredose_doselogs');
    const savedMeds = localStorage.getItem('caredose_medicines');
    if (!saved || (savedMeds && savedMeds.includes('Glycomet'))) {
      return generatePastDoseLogs(INITIAL_MEDICINES);
    }
    try {
      return JSON.parse(saved);
    } catch {
      return generatePastDoseLogs(INITIAL_MEDICINES);
    }
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('caredose_prescriptions');
    if (!saved || saved.includes('Arvind Mehta')) return INITIAL_PRESCRIPTIONS;
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('caredose_appointments');
    if (!saved || saved.includes('Arvind Mehta')) return INITIAL_APPOINTMENTS;
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [escalationLogs, setEscalationLogs] = useState<EscalationAlert[]>(() => {
    const saved = localStorage.getItem('caredose_escalations');
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>('today');
  const [selectedMemberId, setSelectedMemberId] = useState<string | 'all'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [architectureOpen, setArchitectureOpen] = useState(false);
  const [escalationModalOpen, setEscalationModalOpen] = useState(false);
  const [dueReminderOpen, setDueReminderOpen] = useState(false);

  // Target member/medicine for modals
  const [escalationMember, setEscalationMember] = useState<FamilyMember>(INITIAL_MEMBERS[0]);
  const [escalationMedicine, setEscalationMedicine] = useState<Medicine | undefined>(INITIAL_MEDICINES[0]);

  // Save to localStorage on change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('caredose_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('caredose_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('caredose_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('caredose_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('caredose_doselogs', JSON.stringify(doseLogs));
  }, [doseLogs]);

  useEffect(() => {
    localStorage.setItem('caredose_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('caredose_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('caredose_escalations', JSON.stringify(escalationLogs));
  }, [escalationLogs]);

  // Background Web Notification Scheduler: checks pending doses every 20 seconds
  useEffect(() => {
    const runCheck = () => {
      notificationService.checkScheduledDoses(
        medicines,
        members,
        doseLogs,
        (med, member, _time) => {
          if (soundEnabled) soundService.playReminderChime();
          setEscalationMember(member);
          setEscalationMedicine(med);
          setDueReminderOpen(true);
        }
      );
    };

    // Run on mount and every 20 seconds
    runCheck();
    const interval = setInterval(runCheck, 20000);
    return () => clearInterval(interval);
  }, [medicines, members, doseLogs, soundEnabled]);

  // Auth Handlers
  const handleLoginSuccess = (user: AuthUser, withDemoPack?: boolean) => {
    setCurrentUser(user);
    if (withDemoPack) {
      // Seed complete Starting Family Database with doctors and medicines
      setMembers(INITIAL_MEMBERS);
      setMedicines(INITIAL_MEDICINES);
      setDoseLogs(generatePastDoseLogs(INITIAL_MEDICINES));
      setPrescriptions(INITIAL_PRESCRIPTIONS);
      setAppointments(INITIAL_APPOINTMENTS);
      setEscalationLogs([]);
      setSelectedMemberId('all');
      setActiveTab('today');
    } else {
      // Create new clean profile for this registered user
      const newPrimaryMember: FamilyMember = {
        id: `mem-${user.id}`,
        name: user.name,
        relationship: 'Self',
        age: 28,
        avatarColor: user.avatarColor,
        guardianName: user.name,
        guardianPhone: '+1 (555) 789-1022',
        guardianEmail: user.email,
        isPrimaryCaregiver: true,
        notes: 'Primary registered patient account. Ready to add medicines and family members.',
      };
      setMembers([newPrimaryMember]);
      setMedicines([]);
      setDoseLogs([]);
      setPrescriptions([]);
      setAppointments([]);
      setEscalationLogs([]);
      setSelectedMemberId(newPrimaryMember.id);
      setActiveTab('today');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Dose status handler with stock deduction
  const handleMarkDose = (doseLogId: string, status: 'taken' | 'skipped' | 'pending', skipReason?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Find medicine associated with this log
    let medId: string | null = null;
    const existing = doseLogs.find((l) => l.id === doseLogId);
    if (existing) {
      medId = existing.medicineId;
    } else {
      const parts = doseLogId.split('-');
      if (parts.length >= 2) {
        medId = `${parts[1]}-${parts[2]}`;
      }
    }

    // Play feedback sound
    if (soundEnabled) {
      if (status === 'taken') soundService.playSuccessDing();
    }

    // Adjust medicine stock count
    if (medId) {
      setMedicines((prev) =>
        prev.map((m) => {
          if (m.id === medId) {
            if (status === 'taken' && existing?.status !== 'taken') {
              return { ...m, currentStock: Math.max(0, m.currentStock - 1) };
            } else if (existing?.status === 'taken' && status !== 'taken') {
              return { ...m, currentStock: m.currentStock + 1 };
            }
          }
          return m;
        })
      );
    }

    // Update or append dose log
    setDoseLogs((prev) => {
      const idx = prev.findIndex((l) => l.id === doseLogId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          status,
          takenAt: status === 'taken' ? new Date().toISOString() : undefined,
          skipReason: status === 'skipped' ? skipReason : undefined,
        };
        return copy;
      } else {
        const [, , , , timeStr] = doseLogId.split('-');
        const foundMed = medicines.find((m) => doseLogId.includes(m.id)) || medicines[0];
        return [
          ...prev,
          {
            id: doseLogId,
            medicineId: foundMed.id,
            profileId: foundMed.profileId,
            scheduledDate: todayStr,
            scheduledTime: timeStr ? `${timeStr.slice(0, 2)}:${timeStr.slice(2)}` : '20:00',
            status,
            takenAt: status === 'taken' ? new Date().toISOString() : undefined,
            skipReason: status === 'skipped' ? skipReason : undefined,
          },
        ];
      }
    });
  };

  // Stock management handler
  const handleUpdateStock = (medicineId: string, newStock: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, currentStock: newStock } : m))
    );
  };

  // Add Medicine handler
  const handleAddMedicine = (newMed: Omit<Medicine, 'id' | 'createdAt'>) => {
    const id = `med-${Date.now()}`;
    const medicine: Medicine = {
      ...newMed,
      id,
      createdAt: new Date().toISOString(),
    };

    setMedicines((prev) => [medicine, ...prev]);

    // Generate immediate logs for today's timings
    const todayStr = new Date().toISOString().split('T')[0];
    const newLogs: DoseLog[] = medicine.scheduleTimings.map((time) => ({
      id: `log-${id}-${todayStr}-${time.replace(':', '')}`,
      medicineId: id,
      profileId: medicine.profileId,
      scheduledDate: todayStr,
      scheduledTime: time,
      status: 'pending',
    }));

    setDoseLogs((prev) => [...newLogs, ...prev]);
    setActiveTab('today');
  };

  // Add Family Member handler
  const handleAddMember = (newMem: Omit<FamilyMember, 'id'>) => {
    const id = `mem-${Date.now()}`;
    const member: FamilyMember = { ...newMem, id };
    setMembers((prev) => [...prev, member]);
    setSelectedMemberId(id);
  };

  // Add Prescription handler
  const handleAddPrescription = (newRx: Omit<Prescription, 'id'>) => {
    const id = `rx-${Date.now()}`;
    setPrescriptions((prev) => [{ ...newRx, id }, ...prev]);
  };

  // Add Appointment handler
  const handleAddAppointment = (newApt: Omit<Appointment, 'id'>) => {
    const id = `apt-${Date.now()}`;
    setAppointments((prev) => [{ ...newApt, id }, ...prev]);
  };

  // Trigger Simulated Reminder Alert
  const handleTriggerDemoReminder = () => {
    const grandpa = members.find((m) => m.name.includes('Arthur') || m.relationship === 'Grandparent') || members[0];
    const metformin = medicines.find((m) => 
      m.name.toLowerCase().includes('metformin')
    ) || medicines[0];

    setEscalationMember(grandpa);
    setEscalationMedicine(metformin);
    if (soundEnabled) soundService.playReminderChime();
    notificationService.sendTestNotification(metformin, grandpa);
    setDueReminderOpen(true);
  };

  // Trigger Missed Escalation Demo
  const handleTriggerEscalationDemo = (member?: FamilyMember, med?: Medicine) => {
    const targetM = member || members.find((m) => m.name.includes('Arthur') || m.relationship === 'Grandparent') || members[0];
    const targetMed = med || medicines.find((m) => m.profileId === targetM.id) || medicines[0];

    setEscalationMember(targetM);
    setEscalationMedicine(targetMed);
    setEscalationModalOpen(true);

    const alertId = `esc-${Date.now()}`;
    const newAlert: EscalationAlert = {
      id: alertId,
      profileId: targetM.id,
      medicineId: targetMed.id,
      medicineName: targetMed.name,
      doseAmount: targetMed.doseAmount,
      scheduledTime: targetMed.scheduleTimings[0] || '20:00',
      patientName: targetM.name,
      guardianName: targetM.guardianName,
      guardianPhone: targetM.guardianPhone,
      minutesLate: 45,
      timestamp: new Date().toISOString(),
      status: 'sent',
      channel: 'SMS',
    };

    setEscalationLogs((prev) => [newAlert, ...prev]);
  };

  // Reset to initial presentation data
  const handleResetData = () => {
    if (window.confirm('Reset CareDose to the starting family, doctors, and medicines?')) {
      localStorage.clear();
      setCurrentUser(INITIAL_USER);
      setMembers(INITIAL_MEMBERS);
      setMedicines(INITIAL_MEDICINES);
      setDoseLogs(generatePastDoseLogs(INITIAL_MEDICINES));
      setPrescriptions(INITIAL_PRESCRIPTIONS);
      setAppointments(INITIAL_APPOINTMENTS);
      setEscalationLogs([]);
      setSelectedMemberId('all');
      setActiveTab('today');
    }
  };

  const lowStockCount = medicines.filter((m) => m.currentStock <= m.minStockAlert).length;
  const pendingEscalationsCount = escalationLogs.length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Navigation Header */}
      <Navbar
        members={members}
        selectedMemberId={selectedMemberId}
        onSelectMember={(id) => setSelectedMemberId(id)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenScanner={() => setScannerOpen(true)}
        onOpenArchitecture={() => setArchitectureOpen(true)}
        onOpenSafetyGuide={() => setSafetyOpen(true)}
        onTriggerDemoReminder={handleTriggerDemoReminder}
        onTriggerEscalationDemo={() => handleTriggerEscalationDemo()}
        onResetData={handleResetData}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        pendingEscalationsCount={pendingEscalationsCount}
        lowStockCount={lowStockCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'today' && (
          <TodaySchedule
            medicines={medicines}
            doseLogs={doseLogs}
            members={members}
            selectedMemberId={selectedMemberId}
            onMarkDose={handleMarkDose}
            onOpenAddModal={() => setAddModalOpen(true)}
            onOpenScanner={() => setScannerOpen(true)}
            onTriggerAlarmChime={() => soundService.playReminderChime()}
            onSimulateEscalation={(mem, med) => handleTriggerEscalationDemo(mem, med)}
          />
        )}

        {activeTab === 'medicines' && (
          <StockAndRefills
            medicines={medicines}
            members={members}
            selectedMemberId={selectedMemberId}
            onUpdateStock={handleUpdateStock}
            onOpenAddModal={() => setAddModalOpen(true)}
            onOpenScanner={() => setScannerOpen(true)}
          />
        )}

        {activeTab === 'family' && (
          <FamilyHub
            members={members}
            medicines={medicines}
            doseLogs={doseLogs}
            escalationLogs={escalationLogs}
            onAddMember={handleAddMember}
            onSelectMember={(id) => {
              setSelectedMemberId(id);
              setActiveTab('today');
            }}
            onSimulateEscalation={(mem, med) => handleTriggerEscalationDemo(mem, med)}
          />
        )}

        {activeTab === 'adherence' && (
          <AdherenceDashboard
            medicines={medicines}
            doseLogs={doseLogs}
            members={members}
            selectedMemberId={selectedMemberId}
          />
        )}

        {activeTab === 'prescriptions' && (
          <PrescriptionVault
            prescriptions={prescriptions}
            members={members}
            medicines={medicines}
            selectedMemberId={selectedMemberId}
            onAddPrescription={handleAddPrescription}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentManager
            appointments={appointments}
            members={members}
            prescriptions={prescriptions}
            selectedMemberId={selectedMemberId}
            onAddAppointment={handleAddAppointment}
            onTriggerChime={() => soundService.playReminderChime()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CareDose (MediCare+)</span>
            <span aria-hidden="true">·</span>
            <span>Smart Medication & Family Care System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Strip OCR Scanner</span>
            <span aria-hidden="true">·</span>
            <span>Refill Automation</span>
            <span aria-hidden="true">·</span>
            <span>Missed Dose Escalation</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
      />

      {/* Strip Scanner Modal */}
      <MedicineScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        members={members}
        onSaveMedicine={handleAddMedicine}
      />

      {/* Add Medicine Modal */}
      <AddMedicineModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        members={members}
        onAddMedicine={handleAddMedicine}
      />

      {/* Safety Guide Modal */}
      <SafetyGuideModal
        isOpen={safetyOpen}
        onClose={() => setSafetyOpen(false)}
        medicines={medicines}
      />

      {/* Architecture Explainer Modal */}
      <ArchitectureModal
        isOpen={architectureOpen}
        onClose={() => setArchitectureOpen(false)}
      />

      {/* Missed Dose Escalation Modal */}
      <EscalationModal
        isOpen={escalationModalOpen}
        onClose={() => setEscalationModalOpen(false)}
        targetMember={escalationMember}
        targetMedicine={escalationMedicine}
        onConfirmDoseByGuardian={() => {
          if (escalationMedicine) {
            handleMarkDose(`log-${escalationMedicine.id}`, 'taken');
          }
        }}
      />

      {/* Live Due Reminder Alert Modal */}
      {escalationMedicine && (
        <DueReminderModal
          isOpen={dueReminderOpen}
          onClose={() => setDueReminderOpen(false)}
          medicine={escalationMedicine}
          member={escalationMember}
          scheduledTime={escalationMedicine.scheduleTimings[0] || '20:00'}
          onConfirmTaken={(medId) => {
            handleMarkDose(`log-${medId}`, 'taken');
          }}
          onSkip={(medId, reason) => {
            handleMarkDose(`log-${medId}`, 'skipped', reason);
          }}
        />
      )}
    </div>
  );
}
