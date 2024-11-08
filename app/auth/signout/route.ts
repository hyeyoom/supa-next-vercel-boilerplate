import {createSupabaseClientForServer} from "@/utils/supabase/server";
import {NextResponse} from "next/server";

export async function POST() {
    const supabase = await createSupabaseClientForServer();
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL));
}
