'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

interface Template {
  id: string
  icon: string
  name: string
  description: string
  content: string
}

const templates: Template[] = [
  {
    id: 'blank',
    icon: '📄',
    name: 'Blank page',
    description: 'Start from scratch',
    content: '',
  },
  {
    id: 'meeting',
    icon: '📅',
    name: 'Meeting Notes',
    description: 'Capture meeting agenda and action items',
    content: `## Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** 

---

## Agenda
- 
- 
- 

## Discussion

## Action Items
- [ ] 
- [ ] 
- [ ] 

## Next Meeting
**Date:** 
**Topics:** `,
  },
  {
    id: 'project',
    icon: '🎯',
    name: 'Project Plan',
    description: 'Plan and track your project',
    content: `## Project Plan

**Project Name:** 
**Owner:** 
**Due Date:** 

---

## Overview
Brief description of the project...

## Goals
- 
- 
- 

## Milestones
| Milestone | Due Date | Status |
|-----------|----------|--------|
|  |  | 🔵 Not Started |
|  |  | 🔵 Not Started |

## Risks
- 

## Resources
- `,
  },
  {
    id: 'journal',
    icon: '📖',
    name: 'Weekly Journal',
    description: 'Reflect on your week',
    content: `## Weekly Journal

**Week of:** ${new Date().toLocaleDateString()}

---

## What went well? 🎉
- 
- 

## What could be improved? 🔧
- 
- 

## What I learned 💡
- 
- 

## Goals for next week 🎯
- [ ] 
- [ ] 
- [ ] 

## Gratitude 🙏
- `,
  },
  {
    id: 'bugreport',
    icon: '🐛',
    name: 'Bug Report',
    description: 'Document and track bugs',
    content: `## Bug Report

**Date:** ${new Date().toLocaleDateString()}
**Severity:** 🔴 High / 🟡 Medium / 🟢 Low

---

## Description
Brief description of the bug...

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
What should happen...

## Actual Behavior
What actually happens...

## Screenshots
*(Add screenshots here)*

## Environment
- **OS:** 
- **Browser:** 
- **Version:** 

## Possible Fix
*(Optional: suggest a fix)*`,
  },
  {
    id: 'brainstorm',
    icon: '🧠',
    name: 'Brainstorm',
    description: 'Capture and organize ideas',
    content: `## Brainstorm Session

**Topic:** 
**Date:** ${new Date().toLocaleDateString()}

---

## 💡 Ideas
- 
- 
- 
- 
- 

## 🌟 Top Ideas
1. 
2. 
3. 

## ❌ Ideas to Discard
- 

## Next Steps
- [ ] 
- [ ] `,
  },
]

interface Props {
  onSelect: (template: Template) => void
  onClose: () => void
}

export default function TemplatesModal({ onSelect, onClose }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '560px', background: 'var(--bg-secondary)',
        borderRadius: '12px', border: '1px solid var(--border)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)', overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
              New page
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Choose a template to get started
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'flex', padding: '4px', borderRadius: '4px',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <X size={15} />
          </button>
        </div>

        {/* Templates grid */}
        <div style={{
          padding: '16px', display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px',
          maxHeight: '440px', overflowY: 'auto',
        }}>
          {templates.map(template => (
            <div
              key={template.id}
              onClick={() => onSelect(template)}
              onMouseEnter={() => setHovered(template.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '16px 14px', borderRadius: '8px', cursor: 'pointer',
                border: `1px solid ${hovered === template.id ? 'var(--accent-purple)' : 'var(--border)'}`,
                background: hovered === template.id ? 'rgba(155,138,251,0.06)' : 'var(--bg-active)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{template.icon}</div>
              <p style={{
                fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)',
                marginBottom: '4px',
              }}>
                {template.name}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: '1.4' }}>
                {template.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}