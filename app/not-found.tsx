'use client'

import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="h-[calc(100vh-73px)] flex flex-col items-center justify-center gap-4">
            <h2 className="text-4xl font-bold">404 Not Found</h2>
            <p className="text-muted-foreground">요청하신 페이지를 찾을 수 없습니다.</p>
            <Button asChild>
                <Link href="/">
                    홈으로 돌아가기
                </Link>
            </Button>
        </div>
    );
} 