import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { createBrowserRouter, useNavigate } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { DocumentDetail } from "../pages/DocumentDetail";
import { DocumentList } from "../pages/DocumentList";
import ProtectedRoutes from "./ProtectedRoutes";
import { useEffect } from "react";

const SiginInRedirect = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate("/document");
    })

    return <AuthenticateWithRedirectCallback />;
}

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
        element: <SiginInRedirect />
    }
]);
