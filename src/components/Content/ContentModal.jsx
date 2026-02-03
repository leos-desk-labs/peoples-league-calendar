import { Modal } from '../shared/Modal'
import { ContentForm } from './ContentForm'

export function ContentModal({ isOpen, content, team, onSave, onDelete, onClose }) {
  const handleSave = (formData) => {
    if (content?.id) {
      onSave(content.id, formData)
    } else {
      onSave(null, formData)
    }
    onClose()
  }

  const handleDelete = (id) => {
    onDelete(id)
    onClose()
  }

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
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={onClose}
      />
    </Modal>
  )
}
