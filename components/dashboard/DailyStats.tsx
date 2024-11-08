'use client';

import { useEffect, useState } from "react";
import { createSupabaseClientForBrowser } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfDay, endOfDay, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatItem } from './types';

interface Achievement {
    id: string;
    achieved_at: string;
    template: {
        title: string;
        description: string | null;
    };
}

export default function DailyStats() {
    const [stats, setStats] = useState<StatItem[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDailyStats() {
            const supabase = createSupabaseClientForBrowser();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const start = startOfDay(new Date());
            const end = endOfDay(new Date());

            // 달성 기록과 템플릿 정보를 함께 가져오기
            const { data, error } = await supabase
                .from('todo_achievement')
                .select(`
                    id,
                    achieved_at,
                    template:todo_template (
                        title,
                        description
                    )
                `)
                .eq('user_id', user.id)
                .eq('is_active', true)
                .gte('achieved_at', start.toISOString())
                .lte('achieved_at', end.toISOString())
                .order('achieved_at', { ascending: false });

            if (error) {
                console.error('Error fetching stats:', error);
                return;
            }

            // 시간별 통계
            const hourlyStats = Array.from({ length: 24 }, (_, i) => ({
                hour: i,
                count: 0,
                label: `${i}시`
            }));

            data.forEach(achievement => {
                const hour = new Date(achievement.achieved_at).getHours();
                hourlyStats[hour].count++;
            });

            setStats(hourlyStats);
            setAchievements(data as Achievement[]);
            setIsLoading(false);
        }

        fetchDailyStats();
    }, []);

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {format(new Date(), 'PPP', { locale: ko })} 달성 현황
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats}>
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Bar 
                                    dataKey="count" 
                                    fill="#10b981" 
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>오늘의 달성 목록</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className="flex flex-col gap-1 rounded-lg border p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {achievement.template.title}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {format(new Date(achievement.achieved_at), 'HH:mm')}
                                        </span>
                                    </div>
                                    {achievement.template.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {achievement.template.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
} 