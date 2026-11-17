'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import { contactLine, getSections, type Resume } from '@/lib/resume'

Font.registerHyphenationCallback(word => [word])
const styles = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 42, paddingHorizontal: 44, fontFamily: 'Helvetica', fontSize: 10.5, lineHeight: 1.4, color: '#20242b' },
  name: { fontSize: 24, fontFamily: 'Helvetica-Bold', lineHeight: 1.2, marginBottom: 7 },
  contact: { fontSize: 9, lineHeight: 1.45, marginBottom: 12 },
  heading: { fontFamily: 'Helvetica-Bold', fontSize: 14, marginTop: 13, marginBottom: 7, borderBottomWidth: 0.6, borderBottomColor: '#aeb2b8', paddingBottom: 4 },
  entry: { marginBottom: 8 },
  title: { fontFamily: 'Helvetica-Bold', fontSize: 11, marginBottom: 1 },
  detail: { marginBottom: 1 },
  date: { fontSize: 9, color: '#4b5059', marginBottom: 3 },
  bullet: { marginLeft: 9, marginBottom: 3 },
  line: { marginBottom: 2 },
  sample: { color: '#52525b', fontSize: 9, marginBottom: 9 },
  pageNumber: { position: 'absolute', bottom: 22, right: 44, fontSize: 8, color: '#666' },
})

export function ResumeDocument({ data }: { data: Resume }) {
  return <Document title={`${data.contact.name.trim()} — Resume`} author={data.contact.name.trim()} subject="Professional resume" creator="Career Canvas" language="en">
    <Page size="A4" style={styles.page} wrap>
      {data.fictional && <Text style={styles.sample}>Fictional sample — replace with your own facts</Text>}
      <View minPresenceAhead={65}>
        {data.contact.name.trim() && <Text style={styles.name}>{data.contact.name.trim()}</Text>}
        {contactLine(data) && <Text style={styles.contact}>{contactLine(data)}</Text>}
      </View>
      {getSections(data).map(section => <View key={section.heading}>
        <Text style={styles.heading} minPresenceAhead={65}>{section.heading}</Text>
        {section.entries.map((entry, i) => <View key={i} style={styles.entry}>
          {entry.title && <Text style={styles.title} minPresenceAhead={28}>{entry.title}</Text>}
          {entry.detail && <Text style={styles.detail} minPresenceAhead={18}>{entry.detail}</Text>}
          {entry.date && <Text style={styles.date} minPresenceAhead={14}>{entry.date}</Text>}
          {entry.lines?.map((line, j) => <Text key={j} style={styles.line} orphans={2} widows={2}>{line}</Text>)}
          {entry.bullets?.map((bullet, j) => <Text key={j} style={styles.bullet} orphans={2} widows={2}>• {bullet}</Text>)}
        </View>)}
      </View>)}
      <Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => totalPages > 1 ? `${pageNumber} / ${totalPages}` : ''} />
    </Page>
  </Document>
}

export async function downloadResume(data: Resume) {
  const blob = await pdf(<ResumeDocument data={data} />).toBlob()
  const name = data.contact.name.trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '_').slice(0, 100) || 'My'
  const filename = `${name}_Resume.pdf`
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60000)
  return filename
}
