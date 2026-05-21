import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from '../types'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([
    {
      id: 'msg-1',
      sender: 'AI Medical Assistant',
      senderRole: 'Clinical Intelligence Engine',
      text: 'Good evening. I am monitoring the clinical feeds and hospital operations. How can I assist you with clinical protocols, bed allocations, or risk predictions today?',
      timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
      isAi: true
    }
  ])

  const isTyping = ref(false)

  function getAiResponse(userText: string): string {
    const text = userText.toLowerCase()

    if (text.includes('sepsis') || text.includes('qsofa') || text.includes('infection')) {
      return `[CLINICAL INSIGHT] A review of current patient records indicates patient Sarah Jenkins (Bed ICU-A4) has a qSOFA score of 7, marking severe sepsis progression risk. Recommended response:
1. Initiate severe sepsis resuscitation bundle.
2. Order Stat blood cultures x2 and lactate levels.
3. Administer broad-spectrum empiric antimicrobials (e.g., Piperacillin/Tazobactam) within 1 hour.
4. Establish rapid crystalloid fluid resuscitation (30 mL/kg) for MAP < 65 mmHg.`
    }

    if (
      text.includes('bed') ||
      text.includes('capacity') ||
      text.includes('congestion') ||
      text.includes('occupancy')
    ) {
      return `[OPERATIONAL REALLOCATION] Current hospital bed occupancy stands at 87.5% in the ICU. The Emergency Department is experiencing ESI-2 triage surge.
Recommended action:
1. Reallocate 2 RNs from Ward B to the Emergency Department to assist with intake.
2. Mobilize the discharge of Elena Rostova (Room-301) whose post-op metrics are fully stabilized, freeing up a Med-Surg bed.
3. Standby surge beds 104/105 in ICU Annex if Sarah Jenkins' vitals continue to fluctuate.`
    }

    if (
      text.includes('ecg') ||
      text.includes('arrhythmia') ||
      text.includes('heart') ||
      text.includes('vtach') ||
      text.includes('cardiac')
    ) {
      return `[CARDIOLOGY ALERT] Patient Sarah Jenkins (ICU-A4) showed Ventricular Tachycardia (HR: 118 bpm, BP: 92/58 mmHg). 
Recommended immediate actions:
1. Verify lead placement and hemodynamics immediately.
2. Prepare bedside Amiodarone bolus (150mg over 10 mins) if patient remains conscious and has a pulse.
3. Bring crash cart to bedside and check defibrillation sync switch.
4. Stat Electrolytes Panel (K+, Mg++) to rule out electrolyte-induced QT prolongation.`
    }

    if (
      text.includes('hipaa') ||
      text.includes('security') ||
      text.includes('unregistered') ||
      text.includes('breach') ||
      text.includes('audit')
    ) {
      return `[SECURITY INCIDENT UPDATE] The system flagged an unauthorized access attempt from IP 192.168.4.211 using Dr. Ramirez's credentials at ${new Date(Date.now() - 25 * 60000).toLocaleTimeString()}.
Corrective measures deployed:
1. Unregistered IP was blacklisted at the gateway level.
2. Credentials associated with 'Ramirez-R' have been temporarily locked.
3. Security incident logged under audit ID: HIPAA-A-994. Please direct Dr. Ramirez to the compliance office for physical credential reactivation.`
    }

    if (
      text.includes('surgery') ||
      text.includes('or') ||
      text.includes('operating') ||
      text.includes('surgeon')
    ) {
      return `[SURGERY MANAGEMENT ENGINE] Today's Operating Room utilization is averaging 78%. OR Suite 1 is currently active with CABG (Dr. Marcus Vance).
Operational Notes:
1. OR Suite 3 is currently undergoing a 30-min turn-around cleaning cycle, scheduled to finish in 15 minutes.
2. OR Suite 4 is fully prepped and available.
3. Recommend staging the incoming ESI-2 appendicitis case (Sophia Wong) in OR Suite 4 with surgeon Dr. David Lin to prevent emergency congestion.`
    }

    if (
      text.includes('pharmacy') ||
      text.includes('drug') ||
      text.includes('epinephrine') ||
      text.includes('stock')
    ) {
      return `[PHARMACY & LABS REPORT] Epinephrine inventory is stable at 140 vials (critical threshold: 50). Insulin Glargine is low at 12 pens (threshold: 20).
Supply chain action:
1. Automated refill request has been triggered to distributor for 50 Insulin Glargine pens.
2. Centrifuge Lab-C2 has experienced a cooling malfunction (4.2°C). Lab operators have routed blood panels to Centrifuge Lab-C3. Maintenance scheduled.`
    }

    return `[AI CONSULTATION] Analysis of clinical dashboards shows optimal operation. I am monitoring vitals streams, bed status, and device logs across Cardiology, Emergency, and Med-Surg. 

Feel free to ask for specific assistance on:
- "ICU Patient Sepsis Risk" (Clinical Protocols)
- "ED Surge & Bed Capacity" (Bed Allocation Suggestions)
- "Sarah Jenkins Arrhythmia Alert" (Cardiology Assistance)
- "HIPAA Breach Security Logs" (Compliance Auditing)
- "Stage Sophia Wong Appendectomy" (OR Scheduling & Staffing)`
  }

  function sendMessage(text: string) {
    if (!text.trim()) return

    // Add user message
    messages.value.push({
      id: 'msg-user-' + Math.floor(Math.random() * 1000),
      sender: 'Dr. Attending Physician',
      senderRole: 'Clinical Specialist',
      text: text,
      timestamp: new Date().toLocaleTimeString(),
      isAi: false
    })

    // Simulate AI thinking and response
    isTyping.value = true
    setTimeout(() => {
      const responseText = getAiResponse(text)
      messages.value.push({
        id: 'msg-ai-' + Math.floor(Math.random() * 1000),
        sender: 'AI Medical Assistant',
        senderRole: 'Clinical Intelligence Engine',
        text: responseText,
        timestamp: new Date().toLocaleTimeString(),
        isAi: true
      })
      isTyping.value = false
    }, 1200)
  }

  function clearChat() {
    messages.value = [
      {
        id: 'msg-init',
        sender: 'AI Medical Assistant',
        senderRole: 'Clinical Intelligence Engine',
        text: 'System logs cleared. Ready to assist with new operational queries.',
        timestamp: new Date().toLocaleTimeString(),
        isAi: true
      }
    ]
  }

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat
  }
})
