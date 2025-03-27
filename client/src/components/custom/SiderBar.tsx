"use client";

import { useState } from "react";
import { Home, Bell, ListChecks, Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "./hooks/useUser";

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { user } = useUser();

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    if (!user || !user.roleId) return <></>

    return (
        <div className="flex">
            <aside
                className={`flex-col bg-gray-900 text-white h-screen p-4 transition-all ${
                    isExpanded ? "w-60" : "w-16"
                }`}
            >
                <Button variant="ghost" className="mb-6" onClick={toggleSidebar}>
                    {isExpanded ? <X size={24} /> : <Menu size={24} />}
                </Button>
                <SidebarContent isExpanded={isExpanded} />
            </aside>
        </div>
    );
};

const SidebarContent = ({ isExpanded = true }: { isExpanded?: boolean }) => {
    const links = [
        { name: "Home", href: "/", icon: Home },
        { name: "User", href: "/users", icon: Users },
        { name: "Task", href: "/tasks", icon: ListChecks },
        { name: "Notifications", href: "/notifications", icon: Bell },
    ];

    return (
        <nav className="flex flex-col space-y-4">
            {links.map(({ name, href, icon: Icon }) => (
                <Link key={name} href={href} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800">
                    <Icon size={24} />
                    {isExpanded && <span>{name}</span>}
                </Link>
            ))}
        </nav>
    );
};

export default Sidebar;
