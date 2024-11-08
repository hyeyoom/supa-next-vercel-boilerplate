'use client';

import { createSupabaseClientForBrowser } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Database } from "@/utils/types/supabase";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TodoTemplate = Database['public']['Tables']['todo_template']['Row'];

export default function TaskList() {
    const [tasks, setTasks] = useState<TodoTemplate[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndTasks = async () => {
            const supabase = createSupabaseClientForBrowser();
            
            // 사용자 정보 가져오기
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // 할 일 목록 가져오기
            const { data, error } = await supabase
                .from('todo_template')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching tasks:', error);
                return;
            }

            setTasks(data || []);
            setIsLoading(false);
        };

        fetchUserAndTasks();
    }, []);

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
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback>
                                {user?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">
                                {user?.user_metadata?.full_name || user?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(task.created_at).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <h3 className="font-medium">{task.title}</h3>
                    {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
} 