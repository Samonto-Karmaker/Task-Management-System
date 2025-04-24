"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api-response";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const response: ApiResponse = await apiClient.patch(
                "/change-password",
                {
                    password,
                }
            );
            if (response.success) {
                alert(
                    "Password changed successfully! Please login again with updated credentials"
                );
                router.push("/login");
            } else {
                console.error(response.message);
                alert(`Error: ${response.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Change Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                            <Label htmlFor="confirm-password">
                                Confirm Password
                            </Label>
                            <Input
                                type="password"
                                id="confirm-password"
                                name="confirm-password"
                                placeholder="********"
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded px-2 py-1"
                                aria-label="confirm-password"
                            />
                        </div>
                        <Button type="submit">Change Password</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
