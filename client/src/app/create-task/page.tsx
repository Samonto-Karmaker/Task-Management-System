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
import { Priority } from "@/utils/constant";

export default function CreateTaskForm() {
    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Create Task
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="Title" placeholder="Task Title" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Email</Label>
                            <Input
                                type="text"
                                id="description"
                                placeholder="Task Description"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                type="date"
                                id="deadline"
                                placeholder="Select a date"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Select Priority</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(Priority).map((p) => (
                                        <SelectItem
                                            key={p}
                                            value={String(p)}
                                        >
                                            {p}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-500 text-white rounded px-4 py-2"
                        >
                            Create Task
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
