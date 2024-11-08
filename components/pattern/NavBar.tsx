import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuContent,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {CheckSquare, User, LogOut, Settings} from "lucide-react";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {createSupabaseClientForServer} from "@/utils/supabase/server";
import {LoginButton} from "@/components/auth/AuthButtons";
import {ThemeToggle} from "@/components/theme/ThemeToggle";

async function NavBar() {
    const supabase = await createSupabaseClientForServer();
    const {data: {user}} = await supabase.auth.getUser();

    return (
        <div className="w-screen flex justify-center items-center p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <NavigationMenu className="w-full max-w-7xl [&>div]:w-full [&>div]:flex-initial">
                <NavigationMenuList className="w-full flex items-center">
                    <div className="flex-none">
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()}`}>
                                    <CheckSquare className="h-6 w-6"/>
                                    <span className="font-bold text-xl px-2">Task Manager</span>
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </div>

                    <div className="flex-1 flex justify-center items-center gap-12">
                        <NavigationMenuItem>
                            <Link href="/dashboard" legacyBehavior passHref>
                                <NavigationMenuLink className={cn(
                                    navigationMenuTriggerStyle(),
                                    "text-base font-medium hover:text-primary"
                                )}>
                                    대시보드
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link href="/tasks" legacyBehavior passHref>
                                <NavigationMenuLink className={cn(
                                    navigationMenuTriggerStyle(),
                                    "text-base font-medium hover:text-primary"
                                )}>
                                    할 일
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </div>

                    <div className="flex-none flex items-center gap-4">
                        <ThemeToggle />
                        {user ? (
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="flex items-center gap-2">
                                            <img 
                                                src={user.user_metadata.avatar_url} 
                                                alt="Profile" 
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <span>{user.user_metadata.full_name}</span>
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="w-48 p-2">
                                                <li>
                                                    <Link href="/profile" legacyBehavior passHref>
                                                        <NavigationMenuLink 
                                                            className={cn(
                                                                "flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent",
                                                                "cursor-pointer"
                                                            )}
                                                        >
                                                            <User className="w-4 h-4" />
                                                            <span>프로필</span>
                                                        </NavigationMenuLink>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/settings" legacyBehavior passHref>
                                                        <NavigationMenuLink 
                                                            className={cn(
                                                                "flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent",
                                                                "cursor-pointer"
                                                            )}
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                            <span>설정</span>
                                                        </NavigationMenuLink>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <form action="/auth/signout" method="post">
                                                        <button 
                                                            className={cn(
                                                                "flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent",
                                                                "text-red-500 hover:text-red-600"
                                                            )}
                                                        >
                                                            <LogOut className="w-4 h-4" />
                                                            <span>로그아웃</span>
                                                        </button>
                                                    </form>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        ) : (
                            <NavigationMenuItem>
                                <LoginButton />
                            </NavigationMenuItem>
                        )}
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

export default NavBar;
