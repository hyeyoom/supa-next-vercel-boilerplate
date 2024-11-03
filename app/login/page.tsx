'use client'

import {createSupabaseClientForBrowser} from "@/utils/supabase/client";

const LoginPage = () => {
    const supabase = createSupabaseClientForBrowser()

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: 'http://localhost:3000/auth/callback',
            },
        })
    }

    return (
        <>
            <h1>Login Page</h1>
            <button onClick={handleGoogleLogin}>Login With Google</button>
        </>
    )
}

export default LoginPage
