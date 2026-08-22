'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  HelpCircle,
  Pause,
  RotateCcw,
  ShieldAlert,
  Sliders,
  X
} from 'lucide-react'

export type ActionType = 'APPROVE' | 'REJECT' | 'PAUSE' | 'SKIP' | 'OVERRIDE'

interface DecisionReasonModalProps {
  isOpen: boolean
  action: ActionType
  onClose: () => void
  onSubmitSuccess: (outcome: any) => void
}

const reasonCategories = [
  { id: 'COST', label: 'COST', desc: 'Alternative is too expensive or exceeds budget.' },
  { id: 'RISK', label: 'RISK', desc: 'Risk tolerance differs from the recommendation.' },
  { id: 'CAPACITY', label: 'CAPACITY', desc: 'Required capacity or berth is unavailable.' },
  { id: 'CUSTOMER_COMMITMENT', label: 'CUSTOMER COMMITMENT', desc: 'Customer/service SLA commitments require another option.' },
  { id: 'OPERATIONAL_CONSTRAINT', label: 'OPERATIONAL CONSTRAINT', desc: 'Current operational constraints prevent execution.' },
  { id: 'PREFERENCE', label: 'PREFERENCE', desc: 'Team preference favors another strategy.' },
  { id: 'DISAGREEMENT', label: 'DISAGREEMENT', desc: 'Decision-maker disagrees with the recommendation.' },
  { id: 'DATA_QUALITY', label: 'DATA QUALITY', desc: 'Available data is insufficient or unreliable.' },
  { id: 'TIMING', label: 'TIMING', desc: 'Decision timing is not appropriate.' },
  { id: 'OTHER', label: 'OTHER', desc: 'Another operational reason.' }
]

const pauseReasons = [
  'WAITING FOR MORE DATA',
  'WAITING FOR APPROVAL',
  'WAITING FOR CAPACITY',
  'WAITING FOR CUSTOMER',
  'CONDITIONS MAY CHANGE',
  'NEED HUMAN REVIEW',
  'OTHER'
]

const skipReasons = [
  'NOT APPLICABLE',
  'ALREADY RESOLVED',
  'LOW PRIORITY',
  'BUSINESS PREFERENCE',
  'OPERATIONAL CONSTRAINT',
  'DUPLICATE',
  'INSUFFICIENT INFORMATION',
  'OTHER'
]

const disagreementTopics = [
  'Risk assessment',
  'Cost estimate',
  'Delay estimate',
  'Recommended route',
  'Simulation outcome',
  'Business priority',
  'Other'
]

