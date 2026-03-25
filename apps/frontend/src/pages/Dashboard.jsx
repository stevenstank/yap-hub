import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios.js'
import Message from '../components/Message.jsx'

function Dashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [sidebarError, setSidebarError] = useState('')
  const [chatError, setChatError] = useState('')

  async function loadUsers() {
    try {
      const response = await axios.get('/users')
      setUsers(response.data)

      if (!selectedUser && response.data[0]) {
        setSelectedUser(response.data[0])
      }
    } catch (requestError) {
      setSidebarError(
        requestError.response?.data?.message || 'Failed to load users'
      )
    }
  }

  async function loadMessages(userId) {
    try {
      setChatError('')
      const response = await axios.get(`/messages/${userId}`)
      setMessages(response.data)
    } catch (requestError) {
      setChatError(
        requestError.response?.data?.message || 'Failed to load messages'
      )
    }
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        const meResponse = await axios.get('/auth/me')

        setCurrentUserId(meResponse.data.id)
        await loadUsers()
      } catch (requestError) {
        setSidebarError(
          requestError.response?.data?.message || 'Failed to load users'
        )
      }
    }

    loadDashboard()
  }, [])

  useEffect(() => {
    async function fetchMessages() {
      if (!selectedUser) {
        setMessages([])
        return
      }

      await loadMessages(selectedUser.id)
    }

    fetchMessages()
  }, [selectedUser])

  useEffect(() => {
    if (!selectedUser) {
      return undefined
    }

    const intervalId = setInterval(() => {
      loadMessages(selectedUser.id)
    }, 4000)

    return () => {
      clearInterval(intervalId)
    }
  }, [selectedUser])

  async function handleSendMessage(event) {
    event.preventDefault()

    if (!selectedUser || !messageInput.trim()) {
      return
    }

    try {
      await axios.post('/messages', {
        receiverId: selectedUser.id,
        content: messageInput,
      })
      setMessageInput('')
      await loadMessages(selectedUser.id)
    } catch (requestError) {
      setChatError(requestError.response?.data?.message || 'Failed to send message')
    }
  }

  async function handleDeleteMessage(messageId) {
    if (!selectedUser) {
      return
    }

    try {
      setChatError('')
      await axios.delete(`/messages/${messageId}`)
      await loadMessages(selectedUser.id)
    } catch (requestError) {
      setChatError(
        requestError.response?.data?.message || 'Failed to delete message'
      )
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <main className="dashboard-page">
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h1>YapHub</h1>
          <p>Users</p>
        </div>

        <nav className="conversation-list">
          {sidebarError ? <p className="sidebar-message">{sidebarError}</p> : null}
          {!sidebarError && users.length === 0 ? (
            <p className="sidebar-message">No users found.</p>
          ) : null}
          {users.map((user) => {
            const isActive = selectedUser?.id === user.id

            return (
              <button
                key={user.id}
                className={`conversation-item${isActive ? ' active' : ''}`}
                type="button"
                onClick={() => setSelectedUser(user)}
              >
                <span className="conversation-name">{user.username}</span>
                <span className="conversation-preview">{user.email}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <h2>{selectedUser?.username || 'Select a user'}</h2>
            <p>{selectedUser?.email || 'Choose someone from the sidebar'}</p>
          </div>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="chat-messages">
          {chatError ? <p className="chat-message-state">{chatError}</p> : null}
          {!chatError && !selectedUser ? (
            <p className="chat-message-state">Select a user to open the chat.</p>
          ) : null}
          {!chatError && selectedUser && messages.length === 0 ? (
            <p className="chat-message-state">No messages yet.</p>
          ) : null}
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              currentUserId={currentUserId}
              onDelete={handleDeleteMessage}
            />
          ))}
        </div>

        <form className="chat-input-bar" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message"
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            disabled={!selectedUser}
          />
          <button type="submit" disabled={!selectedUser || !messageInput.trim()}>
            Send
          </button>
        </form>
      </section>
    </main>
  )
}

export default Dashboard
