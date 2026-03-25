function Dashboard() {
  return (
    <main className="dashboard-page">
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h1>YapHub</h1>
          <p>Chats</p>
        </div>

        <nav className="conversation-list">
          <button className="conversation-item active" type="button">
            <span className="conversation-name">Alex Carter</span>
            <span className="conversation-preview">See you in five.</span>
          </button>
          <button className="conversation-item" type="button">
            <span className="conversation-name">Maya Stone</span>
            <span className="conversation-preview">Sent a photo</span>
          </button>
          <button className="conversation-item" type="button">
            <span className="conversation-name">Jordan Lee</span>
            <span className="conversation-preview">Typing...</span>
          </button>
        </nav>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <h2>Alex Carter</h2>
            <p>Online now</p>
          </div>
        </header>

        <div className="chat-messages">
          <article className="message-row">
            <div className="message-bubble incoming">
              Want to grab coffee before the meeting?
            </div>
          </article>
          <article className="message-row outgoing-row">
            <div className="message-bubble outgoing">
              Yes. I will be there in ten minutes.
            </div>
          </article>
          <article className="message-row">
            <div className="message-bubble incoming">Perfect. See you in five.</div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
