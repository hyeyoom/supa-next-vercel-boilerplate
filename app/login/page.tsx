'use client'

import {createSupabaseClientForBrowser} from "@/utils/supabase/client";
import {Button} from "@/components/ui/button";

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
            <Button onClick={handleGoogleLogin}>Login With Google</Button>
        </>
    )
}

export default LoginPage
