import { withAuth } from "next-auth/middleware"

export default withAuth({
    // Matches the pages config in `[...nextauth]`
    pages: {
        signIn: 'auth/signin',
    }
})

// user đăng nhập thì mới cho vào
export const config = { matcher: ["/playlist", "/track/upload", '/like'] }
