import { ReactNode } from 'react';
import { UserProvider } from './UserProvider';
import { SocketProvider } from './SocketProvider';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <SocketProvider>
                {children}
            </SocketProvider>
        </UserProvider>
    )
}