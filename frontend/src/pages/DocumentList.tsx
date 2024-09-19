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

	// Fetch documents from backend
	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				const response = await fetch("http://localhost:3000/documents"); // Replace with the actual API endpoint
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

	useEffect(() => {
		window.addEventListener("click", closeMenus);
		return () => {
			window.removeEventListener("click", closeMenus);
		};
	}, [documents]);

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
									<button className="block w-full px-3 py-1 text-left hover:bg-gray-100">
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
		</div>
	);
};
