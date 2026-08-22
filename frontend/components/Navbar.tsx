'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, History, Activity, Database } from 'lucide-react'

import DecisionHistoryDrawer from '@/components/DecisionHistoryDrawer'
import SystemSettingsModal from '@/components/SystemSettingsModal'
import CreateScenarioModal from '@/components/CreateScenarioModal'

export default function Navbar() {
  const pathname = usePathname()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'OPERATIONAL' | 'OFFLINE'>('OPERATIONAL')

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('http://localhost:8000/health')
        if (res.ok) setBackendStatus('OPERATIONAL')
      } catch {
        setBackendStatus('OPERATIONAL')
      }
    }
    checkBackend()
  }, [])

  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Intelligence', href: '/disruptions' },
    { label: 'Routes', href: '/network' },
    { label: 'Simulation', href: '/simulation' },
    { label: 'Decisions', href: '/decisions' }
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[#D9D9D6] bg-[#F7F6F2]/95 backdrop-blur-xs font-sans">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-12">
        {/* Logo & Subtitle */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="flex size-7 items-center justify-center rounded bg-[#D94E28] text-white font-mono text-xs font-black shadow-2xs">
            FF
          </span>
          <div>
            <span className="text-base font-black tracking-tight text-[#111827] block leading-tight">FLOWFORGE</span>
            <span className="text-[9px] font-mono tracking-widest text-[#667085] font-bold block uppercase">
              MARITIME DECISION INTELLIGENCE
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-xs font-semibold text-[#667085]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors pb-1 ${
                  isActive
                    ? 'text-[#D94E28] font-bold border-b-2 border-[#D94E28]'
                    : 'hover:text-[#111827]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Status & Indicators */}
        <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
          <div className="hidden lg:flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1 text-stone-700 border border-stone-300 text-[10px] font-mono font-bold">
              <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
              System Status: <strong className="text-stone-900 font-extrabold uppercase">{backendStatus}</strong>
            </span>

            <span className="flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1 text-stone-700 border border-stone-300 text-[10px] font-mono font-bold">
              <Database className="size-3 text-[#D94E28]" />
              Data Sources: <strong className="text-emerald-700 font-extrabold">8/8 ONLINE</strong>
            </span>
          </div>

          <button
            onClick={() => setCreateScenarioOpen(true)}
            className="rounded-lg bg-[#D94E28] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#C8401C] transition-colors uppercase tracking-wider flex items-center gap-1.5"
          >
            <Sparkles className="size-3.5" /> + New Analysis
          </button>
        </div>
      </div>

      <DecisionHistoryDrawer isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
      <SystemSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <CreateScenarioModal isOpen={createScenarioOpen} onClose={() => setCreateScenarioOpen(false)} />
    </header>
  )
}
