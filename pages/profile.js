import { useSession } from 'next-auth/react'

const Profile = () => {
  // Fetch the user client-side
  const { data: session } = useSession()

  // Server-render loading state
  if (!session?.user || session.user.isLoggedIn === false) {
    return 'Loading...'
  }

  // Once the user request finishes, show the user
  return (
    <div>
      <h1>Your Profile</h1>
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
    </div>
  )
}

export default Profile
