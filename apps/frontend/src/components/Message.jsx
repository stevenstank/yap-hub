function Message({ message, currentUserId, onDelete }) {
  const isOwnMessage = message.senderId === currentUserId

  return (
    <article className={`message-row${isOwnMessage ? ' outgoing-row' : ''}`}>
      <div className="message-card">
        <div
          className={`message-bubble ${isOwnMessage ? 'outgoing' : 'incoming'}`}
        >
          {message.content}
        </div>
        {isOwnMessage ? (
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
