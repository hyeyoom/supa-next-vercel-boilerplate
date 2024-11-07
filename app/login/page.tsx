'use client'

import {createSupabaseClientForBrowser} from "@/utils/supabase/client";

const LoginPage = () => {
    const supabase = createSupabaseClientForBrowser()

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: process.env.NEXT_PUBLIC_SUPABASE_GOOGLE_CALLBACK_URL!,
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
