import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Patient,
  Bed,
  OperatingRoom,
  Device,
  Staff,
  PharmacyItem,
  BillingClaim,
  SecurityLog,
  LiveAlert
} from '../types'

export const useHospitalStore = defineStore('hospital', () => {
  // Live Alerts
  const alerts = ref<LiveAlert[]>([
    {
      id: 'alt-1',
      title: 'ICU Critical Arrhythmia',
      message: 'Patient Sarah Jenkins (Bed ICU-A4) exhibiting Ventricular Tachycardia.',
      level: 'critical',
      timestamp: new Date().toLocaleTimeString(),
      department: 'ICU',
      acknowledged: false,
      aiSuggestedAction:
        'Immediate clinical review. Prepare defibrillator. Confirm IV patency and check electrolyte panel.'
    },
    {
      id: 'alt-2',
      title: 'ED Triage Congestion',
      message: 'Ambulance arrival spike. 4 ESI-2 cases incoming within 10 minutes.',
      level: 'warning',
      timestamp: new Date(Date.now() - 4 * 60000).toLocaleTimeString(),
      department: 'Emergency',
      acknowledged: false,
      aiSuggestedAction: 'Reallocate 2 nurses from Ward B to ED. Open surge rooms 104 and 105.'
    },
    {
      id: 'alt-3',
      title: 'Centrifuge Anomaly',
      message: 'Lab centrifuge device Lab-C2 temp exceeded limit (4.2°C). Specimen integrity risk.',
      level: 'warning',
      timestamp: new Date(Date.now() - 12 * 60000).toLocaleTimeString(),
      department: 'Laboratory',
      acknowledged: false,
      aiSuggestedAction:
        'Reroute critical blood samples to centrifuge Lab-C3. Schedule instant biomedical maintenance.'
    },
    {
      id: 'alt-4',
      title: 'HIPAA Log Anomaly',
      message: 'EHR accessed from unregistered IP address (192.168.4.211) using Dr. Ramirez login.',
      level: 'critical',
      timestamp: new Date(Date.now() - 25 * 60000).toLocaleTimeString(),
      department: 'Security',
      acknowledged: false,
      aiSuggestedAction:
        'Suspend access credentials for user Ramirez-R. Initiate double-factor SMS challenge.'
    }
  ])

  // Patients Data
  const patients = ref<Patient[]>([
    {
      id: 'pat-1',
      name: 'Sarah Jenkins',
      age: 64,
      gender: 'Female',
      mrn: 'MRN-449-012',
      condition: 'Critical',
      triage: 'ESI-1',
      bed: 'ICU-A4',
      room: 'ICU-104',
      department: 'ICU',
      admittedAt: '2026-05-20 08:32',
      chiefComplaint: 'Acute Myocardial Infarction / Dyspnea',
      vitals: {
        heartRate: 118,
        systolicBP: 92,
        diastolicBP: 58,
        oxygenLevel: 91,
        respirationRate: 24,
        temperature: 37.8
      },
      riskScore: 88,
      sepsisScore: 7,
      readmissionRisk: 42,
      diagnoses: ['STEMI', 'Congestive Heart Failure', 'Hypertension'],
      medications: ['Aspirin', 'Heparin Infusion', 'Lisinopril'],
      attendingPhysician: 'Dr. Marcus Vance'
    },
    {
      id: 'pat-2',
      name: 'Robert Miller',
      age: 72,
      gender: 'Male',
      mrn: 'MRN-881-904',
      condition: 'Guarded',
      triage: 'ESI-2',
      bed: 'ED-B12',
      room: 'ED-12',
      department: 'Emergency',
      admittedAt: '2026-05-20 20:10',
      chiefComplaint: 'Altered Mental Status / Suspected Urosepsis',
      vitals: {
        heartRate: 98,
        systolicBP: 104,
        diastolicBP: 64,
        oxygenLevel: 94,
        respirationRate: 20,
        temperature: 39.1
      },
      riskScore: 74,
      sepsisScore: 5,
      readmissionRisk: 55,
      diagnoses: ['UTI', 'Acute Kidney Injury', 'Dehydration'],
      medications: ['Ceftriaxone IV', 'Normal Saline Bolus'],
      attendingPhysician: 'Dr. Evelyn Carter'
    },
    {
      id: 'pat-3',
      name: 'Elena Rostova',
      age: 45,
      gender: 'Female',
      mrn: 'MRN-332-118',
      condition: 'Stable',
      triage: 'ESI-3',
      bed: 'Ward-C1',
      room: 'Room-301',
      department: 'Med-Surg',
      admittedAt: '2026-05-19 14:00',
      chiefComplaint: 'Post-Op Laparoscopic Cholecystectomy',
      vitals: {
        heartRate: 72,
        systolicBP: 120,
        diastolicBP: 80,
        oxygenLevel: 99,
        respirationRate: 16,
        temperature: 36.6
      },
      riskScore: 12,
      sepsisScore: 1,
      readmissionRisk: 18,
      diagnoses: ['Acute Cholecystitis', 'Gallstones'],
      medications: ['Acetaminophen IV', 'Ondansetron'],
      attendingPhysician: 'Dr. David Lin'
    },
    {
      id: 'pat-4',
      name: 'James Peterson',
      age: 58,
      gender: 'Male',
      mrn: 'MRN-552-671',
      condition: 'Stable',
      triage: 'ESI-2',
      bed: 'ICU-B2',
      room: 'ICU-108',
      department: 'ICU',
      admittedAt: '2026-05-18 22:45',
      chiefComplaint: 'Respiratory Failure / COPD Exacerbation',
      vitals: {
        heartRate: 85,
        systolicBP: 135,
        diastolicBP: 85,
        oxygenLevel: 92,
        respirationRate: 22,
        temperature: 37.2
      },
      riskScore: 59,
      sepsisScore: 3,
      readmissionRisk: 68,
      diagnoses: ['COPD Stage IV', 'Hypoxemic Respiratory Failure'],
      medications: ['Methylprednisolone IV', 'Albuterol Nebulizer', 'O2 2L/min'],
      attendingPhysician: 'Dr. Sarah Al-Jamil'
    },
    {
      id: 'pat-5',
      name: 'Sophia Wong',
      age: 28,
      gender: 'Female',
      mrn: 'MRN-109-883',
      condition: 'Admitting',
      triage: 'ESI-2',
      bed: 'ED-A2',
      room: 'ED-02',
      department: 'Emergency',
      admittedAt: '2026-05-20 21:15',
      chiefComplaint: 'Severe Abdominal Pain / Possible Appendicitis',
      vitals: {
        heartRate: 94,
        systolicBP: 110,
        diastolicBP: 72,
        oxygenLevel: 98,
        respirationRate: 18,
        temperature: 38.3
      },
      riskScore: 29,
      sepsisScore: 2,
      readmissionRisk: 8,
      diagnoses: ['Acute Appendicitis', 'Leukocytosis'],
      medications: ['Morphine IV', 'Piperacillin/Tazobactam IV'],
      attendingPhysician: 'Dr. Evelyn Carter'
    }
  ])

  // Beds Data
  const beds = ref<Bed[]>([
    {
      id: 'bed-1',
      room: 'ICU-101',
      department: 'ICU',
      status: 'Occupied',
      patientId: 'pat-1',
      patientName: 'Sarah Jenkins',
      lastCleaned: '2026-05-20 06:00',
      turnaroundTimeMin: 45
    },
    {
      id: 'bed-2',
      room: 'ICU-102',
      department: 'ICU',
      status: 'Available',
      lastCleaned: '2026-05-20 18:30',
      turnaroundTimeMin: 38
    },
    {
      id: 'bed-3',
      room: 'ICU-103',
      department: 'ICU',
      status: 'Dirty',
      lastCleaned: '2026-05-20 12:00',
      turnaroundTimeMin: 52
    },
    {
      id: 'bed-4',
      room: 'ICU-104',
      department: 'ICU',
      status: 'Occupied',
      patientId: 'pat-4',
      patientName: 'James Peterson',
      lastCleaned: '2026-05-20 04:30',
      turnaroundTimeMin: 40
    },
    {
      id: 'bed-5',
      room: 'ED-01',
      department: 'Emergency',
      status: 'Reserved',
      lastCleaned: '2026-05-20 20:00',
      turnaroundTimeMin: 22
    },
    {
      id: 'bed-6',
      room: 'ED-02',
      department: 'Emergency',
      status: 'Occupied',
      patientId: 'pat-5',
      patientName: 'Sophia Wong',
      lastCleaned: '2026-05-20 19:15',
      turnaroundTimeMin: 18
    },
    {
      id: 'bed-7',
      room: 'Room-301',
      department: 'Med-Surg',
      status: 'Occupied',
      patientId: 'pat-3',
      patientName: 'Elena Rostova',
      lastCleaned: '2026-05-19 11:00',
      turnaroundTimeMin: 65
    },
    {
      id: 'bed-8',
      room: 'Room-302',
      department: 'Med-Surg',
      status: 'Available',
      lastCleaned: '2026-05-20 15:45',
      turnaroundTimeMin: 58
    }
  ])

  // Operating Rooms Data
  const operatingRooms = ref<OperatingRoom[]>([
    {
      id: 'or-1',
      name: 'OR Suite 1',
      procedure: 'Coronary Artery Bypass Graft (CABG)',
      surgeon: 'Dr. Marcus Vance',
      anesthesiologist: 'Dr. Clara Thorne',
      patientName: 'Arthur Pendelton',
      status: 'Intra-Op',
      timeElapsedMin: 145,
      estimatedTimeMin: 240,
      utilizationRate: 85.4
    },
    {
      id: 'or-2',
      name: 'OR Suite 2',
      procedure: 'Laparoscopic Appendectomy',
      surgeon: 'Dr. David Lin',
      anesthesiologist: 'Dr. Paul Gregory',
      patientName: 'Thomas Shelby',
      status: 'Pre-Op',
      timeElapsedMin: 5,
      estimatedTimeMin: 60,
      utilizationRate: 72.1
    },
    {
      id: 'or-3',
      name: 'OR Suite 3',
      procedure: 'Total Knee Arthroplasty',
      surgeon: 'Dr. Sandra Oh',
      anesthesiologist: 'Dr. Clara Thorne',
      patientName: 'Mildred Pierce',
      status: 'Cleaning',
      timeElapsedMin: 15,
      estimatedTimeMin: 30,
      utilizationRate: 91.2
    },
    {
      id: 'or-4',
      name: 'OR Suite 4',
      procedure: 'None',
      surgeon: 'None',
      anesthesiologist: 'None',
      patientName: 'None',
      status: 'Available',
      timeElapsedMin: 0,
      estimatedTimeMin: 0,
      utilizationRate: 64.8
    }
  ])

  // Staff Data
  const staff = ref<Staff[]>([
    {
      id: 'stf-1',
      name: 'Dr. Marcus Vance',
      role: 'Physician',
      department: 'Cardiology',
      status: 'On-Duty',
      patientsAssigned: 4,
      burnoutIndex: 45,
      shiftStart: '07:00',
      shiftEnd: '19:00'
    },
    {
      id: 'stf-2',
      name: 'Dr. Evelyn Carter',
      role: 'Physician',
      department: 'Emergency',
      status: 'On-Duty',
      patientsAssigned: 8,
      burnoutIndex: 78,
      shiftStart: '19:00',
      shiftEnd: '07:00'
    },
    {
      id: 'stf-3',
      name: 'Dr. Clara Thorne',
      role: 'Physician',
      department: 'Anesthesiology',
      status: 'On-Duty',
      patientsAssigned: 2,
      burnoutIndex: 32,
      shiftStart: '07:00',
      shiftEnd: '19:00'
    },
    {
      id: 'stf-4',
      name: 'Dr. David Lin',
      role: 'Physician',
      department: 'Surgery',
      status: 'On-Call',
      patientsAssigned: 1,
      burnoutIndex: 51,
      shiftStart: '08:00',
      shiftEnd: '20:00'
    },
    {
      id: 'stf-5',
      name: 'RN Sarah Gamp',
      role: 'RN',
      department: 'ICU',
      status: 'On-Duty',
      patientsAssigned: 2,
      burnoutIndex: 61,
      shiftStart: '19:00',
      shiftEnd: '07:00'
    },
    {
      id: 'stf-6',
      name: 'RN Charles Dickens',
      role: 'RN',
      department: 'Emergency',
      status: 'On-Duty',
      patientsAssigned: 5,
      burnoutIndex: 82,
      shiftStart: '19:00',
      shiftEnd: '07:00'
    }
  ])

  // Devices
  const devices = ref<Device[]>([
    {
      id: 'dev-1',
      name: 'Ventilator V-441',
      type: 'Ventilator',
      status: 'Active',
      location: 'ICU Room 104',
      batteryLife: 100,
      lastCalibrated: '2026-05-01'
    },
    {
      id: 'dev-2',
      name: 'Infusion Pump P-991',
      type: 'Infusion Pump',
      status: 'Active',
      location: 'ICU Room 104',
      batteryLife: 82,
      lastCalibrated: '2026-04-12'
    },
    {
      id: 'dev-3',
      name: 'Defibrillator D-001',
      type: 'Defibrillator',
      status: 'Idle',
      location: 'Crash Cart ED-2',
      batteryLife: 95,
      lastCalibrated: '2026-05-18'
    },
    {
      id: 'dev-4',
      name: 'ECG Monitor M-104',
      type: 'ECG Monitor',
      status: 'Active',
      location: 'ICU Room 101',
      batteryLife: 78,
      lastCalibrated: '2026-05-10'
    }
  ])

  // Pharmacy Inventory
  const pharmacyItems = ref<PharmacyItem[]>([
    {
      id: 'ph-1',
      name: 'Epinephrine Injection 1mg/mL',
      category: 'Emergency Drugs',
      stock: 140,
      minThreshold: 50,
      unit: 'Vials',
      location: 'Emergency Drawer A',
      isCritical: true,
      temperatureCelsius: 22.4
    },
    {
      id: 'ph-2',
      name: 'Heparin Sodium 5,000 U/mL',
      category: 'Anticoagulants',
      stock: 85,
      minThreshold: 30,
      unit: 'Vials',
      location: 'ICU Cart 2',
      isCritical: false,
      temperatureCelsius: 19.8
    },
    {
      id: 'ph-3',
      name: 'Insulin Glargine 100 U/mL',
      category: 'Antidiabetic',
      stock: 12,
      minThreshold: 20,
      unit: 'Pens',
      location: 'Fridge Lab 1',
      isCritical: true,
      temperatureCelsius: 4.1
    },
    {
      id: 'ph-4',
      name: 'Piperacillin/Tazobactam 4.5g',
      category: 'Antibiotics',
      stock: 240,
      minThreshold: 100,
      unit: 'Vials',
      location: 'Main Pharmacy Shelf 4',
      isCritical: false,
      temperatureCelsius: 21.0
    }
  ])

  // Billing Claims
  const claims = ref<BillingClaim[]>([
    {
      id: 'cl-1',
      patientName: 'Sarah Jenkins',
      provider: 'Blue Cross Blue Shield',
      amount: 48250.0,
      status: 'Pending',
      createdDate: '2026-05-20',
      completionRate: 85
    },
    {
      id: 'cl-2',
      patientName: 'Elena Rostova',
      provider: 'Aetna Health',
      amount: 14800.0,
      status: 'Approved',
      createdDate: '2026-05-19',
      completionRate: 100
    },
    {
      id: 'cl-3',
      patientName: 'Arthur Pendelton',
      provider: 'Medicare Advantage',
      amount: 89000.0,
      status: 'Denied',
      denialReason: 'Missing Prior Authorization for Cardiac Bypass Graft Procedure',
      createdDate: '2026-05-18',
      completionRate: 35
    },
    {
      id: 'cl-4',
      patientName: 'James Peterson',
      provider: 'UnitedHealthcare',
      amount: 22400.0,
      status: 'Appealed',
      createdDate: '2026-05-18',
      completionRate: 60
    }
  ])

  // Security HIPAA Logs
  const securityLogs = ref<SecurityLog[]>([
    {
      id: 'sec-1',
      user: 'Dr. Marcus Vance',
      role: 'Physician',
      action: 'EHR Read',
      resource: 'Jenkins, Sarah (EHR)',
      ipAddress: '10.200.4.15',
      timestamp: new Date().toLocaleTimeString(),
      status: 'Granted',
      hipaaFlag: false
    },
    {
      id: 'sec-2',
      user: 'RN Sarah Gamp',
      role: 'RN',
      action: 'Medication Administration Log',
      resource: 'Jenkins, Sarah (EHR)',
      ipAddress: '10.200.4.32',
      timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
      status: 'Granted',
      hipaaFlag: false
    },
    {
      id: 'sec-3',
      user: 'unregistered-client',
      role: 'Guest',
      action: 'DB Query Attemp',
      resource: 'Patient Records Database',
      ipAddress: '192.168.4.211',
      timestamp: new Date(Date.now() - 25 * 60000).toLocaleTimeString(),
      status: 'Denied',
      hipaaFlag: true
    },
    {
      id: 'sec-4',
      user: 'Dr. Evelyn Carter',
      role: 'Physician',
      action: 'EHR Read',
      resource: 'Wong, Sophia (EHR)',
      ipAddress: '10.200.8.21',
      timestamp: new Date(Date.now() - 10 * 60000).toLocaleTimeString(),
      status: 'Granted',
      hipaaFlag: false
    }
  ])

  // Statistics Computations
  const stats = computed(() => {
    const totalBeds = beds.value.length
    const occupiedBeds = beds.value.filter((b) => b.status === 'Occupied').length
    const cleanBeds = beds.value.filter((b) => b.status === 'Available').length
    const dirtyBeds = beds.value.filter((b) => b.status === 'Dirty').length
    const triage1_2 = patients.value.filter(
      (p) => p.triage === 'ESI-1' || p.triage === 'ESI-2'
    ).length

    const criticalPatientsCount = patients.value.filter((p) => p.condition === 'Critical').length
    const averageBurnout = Math.round(
      staff.value.reduce((acc, curr) => acc + curr.burnoutIndex, 0) / staff.value.length
    )

    return {
      icuOccupancyRate: Math.round((occupiedBeds / totalBeds) * 100),
      totalBeds,
      occupiedBeds,
      cleanBeds,
      dirtyBeds,
      activeCriticalAlerts: alerts.value.filter((a) => !a.acknowledged).length,
      emergencyPatientsCount: patients.value.filter((p) => p.department === 'Emergency').length,
      icuPatientsCount: patients.value.filter((p) => p.department === 'ICU').length,
      triage1_2,
      criticalPatientsCount,
      averageBurnout,
      dailyAdmissions: 42,
      dailyDischarges: 38,
      orUtilizationAvg: 78
    }
  })

  // Actions
  function acknowledgeAlert(id: string) {
    const alert = alerts.value.find((a) => a.id === id)
    if (alert) {
      alert.acknowledged = true
    }
  }

  function addPatient(patient: Patient) {
    patients.value.unshift(patient)
  }

  function dischargePatient(id: string) {
    const index = patients.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      const patient = patients.value[index]
      // Free corresponding bed
      const bedObj = beds.value.find((b) => b.patientId === patient.id)
      if (bedObj) {
        bedObj.status = 'Dirty'
        bedObj.patientId = undefined
        bedObj.patientName = undefined
      }
      patients.value.splice(index, 1)
    }
  }

  function acknowledgeAllAlerts() {
    alerts.value.forEach((a) => (a.acknowledged = true))
  }

  // Simulation updates
  function simulateRealtimeUpdates() {
    // 1. Shift vitals slightly
    patients.value.forEach((patient) => {
      if (patient.condition === 'Critical') {
        // High fluctuations
        patient.vitals.heartRate = Math.round(patient.vitals.heartRate + (Math.random() - 0.5) * 4)
        patient.vitals.respirationRate = Math.round(
          patient.vitals.respirationRate + (Math.random() - 0.5) * 2
        )
        patient.vitals.oxygenLevel = Math.max(
          88,
          Math.min(
            100,
            patient.vitals.oxygenLevel + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0)
          )
        )
      } else {
        // Normal minor changes
        patient.vitals.heartRate = Math.round(patient.vitals.heartRate + (Math.random() - 0.5) * 2)
        patient.vitals.respirationRate = Math.round(
          patient.vitals.respirationRate + (Math.random() - 0.5) * 1
        )
      }
    })

    // 2. OR elapsed time increments
    operatingRooms.value.forEach((or) => {
      if (or.status === 'Intra-Op') {
        or.timeElapsedMin += 1
        if (or.timeElapsedMin >= or.estimatedTimeMin) {
          or.status = 'Post-Op'
        }
      } else if (or.status === 'Cleaning') {
        or.timeElapsedMin += 1
        if (or.timeElapsedMin >= or.estimatedTimeMin) {
          or.status = 'Available'
          or.procedure = 'None'
          or.surgeon = 'None'
          or.anesthesiologist = 'None'
          or.patientName = 'None'
        }
      }
    })

    // 3. Random admissions/triage additions (10% chance every 10s)
    if (Math.random() < 0.15) {
      const maleNames = ['David Miller', 'Michael Chen', 'Lucas Vance', 'Henry Higgins']
      const femaleNames = ['Grace Hopper', 'Clara Barton', 'Ada Lovelace', 'Florence Nightingale']
      const complaints = [
        'Chest discomfort',
        'Asthma exacerbation',
        'Right lower quadrant pain',
        'Head injury with confusion'
      ]

      const isMale = Math.random() > 0.5
      const newName = isMale
        ? maleNames[Math.floor(Math.random() * maleNames.length)]
        : femaleNames[Math.floor(Math.random() * femaleNames.length)]

      const newId = 'pat-' + Math.floor(Math.random() * 1000)
      const triageLv = Math.random() > 0.6 ? 'ESI-2' : 'ESI-3'

      const newPat: Patient = {
        id: newId,
        name: newName,
        age: Math.floor(Math.random() * 50) + 20,
        gender: isMale ? 'Male' : 'Female',
        mrn: `MRN-${Math.floor(Math.random() * 899) + 100}-${Math.floor(Math.random() * 899) + 100}`,
        condition: 'Admitting',
        triage: triageLv,
        bed: 'ED-A' + Math.floor(Math.random() * 10),
        room: 'ED-0' + Math.floor(Math.random() * 9),
        department: 'Emergency',
        admittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        chiefComplaint: complaints[Math.floor(Math.random() * complaints.length)],
        vitals: {
          heartRate: 90 + Math.floor(Math.random() * 20),
          systolicBP: 110 + Math.floor(Math.random() * 30),
          diastolicBP: 70 + Math.floor(Math.random() * 15),
          oxygenLevel: 95 + Math.floor(Math.random() * 4),
          respirationRate: 18 + Math.floor(Math.random() * 4),
          temperature: 37.0 + Math.floor(Math.random() * 15) / 10
        },
        riskScore: 20 + Math.floor(Math.random() * 40),
        sepsisScore: 2,
        readmissionRisk: 10 + Math.floor(Math.random() * 20),
        diagnoses: ['Under Diagnostic Evaluation'],
        medications: ['IV Normal Saline'],
        attendingPhysician: 'Dr. Evelyn Carter'
      }

      addPatient(newPat)

      // Add corresponding live alert
      const newAlt: LiveAlert = {
        id: 'alt-' + Math.floor(Math.random() * 1000),
        title: 'New Emergency Admission',
        message: `Patient ${newPat.name} admitted with: ${newPat.chiefComplaint} (Triage: ${newPat.triage}).`,
        level: newPat.triage === 'ESI-2' ? 'warning' : 'info',
        timestamp: new Date().toLocaleTimeString(),
        department: 'Emergency',
        acknowledged: false,
        aiSuggestedAction:
          'Assign to triage room. Start baseline clinical diagnostics panel. Initiate standard admission protocol.'
      }

      alerts.value.unshift(newAlt)

      // Add a security access log
      const newSec: SecurityLog = {
        id: 'sec-' + Math.floor(Math.random() * 1000),
        user: 'Dr. Evelyn Carter',
        role: 'Physician',
        action: 'EHR Write',
        resource: `${newPat.name} (EHR - Intake)`,
        ipAddress: '10.200.8.21',
        timestamp: new Date().toLocaleTimeString(),
        status: 'Granted',
        hipaaFlag: false
      }
      securityLogs.value.unshift(newSec)
    }
  }

  return {
    alerts,
    patients,
    beds,
    operatingRooms,
    staff,
    devices,
    pharmacyItems,
    claims,
    securityLogs,
    stats,
    acknowledgeAlert,
    addPatient,
    dischargePatient,
    acknowledgeAllAlerts,
    simulateRealtimeUpdates
  }
})
