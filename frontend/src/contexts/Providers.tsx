import { ClerkProvider } from "./ClerkProvider";
import { RouterProvider } from "./RouterProvider";
import { DocumentProvider } from "../context/DocumentContext";

export function Providers() {
    return (
        <ClerkProvider>
            <DocumentProvider>
                <RouterProvider />
            </DocumentProvider>
        </ClerkProvider>
    );
}
