"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api-response";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/custom/hooks/useUser";
import { checkPermission } from "@/utils/checkPermission";
import Unauthorized from "@/components/custom/Unauthorized";
import CreateRoleForm from "@/components/custom/CreateRoleForm";

interface Role {
    id: number;
    name: string;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleId: string;
}

export default function CreateUserForm() {
    const {user} = useUser();
    const [roles, setRoles] = useState<Role[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = useForm<FormData>();

    const router = useRouter();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response: ApiResponse = await apiClient.get(
                    "/role-permission/roles"
                );
                if (response.success) {
                    setRoles(response.data);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        if (checkPermission(user, "USER")) {
            fetchRoles();
        }
    }, [user, isOpen]);

    const onSubmit = async (data: FormData) => {
        try {
            const response: ApiResponse = await apiClient.post("/", {
                name: data.name,
                email: data.email,
                password: data.password,
                roleId: data.roleId,
            })

            if (response.success) {
                console.log("User created successfully");
                setValue("name", "");
                setValue("email", "");
                setValue("password", "");
                setValue("confirmPassword", "");
                setValue("roleId", "");

                setError("name", { message: "" });
                setError("email", { message: "" });
                setError("password", { message: "" });
                setError("confirmPassword", { message: "" });
                setError("roleId", { message: "" });

                alert("User created successfully");

                router.push("/users");
            } else if (response.statusCode === 400 && response.data) {
                const errors = response.data;
                if (errors.name) {
                    setError("name", { message: errors.name.msg });
                }
                if (errors.email) {
                    setError("email", { message: errors.email.msg });
                }
                if (errors.password) {
                    setError("password", { message: errors.password.msg });
                }
                if (errors.roleId) {
                    setError("roleId", { message: errors.roleId.msg });
                }
            } else {
                console.error("Error creating user:", response.message);
                alert(`Error creating user: ${response.message}`);
            }
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Error creating user");
        }
    };

    if (!checkPermission(user, "USER")) {
        return <Unauthorized />;
    }

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Create User
                    </CardTitle>
                    <Button variant="outline" className="w-full my-4" onClick={() => setIsOpen(true)}>
                        + Create New Role
                    </Button>
                </CardHeader>
                <CardContent>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Role Selection */}
                        <div className="space-y-2">
                            <Label>Select Role</Label>
                            <Select
                                onValueChange={(value) =>
                                    setValue("roleId", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={String(role.id)}
                                        >
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.roleId && (
                                <p className="text-sm text-red-500">
                                    {errors.roleId.message}
                                </p>
                            )}
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                {...register("name", { required: true })}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="mail@site.com"
                                {...register("email", { required: true })}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                placeholder="********"
                                {...register("password", { required: true })}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                placeholder="********"
                                {...register("confirmPassword", {
                                    required: true,
                                    validate: (value) =>
                                        value === watch("password") ||
                                        "Passwords do not match",
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-500 text-white rounded px-4 py-2"
                        >
                            Create User
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <CreateRoleForm isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}
