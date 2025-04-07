"use client";

import EmptyTable from "@/components/custom/EmptyTable";
import { useState } from "react";
import Loading from "@/components/custom/Loading";

export default function AssignedTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <Loading />;
    }
    if (tasks.length === 0) {
        return <EmptyTable />;
    }
}