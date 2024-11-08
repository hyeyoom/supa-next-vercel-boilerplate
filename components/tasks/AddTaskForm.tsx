'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const taskFormSchema = z.object({
    title: z.string().min(1, "제목을 입력해주세요").max(100, "제목은 100자를 넘을 수 없습니다"),
    description: z.string().max(500, "설명은 500자를 넘을 수 없습니다").optional(),
});

type TaskForm = z.infer<typeof taskFormSchema>;

type FormErrors = {
    [K in keyof TaskForm]?: string[];
};

export function AddTaskForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState<TaskForm>({
        title: '',
        description: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = () => {
        try {
            taskFormSchema.parse(form);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: FormErrors = {};
                error.errors.forEach((err) => {
                    const path = err.path[0] as keyof TaskForm;
                    if (!formattedErrors[path]) {
                        formattedErrors[path] = [];
                    }
                    formattedErrors[path]?.push(err.message);
                });
                setErrors(formattedErrors);
            }
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', form);
            // TODO: Supabase 연동
            setForm({ title: '', description: '' });
            setIsOpen(false);
        }
    };

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
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
                <div className="space-y-1">
                    <Input
                        type="text"
                        placeholder="할 일을 입력하세요"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                    />
                    {errors.title?.map((error) => (
                        <p key={error} className="text-sm text-destructive">
                            {error}
                        </p>
                    ))}
                </div>
                <div className="space-y-1">
                    <Textarea
                        placeholder="상세 내용을 입력하세요 (선택사항)"
                        className="min-h-[100px]"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    {errors.description?.map((error) => (
                        <p key={error} className="text-sm text-destructive">
                            {error}
                        </p>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                >
                    취소
                </Button>
                <Button type="submit">
                    추가하기
                </Button>
            </div>
        </form>
    );
} 