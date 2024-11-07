'use client'

import {createSupabaseClientForBrowser} from "@/utils/supabase/client";

const LogoutPage = () => {
    const supabase = createSupabaseClientForBrowser()

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <>
            <h1>Logout Page</h1>
            <button onClick={handleLogout}>Log out</button>
        </>
    )
}

export default LogoutPage
