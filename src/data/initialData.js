export const LONG_FORM_STAGES = [
  { id: 'idea', label: 'Idea', color: 'var(--status-idea)' },
  { id: 'scheduled-shoot', label: 'Shoot Scheduled', color: 'var(--status-scheduled)' },
  { id: 'production', label: 'In Production', color: 'var(--status-production)' },
  { id: 'editing', label: 'Editing', color: 'var(--status-editing)' },
  { id: 'review', label: 'Review', color: 'var(--status-review)' },
  { id: 'scheduled-release', label: 'Scheduled', color: 'var(--status-ready)' },
  { id: 'published', label: 'Published', color: 'var(--status-published)' },
]

export const SHORT_FORM_STAGES = [
  { id: 'idea', label: 'Idea', color: 'var(--status-idea)' },
  { id: 'shoot', label: 'Shoot', color: 'var(--status-scheduled)' },
  { id: 'edit', label: 'Edit', color: 'var(--status-editing)' },
  { id: 'scheduled', label: 'Scheduled', color: 'var(--status-ready)' },
  { id: 'published', label: 'Published', color: 'var(--status-published)' },
]

export const STATIC_POST_STAGES = [
  { id: 'static-idea', label: 'Idea', color: 'var(--status-idea)' },
  { id: 'static-design', label: 'Design', color: 'var(--status-scheduled)' },
  { id: 'static-copy', label: 'Copy', color: 'var(--status-production)' },
  { id: 'static-review', label: 'Review', color: 'var(--status-review)' },
  { id: 'static-scheduled', label: 'Scheduled', color: 'var(--status-ready)' },
  { id: 'published', label: 'Published', color: 'var(--status-published)' },
]

export const CONTENT_TAGS = [
  'tournament',
  'highlights',
  'behind-scenes',
  'tutorial',
  'interview',
  'promo',
  'recap',
  'announcement',
  'collab',
]

export const TEAM_MEMBERS = [
  'Clay',
  'Anthony',
  'Cole',
  'Reagan',
  'Shane',
  'Liam',
  'Franco',
  'Felipe',
  'Zach',
  'Liane',
  'Serge',
]

export const ACCESS_CODES = ['plhq2026', 'peoples2026', 'plhq']

export const initialData = {
  content: [],
  ideas: [],
  team: TEAM_MEMBERS,
  settings: {
    defaultView: 'pipeline',
  },
}
