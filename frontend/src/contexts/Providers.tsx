import { ClerkProvider } from "./ClerkProvider";
import { DocumentProvider } from "./DocumentContext";
import { RouterProvider } from "./RouterProvider";

export function Providers() {
    return (
        <ClerkProvider>
            <DocumentProvider>
                <RouterProvider />
            </DocumentProvider>
        </ClerkProvider>
    );
}
