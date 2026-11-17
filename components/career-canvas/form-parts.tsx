'use client'

import { useId, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, Lightbulb, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function TextField({ label, value, onChange, placeholder, hint, error, optional, multiline, type = 'text', autoComplete, maxLength = 300, disabled = false }: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string; hint?: string; error?: string; optional?: boolean; multiline?: boolean; type?: string; autoComplete?: string; maxLength?: number; disabled?: boolean
}) {
  const id = useId()
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  const props = { id, value, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value), placeholder, disabled, maxLength, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy }
  return <Field data-invalid={Boolean(error)} data-disabled={disabled}>
    <FieldLabel htmlFor={id}>{label}{optional && <span className="optional-label">Optional</span>}</FieldLabel>
    {multiline ? <Textarea {...props} rows={3} /> : <Input {...props} type={type} autoComplete={autoComplete} {...(type === 'month' ? { min: '1900-01', max: '2100-12' } : {})} />}
    {hint && <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>}
    {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
  </Field>
}

export function Tip({ title, children }: { title: string; children: ReactNode }) {
  return <Alert className="context-tip" role="note"><Lightbulb /><AlertTitle>{title}</AlertTitle><AlertDescription>{children}</AlertDescription></Alert>
}

export function EntryCard({ title, subtitle, children, onRemove, onMoveUp, onMoveDown }: { title: string; subtitle?: string; children: ReactNode; onRemove: () => void; onMoveUp?: () => void; onMoveDown?: () => void }) {
  return <section className="entry-card">
    <div className="entry-card-header"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div><div className="flex gap-1">
      {onMoveUp && <Button type="button" variant="ghost" size="icon-sm" onClick={onMoveUp} aria-label={`Move ${title} up`}><ArrowUp /></Button>}
      {onMoveDown && <Button type="button" variant="ghost" size="icon-sm" onClick={onMoveDown} aria-label={`Move ${title} down`}><ArrowDown /></Button>}
      <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label={`Remove ${title}`}><Trash2 /></Button>
    </div></div>
    <FieldGroup>{children}</FieldGroup>
  </section>
}

export function AddButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <Button variant="outline" type="button" className="add-entry" onClick={onClick} disabled={disabled}><Plus data-icon="inline-start" />{children}</Button>
}

export function BulletHelper({ original, onApply, onClose }: { original: string; onApply: (text: string) => void; onClose: () => void }) {
  const [action, setAction] = useState(original.replace(/^I\s+/i, '').trim())
  const [context, setContext] = useState('')
  const [result, setResult] = useState('')
  const combined = [action.trim().replace(/[.;]+$/, ''), context.trim().replace(/[.;]+$/, ''), result.trim().replace(/[.;]+$/, '')].filter(Boolean).join('; ')
  const suggestion = combined ? combined.charAt(0).toUpperCase() + combined.slice(1) + '.' : ''
  return <section className="bullet-helper" aria-label="Make this stronger">
    <div className="flex items-center justify-between gap-2"><h4 className="flex items-center gap-2"><Sparkles className="size-4" />Your facts. A clearer story.</h4><Button type="button" variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close bullet helper"><X /></Button></div>
    <p>No AI, no invented achievements. Refine the action, then add only context and results you can verify.</p>
    <FieldGroup>
      <TextField label="Action + what you did" value={action} onChange={setAction} multiline maxLength={700} hint="Start with a truthful verb, such as Designed, Analyzed, Supported, or Organized." />
      <TextField label="Relevant context" value={context} onChange={setContext} optional placeholder="e.g. for the campus volunteer program" maxLength={300} />
      <TextField label="Verified result or metric" value={result} onChange={setResult} optional placeholder="What changed because of your work?" maxLength={300} hint="Know a real count, percentage, or time saved? Add it. No reliable metric? A specific qualitative result is fine—or leave this out." />
    </FieldGroup>
    <div className="helper-result"><span>YOUR REVISED BULLET</span><p>{suggestion || 'Add your action above to compose a bullet.'}</p></div>
    <Button type="button" size="sm" disabled={!action.trim()} onClick={() => onApply(suggestion)}>Use this bullet</Button>
  </section>
}
