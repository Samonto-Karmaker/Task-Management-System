"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Define interfaces for the data structure
interface Task {
    id: number;
    title: string;
    deadline: string;
}

interface TaskStatusStats {
    PENDING: number;
    IN_PROGRESS: number;
    COMPLETED: number;
}

interface Workload {
    taskInHand: number;
    taskManaging: number;
    tasksWithUpcoming: number;
    tasksWithOverdue: number;
}

interface PerformanceData {
    assignedTasks: TaskStatusStats;
    createdTasks: TaskStatusStats;
    upcomingDeadlines: Task[];
    overdueDeadlines: Task[];
    workload: Workload;
}

// Dummy data with the defined interface
const dummyPerformanceData: PerformanceData = {
    assignedTasks: {
        PENDING: 4,
        IN_PROGRESS: 3,
        COMPLETED: 6,
    },
    createdTasks: {
        PENDING: 2,
        IN_PROGRESS: 5,
        COMPLETED: 7,
    },
    upcomingDeadlines: [
        { id: 1, title: "Design login page", deadline: "2025-04-10" },
        { id: 2, title: "Update dashboard UI", deadline: "2025-04-11" },
    ],
    overdueDeadlines: [
        { id: 3, title: "Fix navbar bug", deadline: "2025-04-05" },
    ],
    workload: {
        taskInHand: 6,
        taskManaging: 4,
        tasksWithUpcoming: 2,
        tasksWithOverdue: 1,
    },
};

// Define props for the `StatCard` component
interface StatCardProps {
    title: string;
    value: number;
    color: string;
}

const StatCard = ({ title, value, color }: StatCardProps) => (
    <Card className="w-full">
        <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className={`text-2xl font-bold text-${color}-500`}>
                {value}
            </div>
        </CardContent>
    </Card>
);

// Define props for the `TaskList` component
interface TaskListProps {
    tasks: Task[];
    label: string;
}

const TaskList = ({ tasks, label }: TaskListProps) => (
    <Card className="w-full">
        <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-lg">{label}</h3>
            <ul className="space-y-1">
                {tasks.map((task) => (
                    <li key={task.id} className="flex justify-between">
                        <span>{task.title}</span>
                        <Badge>{task.deadline}</Badge>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const {
        assignedTasks,
        createdTasks,
        upcomingDeadlines,
        overdueDeadlines,
        workload,
    } = dummyPerformanceData;

    // Define the type for the `data` parameter in `renderStatusBars`
    const renderStatusBars = (data: TaskStatusStats) => {
        const total = Object.values(data).reduce((a, b) => a + b, 0);
        return Object.entries(data).map(([status, count]) => {
            const percent = ((count / total) * 100).toFixed(0);
            return (
                <div key={status} className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                        <span>{status}</span>
                        <span>{count}</span>
                    </div>
                    <Progress value={parseFloat(percent)} />
                </div>
            );
        });
    };

    return (
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
                title="Tasks In Hand"
                value={workload.taskInHand}
                color="blue"
            />
            <StatCard
                title="Tasks Managing"
                value={workload.taskManaging}
                color="green"
            />
            <StatCard
                title="Upcoming Tasks"
                value={workload.tasksWithUpcoming}
                color="yellow"
            />
            <StatCard
                title="Overdue Tasks"
                value={workload.tasksWithOverdue}
                color="red"
            />

            <div className="col-span-1 md:col-span-2">
                <Card>
                    <CardContent className="p-4">
                        <Tabs defaultValue="assigned">
                            <TabsList>
                                <TabsTrigger value="assigned">
                                    Assigned Tasks
                                </TabsTrigger>
                                <TabsTrigger value="created">
                                    Created Tasks
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="assigned">
                                {renderStatusBars(assignedTasks)}
                            </TabsContent>
                            <TabsContent value="created">
                                {renderStatusBars(createdTasks)}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <TaskList tasks={upcomingDeadlines} label="Upcoming Deadlines" />
            <TaskList tasks={overdueDeadlines} label="Overdue Deadlines" />
        </div>
    );
}