import { Squirrel } from "lucide-react";

export default function EmptyTable() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <Squirrel className="w-16 h-16 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-700">
                No Data Available
            </h2>
            <p className="text-gray-500">Please check back later.</p>
        </div>
    );
}
