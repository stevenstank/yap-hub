import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios.js'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await axios.post('/auth/login', formData)
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <button
          className="auth-back-button"
          type="button"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>

        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Login
