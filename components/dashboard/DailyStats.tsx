'use client';

import { useEffect, useState } from "react";
import { createSupabaseClientForBrowser } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfDay, endOfDay, format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function DailyStats() {
    const [stats, setStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDailyStats() {
            const supabase = createSupabaseClientForBrowser();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const start = startOfDay(new Date());
            const end = endOfDay(new Date());

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

            // 시간별로 그룹화
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
            setIsLoading(false);
        }

        fetchDailyStats();
    }, []);

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    return (
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
    );
} 