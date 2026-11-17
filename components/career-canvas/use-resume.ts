'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { emptyResume, resumeSchema, STORAGE_KEY, type Resume } from '@/lib/resume'

export function useResume() {
  const [data, setData] = useState<Resume>(emptyResume)
  const [step, setStep] = useState(0)
  const [ready, setReady] = useState(false)
  const [saveStatus, setSaveStatus] = useState('Opening your canvas…')
  const [storageWarning, setStorageWarning] = useState('')
  const canSave = useRef(true)
  const latest = useRef({ data, step })
  latest.current = { data, step }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        const parsed = resumeSchema.safeParse(saved.data)
        if (!parsed.success || saved.version !== 1) throw new Error('Invalid draft')
        setData(parsed.data)
        setStep(Number.isInteger(saved.step) && saved.step >= 0 && saved.step <= 5 ? saved.step : 0)
      }
      setSaveStatus('Saved on this device')
    } catch {
      canSave.current = false
      setSaveStatus('Autosave unavailable')
      setStorageWarning('We couldn’t open your saved draft. Your existing storage has not been overwritten. You can still edit and download a PDF; reset the draft to retry local saving.')
    }
    setReady(true)
  }, [])

  const save = useCallback((draft: Resume, currentStep: number) => {
    if (!canSave.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, data: draft, step: currentStep }))
      setSaveStatus('Saved just now')
      setStorageWarning('')
    } catch {
      setSaveStatus('Couldn’t save draft')
      setStorageWarning('Device storage is unavailable or full. Keep this tab open and download your PDF before leaving; these changes may not survive a refresh.')
    }
  }, [])

  useEffect(() => {
    if (!ready || !canSave.current) return
    setSaveStatus('Saving…')
    const timer = window.setTimeout(() => save(data, step), 450)
    return () => clearTimeout(timer)
  }, [data, step, ready, save])

  useEffect(() => {
    if (!ready) return
    const flush = () => save(latest.current.data, latest.current.step)
    const hide = () => { if (document.visibilityState === 'hidden') flush() }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', hide)
    return () => { window.removeEventListener('pagehide', flush); document.removeEventListener('visibilitychange', hide) }
  }, [ready, save])

  function replace(draft: Resume) {
    canSave.current = true
    setData(draft)
    setStep(0)
    save(draft, 0)
  }
  return { data, setData, step, setStep, ready, saveStatus, storageWarning, replace }
}
