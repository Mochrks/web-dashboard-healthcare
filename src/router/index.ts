import { createRouter, createWebHistory } from 'vue-router'
import MasterLayout from '@/layouts/MasterLayout.vue'
import ExecutiveDashboard from '@/pages/ExecutiveDashboard.vue'
import AiInsightsCenter from '@/pages/AiInsightsCenter.vue'
import RealtimeMonitoring from '@/pages/RealtimeMonitoring.vue'

// Patient Management
import Patients from '@/pages/patients/PatientList.vue'
import PatientAnalytics from '@/pages/patients/PatientAnalytics.vue'
import MedicalRecords from '@/pages/patients/MedicalRecords.vue'
import AdmissionsDischarges from '@/pages/patients/AdmissionsDischarges.vue'
import Appointments from '@/pages/patients/Appointments.vue'
import Telemedicine from '@/pages/patients/Telemedicine.vue'

// AI Diagnostics
import AiDiagnosis from '@/pages/ai-diagnostics/AiDiagnosis.vue'
import MedicalImaging from '@/pages/ai-diagnostics/MedicalImaging.vue'
import LabIntelligence from '@/pages/ai-diagnostics/LabIntelligence.vue'
import PredictiveRisk from '@/pages/ai-diagnostics/PredictiveRisk.vue'
import ClinicalDecision from '@/pages/ai-diagnostics/ClinicalDecision.vue'

// Hospital Operations
import BedManagement from '@/pages/hospital-operations/BedManagement.vue'
import EmergencyOps from '@/pages/hospital-operations/EmergencyOps.vue'
import SurgeryManagement from '@/pages/hospital-operations/SurgeryManagement.vue'
import StaffOperations from '@/pages/hospital-operations/StaffOperations.vue'
import FacilityMonitoring from '@/pages/hospital-operations/FacilityMonitoring.vue'
import AssetTracking from '@/pages/hospital-operations/AssetTracking.vue'

// Pharmacy & Labs
import Pharmacy from '@/pages/pharmacy-labs/Pharmacy.vue'
import Inventory from '@/pages/pharmacy-labs/Inventory.vue'
import LabOperations from '@/pages/pharmacy-labs/LabOperations.vue'

// Finance & Insurance
import Billing from '@/pages/finance-insurance/Billing.vue'
import Claims from '@/pages/finance-insurance/Claims.vue'
import FinancialAnalytics from '@/pages/finance-insurance/FinancialAnalytics.vue'

// Security & Compliance
import SecurityCenter from '@/pages/security-compliance/SecurityCenter.vue'
import Compliance from '@/pages/security-compliance/Compliance.vue'

// Communication
import Messages from '@/pages/communication/Messages.vue'
import Notifications from '@/pages/communication/Notifications.vue'

// Administration
import Reports from '@/pages/administration/Reports.vue'
import ApiIntegrations from '@/pages/administration/ApiIntegrations.vue'
import Settings from '@/pages/administration/Settings.vue'

const routes = [
  {
    path: '/',
    component: MasterLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: ExecutiveDashboard
      },
      {
        path: 'ai-insights',
        name: 'AiInsights',
        component: AiInsightsCenter
      },
      {
        path: 'realtime-monitor',
        name: 'RealtimeMonitor',
        component: RealtimeMonitoring
      },
      // Patient Management
      { path: 'patients', name: 'Patients', component: Patients },
      { path: 'patient-analytics', name: 'PatientAnalytics', component: PatientAnalytics },
      { path: 'medical-records', name: 'MedicalRecords', component: MedicalRecords },
      {
        path: 'admissions-discharges',
        name: 'AdmissionsDischarges',
        component: AdmissionsDischarges
      },
      { path: 'appointments', name: 'Appointments', component: Appointments },
      { path: 'telemedicine', name: 'Telemedicine', component: Telemedicine },
      // AI Diagnostics
      { path: 'ai-diagnosis', name: 'AiDiagnosis', component: AiDiagnosis },
      { path: 'medical-imaging', name: 'MedicalImaging', component: MedicalImaging },
      { path: 'lab-intelligence', name: 'LabIntelligence', component: LabIntelligence },
      { path: 'predictive-risk', name: 'PredictiveRisk', component: PredictiveRisk },
      { path: 'clinical-decision', name: 'ClinicalDecision', component: ClinicalDecision },
      // Hospital Operations
      { path: 'bed-management', name: 'BedManagement', component: BedManagement },
      { path: 'emergency-ops', name: 'EmergencyOps', component: EmergencyOps },
      { path: 'surgery-management', name: 'SurgeryManagement', component: SurgeryManagement },
      { path: 'staff-operations', name: 'StaffOperations', component: StaffOperations },
      { path: 'facility-monitoring', name: 'FacilityMonitoring', component: FacilityMonitoring },
      { path: 'asset-tracking', name: 'AssetTracking', component: AssetTracking },
      // Pharmacy & Labs
      { path: 'pharmacy', name: 'Pharmacy', component: Pharmacy },
      { path: 'inventory', name: 'Inventory', component: Inventory },
      { path: 'lab-operations', name: 'LabOperations', component: LabOperations },
      // Finance & Insurance
      { path: 'billing', name: 'Billing', component: Billing },
      { path: 'claims', name: 'Claims', component: Claims },
      { path: 'financial-analytics', name: 'FinancialAnalytics', component: FinancialAnalytics },
      // Security & Compliance
      { path: 'security-center', name: 'SecurityCenter', component: SecurityCenter },
      { path: 'compliance', name: 'Compliance', component: Compliance },
      // Communication
      { path: 'messages', name: 'Messages', component: Messages },
      { path: 'notifications', name: 'Notifications', component: Notifications },
      // Administration
      { path: 'reports', name: 'Reports', component: Reports },
      { path: 'api-integrations', name: 'ApiIntegrations', component: ApiIntegrations },
      { path: 'settings', name: 'Settings', component: Settings }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Dynamic SEO Title formatting
router.beforeEach((to, _from, next) => {
  const baseTitle = 'Aether Health'
  if (to.name) {
    // Format camelCase/PascalCase route names into spaced words (e.g., 'PatientAnalytics' -> 'Patient Analytics')
    const routeName = to.name
      .toString()
      .replace(/([A-Z])/g, ' $1')
      .trim()
    document.title = `${routeName} | ${baseTitle}`
  } else {
    document.title = baseTitle
  }
  next()
})

export default router
