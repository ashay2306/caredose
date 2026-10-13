import { FamilyMember, Medicine, DoseLog, Prescription, Appointment } from '../types/medicare';

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'mem-1',
    name: 'Arthur (Grandpa)',
    relationship: 'Grandparent',
    age: 78,
    avatarColor: '#0284c7', // Sky 600
    guardianName: 'Robert (Father)',
    guardianPhone: '+1 (555) 234-8901',
    guardianEmail: 'robert.family@example.com',
    notes: 'Type 2 Diabetes and Mild Hypertension. Requires strict 8:00 PM dose monitoring.',
    allergies: ['Penicillin', 'Sulfa drugs'],
  },
  {
    id: 'mem-2',
    name: 'Robert (Father)',
    relationship: 'Father',
    age: 54,
    avatarColor: '#059669', // Emerald 600
    guardianName: 'Alex (Self)',
    guardianPhone: '+1 (555) 789-1022',
    guardianEmail: 'alex.student@college.edu',
    notes: 'Managing blood pressure. Daily morning dose after breakfast.',
  },
  {
    id: 'mem-3',
    name: 'Elena (Mother)',
    relationship: 'Mother',
    age: 52,
    avatarColor: '#d97706', // Amber 600
    guardianName: 'Robert (Father)',
    guardianPhone: '+1 (555) 234-8901',
    guardianEmail: 'robert.family@example.com',
    notes: 'Thyroid management. Requires strict empty-stomach administration.',
  },
  {
    id: 'mem-4',
    name: 'Alex (Self)',
    relationship: 'Self',
    age: 24,
    avatarColor: '#4f46e5', // Indigo 600
    guardianName: 'Robert (Father)',
    guardianPhone: '+1 (555) 234-8901',
    guardianEmail: 'robert.family@example.com',
    isPrimaryCaregiver: true,
    notes: 'Primary account administrator and family caregiver.',
  },
  {
    id: 'mem-5',
    name: 'Leo (Child)',
    relationship: 'Child',
    age: 8,
    avatarColor: '#db2777', // Pink 600
    guardianName: 'Elena (Mother)',
    guardianPhone: '+1 (555) 345-6711',
    guardianEmail: 'elena.family@example.com',
    notes: 'Seasonal allergy syrup. Bedtime routine.',
  },
];

