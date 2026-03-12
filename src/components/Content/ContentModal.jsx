import { Modal } from '../shared/Modal'
import { ContentForm } from './ContentForm'

export function ContentModal({ isOpen, content, team, onSave, onDelete, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={content?.id ? 'Edit Content' : 'New Content'}
      size="md"
    >
      <ContentForm
        content={content}
        team={team}
        onSave={onSave}
        onDelete={onDelete}
        onClose={onClose}
      />
    </Modal>
  )
}
