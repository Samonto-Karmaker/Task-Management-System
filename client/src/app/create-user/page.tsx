"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api-response";

interface Role {
    id: number;
    name: string;
}

export default function CreateUserForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response: ApiResponse = await apiClient.get("/role-permission/roles")
                if (response.success) {
                    setRoles(response.data);
                } else {
                    console.error(response.message);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchRoles();
    }, []);

    const getRoleId = (roleName: string | null) => {
        if (!roleName) return null;
        const role = roles.find((role) => role.name === roleName);
        return role ? role.id : null;
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`Selected Role: ${selectedRole}`);
        console.log(`Role ID: ${getRoleId(selectedRole)}`);
    };

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Create User
                    </CardTitle>
                    <Button variant="outline" className="w-full my-4">
                        + Create New Role
                    </Button>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label>Select Role</Label>
                            <Select onValueChange={(id) => setSelectedRole(id)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Email</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1"
                                aria-label="Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="mail@site.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1"
                                aria-label="Email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="********"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1"
                                aria-label="Password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm Password</Label>
                            <Input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                placeholder="********"
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded px-2 py-1"
                                aria-label="Confirm Password"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-blue-500 text-white rounded px-4 py-2"
                        >
                            Create User
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
