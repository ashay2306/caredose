export type Relationship = 
  | 'Self' 
  | 'Grandparent' 
  | 'Father' 
  | 'Mother' 
  | 'Child' 
  | 'Spouse' 
  | 'Other';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: Relationship;
  age: number;
  avatarColor: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  isPrimaryCaregiver?: boolean;
  notes?: string;
  allergies?: string[];
}

export type DosageForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Drops' | 'Inhaler' | 'Injection' | 'Other';

export type FoodInstruction = 
  | 'After food' 
  | 'Before food' 
  | 'With meals' 
  | 'Empty stomach' 
  | 'After dinner' 
  | 'After breakfast' 
  | 'After lunch'
  | 'Before lunch'
  | 'At bedtime'
  | 'As directed';

export interface Medicine {
  id: string;
  profileId: string;
  name: string;
  strength: string;
  dosageForm: DosageForm;
  doseAmount: string; // e.g. "1 tablet"
  foodInstruction: FoodInstruction;
  scheduleTimings: string[]; // ["08:00", "20:00"] (24-hour format)
  daysOfWeek: number[]; // [0, 1, 2, 3, 4, 5, 6] where 0 is Sun
  currentStock: number;
  initialStock: number;
  minStockAlert: number;
  unitType: string; // "tablets", "capsules", "ml", "doses"
  dailyFrequency: number;
  activeSalt?: string;
  manufacturer?: string;
  expiryDate?: string; // "MM/YYYY"
  purpose?: string;
  safetyWarnings?: string;
  createdAt: string;
}

export type DoseStatus = 'pending' | 'taken' | 'skipped' | 'missed';

export interface DoseLog {
  id: string;
  medicineId: string;
  profileId: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: DoseStatus;
  takenAt?: string;
  skipReason?: string;
  escalationTriggered?: boolean;
}

export interface Prescription {
  id: string;
  profileId: string;
  title: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  date: string;
  validUntil: string;
  diagnosis: string;
  imageUrl: string;
  medicineNames: string[];
  notes?: string;
}

export interface Appointment {
  id: string;
  profileId: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  prescriptionId?: string;
}

export interface EscalationAlert {
  id: string;
  profileId: string;
  medicineId: string;
  doseLogId?: string;
  medicineName: string;
  doseAmount: string;
  scheduledTime: string;
  patientName: string;
  guardianName: string;
  guardianPhone: string;
  minutesLate: number;
  timestamp: string;
  status: 'sent' | 'acknowledged' | 'resolved';
  channel: 'SMS' | 'WhatsApp' | 'In-App Chime';
}

export interface ScannedMedicineResult {
  medicineName: string;
  strength: string;
  dosageForm: string;
  manufacturer: string;
  expiryDate: string;
  activeSalt: string;
  totalUnitsInStrip: number;
  foodInstruction: string;
  safetyWarnings: string;
  suggestedFrequency: string;
}
