"use client";

import EmptyTable from "@/components/custom/EmptyTable";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AssignedTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Loader2 className="w-16 h-16 animate-spin text-gray-400" />
            </div>
        );
    }
    if (tasks.length === 0) {
        return <EmptyTable />;
    }
}