export default function DecisionReasonModal({
  isOpen,
  action,
  onClose,
  onSubmitSuccess
}: DecisionReasonModalProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('PREFERENCE')
  const [disagreementTopic, setDisagreementTopic] = useState<string>('Recommended route')
  const [preferredRoute, setPreferredRoute] = useState<string>('Colombo')
  const [resumeCondition, setResumeCondition] = useState<string>('Wait until port congestion falls below 70%')
  const [reasonText, setReasonText] = useState<string>(
    action === 'OVERRIDE' || action === 'REJECT'
      ? 'Existing carrier agreement provides guaranteed capacity on the Colombo route.'
      : ''
  )
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const modalTitle = {
    APPROVE: 'CONFIRM DECISION APPROVAL',
    REJECT: 'WHY WAS THIS DECISION REJECTED?',
    PAUSE: 'WHY IS THIS DECISION BEING PAUSED?',
    SKIP: 'WHY IS THIS ACTION BEING SKIPPED?',
    OVERRIDE: 'RECORD OPERATIONAL OVERRIDE'
  }[action]

  const modalSubtitle = {
    APPROVE: 'Confirm execution of the FlowForge recommended Antwerp route.',
    REJECT: 'Capture the reason so FlowForge can preserve the operational context behind this decision.',
    PAUSE: 'Specify the pause rationale and expected resume condition.',
    SKIP: 'Specify why this action is not applicable or skipped.',
    OVERRIDE: 'Preserve the distinction between AI recommendation and human operational choice.'
  }[action]

  const handleSubmit = async () => {
    setSubmitting(true)
    const payload = {
      decision_id: 'DEC-00421',
      simulation_id: 'SIM-9281',
      disruption_id: 'ROTTERDAM',
      action: action,
      reason_category: action === 'PAUSE' ? 'TIMING' : action === 'SKIP' ? 'OPERATIONAL_CONSTRAINT' : selectedCategory,
      reason_subcategory: action === 'DISAGREEMENT' ? disagreementTopic : 'EXISTING_CONTRACT',
      reason_text: reasonText || (action === 'APPROVE' ? 'Approved by operator' : 'Action taken by operator'),
      recommended_strategy_id: 'Antwerp',
      selected_strategy_id: action === 'OVERRIDE' ? preferredRoute : action === 'APPROVE' ? 'Antwerp' : 'Antwerp',
      resume_condition: action === 'PAUSE' ? resumeCondition : null
    }

    try {
      const res = await fetch('http://localhost:8000/api/v1/decisions/outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        onSubmitSuccess(data)
      } else {
        onSubmitSuccess(payload)
      }
    } catch {
      onSubmitSuccess(payload)
    }

    setSubmitting(false)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative z-[100000] w-full max-w-2xl rounded-lg border-2 border-stone-300 bg-[#F6F6F3] shadow-2xl overflow-hidden font-sans my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-300 bg-white p-5 md:px-7">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black tracking-widest text-[#D94E28]">
              <ShieldAlert className="size-3.5" /> ROUND 2 ABANDONMENT & DECISION INTELLIGENCE
            </div>
            <h3 className="text-xl font-black text-[#151719] mt-0.5">{modalTitle}</h3>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">{modalSubtitle}</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700">
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-7 space-y-5 max-h-[75vh] overflow-y-auto font-mono text-xs">
          {/* APPROVE CONFIRMATION BODY */}
          {action === 'APPROVE' && (
            <div className="rounded border border-[#047857] bg-[#ECFDF5] p-5 space-y-3">
              <div className="flex items-center gap-2 font-black text-[#047857] text-sm">
                <CheckCircle2 className="size-5 text-[#047857]" />
                <span>CONFIRM RECOMMENDATION EXECUTION</span>
              </div>
              <p className="text-xs text-stone-800 font-semibold font-sans">
                Reroute 142 shipments via Antwerp (BEANR). Expected financial loss avoided: <strong>$63,000 USD</strong>.
              </p>
            </div>
          )}

          {/* OVERRIDE & PREFERENCE ROUTE COMPARISON */}
          {(action === 'OVERRIDE' || selectedCategory === 'PREFERENCE' || selectedCategory === 'DISAGREEMENT') && action !== 'APPROVE' && (
            <div className="grid grid-cols-2 gap-3 p-4 rounded border border-stone-300 bg-white">
              <div className="rounded bg-stone-50 p-3 border border-stone-200">
                <span className="text-[9px] text-stone-500 font-extrabold block">FLOWFORGE RECOMMENDED</span>
                <span className="text-sm font-black text-[#D94E28] block mt-0.5">Antwerp Route</span>
                <span className="text-[10px] text-stone-600 font-bold block">Risk: 28% · Loss: $19K</span>
              </div>

              <div className="rounded bg-[#ECFDF5] p-3 border border-[#A7F3D0]">
                <span className="text-[9px] text-[#065F46] font-extrabold block">HUMAN / TEAM PREFERRED</span>
                <select
                  value={preferredRoute}
                  onChange={(e) => setPreferredRoute(e.target.value)}
                  className="mt-0.5 w-full rounded border border-[#047857] bg-white text-sm font-black text-[#047857] p-1 focus:outline-none"
                >
                  <option value="Colombo">Colombo Route (LKCMB)</option>
                  <option value="Direct Rotterdam">Direct Rotterdam (NLRTM)</option>
                  <option value="Gdansk Diversion">Gdansk Diversion (PLGDN)</option>
                </select>
                <span className="text-[10px] text-[#047857] font-bold block mt-1">Risk: 42% · Loss: $41K</span>
              </div>
            </div>
          )}

          {/* DISAGREEMENT EXTRA FIELD */}
          {selectedCategory === 'DISAGREEMENT' && action !== 'APPROVE' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-stone-700 block">WHAT DO YOU DISAGREE WITH?</label>
              <div className="grid grid-cols-2 gap-2">
                {disagreementTopics.map((top) => (
                  <button
                    key={top}
                    onClick={() => setDisagreementTopic(top)}
                    className={`rounded border p-2 text-[11px] text-left font-bold transition-all ${
                      disagreementTopic === top
                        ? 'border-[#D94E28] bg-orange-50 text-[#D94E28] font-black'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    {top}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* REASON CATEGORIES SELECTOR */}
          {action !== 'APPROVE' && action !== 'PAUSE' && action !== 'SKIP' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-700 block">SELECT PRIMARY REASON CATEGORY</label>
              <div className="grid grid-cols-2 gap-2">
                {reasonCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded p-2.5 border cursor-pointer transition-all ${
                      selectedCategory === cat.id
                        ? 'border-2 border-[#D94E28] bg-orange-50/90 shadow-2xs font-black'
                        : 'border-stone-300 bg-white hover:border-stone-400'
                    }`}
                  >
                    <span className="text-xs font-black text-stone-900 block">{cat.label}</span>
                    <span className="text-[10px] text-stone-500 font-bold font-sans block">{cat.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAUSE RESUME CONDITION */}
          {action === 'PAUSE' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-700 block">EXPECTED RESUME CONDITION</label>
                <input
                  type="text"
                  value={resumeCondition}
                  onChange={(e) => setResumeCondition(e.target.value)}
                  placeholder="e.g. Wait until port congestion falls below 70%"
                  className="w-full rounded border border-stone-300 bg-white p-2.5 font-bold text-stone-900 focus:border-[#D94E28] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TEXTAREA CONTEXT BOX (500 MAX CHARACTERS) */}
          {action !== 'APPROVE' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-black text-stone-700">
                <span>ADDITIONAL CONTEXT & EXPLANATION</span>
                <span className="text-stone-400">{reasonText.length} / 500</span>
              </div>
              <textarea
                maxLength={500}
                rows={3}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Explain why this action was rejected, paused, skipped or overridden (e.g. Existing carrier agreement requires Colombo...)"
                className="w-full rounded border border-stone-300 bg-white p-2.5 font-bold text-stone-900 font-sans text-xs focus:border-[#D94E28] focus:outline-none"
              />
            </div>
          )}

          {action === 'OVERRIDE' && (
            <div className="rounded bg-amber-50 p-2.5 border border-amber-300 text-amber-900 font-bold text-[10px] flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-700" />
              <span>This override will be recorded in the decision audit trail for future context.</span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-stone-300 bg-white p-4 md:px-7 font-mono">
          <button
            onClick={onClose}
            className="rounded border border-stone-300 bg-stone-100 px-4 py-2 text-xs font-black text-stone-700 hover:bg-stone-200 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded bg-[#D94E28] px-6 py-2 text-xs font-black text-white hover:bg-[#C84B24] transition-colors shadow-2xs disabled:opacity-50"
          >
            {submitting
              ? 'SAVING REASON...'
              : action === 'APPROVE'
              ? 'CONFIRM APPROVAL ✓'
              : 'SAVE DECISION REASON →'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
