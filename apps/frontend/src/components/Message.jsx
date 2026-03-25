function Message({ message, onDelete }) {
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
  const isOwnMessage = message.senderId === currentUser?.id
  const isAIMessage = message.senderId === 'ai'
  const canDelete = isOwnMessage && typeof onDelete === 'function'

  return (
    <div className={`message-row ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`message-stack ${isOwnMessage ? 'own' : 'other'}`}>
        {isAIMessage && (
          <span className="message-label">AI</span>
        )}

        <div
          className={`message-bubble ${
            isOwnMessage
              ? 'message-bubble-own'
              : 'message-bubble-other'
          }`}
        >
          {message.content}
        </div>

        {canDelete && (
          <button
            className="message-delete-button"
            type="button"
            onClick={() => onDelete(message.id)}
            aria-label="Delete message"
            title="Delete message"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}

export default Message
