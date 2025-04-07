"use client";

import { Button } from "@/components/ui/button";
import { FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    task: any;
}

export default function UpdateTaskButton({ task }: Props) {
    const router = useRouter();

    const handleClick = () => {
        if (confirm("Are you sure you want to update this task?")) {
            localStorage.setItem("taskToUpdate", JSON.stringify(task));
            router.push(`/update-task/${task.id}`);
        }
    };

    return (
        <Button variant="ghost" onClick={handleClick}>
            <FilePenLine size={20} />
        </Button>
    );
}
