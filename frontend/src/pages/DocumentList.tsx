import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

interface Document {
	id: string;
	name: string;
	content: string;
	authorId: string;
	isShared: boolean;
	createdAt: string;
	updatedAt: string;
}

export const DocumentList = () => {
	const [activeTab, setActiveTab] = useState("My Documents");
	const [menuVisible, setMenuVisible] = useState<boolean[]>([]);
	const [documents, setDocuments] = useState<Document[]>([]);
	const [showRenameModal, setShowRenameModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal para eliminar documento
	const [deleteDocumentId, setDeleteDocumentId] = useState<string | null>(null); // Estado para el ID del documento a eliminar
	const [renameDocumentId, setRenameDocumentId] = useState<string | null>(null);
	const [newName, setNewName] = useState("");
	const API_URL = "http://localhost:3000/document"; // Ruta del endpoint para los requests
    const { getToken } = useAuth();

	// Fetch de documentos desde el backend
	useEffect(() => {
		const fetchDocuments = async () => {
			try {
                const token = await getToken();
				const response = await fetch(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
				if (!response.ok) {
					throw new Error("Failed to fetch documents");
				}
				const data: Document[] = await response.json();
				setDocuments(data);
				setMenuVisible(Array(data.length).fill(false));
			} catch (error) {
				console.error("Error fetching documents:", error);
			}
		};

		fetchDocuments();
	}, []);

	// Función para mostrar/ocultar menú desplegable
	const toggleMenu = (index: number) => {
		const updatedMenus = menuVisible.map((visible, i) => (i === index ? !visible : false));
		setMenuVisible(updatedMenus);
	};

	// Función para cerrar todos los menús al hacer clic fuera
	const closeMenus = (e: any) => {
		if (!e.target.classList.contains("menu-btn")) {
			setMenuVisible(Array(documents.length).fill(false));
		}
	};

	// Función para abrir el modal de renombrar
	const openRenameModal = (docId: string, currentName: string) => {
		setRenameDocumentId(docId);
		setNewName(currentName);
		setShowRenameModal(true);
	};

	// Función para renombrar documento (PUT request)
	const handleRename = async () => {
		if (!renameDocumentId) return;

		try {
            const token = await getToken();
			const response = await fetch(API_URL, {
				method: "PUT",
				headers: {
                    Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: renameDocumentId, // Enviamos el id del documento y el nuevo nombre en el body
					name: newName,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to rename document");
			}

			// Actualizar el estado local
			setDocuments((prevDocs) =>
				prevDocs.map((doc) => (doc.id === renameDocumentId ? { ...doc, name: newName } : doc))
			);

			// Cerrar el modal
			setShowRenameModal(false);
			setRenameDocumentId(null);
			setNewName("");
		} catch (error) {
			console.error("Error renaming document:", error);
		}
	};

	// Función para eliminar documento (DELETE request)
	const handleDelete = async () => {
		if (!deleteDocumentId) return;

		try {
			// Agregamos un console.log del id que se enviará al DELETE request
			console.log(`Eliminando documento con id: ${deleteDocumentId}`);

            const token = await getToken();
			// Hacemos el DELETE request al backend con el id en la URL
			const response = await fetch(`${API_URL}?id=${deleteDocumentId}`, {
				method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
			});

			if (!response.ok) {
				throw new Error("Failed to delete document");
			}

			// Actualizar el estado local eliminando el documento
			setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== deleteDocumentId));

			// Cerrar el modal
			setShowDeleteModal(false);
			setDeleteDocumentId(null);
		} catch (error) {
			console.error("Error deleting document:", error);
		}
	};

	// Función para abrir el modal de eliminación
	const openDeleteModal = (docId: string) => {
		setDeleteDocumentId(docId);
		setShowDeleteModal(true);
	};

	// Función para cerrar el modal de renombrar
	const closeRenameModal = () => {
		setShowRenameModal(false);
		setRenameDocumentId(null);
		setNewName("");
	};

	// Función para cerrar el modal de eliminación
	const closeDeleteModal = () => {
		setShowDeleteModal(false);
		setDeleteDocumentId(null);
	};

	useEffect(() => {
		window.addEventListener("click", closeMenus);
		return () => {
			window.removeEventListener("click", closeMenus);
		};
	}, [closeMenus, documents]);

	return (
		<div className="p-5 flex flex-col items-center">
			{/* Barra de alternancia */}
			<div className="flex bg-gray-200 rounded-full p-2 mb-5 w-96">
				<button
					className={`flex-1 py-2 px-5 rounded-full transition-colors ${
						activeTab === "My Documents" ? "bg-green-600 text-white" : "text-gray-700"
					}`}
					onClick={() => setActiveTab("My Documents")}
				>
					My Documents
				</button>
				<button
					className={`flex-1 py-2 px-5 rounded-full transition-colors ${
						activeTab === "Shared" ? "bg-green-600 text-white" : "text-gray-700"
					}`}
					onClick={() => setActiveTab("Shared")}
				>
					Shared
				</button>
			</div>

			{/* Grilla de documentos */}
			<div className="grid grid-cols-4 gap-5 max-w-5xl w-full justify-items-center">
				{activeTab === "My Documents" && (
					<div className="flex flex-col justify-center items-center w-44 h-56 bg-yellow-400 text-gray-900 rounded-lg cursor-pointer shadow-lg">
						<span className="text-4xl mb-2">+</span>
						<span>Create Document</span>
					</div>
				)}

				{/* Filtrar documentos según la pestaña activa */}
				{documents
					.filter((doc) => (activeTab === "My Documents" ? !doc.isShared : doc.isShared))
					.map((doc, index) => (
						<div
							className="relative w-44 h-56 bg-green-600 text-white rounded-lg flex justify-center items-center shadow-lg"
							key={doc.id}
						>
							<span>{doc.name}</span>
							<button
								className="absolute top-2 right-2 text-xl menu-btn"
								onClick={() => toggleMenu(index)}
							>
								⋮
							</button>
							{menuVisible[index] && (
								<div className="absolute top-10 right-2 bg-white text-black border border-gray-300 rounded shadow-lg z-10 w-24">
									<button
										className="block w-full px-3 py-1 text-left hover:bg-gray-100"
										onClick={() => openRenameModal(doc.id, doc.name)}
									>
										Rename
									</button>
									<button
										className="block w-full px-3 py-1 text-left hover:bg-gray-100"
										onClick={() => openDeleteModal(doc.id)} // Abrir el modal de eliminación
									>
										Delete
									</button>
								</div>
							)}
						</div>
					))}
			</div>

			{/* Modal de renombrar */}
			{showRenameModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-gray-100 p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-2xl font-bold mb-4">Change Note Name</h2>
						<input
							type="text"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							className="w-full p-2 mb-4 border rounded"
							placeholder="Enter new name"
						/>
						<div className="flex justify-end space-x-4">
							<button
								className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
								onClick={closeRenameModal}
							>
								Cancel
							</button>
							<button
								className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
								onClick={handleRename}
							>
								Done
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal de confirmación de eliminación */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-gray-100 p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
						<p>Are you sure you want to delete this document?</p>
						<div className="flex justify-end space-x-4 mt-4">
							<button
								className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
								onClick={closeDeleteModal}
							>
								Cancel
							</button>
							<button
								className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
								onClick={handleDelete}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
