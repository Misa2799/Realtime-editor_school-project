import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { DocumentList } from "../pages/DocumentList";
import { DocumentDetail } from "../pages/DocumentDetail";

export const router = createBrowserRouter([
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
]);
