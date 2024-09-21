import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { FaShareAlt } from "react-icons/fa";
import { Button } from "../components/Button";
import CancelModal from "../components/CancelModal";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export const DocumentDetail = () => {
  const { id } = useParams();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } });
  }, []);

  useEffect(() => {
    // add class Tailwind for `ql-container`
    document.querySelectorAll(".ql-container").forEach((element) => {
      element.classList.add("p-4", "border", "border-gray-300", "rounded-lg");
    });

    // add class Tailwind for `ql-editor`
    document.querySelectorAll(".ql-editor").forEach((element) => {
      element.classList.add("min-h-[1056px]", "p-[96px]", "m-4", "shadow-md");
      (element as HTMLElement).style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
    });

    // add class Tailwind for `.ql-toolbar`
    document.querySelectorAll(".ql-toolbar").forEach((element) => {
      element.classList.add(
        "flex",
        "justify-center",
        "sticky",
        "top-0",
        "z-10",
        "bg-gray-200",
        "border-none"
      );
      (element as HTMLElement).style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
    });
  }, []);

  // function for pop up
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // function for share
  const handleShare = () => {
    console.log(`Sharing to: ${email}`);
    setIsPopupOpen(false); // close pop up after share
  };

  // function to cancel document and go back to List page
  const handleCancelModal = () => {
    console.log("cancel is clicked");
    // display modal and set "Cancel a document?", Yes and No button
    setIsOpen(true);
    // if Yes, go back to List page
  };

  // function to send data to DB
  const handleSave = () => {
    console.log("save is clicked");
    // send text to DB
    // display a message "Saved!"
  };

  return (
    <div>
      <div
        className="flex items-center border-2 rounded-full p-2 w-auto m-8"
        style={{ borderColor: "#5c840c" }}
      >
        <div className="flex-1 px-2 py-2 text-gray-700">
          <h1>Document Detail: {id}</h1>
        </div>
        <div className="saveBtn mx-8">
          <Button
            className="mr-6 py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-500 dark:text-gray-100 dark:border-gray-300 dark:hover:text-white dark:hover:bg-gray-400"
            onClick={handleCancelModal}
            children={"CANCEL"}
          />
          {isOpen && <CancelModal setIsOpen={setIsOpen} />}

          <Button
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={handleSave}
            children={"SAVE"}
          />
        </div>
        <div
          className="p-2 cursor-pointer"
          style={{ color: "#889f28" }}
          onClick={togglePopup}
        >
          <FaShareAlt size={20} />
        </div>
      </div>

      {isPopupOpen && (
        <div
          className="absolute top-20 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg w-72 z-50"
          style={{ background: "#889f28" }}
        >
          <div className="mb-4">
            <label className="block text-black font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-full"
              placeholder="Enter email"
            />
          </div>
          <button
            onClick={handleShare}
            className=" text-black font-bold py-2 px-4 rounded-full w-full"
            style={{ background: "#ecd90e" }}
          >
            Share
          </button>
        </div>
      )}

      {/* Text Editor */}
      <div
        className="container border-2 rounded-lg p-4 mx-auto"
        style={{ borderColor: "#5c840c" }}
        ref={wrapperRef}
      ></div>
    </div>
  );
};
