'use client'

import { useState } from 'react'
import { BriefcaseBusiness, Building2, ChevronDown, GraduationCap, Plus, Rocket, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { AddButton, BulletHelper, EntryCard, TextField, Tip } from './form-parts'
import { newCredential, newEducation, newExtra, newSkill, newWork, type Errors, type Extra, type Resume } from '@/lib/resume'
import { cn } from '@/lib/utils'

type Props = { data: Resume; update: (data: Resume) => void; errors: Errors; remove: (data: Resume, label: string) => void }

export function TargetStep({ data, update, errors }: Props) {
  const set = (key: keyof Resume['target'], value: string) => update({ ...data, target: { ...data.target, [key]: value } })
  const levels = [{ value: 'student', label: 'Student', detail: 'Building my foundation', icon: GraduationCap }, { value: 'early', label: 'Early career', detail: 'Finding my momentum', icon: Rocket }, { value: 'experienced', label: 'Experienced', detail: 'Ready for what’s next', icon: BriefcaseBusiness }]
  return <FieldGroup>
    <TextField label="What role are you aiming for?" value={data.target.role} onChange={v => set('role', v)} placeholder="e.g. Product Designer" hint="A specific role gives your resume a little more direction." error={errors['target.role']} />
    <TextField label="Field or industry" value={data.target.industry} onChange={v => set('industry', v)} placeholder="e.g. Technology & digital products" error={errors['target.industry']} />
    <FieldSet><FieldLegend variant="label">Where are you in your career?</FieldLegend><div className="career-levels">
      {levels.map(({ value, label, detail, icon: Icon }) => <label key={value} className={cn('career-choice', data.target.level === value && 'selected')}>
        <input type="radio" name="experience-level" value={value} checked={data.target.level === value} onChange={() => set('level', value)} aria-invalid={Boolean(errors['target.level'])} aria-describedby={errors['target.level'] ? 'level-error' : undefined} />
        <Icon aria-hidden="true" /><strong>{label}</strong><span>{detail}</span>
      </label>)}
    </div>{errors['target.level'] && <FieldError id="level-error">{errors['target.level']}</FieldError>}</FieldSet>
    <details className="job-description"><summary><span><Plus className="size-4" />Have a job description?</span><span className="flex items-center gap-2">Optional<ChevronDown className="size-4" /></span></summary>
      <div className="pt-4"><TextField label="Paste the job description" value={data.target.description} onChange={v => set('description', v)} placeholder="Keep the role’s responsibilities and requirements handy…" multiline maxLength={16000} hint="A private reference for your edits. We don’t add its claims or keywords to your resume automatically." /></div>
    </details>
    <Tip title="Tailored to the role. True to you.">Highlight the experience that matters for this role—not every keyword in the job description. Your real story is your strongest starting point.</Tip>
  </FieldGroup>
}

export function ContactStep({ data, update, errors }: Props) {
  const set = (key: keyof Resume['contact'], value: string) => update({ ...data, contact: { ...data.contact, [key]: value } })
  return <FieldGroup>
    <TextField label="Full name" value={data.contact.name} onChange={v => set('name', v)} autoComplete="name" placeholder="Your professional name" error={errors['contact.name']} />
    <TextField label="Professional email" value={data.contact.email} onChange={v => set('email', v)} autoComplete="email" type="email" placeholder="you@example.com" error={errors['contact.email']} />
    <FieldGroup className="field-columns"><TextField label="Phone" value={data.contact.phone} onChange={v => set('phone', v)} autoComplete="tel" type="tel" optional placeholder="Include country code" /><TextField label="City / country" value={data.contact.location} onChange={v => set('location', v)} optional placeholder="e.g. London, UK" hint="No street address needed." /></FieldGroup>
    <TextField label="LinkedIn profile" value={data.contact.linkedin} onChange={v => set('linkedin', v)} type="url" optional placeholder="https://linkedin.com/in/yourname" error={errors['contact.linkedin']} />
    <TextField label="Portfolio or GitHub" value={data.contact.portfolio} onChange={v => set('portfolio', v)} type="url" optional placeholder="https://your-portfolio.com" error={errors['contact.portfolio']} />
    <Tip title="Just the essentials">A name, professional email, and a way to see your work are enough. Leave out your photo, age, and sensitive personal identifiers.</Tip>
  </FieldGroup>
}

export function ExperienceStep({ data, update, errors, remove }: Props) {
  const [helper, setHelper] = useState<string | null>(null)
  const set = (id: string, patch: Partial<Resume['experience'][number]>) => update({ ...data, experience: data.experience.map(w => w.id === id ? { ...w, ...patch } : w) })
  return <FieldGroup>
    {data.experience.length === 0 && <div className="empty-entry"><span className="empty-icon"><BriefcaseBusiness /></span><h3>Every kind of experience counts.</h3><p>Internships, part-time jobs, freelance work, and campus roles all belong here. Just starting out? You can skip this step.</p></div>}
    {data.experience.map((w, index) => {
      const p = `experience.${w.id}`
      return <EntryCard key={w.id} title={w.title || `Experience ${index + 1}`} subtitle="Most recent roles appear first on your resume." onRemove={() => remove({ ...data, experience: data.experience.filter(e => e.id !== w.id) }, 'Role removed')}>
        <TextField label="Role title" value={w.title} onChange={v => set(w.id, { title: v })} placeholder="e.g. Marketing Intern" error={errors[`${p}.title`]} />
        <FieldGroup className="field-columns"><TextField label="Employer / organization" value={w.employer} onChange={v => set(w.id, { employer: v })} error={errors[`${p}.employer`]} /><TextField label="Location" value={w.location} onChange={v => set(w.id, { location: v })} optional placeholder="City or Remote" /></FieldGroup>
        <FieldGroup className="field-columns"><TextField label="Start date" type="month" value={w.start} onChange={v => set(w.id, { start: v })} error={errors[`${p}.start`]} /><TextField label="End date" type="month" value={w.end} onChange={v => set(w.id, { end: v })} disabled={w.current} error={errors[`${p}.end`]} /></FieldGroup>
        <label className="checkbox-label"><input type="checkbox" checked={w.current} onChange={e => set(w.id, { current: e.target.checked })} />I currently work here</label>
        <FieldSet><FieldLegend variant="label">Your impact <span className="optional-label">2–4 concise bullets</span></FieldLegend>
          {w.bullets.map((bullet, i) => <div className="bullet-editor" key={`${w.id}-${i}`}>
            <TextField label={`Achievement ${i + 1}`} value={bullet} onChange={v => set(w.id, { bullets: w.bullets.map((b, j) => i === j ? v : b) })} multiline maxLength={1400} placeholder="What did you do, and what changed?" />
            <div className="bullet-actions"><Button type="button" variant="link" size="sm" onClick={() => setHelper(helper === `${w.id}-${i}` ? null : `${w.id}-${i}`)}><Sparkles data-icon="inline-start" />Make this stronger</Button>{w.bullets.length > 2 && <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove achievement ${i + 1}`} onClick={() => { setHelper(null); remove({ ...data, experience: data.experience.map(e => e.id === w.id ? { ...e, bullets: e.bullets.filter((_, j) => j !== i) } : e) }, 'Bullet removed') }}><X /></Button>}</div>
            {helper === `${w.id}-${i}` && <BulletHelper key={`${w.id}-${i}`} original={bullet} onClose={() => setHelper(null)} onApply={v => { set(w.id, { bullets: w.bullets.map((b, j) => i === j ? v : b) }); setHelper(null) }} />}
          </div>)}
          {errors[`${p}.bullets`] && <FieldError>{errors[`${p}.bullets`]}</FieldError>}
          {w.bullets.length < 4 && <Button variant="outline" type="button" size="sm" onClick={() => set(w.id, { bullets: [...w.bullets, ''] })}><Plus data-icon="inline-start" />Add a bullet</Button>}
        </FieldSet>
      </EntryCard>
    })}
    <AddButton onClick={() => update({ ...data, experience: [...data.experience, newWork()] })} disabled={data.experience.length >= 30}>Add experience</AddButton>
    <Tip title="Make your impact concrete">Instead of “Helped run events,” try “Coordinated 3 campus events for 120 attendees.” This is an example, not a claim about you—only use numbers you can stand behind.</Tip>
  </FieldGroup>
}

export function EducationStep({ data, update, errors, remove }: Props) {
  const set = (id: string, patch: Partial<Resume['education'][number]>) => update({ ...data, education: data.education.map(e => e.id === id ? { ...e, ...patch } : e) })
  return <FieldGroup>
    {data.education.length === 0 && <div className="empty-entry"><span className="empty-icon"><GraduationCap /></span><h3>Your foundation, in a few lines.</h3><p>Add a degree, diploma, or school program. Still studying? An expected graduation date is welcome.</p></div>}
    {data.education.map((e, i) => {
      const p = `education.${e.id}`
      return <EntryCard key={e.id} title={e.school || `Education ${i + 1}`} onRemove={() => remove({ ...data, education: data.education.filter(v => v.id !== e.id) }, 'Education removed')}>
        <TextField label="School / institution" value={e.school} onChange={v => set(e.id, { school: v })} error={errors[`${p}.school`]} />
        <TextField label="Degree / field of study" value={e.degree} onChange={v => set(e.id, { degree: v })} placeholder="e.g. B.S. in Computer Science" error={errors[`${p}.degree`]} />
        <TextField label="Location" value={e.location} onChange={v => set(e.id, { location: v })} optional />
        <FieldGroup className="field-columns"><TextField label="Start date" type="month" value={e.start} onChange={v => set(e.id, { start: v })} optional error={errors[`${p}.start`]} /><TextField label="Graduation / expected" type="month" value={e.end} onChange={v => set(e.id, { end: v })} optional error={errors[`${p}.end`]} /></FieldGroup>
        <FieldGroup className="field-columns"><TextField label="GPA" value={e.gpa} onChange={v => set(e.id, { gpa: v })} optional placeholder="e.g. 3.7 / 4.0" maxLength={50} /><TextField label="Honors" value={e.honors} onChange={v => set(e.id, { honors: v })} optional /></FieldGroup>
        <TextField label="Relevant coursework" value={e.coursework} onChange={v => set(e.id, { coursework: v })} optional placeholder="A few courses that connect to your target role" />
      </EntryCard>
    })}
    <AddButton onClick={() => update({ ...data, education: [...data.education, newEducation()] })} disabled={data.education.length >= 20}>Add education</AddButton>
    <Tip title="Keep the relevant details">GPA, honors, and coursework are optional. If you’re a student, we place education before experience. For other career stages, experience comes first.</Tip>
  </FieldGroup>
}

export function SkillsStep({ data, update, errors, remove }: Props) {
  const setSkill = (id: string, patch: Partial<Resume['skills'][number]>) => update({ ...data, skills: data.skills.map(s => s.id === id ? { ...s, ...patch } : s) })
  const setCredential = (id: string, patch: Partial<Resume['credentials'][number]>) => update({ ...data, credentials: data.credentials.map(c => c.id === id ? { ...c, ...patch } : c) })
  const setExtra = (id: string, patch: Partial<Extra>) => update({ ...data, extras: data.extras.map(e => e.id === id ? { ...e, ...patch } : e) })
  return <FieldGroup>
    <div className="section-intro"><h3>Skills you can put to work</h3><p>Group a few relevant skills by category. Everything here is optional.</p></div>
    {data.skills.map((s, i) => <EntryCard key={s.id} title={s.category || `Skill group ${i + 1}`} onRemove={() => remove({ ...data, skills: data.skills.filter(v => v.id !== s.id) }, 'Skill group removed')}>
      <TextField label="Category" value={s.category} onChange={v => setSkill(s.id, { category: v })} placeholder="e.g. Technical skills, Design, Tools" error={errors[`skills.${s.id}.category`]} />
      <TextField label="Skills" value={s.items} onChange={v => setSkill(s.id, { items: v })} placeholder="e.g. Python, SQL, Excel" hint="Separate skills with commas. Only include skills you can demonstrate." error={errors[`skills.${s.id}.items`]} maxLength={1000} />
    </EntryCard>)}
    <AddButton onClick={() => update({ ...data, skills: [...data.skills, newSkill()] })} disabled={data.skills.length >= 30}>Add a skill group</AddButton>
    <div className="section-intro section-divider"><h3>Credentials & training</h3><p>Have a relevant certificate or course? Add the exact name and provider.</p></div>
    {data.credentials.map((c, i) => <EntryCard key={c.id} title={c.name || `Credential ${i + 1}`} onRemove={() => remove({ ...data, credentials: data.credentials.filter(v => v.id !== c.id) }, 'Credential removed')}>
      <TextField label="Certificate / course name" value={c.name} onChange={v => setCredential(c.id, { name: v })} error={errors[`credentials.${c.id}.name`]} />
      <TextField label="Issuing organization" value={c.organization} onChange={v => setCredential(c.id, { organization: v })} placeholder="e.g. Google, Microsoft, Amazon/AWS" hint="Examples only—not affiliations or credentials added for you." error={errors[`credentials.${c.id}.organization`]} />
      <FieldGroup className="field-columns"><TextField label="Date earned" type="month" value={c.date} onChange={v => setCredential(c.id, { date: v })} optional error={errors[`credentials.${c.id}.date`]} /><TextField label="Credential ID" value={c.credentialId} onChange={v => setCredential(c.id, { credentialId: v })} optional /></FieldGroup>
      <TextField label="Credential link" type="url" value={c.link} onChange={v => setCredential(c.id, { link: v })} optional placeholder="https://…" error={errors[`credentials.${c.id}.link`]} />
    </EntryCard>)}
    <AddButton onClick={() => update({ ...data, credentials: [...data.credentials, newCredential()] })} disabled={data.credentials.length >= 30}>Add a credential</AddButton>
    <div className="section-intro section-divider"><h3>A little more of your story</h3><p>Choose what adds value. Leave the rest out.</p></div>
    {data.extras.map((e, i) => <EntryCard key={e.id} title={e.name || `${e.kind} ${i + 1}`} subtitle={e.kind} onRemove={() => remove({ ...data, extras: data.extras.filter(v => v.id !== e.id) }, `${e.kind} entry removed`)}>
      <TextField label={e.kind === 'Languages' ? 'Language' : 'Name / title'} value={e.name} onChange={v => setExtra(e.id, { name: v })} error={errors[`extras.${e.id}.name`]} />
      {e.kind !== 'Languages' && <><TextField label="Organization / context" value={e.organization} onChange={v => setExtra(e.id, { organization: v })} optional /><FieldGroup className="field-columns"><TextField label="Date" type="month" value={e.date} onChange={v => setExtra(e.id, { date: v })} optional error={errors[`extras.${e.id}.date`]} /><TextField label="Link" type="url" value={e.link} onChange={v => setExtra(e.id, { link: v })} optional placeholder="https://…" error={errors[`extras.${e.id}.link`]} /></FieldGroup></>}
      <TextField label={e.kind === 'Languages' ? 'Proficiency' : 'Details / achievements'} value={e.description} onChange={v => setExtra(e.id, { description: v })} optional multiline={e.kind !== 'Languages'} placeholder={e.kind === 'Languages' ? 'e.g. Native, conversational, professional working' : 'Describe your contribution. One concise point per line.'} maxLength={2000} />
    </EntryCard>)}
    <div className="optional-sections">{(['Projects', 'Awards', 'Volunteering', 'Languages'] as const).map(kind => <Button key={kind} variant="outline" type="button" onClick={() => update({ ...data, extras: [...data.extras, newExtra(kind)] })} disabled={data.extras.length >= 40}><Plus data-icon="inline-start" />{kind}</Button>)}</div>
    <Tip title="Specific beats exhaustive">A short list of skills you’ve actually used tells a stronger story than a long list of buzzwords. No credentials? No problem—skip them.</Tip>
  </FieldGroup>
}
