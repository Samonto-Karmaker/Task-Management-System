import { User } from "@/types/user";

export const checkPermission = (
    user: User | null,
    keywordOrPermission: string
): boolean => {
    if (!user || !user.roleId || !user.permissionInfo) return false;

    const permissions = user.permissionInfo.permissions.map(
        (permission) => permission.name
    );

    // Check if the keywordOrPermission matches either a full permission name or is included as a substring
    return permissions.some((perm) => perm === keywordOrPermission);
};
