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
  { id: 'sf-idea', label: 'Idea', color: 'var(--status-idea)' },
  { id: 'shoot', label: 'Shoot', color: 'var(--status-scheduled)' },
  { id: 'edit', label: 'Edit', color: 'var(--status-editing)' },
  { id: 'scheduled', label: 'Scheduled', color: 'var(--status-ready)' },
  { id: 'sf-published', label: 'Published', color: 'var(--status-published)' },
]

export const STATIC_POST_STAGES = [
  { id: 'sp-idea', label: 'Idea', color: 'var(--status-idea)' },
  { id: 'design', label: 'Design', color: 'var(--status-production)' },
  { id: 'copy', label: 'Copy', color: 'var(--status-editing)' },
  { id: 'sp-review', label: 'Review', color: 'var(--status-review)' },
  { id: 'sp-scheduled', label: 'Scheduled', color: 'var(--status-ready)' },
  { id: 'sp-published', label: 'Published', color: 'var(--status-published)' },
]

export function getStagesForType(type) {
  if (type === 'long-form') return LONG_FORM_STAGES
  if (type === 'short-form') return SHORT_FORM_STAGES
  if (type === 'static-post') return STATIC_POST_STAGES
  return LONG_FORM_STAGES
}

export function getFirstStageForType(type) {
  return getStagesForType(type)[0].id
}

export const CONTENT_TAGS = [
  // Season/Event
  '2025 Championship',
  '2026 Peoples League Tour',
  'Event 1 (Whirlwind)',
  'Event 2 (Tahoe)',
  'Event 3 (French Lick)',
  'Event 4 (Lake of Isles)',
  // Sponsors
  'Liquid I.V.',
  'DraftKings',
  // Content type
  'Golf',
  'Personality',
  'Announcement',
]

export const TAG_GROUPS = [
  {
    label: 'Season / Events',
    tags: [
      '2025 Championship',
      '2026 Peoples League Tour',
      'Event 1 (Whirlwind)',
      'Event 2 (Tahoe)',
      'Event 3 (French Lick)',
      'Event 4 (Lake of Isles)',
    ],
  },
  {
    label: 'Sponsors',
    tags: ['Liquid I.V.', 'DraftKings'],
  },
  {
    label: 'Content',
    tags: ['Golf', 'Personality', 'Announcement'],
  },
]

export const initialData = {
  content: [],
  ideas: [],
  team: [],
  settings: {
    defaultView: 'pipeline',
  },
}
