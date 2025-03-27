import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api-response";

export default function CreateRoleForm({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}) {
    const [permissions, setPermissions] = useState<
        {
            id: string;
            name: string;
        }[]
    >([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response: ApiResponse = await apiClient.get("/role-permission");
                if (response.success) {
                    console.log(response.data);
                    setPermissions(response.data);
                } else {
                    console.error(response.message);
                }
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        }

        fetchPermissions();
    }, []);

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: "white",
            borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
            boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            transition: "all 0.2s ease-in-out",
        }),
        menu: (provided: any) => ({
            ...provided,
            borderRadius: "0.5rem",
            overflow: "hidden",
            zIndex: 50,
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: "#3b82f6",
            color: "white",
            borderRadius: "0.25rem",
            padding: "2px 6px",
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: "white",
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: "white",
            ":hover": {
                backgroundColor: "#2563eb",
                color: "white",
            },
        }),
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
            <DialogContent className="max-w-lg w-full p-6">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                    Create Role
                </DialogTitle>
                <Card className="shadow-none border-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Role Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Role Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter role name..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="permissions">Permissions</Label>
                                <Select
                                    isMulti
                                    options={permissions.map((permission) => ({
                                        value: permission.id,
                                        label: permission.name,
                                    }))}
                                    styles={customStyles}
                                    className="focus:ring-2 focus:ring-blue-500"
                                    placeholder="Select permissions..."
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Create Role</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
