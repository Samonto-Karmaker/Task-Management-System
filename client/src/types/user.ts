import { permissions } from './permissions';

export type User = {
    id: string;
    email: string;
    name: string;
    roleId: string;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
    permissionInfo: {
        role: string;
        permissions: permissions[];
    }
}