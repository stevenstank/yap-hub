function Message({ message, currentUserId, onDelete }) {
  const isOwnMessage = message.senderId === currentUserId
  const isAIMessage = message.senderId === 'ai'
  const canDelete = isOwnMessage && typeof onDelete === 'function'

  return (
    <article className={`message-row${isOwnMessage ? ' outgoing-row' : ''}`}>
      <div className="message-card">
        {isAIMessage ? <span className="message-label">AI</span> : null}
        <div
          className={`message-bubble ${
            isOwnMessage ? 'outgoing' : isAIMessage ? 'ai' : 'incoming'
          }`}
        >
          {message.content}
        </div>
        {canDelete ? (
          <button
            className="message-delete-button"
            type="button"
            onClick={() => onDelete(message.id)}
            aria-label="Delete message"
            title="Delete message"
          >
            🗑️
          </button>
        ) : null}
      </div>
    </article>
  )
}

export default Message
