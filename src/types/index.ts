// Medical and Operational Types

export type TriageLevel = 'ESI-1' | 'ESI-2' | 'ESI-3' | 'ESI-4' | 'ESI-5'
export type PatientCondition = 'Critical' | 'Guarded' | 'Stable' | 'Discharging' | 'Admitting'

export interface VitalsReading {
  heartRate: number
  systolicBP: number
  diastolicBP: number
  oxygenLevel: number
  respirationRate: number
  temperature: number
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  mrn: string // Medical Record Number
  condition: PatientCondition
  triage: TriageLevel
  bed: string
  room: string
  department: string
  admittedAt: string
  chiefComplaint: string
  vitals: VitalsReading
  riskScore: number // 0-100% predictive risk index
  sepsisScore: number // 0-10 qSOFA / clinical indicator
  readmissionRisk: number // 0-100%
  diagnoses: string[]
  medications: string[]
  attendingPhysician: string
}

export interface Bed {
  id: string
  room: string
  department: string
  status: 'Occupied' | 'Available' | 'Dirty' | 'Reserved'
  patientId?: string
  patientName?: string
  lastCleaned: string
  turnaroundTimeMin: number
}

export interface OperatingRoom {
  id: string
  name: string
  procedure: string
  surgeon: string
  anesthesiologist: string
  patientName: string
  status: 'Pre-Op' | 'Intra-Op' | 'Post-Op' | 'Cleaning' | 'Available'
  timeElapsedMin: number
  estimatedTimeMin: number
  utilizationRate: number
}

export interface Device {
  id: string
  name: string
  type: string
  status: 'Active' | 'Idle' | 'Maintenance' | 'Missing'
  location: string
  batteryLife: number
  lastCalibrated: string
}

export interface Staff {
  id: string
  name: string
  role: 'Physician' | 'Resident' | 'Nurse Practitioner' | 'RN' | 'Technician'
  department: string
  status: 'On-Duty' | 'On-Call' | 'Off-Duty'
  patientsAssigned: number
  burnoutIndex: number // 0-100
  shiftStart: string
  shiftEnd: string
}

export interface PharmacyItem {
  id: string
  name: string
  category: string
  stock: number
  minThreshold: number
  unit: string
  location: string
  isCritical: boolean
  temperatureCelsius: number
}

export interface BillingClaim {
  id: string
  patientName: string
  provider: string
  amount: number
  status: 'Approved' | 'Pending' | 'Denied' | 'Appealed'
  denialReason?: string
  createdDate: string
  completionRate: number
}

export interface SecurityLog {
  id: string
  user: string
  role: string
  action: string
  resource: string
  ipAddress: string
  timestamp: string
  status: 'Granted' | 'Denied'
  hipaaFlag: boolean
}

export interface LiveAlert {
  id: string
  title: string
  message: string
  level: 'info' | 'warning' | 'critical'
  timestamp: string
  department: string
  acknowledged: boolean
  aiSuggestedAction?: string
}

export interface Message {
  id: string
  sender: string
  senderRole: string
  text: string
  timestamp: string
  isAi: boolean
}
