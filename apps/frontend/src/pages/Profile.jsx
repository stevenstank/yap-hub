import { useEffect, useState } from 'react'
import axios from '../api/axios.js'

function Profile() {
  const [userId, setUserId] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    profilePicture: '',
    email: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await axios.get('/auth/me')
        setUserId(response.data.id)
        setFormData({
          username: response.data.username || '',
          bio: response.data.bio || '',
          profilePicture: response.data.profilePicture || '',
          email: response.data.email || '',
        })
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load profile')
      }
    }

    loadProfile()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!userId) {
      return
    }

    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const response = await axios.put(`/users/${userId}`, {
        username: formData.username,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
      })

      setFormData((current) => ({
        ...current,
        username: response.data.username || '',
        bio: response.data.bio || '',
        profilePicture: response.data.profilePicture || '',
      }))
      setSuccess('Profile updated successfully')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Your profile</h1>
        <input
          name="email"
          type="email"
          value={formData.email}
          disabled
          readOnly
        />
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          name="profilePicture"
          type="text"
          placeholder="Profile picture URL"
          value={formData.profilePicture}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Bio"
          rows="4"
          value={formData.bio}
          onChange={handleChange}
        />
        {error ? <p className="auth-error">{error}</p> : null}
        {success ? <p className="auth-success">{success}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </main>
  )
}

export default Profile
