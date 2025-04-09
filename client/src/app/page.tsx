"use client";

import Dashboard from "@/components/custom/Dashboard";
import { useUser } from "@/components/custom/hooks/useUser";

export default function Home() {
    const { user } = useUser();

    return (
        <main className="container mx-auto px-4 py-8">
            {user ? (
                <Dashboard />
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-8">
                        Task Management System
                    </h1>
                    <p>
                        Welcome to the Task Management System. This is a simple
                        task management system that allows you to create, read,
                        update, and delete tasks. Please login to access the
                        system. If you do not have an account, please contact
                        the Admin.
                    </p>
                </>
            )}
        </main>
    );
}
