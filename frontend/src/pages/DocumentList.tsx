import { useState, useEffect } from "react";

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
	const [renameDocumentId, setRenameDocumentId] = useState<string | null>(null);
	const [newName, setNewName] = useState("");
	const API_URL = "http://localhost:3000/document"; // Actualiza con la URL de tu API

	// Fetch documents from backend
	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				const response = await fetch(API_URL);
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

	// Function to toggle visibility of dropdown menus
	const toggleMenu = (index: number) => {
		const updatedMenus = menuVisible.map((visible, i) => (i === index ? !visible : false));
		setMenuVisible(updatedMenus);
	};

	// Function to close all menus when clicking outside
	const closeMenus = (e: any) => {
		if (!e.target.classList.contains("menu-btn")) {
			setMenuVisible(Array(documents.length).fill(false));
		}
	};

	// Function to open the rename modal
	const openRenameModal = (docId: string, currentName: string) => {
		setRenameDocumentId(docId);
		setNewName(currentName);
		setShowRenameModal(true);
	};

	// Function to handle the rename action (with PUT request)
	const handleRename = async () => {
		if (!renameDocumentId) return;

		try {
			// Log the data before making the PUT request
			console.log({
				id: renameDocumentId,
				name: newName,
			});

			// Make the PUT request to the backend at /document (without adding the id to the URL)
			const response = await fetch(API_URL, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: renameDocumentId, // Send the document id and new name in the body
					name: newName,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to rename document");
			}

			// Update the document in the local state after successful PUT request
			setDocuments((prevDocs) =>
				prevDocs.map((doc) => (doc.id === renameDocumentId ? { ...doc, name: newName } : doc))
			);

			// Close the modal
			setShowRenameModal(false);
			setRenameDocumentId(null);
			setNewName("");
		} catch (error) {
			console.error("Error renaming document:", error);
		}
	};

	// Function to close the rename modal
	const closeRenameModal = () => {
		setShowRenameModal(false);
		setRenameDocumentId(null);
		setNewName("");
	};

	useEffect(() => {
		window.addEventListener("click", closeMenus);
		return () => {
			window.removeEventListener("click", closeMenus);
		};
	}, [closeMenus, documents]);

	return (
		<div className="p-5 flex flex-col items-center">
			{/* Toggle bar */}
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

			{/* Document grid */}
			<div className="grid grid-cols-4 gap-5 max-w-5xl w-full justify-items-center">
				{activeTab === "My Documents" && (
					<div className="flex flex-col justify-center items-center w-44 h-56 bg-yellow-400 text-gray-900 rounded-lg cursor-pointer shadow-lg">
						<span className="text-4xl mb-2">+</span>
						<span>Create Document</span>
					</div>
				)}

				{/* Filter documents based on the active tab */}
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
									<button className="block w-full px-3 py-1 text-left hover:bg-gray-100">
										Delete
									</button>
								</div>
							)}
						</div>
					))}
			</div>

			{/* Rename modal */}
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
		</div>
	);
};
