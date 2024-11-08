'use client';

import { createSupabaseClientForBrowser } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Database } from "@/utils/types/supabase";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type TodoTemplate = Database['public']['Tables']['todo_template']['Row'];
type TodoAchievement = Database['public']['Tables']['todo_achievement']['Row'];

interface TaskWithAchievement extends TodoTemplate {
    achievement?: TodoAchievement;
}

export default function TaskList() {
    const [tasks, setTasks] = useState<TaskWithAchievement[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasksWithAchievements = async () => {
        const supabase = createSupabaseClientForBrowser();
        
        // 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUser(user);

        // 템플릿과 최신 달성 기록을 함께 가져오기
        const { data: templates, error: templatesError } = await supabase
            .from('todo_template')
            .select('*')
            .order('created_at', { ascending: false });

        if (templatesError) {
            console.error('Error fetching tasks:', templatesError);
            return;
        }

        // 각 템플릿의 최신 달성 기록 가져오기
        const tasksWithAchievements = await Promise.all(
            templates.map(async (template) => {
                const { data: achievements } = await supabase
                    .from('todo_achievement')
                    .select('*')
                    .eq('template_id', template.id)
                    .eq('user_id', user.id)
                    .eq('is_active', true)
                    .order('achieved_at', { ascending: false })
                    .limit(1);

                return {
                    ...template,
                    achievement: achievements?.[0],
                };
            })
        );

        setTasks(tasksWithAchievements);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTasksWithAchievements();
    }, []);

    const handleAchievement = async (task: TaskWithAchievement) => {
        if (!user) return;

        const supabase = createSupabaseClientForBrowser();

        if (task.achievement?.is_active) {
            // 달성 취소
            const { error } = await supabase
                .from('todo_achievement')
                .update({ is_active: false })
                .eq('id', task.achievement.id);

            if (error) {
                console.error('Error updating achievement:', error);
                return;
            }
        } else {
            // 기존의 달성 기록이 없을 경우에만 새로운 달성 기록 생성
            if (!task.achievement) {
                const { error } = await supabase
                    .from('todo_achievement')
                    .insert({
                        template_id: task.id,
                        user_id: user.id,
                        status: 'completed',
                        is_active: true,
                    });

                if (error) {
                    console.error('Error creating achievement:', error);
                    return;
                }
            } else {
                // 이미 존재하는 달성 기록이 있을 경우, 업데이트
                const { error } = await supabase
                    .from('todo_achievement')
                    .update({ is_active: true })
                    .eq('id', task.achievement.id);

                if (error) {
                    console.error('Error updating achievement:', error);
                    return;
                }
            }
        }

        await fetchTasksWithAchievements();
    };

    if (isLoading) {
        return <div className="text-center">로딩 중...</div>;
    }

    if (tasks.length === 0) {
        return <div className="text-center text-muted-foreground">할 일이 없습니다.</div>;
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className={cn(
                        "p-4 rounded-lg border bg-card transition-colors",
                        "hover:bg-accent/50"
                    )}
                >
                    <div className="flex items-start gap-3">
                        <div className="pt-1">
                            <Checkbox
                                checked={task.achievement?.is_active ?? false}
                                onCheckedChange={() => handleAchievement(task)}
                                className={cn(
                                    "size-5 border-2 rounded-md",
                                    "border-emerald-600/40 dark:border-emerald-500/40",
                                    "data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600",
                                    "dark:data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:border-emerald-500",
                                    "focus-visible:ring-emerald-600/20",
                                    "transition-colors"
                                )}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={task.user_id === user?.id ? user?.user_metadata?.avatar_url : undefined} />
                                    <AvatarFallback>
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">
                                        {user?.user_metadata?.full_name || user?.email}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>생성: {new Date(task.created_at).toLocaleString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}</span>
                                        {task.achievement?.is_active && (
                                            <>
                                                <span>•</span>
                                                <span>달성: {new Date(task.achievement.achieved_at).toLocaleString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                })}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <h3 className={cn(
                                "font-medium",
                                task.achievement?.is_active && "line-through text-muted-foreground"
                            )}>
                                {task.title}
                            </h3>
                            {task.description && (
                                <p className={cn(
                                    "text-sm mt-1 text-muted-foreground",
                                    task.achievement?.is_active && "line-through"
                                )}>
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 