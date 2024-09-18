import { ClerkProvider } from "./ClerkProvider";
import { RouterProvider } from "./RouterProvider";

export function Providers() {
    return (
        <ClerkProvider>
            <RouterProvider />
        </ClerkProvider>
    );
}
