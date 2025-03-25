import { Button } from "@/components/ui/button";
import { House } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-gray-800 text-white py-4">
            <nav className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Task Management System</h1>
                <ul className="flex space-x-4">
                    <li>
                        <Button className="hover:cursor-pointer hover:text-gray-300">
                            <House />
                        </Button>
                    </li>
                    <li>
                        <Button className="hover:cursor-pointer hover:text-gray-300">
                            Login
                        </Button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
