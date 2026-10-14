import { FamilyMember, Medicine, DoseLog, Prescription, Appointment } from '../types/medicare';

// ==========================================
// STARTING FAMILY DATA & COMPREHENSIVE RECORDS
// Multi-generational family with doctors & medicine details
// ==========================================

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'mem-1',
    name: 'Arthur Rivera (Grandpa)',
    relationship: 'Grandparent',
    age: 78,
    avatarColor: '#0284c7', // Sky 600
    guardianName: 'Alex Rivera (Grandson)',
    guardianPhone: '+1 (555) 789-1022',
    guardianEmail: 'alex.rivera@familycare.com',
    notes: 'Managing Type 2 Diabetes and Stage 1 Hypertension for 14 years. Strict 8:00 PM Metformin dose monitoring. Daily gentle garden walks.',
    allergies: ['Penicillin', 'Sulfa drugs'],
  },
  {
    id: 'mem-2',
    name: 'Elena Rivera (Mother)',
    relationship: 'Mother',
    age: 54,
    avatarColor: '#d97706', // Amber 600
    guardianName: 'Alex Rivera (Son)',
    guardianPhone: '+1 (555) 789-1022',
    guardianEmail: 'alex.rivera@familycare.com',
    notes: 'Hypothyroidism and Osteopenia care. Takes Levothyroxine at 6:30 AM on an empty stomach with a full glass of water, and Calcium at lunch.',
    allergies: ['Aspirin'],
  },
  {
    id: 'mem-3',
    name: 'Robert Rivera (Father)',
    relationship: 'Father',
    age: 56,
    avatarColor: '#059669', // Emerald 600
    guardianName: 'Elena Rivera (Wife)',
    guardianPhone: '+1 (555) 234-5678',
    guardianEmail: 'elena.rivera@familycare.com',
    notes: 'Managing primary essential hypertension. Takes Lisinopril 10mg every morning after breakfast. Monitors home blood pressure weekly.',
  },
  {
    id: 'mem-4',
    name: 'Alex Rivera (Caregiver)',
    relationship: 'Self',
    age: 28,
    avatarColor: '#4f46e5', // Indigo 600
    guardianName: 'Elena Rivera (Mother)',
    guardianPhone: '+1 (555) 234-5678',
    guardianEmail: 'elena.rivera@familycare.com',
    isPrimaryCaregiver: true,
    notes: 'Primary family caregiver & administrator. Coordinates doctor consultations and pharmacy refills. Takes daily Omega-3 Fish Oil.',
  },
  {
    id: 'mem-5',
    name: 'Leo Rivera (Child)',
    relationship: 'Child',
    age: 8,
    avatarColor: '#db2777', // Pink 600
    guardianName: 'Elena Rivera (Grandmother)',
    guardianPhone: '+1 (555) 234-5678',
    guardianEmail: 'elena.rivera@familycare.com',
    notes: 'Pediatric seasonal allergy care. Takes 5ml Cetirizine Syrup at bedtime during weather transitions.',
  },
];

