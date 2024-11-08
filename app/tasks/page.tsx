'use client';

import { AddTaskForm } from "@/components/tasks/AddTaskForm";
import TaskList from "@/components/tasks/TaskList";

export default function TasksPage() {
    return (
        <main className="min-h-[calc(100vh-73px)] flex flex-col items-center py-8">
            <div className="w-full max-w-3xl space-y-8 px-4">
                <div>
                    <h1 className="text-3xl font-bold">할 일 목록</h1>
                    <p className="text-muted-foreground">
                        새로운 할 일을 추가하고 관리하세요.
                    </p>
                </div>
                <AddTaskForm />
                <TaskList />
            </div>
        </main>
    );
} 