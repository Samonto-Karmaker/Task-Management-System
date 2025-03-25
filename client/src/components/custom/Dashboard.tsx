"use client";

import { User } from "@/types/user";

export default function Dashboard({ user }: { user: User }) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <p>Welcome, {user.name}!</p>
        </div>
    );
}