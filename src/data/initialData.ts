import { FamilyMember, Medicine, DoseLog, Prescription, Appointment } from '../types/medicare';

// ==========================================
// THE SHARMA FAMILY (INDIAN MULTI-GENERATIONAL HOUSEHOLD)
// Explanatory Database for New Users
// ==========================================

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'mem-1',
    name: 'Ramakant Sharma (Dadaji)',
    relationship: 'Grandparent',
    age: 76,
    avatarColor: '#0284c7', // Sky 600
    guardianName: 'Rajesh Sharma (Son)',
    guardianPhone: '+91 98201 44521',
    guardianEmail: 'rajesh.sharma@familycare.in',
    notes: 'Managing Type 2 Diabetes and Hypertension for 12 years. Strict 8:00 PM Glycomet-GP dose monitoring. Daily morning stroll at Shivaji Park.',
    allergies: ['Penicillin', 'Sulfa drugs'],
  },
  {
    id: 'mem-2',
    name: 'Saraswati Sharma (Dadiji)',
    relationship: 'Grandparent',
    age: 72,
    avatarColor: '#d97706', // Amber 600
    guardianName: 'Rajesh Sharma (Son)',
    guardianPhone: '+91 98201 44521',
    guardianEmail: 'rajesh.sharma@familycare.in',
    notes: 'Osteopenia & Hypothyroidism care. Takes Thyronorm at 6:30 AM on an empty stomach with warm water, and Shelcal Calcium after lunch.',
    allergies: ['Aspirin'],
  },
  {
    id: 'mem-3',
    name: 'Rajesh Sharma (Father)',
    relationship: 'Father',
    age: 52,
    avatarColor: '#059669', // Emerald 600
    guardianName: 'Sunita Sharma (Wife)',
    guardianPhone: '+91 98192 33410',
    guardianEmail: 'sunita.sharma@familycare.in',
    isPrimaryCaregiver: true,
    notes: 'Primary family caregiver & administrator. Managing Stage 1 hypertension with daily morning Telmisartan after breakfast.',
  },
  {
    id: 'mem-4',
    name: 'Sunita Sharma (Mother)',
    relationship: 'Mother',
    age: 49,
    avatarColor: '#7c3aed', // Violet 600
    guardianName: 'Rajesh Sharma (Husband)',
    guardianPhone: '+91 98201 44521',
    guardianEmail: 'rajesh.sharma@familycare.in',
    notes: 'Takes Becosules Z multivitamin & zinc after breakfast. Coordinates wholesome home meals and family medication timings.',
  },
  {
    id: 'mem-5',
    name: 'Aarav Sharma (Son)',
    relationship: 'Self',
    age: 21,
    avatarColor: '#4f46e5', // Indigo 600
    guardianName: 'Rajesh Sharma (Father)',
    guardianPhone: '+91 98201 44521',
    guardianEmail: 'rajesh.sharma@familycare.in',
    notes: 'College engineering student and fitness enthusiast. Takes daily Omega-3 Cod Liver Oil (Seacod) with lunch.',
  },
  {
    id: 'mem-6',
    name: 'Ananya Sharma (Daughter)',
    relationship: 'Child',
    age: 10,
    avatarColor: '#db2777', // Pink 600
    guardianName: 'Sunita Sharma (Mother)',
    guardianPhone: '+91 98192 33410',
    guardianEmail: 'sunita.sharma@familycare.in',
    notes: 'Pediatric seasonal allergy care. Takes 5ml Cetzine Syrup at bedtime during weather transitions.',
  },
];

