"use client";

import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard({ user }: { user: User }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="shadow-lg border border-gray-200">
                <CardHeader className="bg-blue-500 text-white rounded-t-lg p-4">
                    <CardTitle className="text-2xl font-bold">
                        Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <p className="text-lg font-medium">
                            Welcome, <span className="font-bold">{user.name}</span>!
                        </p>
                        <p className="text-gray-600">
                            You are logged in as <span className="font-semibold">{user.permissionInfo.role}</span>.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}