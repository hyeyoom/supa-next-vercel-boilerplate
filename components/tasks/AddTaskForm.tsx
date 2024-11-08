'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export function AddTaskForm() {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground"
                onClick={() => setIsOpen(true)}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                새로운 할 일 추가하기
            </Button>
        );
    }

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
                <Input
                    type="text"
                    placeholder="할 일을 입력하세요"
                />
                <Textarea
                    placeholder="상세 내용을 입력하세요 (선택사항)"
                    className="min-h-[100px]"
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                >
                    취소
                </Button>
                <Button>
                    추가하기
                </Button>
            </div>
        </div>
    );
} 