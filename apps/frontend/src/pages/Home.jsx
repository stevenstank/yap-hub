import { Link } from 'react-router-dom'

const features = [
  'Send direct messages',
  'View chat history',
  'Secure authentication',
  'Clean UI experience',
  'Profile customization',
  'Fast REST-based messaging',
  'Conversation tracking',
  'Lightweight and fast',
  'No distractions',
]

function Home() {
  return (
    <main className="home-page">
      <section className="home-card">
        <p className="home-kicker">YapHub</p>
        <h1>Welcome to YapHub</h1>
        <p className="home-subtitle">Simple. Clean. Messaging.</p>

        <div className="home-features">
          <h2>What you can do:</h2>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="home-actions">
          <Link className="home-button" to="/login">
            Login
          </Link>
          <Link className="home-button" to="/signup">
            Signup
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home
