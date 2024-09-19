import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { DocumentDetail } from "../pages/DocumentDetail";
import { DocumentList } from "../pages/DocumentList";
import ProtectedRoutes from "./ProtectedRoutes";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoutes />,
        children: [
            {
                path: "/",
                element: <RootLayout />,
                children: [
                    {
                        path: "/document",
                        element: <DocumentList />,
                    },
                    {
                        path: "/document/:id",
                        element: <DocumentDetail />
                    }
                ]
            }
        ]
    },
    {
        path: "/sign-in",
        element: <AuthenticateWithRedirectCallback />
    }
]);
