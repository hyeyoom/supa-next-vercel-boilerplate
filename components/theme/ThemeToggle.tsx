'use client'

import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";

export function ThemeToggle() {
    const {theme, setTheme} = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-10 w-10"
        >
            <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-transform duration-500 dark:-rotate-90 dark:scale-0"/>
            <Moon
                className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100"/>
            <span className="sr-only">테마 변경</span>
        </Button>
    );
} 