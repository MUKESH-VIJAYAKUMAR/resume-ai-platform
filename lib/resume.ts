import { z } from 'zod'

const text = z.string().max(20000)
const identified = { id: z.string() }
const workSchema = z.object({ ...identified, title: text, employer: text, location: text, start: text, end: text, current: z.boolean(), bullets: z.array(text).max(4) })
const educationSchema = z.object({ ...identified, school: text, degree: text, location: text, start: text, end: text, gpa: text, honors: text, coursework: text })
const skillSchema = z.object({ ...identified, category: text, items: text })
const credentialSchema = z.object({ ...identified, name: text, organization: text, date: text, link: text, credentialId: text })
const extraSchema = z.object({ ...identified, kind: z.enum(['Projects', 'Awards', 'Volunteering', 'Languages']), name: text, organization: text, date: text, link: text, description: text })
export const resumeSchema = z.object({
  fictional: z.boolean(),
  target: z.object({ role: text, industry: text, level: z.enum(['', 'student', 'early', 'experienced']), description: text }),
  contact: z.object({ name: text, email: text, phone: text, location: text, linkedin: text, portfolio: text }),
  experience: z.array(workSchema).max(30), education: z.array(educationSchema).max(20),
  skills: z.array(skillSchema).max(30), credentials: z.array(credentialSchema).max(30), extras: z.array(extraSchema).max(40),
})
export type Resume = z.infer<typeof resumeSchema>
export type Work = Resume['experience'][number]
export type Education = Resume['education'][number]
export type SkillGroup = Resume['skills'][number]
export type Credential = Resume['credentials'][number]
export type Extra = Resume['extras'][number]
export type Errors = Record<string, string>
export const STORAGE_KEY = 'career-canvas-draft-v1'
export const steps = [
  { title: 'Your direction', subtitle: 'The role you have in mind', short: 'Target role' },
  { title: 'The basics', subtitle: 'How to reach you', short: 'Contact' },
  { title: 'Your experience', subtitle: 'What you bring to the table', short: 'Experience' },
  { title: 'Your education', subtitle: 'Where you built your foundation', short: 'Education' },
  { title: 'Skills & more', subtitle: 'The things that make you, you', short: 'Skills & credentials' },
  { title: 'Review & download', subtitle: 'Make your next move', short: 'Review' },
]
export function emptyResume(): Resume {
  return { fictional: false, target: { role: '', industry: '', level: '', description: '' }, contact: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' }, experience: [], education: [], skills: [], credentials: [], extras: [] }
}
export const newWork = (): Work => ({ id: crypto.randomUUID(), title: '', employer: '', location: '', start: '', end: '', current: false, bullets: ['', ''] })
export const newEducation = (): Education => ({ id: crypto.randomUUID(), school: '', degree: '', location: '', start: '', end: '', gpa: '', honors: '', coursework: '' })
export const newSkill = (): SkillGroup => ({ id: crypto.randomUUID(), category: '', items: '' })
export const newCredential = (): Credential => ({ id: crypto.randomUUID(), name: '', organization: '', date: '', link: '', credentialId: '' })
export const newExtra = (kind: Extra['kind']): Extra => ({ id: crypto.randomUUID(), kind, name: '', organization: '', date: '', link: '', description: '' })
export const hasText = (s: string) => Boolean(s.trim())
export const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
export const validUrl = (s: string) => { try { const u = new URL(s.trim()); return ['https:', 'http:'].includes(u.protocol) && u.hostname.includes('.') } catch { return false } }
export function formatDate(value: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return ''
  const [year, month] = value.split('-')
  return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(month) - 1]} ${year}`
}
export const dateRange = (start: string, end: string, current = false) => [formatDate(start), current ? 'Present' : formatDate(end)].filter(Boolean).join(' – ')
export function validateStep(data: Resume, step: number): Errors {
  const errors: Errors = {}
  const required = (key: string, val: string, label: string) => { if (!hasText(val)) errors[key] = `Add ${label}.` }
  const url = (key: string, val: string) => { if (hasText(val) && !validUrl(val)) errors[key] = 'Use a full link starting with https:// or http://.' }
  const date = (key: string, val: string) => { if (hasText(val) && (!formatDate(val) || Number(val.slice(0, 4)) < 1900 || Number(val.slice(0, 4)) > 2100)) errors[key] = 'Use a month and year between 1900 and 2100.' }
  const range = (prefix: string, start: string, end: string, current = false) => {
    date(`${prefix}.start`, start); if (!current) date(`${prefix}.end`, end)
    if (!current && start && end && end < start) errors[`${prefix}.end`] = 'End date must be on or after the start date.'
  }
  if (step === 0) {
    required('target.role', data.target.role, 'a target role')
    required('target.industry', data.target.industry, 'a field or industry')
    required('target.level', data.target.level, 'your experience level')
  }
  if (step === 1) {
    required('contact.name', data.contact.name, 'your full name')
    if (!validEmail(data.contact.email)) errors['contact.email'] = 'Add a valid professional email address.'
    url('contact.linkedin', data.contact.linkedin); url('contact.portfolio', data.contact.portfolio)
  }
  if (step === 2) data.experience.forEach((w) => {
    const p = `experience.${w.id}`
    required(`${p}.title`, w.title, 'a role title'); required(`${p}.employer`, w.employer, 'an employer or organization')
    required(`${p}.start`, w.start, 'a start date'); if (!w.current) required(`${p}.end`, w.end, 'an end date, or select current role')
    range(p, w.start, w.end, w.current)
    if (w.start && w.start > new Date().toISOString().slice(0, 7)) errors[`${p}.start`] = 'Experience should describe work you have already started.'
    if (!w.current && w.end && w.end > new Date().toISOString().slice(0, 7)) errors[`${p}.end`] = 'Use an actual end date, or select current role.'
    if (w.bullets.filter(hasText).length < 2) errors[`${p}.bullets`] = 'Add at least two truthful bullets, or remove this role for now.'
  })
  if (step === 3) data.education.forEach((e) => {
    const p = `education.${e.id}`
    required(`${p}.school`, e.school, 'a school'); required(`${p}.degree`, e.degree, 'a degree or field of study')
    range(p, e.start, e.end)
  })
  if (step === 4) {
    data.skills.forEach((s) => { required(`skills.${s.id}.category`, s.category, 'a skill category'); required(`skills.${s.id}.items`, s.items, 'skills you can demonstrate') })
    data.credentials.forEach((c) => { required(`credentials.${c.id}.name`, c.name, 'a certificate or training name'); required(`credentials.${c.id}.organization`, c.organization, 'the issuing organization'); date(`credentials.${c.id}.date`, c.date); url(`credentials.${c.id}.link`, c.link) })
    data.extras.forEach((e) => { required(`extras.${e.id}.name`, e.name, 'a name'); date(`extras.${e.id}.date`, e.date); url(`extras.${e.id}.link`, e.link) })
  }
  return errors
}
export type ResumeEntry = { title: string; detail?: string; date?: string; lines?: string[]; bullets?: string[] }
export type ResumeSection = { heading: string; step: number; entries: ResumeEntry[] }
export function getSections(d: Resume): ResumeSection[] {
  const work = [...d.experience].sort((a, b) => (b.current ? '9999' : b.end || b.start).localeCompare(a.current ? '9999' : a.end || a.start))
  const edu = [...d.education].sort((a, b) => (b.end || b.start).localeCompare(a.end || a.start))
  const sections: ResumeSection[] = [
    { heading: 'Experience', step: 2, entries: work.filter(w => [w.title, w.employer, ...w.bullets].some(hasText)).map(w => ({ title: w.title.trim(), detail: [w.employer, w.location].filter(hasText).join(' · '), date: dateRange(w.start, w.end, w.current), bullets: w.bullets.map(b => b.trim()).filter(Boolean) })) },
    { heading: 'Education', step: 3, entries: edu.filter(e => [e.school, e.degree].some(hasText)).map(e => ({ title: e.school.trim(), detail: [e.degree, e.location].filter(hasText).join(' · '), date: dateRange(e.start, e.end), lines: [e.gpa && `GPA: ${e.gpa}`, e.honors && `Honors: ${e.honors}`, e.coursework && `Relevant coursework: ${e.coursework}`].filter(Boolean) })) },
    { heading: 'Skills', step: 4, entries: d.skills.filter(s => hasText(s.items)).map(s => ({ title: s.category.trim(), lines: [s.items.trim()] })) },
    { heading: 'Certifications & Training', step: 4, entries: d.credentials.filter(c => hasText(c.name)).map(c => ({ title: c.name.trim(), detail: c.organization.trim(), date: formatDate(c.date), lines: [c.credentialId && `Credential ID: ${c.credentialId}`, c.link].filter(hasText) })) },
    ...(['Projects', 'Awards', 'Volunteering', 'Languages'] as const).map(kind => ({ heading: kind, step: 4, entries: d.extras.filter(e => e.kind === kind && hasText(e.name)).map(e => ({ title: e.name.trim(), detail: e.organization.trim(), date: formatDate(e.date), lines: [e.link].filter(hasText), bullets: e.description.split('\n').map(s => s.trim()).filter(Boolean) })) })),
  ]
  if (d.target.level === 'student') [sections[0], sections[1]] = [sections[1], sections[0]]
  return sections.filter(s => s.entries.length)
}
export const contactLine = (d: Resume) => [d.contact.email, d.contact.phone, d.contact.location, d.contact.linkedin, d.contact.portfolio].map(s => s.trim()).filter(Boolean).join('  |  ')
export function getReadiness(d: Resume) {
  return [
    { label: 'A clear target role', detail: 'A direction to tailor your true experience toward.', done: Object.keys(validateStep(d, 0)).length === 0, step: 0 },
    { label: 'Contact details are ready', detail: 'Your name and a professional email address.', done: Object.keys(validateStep(d, 1)).length === 0, step: 1 },
    { label: 'Readable, relevant sections', detail: 'Education, experience, skills, or projects to build on.', done: getSections(d).length > 0, step: 3 },
    { label: d.experience.length ? 'Specific experience bullets' : 'Experience is optional', detail: d.experience.length ? 'Two to four factual bullets for each role.' : 'Starting out? Education and projects count, too.', done: !d.experience.length || Object.keys(validateStep(d, 2)).length === 0, step: 2 },
  ]
}
export function sampleResume(): Resume {
  return {
    fictional: true,
    target: { role: 'Product Designer', industry: 'Technology & digital products', level: 'early', description: '' },
    contact: { name: 'Alex Morgan', email: 'alex.morgan@example.com', phone: '', location: 'Portland, OR', linkedin: '', portfolio: 'https://example.com/alex' },
    experience: [{ id: crypto.randomUUID(), title: 'Design Intern', employer: 'Northstar Studio (fictional)', location: 'Portland, OR', start: '2025-06', end: '2025-09', current: false, bullets: ['Redesigned the onboarding flow for a student budgeting app, reducing the prototype from 8 screens to 5.', 'Conducted 12 usability sessions and summarized findings to guide the next design iteration.', 'Created a reusable library of 24 interface components in Figma for the design team.'] }],
    education: [{ id: crypto.randomUUID(), school: 'Cascade University (fictional)', degree: 'B.A. in Interaction Design', location: 'Portland, OR', start: '2022-09', end: '2026-06', gpa: '', honors: "Dean’s List, 2024–2025", coursework: 'Human-computer interaction, accessibility, visual design' }],
    skills: [{ id: crypto.randomUUID(), category: 'Design', items: 'User research, wireframing, prototyping, accessibility' }, { id: crypto.randomUUID(), category: 'Tools', items: 'Figma, FigJam, Adobe Illustrator' }], credentials: [],
    extras: [{ id: crypto.randomUUID(), kind: 'Projects', name: 'Campus Connect', organization: 'Independent student project', date: '2025-03', link: '', description: 'Designed a campus event discovery prototype and tested it with 8 students to improve navigation.' }],
  }
}
