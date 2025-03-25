"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api-response";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/custom/hooks/useUser";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useUser();

    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const loginResponse: ApiResponse = await apiClient.post("/login", {
                email,
                password,
            });
            if (loginResponse.success) {
                setUser(loginResponse.data);
                alert("Login successful!");
                router.push("/");
            } else {
                console.error(loginResponse.message);
                alert("An error occurred. Please try again later.");
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
                        Login
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                        <Button
                            type="submit"
                            className="bg-blue-500 text-white rounded px-4 py-2"
                        >
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