export const INITIAL_MEDICINES: Medicine[] = [
  // 1. Arthur Rivera (Grandpa) - Senior Diabetic & Cardio Care
  {
    id: 'med-1',
    profileId: 'mem-1',
    name: 'Metformin HCl 500mg (Glucophage)',
    strength: '500 mg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'After dinner',
    scheduleTimings: ['20:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 4, // 4 tablets left -> CRITICAL LOW STOCK REFILL ALERT!
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Metformin Hydrochloride (Extended Release)',
    manufacturer: 'Bristol Myers Squibb',
    expiryDate: '11/2027',
    purpose: 'Type 2 Diabetes Glycemic Control',
    safetyWarnings: 'Take with or immediately after evening meal to prevent gastrointestinal discomfort. Do not crush sustained-release tablets.',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'med-2',
    profileId: 'mem-1',
    name: 'Atorvastatin Calcium 20mg (Lipitor)',
    strength: '20 mg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'At bedtime',
    scheduleTimings: ['21:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 22,
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Atorvastatin Calcium Trihydrate',
    manufacturer: 'Pfizer Labs',
    expiryDate: '09/2027',
    purpose: 'Cholesterol & Lipid Regulation',
    safetyWarnings: 'Avoid excessive intake of grapefruit juice. Report any unprovoked muscle weakness or tenderness to Dr. Jenkins.',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'med-3',
    profileId: 'mem-1',
    name: 'Amlodipine Besylate 5mg (Norvasc)',
    strength: '5 mg',
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
    activeSalt: 'Amlodipine Besylate USP',
    manufacturer: 'Pfizer Pharmaceuticals',
    expiryDate: '05/2028',
    purpose: 'Hypertension & Vasodilation Support',
    safetyWarnings: 'Take with water each morning before breakfast. Monitor blood pressure weekly.',
    createdAt: '2026-09-01T08:00:00Z',
  },

  // 2. Elena Rivera (Mother) - Thyroid & Bone Health
  {
    id: 'med-4',
    profileId: 'mem-2',
    name: 'Levothyroxine Sodium 50mcg (Synthroid)',
    strength: '50 mcg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'Empty stomach',
    scheduleTimings: ['06:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 25,
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Levothyroxine Sodium USP',
    manufacturer: 'AbbVie Inc.',
    expiryDate: '07/2027',
    purpose: 'Hypothyroidism Hormone Replacement',
    safetyWarnings: 'Must be taken immediately on waking with pure water 30-60 minutes before breakfast. Keep 4-hour gap from Calcium.',
    createdAt: '2026-09-05T08:00:00Z',
  },
  {
    id: 'med-5',
    profileId: 'mem-2',
    name: 'Calcium 500mg + Vitamin D3 (Caltrate)',
    strength: '500 mg / 400 IU',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'After lunch',
    scheduleTimings: ['13:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 28,
    initialStock: 30,
    minStockAlert: 5,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Calcium Carbonate + Cholecalciferol',
    manufacturer: 'Haleon / GSK Consumer',
    expiryDate: '12/2027',
    purpose: 'Bone Mineral Density & Osteopenia Care',
    safetyWarnings: 'Take with lunch. Do not take within 4 hours of morning thyroid medication to avoid absorption binding.',
    createdAt: '2026-09-05T08:00:00Z',
  },

  // 3. Robert Rivera (Father) - Cardiovascular & BP Care
  {
    id: 'med-6',
    profileId: 'mem-3',
    name: 'Lisinopril 10mg (Prinivil)',
    strength: '10 mg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'After breakfast',
    scheduleTimings: ['08:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 19,
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Lisinopril Dihydrate USP',
    manufacturer: 'Merck Sharp & Dohme',
    expiryDate: '03/2028',
    purpose: 'ACE Inhibitor Hypertension Therapy',
    safetyWarnings: 'Take regularly after breakfast. Avoid potassium dietary supplements without physician advice.',
    createdAt: '2026-09-10T08:00:00Z',
  },

  // 4. Alex Rivera (Caregiver) - Wellness Support
  {
    id: 'med-7',
    profileId: 'mem-4',
    name: 'Omega-3 Fish Oil 1000mg',
    strength: '1000 mg (EPA 180mg / DHA 120mg)',
    dosageForm: 'Capsule',
    doseAmount: '1 capsule',
    foodInstruction: 'After lunch',
    scheduleTimings: ['13:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 50,
    initialStock: 60,
    minStockAlert: 10,
    unitType: 'capsules',
    dailyFrequency: 1,
    activeSalt: 'Purified Omega-3 Marine Triglycerides',
    manufacturer: 'Nordic Naturals',
    expiryDate: '10/2028',
    purpose: 'Cardiovascular, Eye & Cognitive Support',
    safetyWarnings: 'Swallow whole with a full glass of fresh water after lunch.',
    createdAt: '2026-09-12T08:00:00Z',
  },

  // 5. Leo Rivera (Child) - Pediatric Care
  {
    id: 'med-8',
    profileId: 'mem-5',
    name: 'Cetirizine Pediatric Syrup (Zyrtec)',
    strength: '5 mg / 5 ml',
    dosageForm: 'Syrup',
    doseAmount: '5 ml',
    foodInstruction: 'At bedtime',
    scheduleTimings: ['20:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 70,
    initialStock: 100,
    minStockAlert: 20,
    unitType: 'ml',
    dailyFrequency: 1,
    activeSalt: 'Cetirizine Hydrochloride Oral Solution USP',
    manufacturer: 'Johnson & Johnson Consumer',
    expiryDate: '08/2027',
    purpose: 'Pediatric Allergic Rhinitis & Sneezing Relief',
    safetyWarnings: 'Administer using the calibrated dosing syringe provided. May cause mild relaxation or drowsiness.',
    createdAt: '2026-10-01T08:00:00Z',
  },
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    profileId: 'mem-1',
    title: 'Cardiovascular & Diabetes Maintenance Protocol',
    doctorName: 'Dr. Sarah Jenkins, MD, FACC',
    specialty: 'Senior Cardiologist & Clinical Director',
    clinic: 'City Heart & Vascular Institute, Suite 402',
    date: '2026-10-08',
    validUntil: '2027-04-08',
    diagnosis: 'Type 2 Diabetes Mellitus with Essential Hypertension Stage 1',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    medicineNames: ['Metformin HCl 500mg (Glucophage)', 'Atorvastatin Calcium 20mg (Lipitor)', 'Amlodipine Besylate 5mg (Norvasc)'],
    notes: 'Patient advised 30 minutes brisk daily walking, low glycemic index diet, and quarterly HbA1c review with Dr. Miller.',
  },
  {
    id: 'rx-2',
    profileId: 'mem-2',
    title: 'Endocrine & Thyroid Supplementation Plan',
    doctorName: 'Dr. Robert Miller, MD',
    specialty: 'Chief Endocrinologist & Diabetologist',
    clinic: 'Metropolitan Diabetes & Endocrine Center',
    date: '2026-09-18',
    validUntil: '2027-03-18',
    diagnosis: 'Subclinical Hypothyroidism & Age-related Bone Mineral Density Decline',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    medicineNames: ['Levothyroxine Sodium 50mcg (Synthroid)', 'Calcium 500mg + Vitamin D3 (Caltrate)'],
    notes: 'Recheck TSH & Free T4 levels after 8 weeks. Keep strict 4-hour window between morning thyroid tablet and afternoon calcium dose.',
  },
  {
    id: 'rx-3',
    profileId: 'mem-3',
    title: 'Hypertension & Preventative Wellness Protocol',
    doctorName: 'Dr. Emily Watson, MD',
    specialty: 'Family Physician & Internal Medicine',
    clinic: 'Valley Health Medical Center, West Wing',
    date: '2026-09-25',
    validUntil: '2027-03-25',
    diagnosis: 'Stage 1 Essential Hypertension',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    medicineNames: ['Lisinopril 10mg (Prinivil)'],
    notes: 'Reduce dietary sodium intake (<2,000 mg/day). Maintain bi-weekly home blood pressure log. Follow-up consultation in 6 weeks.',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    profileId: 'mem-1',
    doctorName: 'Dr. Sarah Jenkins, MD, FACC',
    specialty: 'Senior Cardiologist & Clinical Director',
    clinic: 'City Heart & Vascular Institute, Suite 402',
    date: '2026-10-15', // Upcoming follow-up
    time: '10:30',
    reason: 'Quarterly ECG evaluation, blood pressure check & medication review',
    status: 'upcoming',
    prescriptionId: 'rx-1',
  },
  {
    id: 'apt-2',
    profileId: 'mem-2',
    doctorName: 'Dr. Robert Miller, MD',
    specialty: 'Chief Endocrinologist & Diabetologist',
    clinic: 'Metropolitan Diabetes & Endocrine Center, Room 210',
    date: '2026-10-24',
    time: '15:00',
    reason: 'Thyroid panel follow-up & DEXA bone density scan review',
    status: 'upcoming',
    prescriptionId: 'rx-2',
  },
  {
    id: 'apt-3',
    profileId: 'mem-3',
    doctorName: 'Dr. Emily Watson, MD',
    specialty: 'Family Physician & Internal Medicine',
    clinic: 'Valley Health Medical Center, West Wing',
    date: '2026-11-04',
    time: '11:15',
    reason: 'Routine BP evaluation & comprehensive metabolic panel consultation',
    status: 'upcoming',
    prescriptionId: 'rx-3',
  },
];

// Generate past 14 days of realistic dose logs to deliver ~92% adherence
export function generatePastDoseLogs(medicines: Medicine[]): DoseLog[] {
  const logs: DoseLog[] = [];
  const today = new Date();

  // Generate logs for the past 14 days
  for (let d = 14; d >= 0; d--) {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() - d);
    const dateStr = targetDate.toISOString().split('T')[0];
    const isToday = d === 0;

    medicines.forEach((med) => {
      med.scheduleTimings.forEach((time) => {
        const id = `log-${med.id}-${dateStr}-${time.replace(':', '')}`;
        
        if (isToday) {
          // Today's schedule: morning is taken, evening is pending
          const [h] = time.split(':').map(Number);
          const currentHour = today.getHours();
          
          if (h <= currentHour) {
            logs.push({
              id,
              medicineId: med.id,
              profileId: med.profileId,
              scheduledDate: dateStr,
              scheduledTime: time,
              status: 'taken',
              takenAt: `${dateStr}T${time}:00Z`,
            });
          } else {
            logs.push({
              id,
              medicineId: med.id,
              profileId: med.profileId,
              scheduledDate: dateStr,
              scheduledTime: time,
              status: 'pending',
            });
          }
        } else {
          // Historical days: ~92% adherence rate
          // Deterministic based on hash of id
          const charCodeSum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
          const rand = (charCodeSum % 100);

          if (rand < 90) {
            logs.push({
              id,
              medicineId: med.id,
              profileId: med.profileId,
              scheduledDate: dateStr,
              scheduledTime: time,
              status: 'taken',
              takenAt: `${dateStr}T${time}:00Z`,
            });
          } else if (rand < 95) {
            logs.push({
              id,
              medicineId: med.id,
              profileId: med.profileId,
              scheduledDate: dateStr,
              scheduledTime: time,
              status: 'skipped',
              skipReason: 'Mild stomach discomfort / Doctor consulted',
            });
          } else {
            logs.push({
              id,
              medicineId: med.id,
              profileId: med.profileId,
              scheduledDate: dateStr,
              scheduledTime: time,
              status: 'missed',
              escalationTriggered: true,
            });
          }
        }
      });
    });
  }

  return logs;
}
