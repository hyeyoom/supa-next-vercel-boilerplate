'use client';

import { useEffect, useState } from "react";
import { createSupabaseClientForBrowser } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { StatItem } from './types';

export default function WeeklyStats() {
    const [stats, setStats] = useState<StatItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchWeeklyStats() {
            const supabase = createSupabaseClientForBrowser();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // 월요일부터 시작
            const end = endOfWeek(new Date(), { weekStartsOn: 1 });

            const { data, error } = await supabase
                .from('todo_achievement')
                .select('achieved_at')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .gte('achieved_at', start.toISOString())
                .lte('achieved_at', end.toISOString());

            if (error) {
                console.error('Error fetching stats:', error);
                return;
            }

            // 일별로 그룹화
            const days = eachDayOfInterval({ start, end });
            const dailyStats: StatItem[] = days.map(day => ({
                date: format(day, 'EEE', { locale: ko }),
                fullDate: format(day, 'yyyy-MM-dd'),
                label: format(day, 'EEE', { locale: ko }),
                count: 0
            }));

            data.forEach(achievement => {
                const achievedDate = format(new Date(achievement.achieved_at), 'yyyy-MM-dd');
                const statIndex = dailyStats.findIndex(stat => stat.fullDate === achievedDate);
                if (statIndex !== -1) {
                    dailyStats[statIndex].count++;
                }
            });

            setStats(dailyStats);
            setIsLoading(false);
        }

        fetchWeeklyStats();
    }, []);

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    이번 주 달성 현황
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats}>
                            <XAxis dataKey="date" />
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
    );
} 