export const INITIAL_MEDICINES: Medicine[] = [
  // Arthur (Grandpa)
  {
    id: 'med-1',
    profileId: 'mem-1',
    name: 'Metformin HCl',
    strength: '500 mg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'After dinner',
    scheduleTimings: ['20:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 4, // 4 tablets remaining -> LOW STOCK ALERT!
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Metformin Hydrochloride (Prolonged Release)',
    manufacturer: 'USV Pharma',
    expiryDate: '11/2027',
    purpose: 'Type 2 Diabetes Glycemic Control',
    safetyWarnings: 'Take with or immediately after meals to avoid gastrointestinal discomfort. Avoid excessive alcohol.',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'med-2',
    profileId: 'mem-1',
    name: 'Atorvastatin',
    strength: '20 mg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'At bedtime',
    scheduleTimings: ['22:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 22,
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Atorvastatin Calcium Trihydrate',
    manufacturer: 'Sun Pharmaceuticals',
    expiryDate: '09/2027',
    purpose: 'Cholesterol & Lipid Regulation',
    safetyWarnings: 'Avoid consuming large quantities of grapefruit juice while on this medication.',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'med-3',
    profileId: 'mem-1',
    name: 'Glimepiride',
    strength: '1 mg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'Before food',
    scheduleTimings: ['08:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 18,
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Glimepiride IP',
    manufacturer: 'Sanofi Healthcare',
    expiryDate: '04/2028',
    purpose: 'Pancreatic insulin stimulation',
    safetyWarnings: 'Carry fast-acting glucose tablets in case of hypoglycemia (sweating, dizziness, shaking).',
    createdAt: '2026-09-01T08:00:00Z',
  },

  // Robert (Father)
  {
    id: 'med-4',
    profileId: 'mem-2',
    name: 'Amlodipine Besylate',
    strength: '5 mg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'After breakfast',
    scheduleTimings: ['08:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 16,
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Amlodipine Besylate USP',
    manufacturer: 'Pfizer Labs',
    expiryDate: '12/2027',
    purpose: 'Hypertension Blood Pressure Management',
    safetyWarnings: 'Do not stop abruptly without consulting your cardiologist. Stand up slowly to avoid postural dizziness.',
    createdAt: '2026-09-10T08:00:00Z',
  },

  // Elena (Mother)
  {
    id: 'med-5',
    profileId: 'mem-3',
    name: 'Levothyroxine Sodium',
    strength: '50 mcg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'Empty stomach',
    scheduleTimings: ['06:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 28,
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Levothyroxine Sodium IP',
    manufacturer: 'Abbott Laboratories',
    expiryDate: '01/2028',
    purpose: 'Hypothyroidism Hormone Replacement',
    safetyWarnings: 'Take with a full glass of water 30 to 60 minutes before morning tea or breakfast. Keep 4 hours away from calcium.',
    createdAt: '2026-09-05T08:00:00Z',
  },
  {
    id: 'med-6',
    profileId: 'mem-3',
    name: 'Calcium Carbonate + Vit D3',
    strength: '500 mg / 400 IU',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'After lunch',
    scheduleTimings: ['13:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 3, // 3 remaining -> LOW STOCK REFILL ALERT!
    initialStock: 30,
    minStockAlert: 6,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Elemental Calcium + Cholecalciferol',
    manufacturer: 'GSK Consumer Health',
    expiryDate: '06/2027',
    purpose: 'Bone Density & Osteoporosis Support',
    safetyWarnings: 'Best absorbed when taken with or immediately after a meal.',
    createdAt: '2026-09-05T08:00:00Z',
  },

  // Alex (Self)
  {
    id: 'med-7',
    profileId: 'mem-4',
    name: 'Omega-3 Fish Oil',
    strength: '1000 mg',
    dosageForm: 'Capsule',
    doseAmount: '1 capsule',
    foodInstruction: 'After lunch',
    scheduleTimings: ['14:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 45,
    initialStock: 60,
    minStockAlert: 10,
    unitType: 'capsules',
    dailyFrequency: 1,
    activeSalt: 'EPA 180mg + DHA 120mg',
    manufacturer: 'Nature Made',
    expiryDate: '08/2028',
    purpose: 'Cardiovascular & Cognitive Wellness',
    safetyWarnings: 'Take with food to prevent fishy aftertaste.',
    createdAt: '2026-09-12T08:00:00Z',
  },

  // Leo (Child)
  {
    id: 'med-8',
    profileId: 'mem-5',
    name: 'Cetirizine Pediatric Syrup',
    strength: '5 mg / 5 ml',
    dosageForm: 'Syrup',
    doseAmount: '5 ml',
    foodInstruction: 'At bedtime',
    scheduleTimings: ['20:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 65,
    initialStock: 100,
    minStockAlert: 20,
    unitType: 'ml',
    dailyFrequency: 1,
    activeSalt: 'Cetirizine Hydrochloride Oral Solution',
    manufacturer: 'Dr. Reddy Labs',
    expiryDate: '10/2027',
    purpose: 'Allergic Rhinitis & Night Sneezing',
    safetyWarnings: 'Use measuring cup provided. May cause mild drowsiness.',
    createdAt: '2026-10-01T08:00:00Z',
  },
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    profileId: 'mem-1',
    title: 'Cardiology & Diabetes Maintenance Rx',
    doctorName: 'Dr. Sarah Jenkins, MD, DM (Cardio)',
    specialty: 'Senior Cardiologist & Diabetologist',
    clinic: 'Metro Heart & Diabetes Institute, New York',
    date: '2026-10-08',
    validUntil: '2027-04-08',
    diagnosis: 'Type 2 Diabetes Mellitus with Essential Hypertension Stage 1',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    medicineNames: ['Metformin HCl 500mg', 'Atorvastatin 20mg', 'Glimepiride 1mg'],
    notes: 'Patient advised 30 mins brisk walking, low glycemic index diet, and periodic HbA1c review every 3 months.',
  },
  {
    id: 'rx-2',
    profileId: 'mem-3',
    title: 'Endocrine & Calcium Supplementation Plan',
    doctorName: 'Dr. Anita Roy, MD',
    specialty: 'Consultant Endocrinologist',
    clinic: 'St. Luke Comprehensive Clinic',
    date: '2026-09-15',
    validUntil: '2027-03-15',
    diagnosis: 'Subclinical Hypothyroidism & Mild Osteopenia',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    medicineNames: ['Levothyroxine Sodium 50mcg', 'Calcium Carbonate + Vit D3'],
    notes: 'Recheck TSH levels after 8 weeks. Keep 4-hour window between thyroid tablet and calcium dose.',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    profileId: 'mem-1',
    doctorName: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist & Diabetologist',
    clinic: 'Metro Heart Institute, Suite 402',
    date: '2026-10-14', // Tomorrow
    time: '10:30',
    reason: 'Quarterly HbA1c review and Blood Pressure calibration',
    status: 'upcoming',
    prescriptionId: 'rx-1',
  },
  {
    id: 'apt-2',
    profileId: 'mem-3',
    doctorName: 'Dr. Anita Roy',
    specialty: 'Endocrinologist',
    clinic: 'St. Luke Endocrinology Center',
    date: '2026-10-22',
    time: '15:00',
    reason: 'Thyroid function test follow-up & DEXA bone density scan review',
    status: 'upcoming',
    prescriptionId: 'rx-2',
  },
];

// Generate past 14 days of realistic dose logs to deliver 92% adherence
export function generatePastDoseLogs(medicines: Medicine[]): DoseLog[] {
  const logs: DoseLog[] = [];
  const today = new Date();

  // Create 14 days of history
  for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
    const logDate = new Date(today);
    logDate.setDate(today.getDate() - daysAgo);
    const dateStr = logDate.toISOString().split('T')[0];
    const isToday = daysAgo === 0;

    medicines.forEach((med) => {
      med.scheduleTimings.forEach((timeStr) => {
        const id = `log-${med.id}-${dateStr}-${timeStr.replace(':', '')}`;

        if (isToday) {
          // For today, some morning doses are taken, 8 PM dose is pending
          const currentHour = 14; // simulated afternoon
          const [medHour] = timeStr.split(':').map(Number);

          if (medHour < 12) {
            logs.push({
              id,
              medicineId: med.id,
              profileId: med.profileId,
              scheduledDate: dateStr,
              scheduledTime: timeStr,
              status: 'taken',
              takenAt: `${dateStr}T${timeStr}:12Z`,
            });
          } else {
            logs.push({
              id,
              medicineId: med.id,
              profileId: med.profileId,
              scheduledDate: dateStr,
              scheduledTime: timeStr,
              status: 'pending',
            });
          }
        } else {
          // Past days: ~92% taken, ~5% missed, ~3% skipped
          const rand = Math.sin(daysAgo * 7 + med.name.length) * 10000;
          const prob = Math.abs(rand - Math.floor(rand));

          if (prob > 0.09) {
            logs.push({
              id,
              medicineId: med.id,
              profileId: med.profileId,
              scheduledDate: dateStr,
              scheduledTime: timeStr,
              status: 'taken',
              takenAt: `${dateStr}T${timeStr}:05Z`,
            });
          } else if (prob > 0.04) {
            logs.push({
              id,
              medicineId: med.id,
              profileId: med.profileId,
              scheduledDate: dateStr,
              scheduledTime: timeStr,
              status: 'skipped',
              skipReason: 'Felt nauseous / Doctor advised pause',
            });
          } else {
            logs.push({
              id,
              medicineId: med.id,
              profileId: med.profileId,
              scheduledDate: dateStr,
              scheduledTime: timeStr,
              status: 'missed',
            });
          }
        }
      });
    });
  }

  return logs;
}
