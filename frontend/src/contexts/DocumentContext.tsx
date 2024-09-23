import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export interface Document {
    id: string;
    name: string;
    content: string;
    authorId: string;
    isShared: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DocumentContext = createContext<{
    documentsFromContext: Document[];
    setDocumentsFromContext: (documents: Document[]) => void;
    fetchDocumentsFromContext: () => void;
} | undefined>(undefined);

export const DocumentProvider = ({ children }: {children: React.ReactNode}) => {
    const [documentsFromContext, setDocumentsFromContext] = useState<Document[]>([]);
    const { getToken } = useAuth();

    const fetchDocumentsFromContext = async () => {
        const token = await getToken();
        try {
            const response = await fetch("http://localhost:3000/document",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setDocumentsFromContext(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDocumentsFromContext();
    }, [])

    return (
        <DocumentContext.Provider value={{ documentsFromContext, setDocumentsFromContext, fetchDocumentsFromContext }}>
            {children}
        </DocumentContext.Provider>
    );
}

export const useDocuments = () => {
	const context = useContext(DocumentContext);
	if (!context) throw new Error("useDocuments must be used within a DocumentProvider");
	return context;
};