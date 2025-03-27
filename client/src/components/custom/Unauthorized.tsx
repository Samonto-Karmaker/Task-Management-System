import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Unauthorized() {
    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Unauthorized
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center">
                        You are not authorized to view this page
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}