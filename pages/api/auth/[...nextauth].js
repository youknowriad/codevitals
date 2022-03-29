import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { PSDB } from 'planetscale-node'

const conn = new PSDB('main')

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  callbacks: {
    async signIn({ user }) {
      const [users] = await conn.query('select id from user where email = ?', user.email)
      if (!users.length) {
        await conn.query('insert into user (email, created_at) values (?,?)', [user.email, new Date()])
      }

      return true
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const [users] = await conn.query('select id from user where email = ?', user.email)
        if (users.length) {
          token.userId = users[0].id
        }
      }
      return token
    },

    async session({ token, session }) {
      if (token.userId) {
        session.userId = token.userId
      }
      return session
    }
  }
})
