'use client';

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DailyStats from "@/components/dashboard/DailyStats";
import WeeklyStats from "@/components/dashboard/WeeklyStats";
import MonthlyStats from "@/components/dashboard/MonthlyStats";

export default function DashboardPage() {
    return (
        <main className="min-h-[calc(100vh-73px)] flex flex-col items-center py-8">
            <div className="w-full max-w-5xl space-y-8 px-4">
                <div>
                    <h1 className="text-3xl font-bold">대시보드</h1>
                    <p className="text-muted-foreground">
                        할 일 달성 현황을 한눈에 확인하세요.
                    </p>
                </div>

                <Tabs defaultValue="daily" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="daily">일간</TabsTrigger>
                        <TabsTrigger value="weekly">주간</TabsTrigger>
                        <TabsTrigger value="monthly">월간</TabsTrigger>
                    </TabsList>
                    <TabsContent value="daily">
                        <DailyStats />
                    </TabsContent>
                    <TabsContent value="weekly">
                        <WeeklyStats />
                    </TabsContent>
                    <TabsContent value="monthly">
                        <MonthlyStats />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
} 