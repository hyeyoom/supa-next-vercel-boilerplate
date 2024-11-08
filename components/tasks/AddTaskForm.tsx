'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { createSupabaseClientForBrowser } from "@/utils/supabase/client";

const taskFormSchema = z.object({
    title: z.string().min(1, "제목을 입력해주세요").max(100, "제목은 100자를 넘을 수 없습니다"),
    description: z.string().max(500, "설명은 500자를 넘을 수 없습니다").optional(),
    repeat_type: z.string().default('none'),
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
        repeat_type: 'none',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const supabase = createSupabaseClientForBrowser();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) throw new Error("로그인이 필요합니다");

            const { error } = await supabase
                .from('todo_template')
                .insert({
                    title: form.title,
                    description: form.description || '',
                    repeat_type: form.repeat_type,
                    user_id: user.id,
                });

            if (error) throw error;

            setForm({ title: '', description: '', repeat_type: 'none' });
            setIsOpen(false);
        } catch (error) {
            console.error('Error creating task:', error);
            alert('할 일을 추가하는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                    disabled={isLoading}
                >
                    취소
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? '추가 중...' : '추가하기'}
                </Button>
            </div>
        </form>
    );
} 