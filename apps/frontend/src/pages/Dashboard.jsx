import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import Message from '../components/Message.jsx'

const aiUser = {
  id: 'ai',
  username: 'YapHub AI',
  isAI: true,
}

function Dashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [aiMessages, setAiMessages] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [sidebarError, setSidebarError] = useState('')
  const [chatError, setChatError] = useState('')
  const isAIChat = selectedUser?.id === aiUser.id

  async function loadUsers() {
    try {
      setSidebarError('')
      const res = await api.get('/users')
      const currentUser = JSON.parse(localStorage.getItem('user'))
      const filteredUsers = res.data.filter((user) => user.id !== currentUser?.id)
      const finalUsers = [aiUser, ...filteredUsers]

      setUsers(finalUsers)

      if (selectedUser && !finalUsers.some((user) => user.id === selectedUser.id)) {
        setSelectedUser(null)
      }

      if (!selectedUser && finalUsers[0]) {
        setSelectedUser(finalUsers[0])
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
      const res = await api.get(`/messages/${userId}`)
      setMessages(res.data)
    } catch (requestError) {
      setChatError(
        requestError.response?.data?.message || 'Failed to load messages'
      )
    }
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        const meResponse = await api.get('/auth/me')

        setCurrentUserId(meResponse.data.id)
        localStorage.setItem('user', JSON.stringify(meResponse.data))
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

      if (selectedUser.id === aiUser.id) {
        setChatError('')
        return
      }

      await loadMessages(selectedUser.id)
    }

    fetchMessages()
  }, [selectedUser])

  useEffect(() => {
    if (!selectedUser || selectedUser.id === aiUser.id) {
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

    const trimmedMessage = messageInput.trim()

    try {
      setChatError('')

      if (selectedUser.id === aiUser.id) {
        const userMessage = {
          id: `ai-user-${Date.now()}`,
          content: trimmedMessage,
          senderId: currentUserId,
        }

        setAiMessages((current) => [...current, userMessage])
        setMessageInput('')

        const response = await api.post('/ai', {
          message: trimmedMessage,
        })

        const aiReply = {
          id: `ai-reply-${Date.now()}`,
          content: response.data.reply,
          senderId: aiUser.id,
        }

        setAiMessages((current) => [...current, aiReply])
        return
      }

      await api.post('/messages', {
        receiverId: selectedUser.id,
        content: trimmedMessage,
      })
      setMessageInput('')
      await loadMessages(selectedUser.id)
    } catch (requestError) {
      if (selectedUser.id === aiUser.id) {
        const fallbackReply = {
          id: `ai-reply-fallback-${Date.now()}`,
          content: 'Something broke, but I am still here 👀',
          senderId: aiUser.id,
        }

        setAiMessages((current) => [...current, fallbackReply])
        return
      }

      setChatError(requestError.response?.data?.message || 'Failed to send message')
    }
  }

  async function handleDeleteMessage(messageId) {
    if (!selectedUser || selectedUser.id === aiUser.id) {
      return
    }

    try {
      setChatError('')
      await api.delete(`/messages/${messageId}`)
      await loadMessages(selectedUser.id)
    } catch (requestError) {
      setChatError(
        requestError.response?.data?.message || 'Failed to delete message'
      )
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const activeMessages = isAIChat ? aiMessages : messages

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
                className={`conversation-item${
                  user.isAI ? ' conversation-item-ai' : ''
                }${isActive ? ' active' : ''}`}
                type="button"
                onClick={() => setSelectedUser(user)}
              >
                <span className="conversation-topline">
                  <span className="conversation-name">{user.username}</span>
                  {user.isAI ? <span className="conversation-badge">AI</span> : null}
                </span>
                <span className="conversation-preview">
                  {user.isAI ? 'Ask anything' : user.email}
                </span>
              </button>
            )
          })}
        </nav>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <h2>{selectedUser?.username || 'Select a user'}</h2>
            <p>
              {selectedUser?.isAI
                ? 'Chat with YapHub AI'
                : selectedUser?.email || 'Choose someone from the sidebar'}
            </p>
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
          {!chatError && selectedUser && activeMessages.length === 0 ? (
            <p className="chat-message-state">No messages yet.</p>
          ) : null}
          {activeMessages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onDelete={isAIChat ? undefined : handleDeleteMessage}
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
