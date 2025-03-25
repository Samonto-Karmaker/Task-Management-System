"use client";

import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import Link from "next/link";
import { useUser } from "./hooks/useUser";

export default function Header() {
    const { user } = useUser();

    return (
        <header className="bg-gray-800 text-white py-4">
            <nav className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Task Management System</h1>
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/">
                            <Button className="hover:cursor-pointer hover:text-gray-300">
                                <House />
                            </Button>
                        </Link>
                    </li>
                    {user ? (
                        <li>
                            <Button className="hover:cursor-pointer hover:text-gray-300">
                                Logout
                            </Button>
                        </li>
                    ) : (
                        <li>
                            <Link href="/login">
                                <Button className="hover:cursor-pointer hover:text-gray-300">
                                    Login
                                </Button>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}