export const INITIAL_MEDICINES: Medicine[] = [
  // 1. Ramakant Sharma (Dadaji) - Senior Diabetic & Cardio Care
  {
    id: 'med-1',
    profileId: 'mem-1',
    name: 'Glycomet-GP 1 (Metformin + Glimepiride)',
    strength: '500 mg / 1 mg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'After dinner',
    scheduleTimings: ['20:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 4, // 4 tablets left -> CRITICAL LOW STOCK ALERT!
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Metformin HCl PR 500mg + Glimepiride IP 1mg',
    manufacturer: 'USV Private Limited (India)',
    expiryDate: '11/2027',
    purpose: 'Type 2 Diabetes Glycemic Control',
    safetyWarnings: 'Take with or immediately after meals to avoid stomach upset. Carry sweets/glucose tablets in case of mild dizziness.',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'med-2',
    profileId: 'mem-1',
    name: 'Atorva 20 (Atorvastatin)',
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
    activeSalt: 'Atorvastatin Calcium IP',
    manufacturer: 'Zydus Lifesciences (Ahmedabad)',
    expiryDate: '09/2027',
    purpose: 'Cholesterol & Lipid Regulation',
    safetyWarnings: 'Avoid excessive intake of grapefruit juice. Take regularly at bedtime.',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'med-3',
    profileId: 'mem-1',
    name: 'Pantocid 40 (Pantoprazole)',
    strength: '40 mg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'Empty stomach',
    scheduleTimings: ['07:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 18,
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Pantoprazole Sodium Gastro-resistant IP',
    manufacturer: 'Sun Pharmaceutical Industries',
    expiryDate: '04/2028',
    purpose: 'Acid Reflux & Gastrointestinal Protection',
    safetyWarnings: 'Take 30 minutes before morning tea or breakfast with a glass of warm water.',
    createdAt: '2026-09-01T08:00:00Z',
  },

  // 2. Saraswati Sharma (Dadiji) - Thyroid & Bone Health
  {
    id: 'med-4',
    profileId: 'mem-2',
    name: 'Thyronorm 50 mcg (Levothyroxine)',
    strength: '50 mcg',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'Empty stomach',
    scheduleTimings: ['06:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 26,
    initialStock: 30,
    minStockAlert: 7,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Levothyroxine Sodium IP',
    manufacturer: 'Abbott Healthcare Pvt Ltd (India)',
    expiryDate: '01/2028',
    purpose: 'Hypothyroidism Hormone Replacement',
    safetyWarnings: 'Must be taken on an empty stomach with plain water. Maintain minimum 4-hour gap from Calcium tablets.',
    createdAt: '2026-09-05T08:00:00Z',
  },
  {
    id: 'med-5',
    profileId: 'mem-2',
    name: 'Shelcal 500 (Calcium + Vit D3)',
    strength: '500 mg / 250 IU',
    dosageForm: 'Tablet',
    doseAmount: '1 tablet',
    foodInstruction: 'After lunch',
    scheduleTimings: ['13:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 3, // 3 tablets left -> CRITICAL LOW STOCK REFILL ALERT!
    initialStock: 30,
    minStockAlert: 6,
    unitType: 'tablets',
    dailyFrequency: 1,
    activeSalt: 'Elemental Calcium (Oyster Shell) + Cholecalciferol IP',
    manufacturer: 'Torrent Pharmaceuticals',
    expiryDate: '06/2027',
    purpose: 'Bone Density & Osteoporosis Support',
    safetyWarnings: 'Best absorbed when taken with or immediately after a wholesome lunch.',
    createdAt: '2026-09-05T08:00:00Z',
  },

  // 3. Rajesh Sharma (Father) - Hypertension Control
  {
    id: 'med-6',
    profileId: 'mem-3',
    name: 'Telma 40 (Telmisartan)',
    strength: '40 mg',
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
    activeSalt: 'Telmisartan IP 40mg',
    manufacturer: 'Glenmark Pharmaceuticals',
    expiryDate: '12/2027',
    purpose: 'Essential Hypertension Blood Pressure Management',
    safetyWarnings: 'Do not discontinue abruptly. Reduce intake of high-sodium pickles and papad.',
    createdAt: '2026-09-10T08:00:00Z',
  },

  // 4. Sunita Sharma (Mother) - Nutritional & Immunity Care
  {
    id: 'med-7',
    profileId: 'mem-4',
    name: 'Becosules Z (B-Complex + Zinc)',
    strength: 'Therapeutic Formula',
    dosageForm: 'Capsule',
    doseAmount: '1 capsule',
    foodInstruction: 'After breakfast',
    scheduleTimings: ['09:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    currentStock: 22,
    initialStock: 30,
    minStockAlert: 5,
    unitType: 'capsules',
    dailyFrequency: 1,
    activeSalt: 'Vitamin B-Complex + Vitamin C + Zinc Sulphate Monohydrate',
    manufacturer: 'Pfizer Limited (India)',
    expiryDate: '03/2028',
    purpose: 'Energy Metabolism & Immunity Support',
    safetyWarnings: 'Take with a glass of water after breakfast.',
    createdAt: '2026-09-12T08:00:00Z',
  },

  // 5. Aarav Sharma (Son) - Cognitive & Cardiovascular Wellness
  {
    id: 'med-8',
    profileId: 'mem-5',
    name: 'Seven Seas Seacod (Omega-3 Cod Liver Oil)',
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
    activeSalt: 'Natural Cod Liver Oil (EPA 180mg + DHA 120mg + Vitamin A & D)',
    manufacturer: 'Procter & Gamble Health India',
    expiryDate: '08/2028',
    purpose: 'Cardiovascular, Eye & Cognitive Support',
    safetyWarnings: 'Swallow whole with fresh water after lunch.',
    createdAt: '2026-09-12T08:00:00Z',
  },

  // 6. Ananya Sharma (Daughter) - Pediatric Allergy Care
  {
    id: 'med-9',
    profileId: 'mem-6',
    name: 'Cetzine Pediatric Syrup (Cetirizine)',
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
    activeSalt: 'Cetirizine Hydrochloride Oral Solution IP',
    manufacturer: "Dr. Reddy's Laboratories (Hyderabad)",
    expiryDate: '10/2027',
    purpose: 'Allergic Rhinitis, Sneezing & Cough Relief',
    safetyWarnings: 'Use measuring cup provided. May induce mild drowsiness.',
    createdAt: '2026-10-01T08:00:00Z',
  },
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    profileId: 'mem-1',
    title: 'Cardiology & Diabetes Maintenance Protocol',
    doctorName: 'Dr. Arvind Mehta, MD, DM (Cardio)',
    specialty: 'Senior Consultant Cardiologist & Diabetologist',
    clinic: 'Apollo Hospitals & Heart Institute, Mumbai',
    date: '2026-10-08',
    validUntil: '2027-04-08',
    diagnosis: 'Type 2 Diabetes Mellitus with Essential Hypertension Stage 1',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    medicineNames: ['Glycomet-GP 1 (Metformin + Glimepiride)', 'Atorva 20 (Atorvastatin)', 'Pantocid 40 (Pantoprazole)'],
    notes: 'Patient advised 30 mins brisk morning walking, strict diabetic diet (jowar/bajra, avoid sweets), and quarterly HbA1c review.',
  },
  {
    id: 'rx-2',
    profileId: 'mem-2',
    title: 'Endocrine & Bone Mineral Supplementation Plan',
    doctorName: 'Dr. Priya Nair, MD, DNB (Endo)',
    specialty: 'Consultant Endocrinologist',
    clinic: 'Max Super Speciality Hospital, New Delhi',
    date: '2026-09-18',
    validUntil: '2027-03-18',
    diagnosis: 'Subclinical Hypothyroidism & Age-related Osteopenia',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    medicineNames: ['Thyronorm 50 mcg (Levothyroxine)', 'Shelcal 500 (Calcium + Vit D3)'],
    notes: 'Recheck TSH levels after 8 weeks. Keep strict 4-hour window between morning thyroid tablet and afternoon calcium dose.',
  },
  {
    id: 'rx-3',
    profileId: 'mem-3',
    title: 'Hypertension & Preventive Cardiology Assessment',
    doctorName: 'Dr. Rakesh Kulkarni, MD (Med), DM',
    specialty: 'Consultant Physician & Cardiologist',
    clinic: 'Fortis Healthcare Clinic, Bengaluru',
    date: '2026-09-25',
    validUntil: '2027-03-25',
    diagnosis: 'Stage 1 Essential Hypertension',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    medicineNames: ['Telma 40 (Telmisartan 40mg)'],
    notes: 'Reduce dietary salt intake (sendha namak preferred, avoid fried snacks). Maintain bi-weekly home BP log.',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    profileId: 'mem-1',
    doctorName: 'Dr. Arvind Mehta',
    specialty: 'Senior Cardiologist & Diabetologist',
    clinic: 'Apollo Hospitals, OPD Block Suite 204, Mumbai',
    date: '2026-10-15', // Upcoming
    time: '10:30',
    reason: 'Quarterly HbA1c blood sugar review & ECG evaluation',
    status: 'upcoming',
    prescriptionId: 'rx-1',
  },
  {
    id: 'apt-2',
    profileId: 'mem-2',
    doctorName: 'Dr. Priya Nair',
    specialty: 'Consultant Endocrinologist',
    clinic: 'Max Super Speciality Endocrinology Centre, Delhi',
    date: '2026-10-24',
    time: '15:00',
    reason: 'Thyroid function test follow-up & DEXA bone density review',
    status: 'upcoming',
    prescriptionId: 'rx-2',
  },
  {
    id: 'apt-3',
    profileId: 'mem-3',
    doctorName: 'Dr. Rakesh Kulkarni',
    specialty: 'Cardiologist & Physician',
    clinic: 'Fortis Healthcare Clinic, Bengaluru',
    date: '2026-11-04',
    time: '11:15',
    reason: 'Routine BP evaluation & Lipid panel report check',
    status: 'upcoming',
    prescriptionId: 'rx-3',
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
          // For today, morning and afternoon doses are taken, 8 PM dose is pending
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
              skipReason: 'Felt mildly nauseous / Doctor advised temporary pause',
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
