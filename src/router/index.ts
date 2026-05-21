import { createRouter, createWebHistory } from 'vue-router'
import MasterLayout from '@/layouts/MasterLayout.vue'
import ExecutiveDashboard from '@/pages/ExecutiveDashboard.vue'
import AiInsightsCenter from '@/pages/AiInsightsCenter.vue'
import RealtimeMonitoring from '@/pages/RealtimeMonitoring.vue'
import ClinicalModuleLoader from '@/pages/ClinicalModuleLoader.vue'

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
      { path: 'patients', name: 'Patients', component: ClinicalModuleLoader },
      { path: 'patient-analytics', name: 'PatientAnalytics', component: ClinicalModuleLoader },
      { path: 'medical-records', name: 'MedicalRecords', component: ClinicalModuleLoader },
      {
        path: 'admissions-discharges',
        name: 'AdmissionsDischarges',
        component: ClinicalModuleLoader
      },
      { path: 'appointments', name: 'Appointments', component: ClinicalModuleLoader },
      { path: 'telemedicine', name: 'Telemedicine', component: ClinicalModuleLoader },
      // AI Diagnostics
      { path: 'ai-diagnosis', name: 'AiDiagnosis', component: ClinicalModuleLoader },
      { path: 'medical-imaging', name: 'MedicalImaging', component: ClinicalModuleLoader },
      { path: 'lab-intelligence', name: 'LabIntelligence', component: ClinicalModuleLoader },
      { path: 'predictive-risk', name: 'PredictiveRisk', component: ClinicalModuleLoader },
      { path: 'clinical-decision', name: 'ClinicalDecision', component: ClinicalModuleLoader },
      // Hospital Operations
      { path: 'bed-management', name: 'BedManagement', component: ClinicalModuleLoader },
      { path: 'emergency-ops', name: 'EmergencyOps', component: ClinicalModuleLoader },
      { path: 'surgery-management', name: 'SurgeryManagement', component: ClinicalModuleLoader },
      { path: 'staff-operations', name: 'StaffOperations', component: ClinicalModuleLoader },
      { path: 'facility-monitoring', name: 'FacilityMonitoring', component: ClinicalModuleLoader },
      { path: 'asset-tracking', name: 'AssetTracking', component: ClinicalModuleLoader },
      // Pharmacy & Labs
      { path: 'pharmacy', name: 'Pharmacy', component: ClinicalModuleLoader },
      { path: 'inventory', name: 'Inventory', component: ClinicalModuleLoader },
      { path: 'lab-operations', name: 'LabOperations', component: ClinicalModuleLoader },
      // Finance & Insurance
      { path: 'billing', name: 'Billing', component: ClinicalModuleLoader },
      { path: 'claims', name: 'Claims', component: ClinicalModuleLoader },
      { path: 'financial-analytics', name: 'FinancialAnalytics', component: ClinicalModuleLoader },
      // Security & Compliance
      { path: 'security-center', name: 'SecurityCenter', component: ClinicalModuleLoader },
      { path: 'compliance', name: 'Compliance', component: ClinicalModuleLoader },
      // Communication
      { path: 'messages', name: 'Messages', component: ClinicalModuleLoader },
      { path: 'notifications', name: 'Notifications', component: ClinicalModuleLoader },
      // Administration
      { path: 'reports', name: 'Reports', component: ClinicalModuleLoader },
      { path: 'api-integrations', name: 'ApiIntegrations', component: ClinicalModuleLoader },
      { path: 'settings', name: 'Settings', component: ClinicalModuleLoader }
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

export default router
