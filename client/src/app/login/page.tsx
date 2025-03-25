import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Login
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full border border-gray-300 rounded px-2 py-1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full border border-gray-300 rounded px-2 py-1"
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
