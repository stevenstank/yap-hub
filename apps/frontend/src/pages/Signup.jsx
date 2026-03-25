import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios.js'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
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
      await axios.post('/auth/signup', formData)
      navigate('/login')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Signup failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
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
          {isSubmitting ? 'Creating...' : 'Sign up'}
        </button>
      </form>
    </main>
  )
}

export default Signup
