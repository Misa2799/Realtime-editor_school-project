import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { FaShareAlt } from "react-icons/fa";
import { Button } from "../components/Button";
import CancelModal from "../components/CancelModal";
import { io } from "socket.io-client";
import QuillCursors from "quill-cursors";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import SaveModal from "../components/SaveModal";

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
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [receivedDelta, setDelta] = useState<any>();
  const [quill, setQuill] = useState<Quill>();

  const { user } = useUser();
  const currentUserId = user?.id || "";
  const currentUserName = user?.username || "";
  console.log("currentUser:", currentUserId, currentUserName);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const socket = io("http://localhost:3001", {
    withCredentials: true,
  });

  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    Quill.register("modules/cursors", QuillCursors);
    const quill = new Quill(editor, {
      theme: "snow",
      modules: {
        cursors: true,
        toolbar: TOOLBAR_OPTIONS,
      },
    });
    setQuill(quill);

    quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
      if (source === "user") {
        console.log("text-changed", delta, oldDelta, source);
        socket.emit("send-changes", delta, id);
      }
    });

    quill.on("selection-change", (range: any, oldRange: any, source: any) => {
      if (source === "user") {
        console.log("selection-changed", range, oldRange, source);
        socket.emit(
          "send-selection-changes",
          range,
          id,
          currentUserId,
          currentUserName
        );
      }
    });
  }, []);

  //socket.io-client
  useEffect(() => {
    socket.emit("join-room", id);

    socket.on(
      "send-changes",
      (data: any, range: any, editorId, editorUserName) => {
        console.log("This is socket", data);

        console.log("received-range(useEffect)", range);
        console.log("editorId(useEffect)", editorId);
        console.log("editorUserName(useEffect)", editorUserName);

        setDelta(data);
        console.log("received-delta(useEffect)", receivedDelta);

        const cursorColor = generateRandomColor();

        // FIXME: using the same code as the one inside send-selection-changes, but it's not working
        if (quill != undefined) {
          // don't show cursor for current user
          if (editorId != currentUserId) {
            const cursors: any = quill.getModule("cursors");
            cursors.createCursor(editorId, editorUserName, cursorColor);
            cursors.moveCursor(editorId, range);
            cursors.toggleFlag(editorId, true);
          }
        }
      }
    );

    socket.on("send-selection-changes", (range, editorId, editorUserName) => {
      console.log("received-selection: ", range);
      console.log("editorId: ", editorId);
      console.log("editorUserName: ", editorUserName);

      const cursorColor = generateRandomColor();

      if (quill != undefined) {
        // don't show cursor for current user
        if (editorId != currentUserId) {
          const cursors: any = quill.getModule("cursors");
          cursors.createCursor(editorId, editorUserName, cursorColor);
          cursors.moveCursor(editorId, range);
          cursors.toggleFlag(editorId, true);
        }
      }
    });

    if (quill != undefined) {
      quill.updateContents(receivedDelta);
    }

    return () => {
      socket.off("send-changes");
      socket.off("send-selection-changes");
    };
  }, [receivedDelta]);

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

  // call PUT /document API to get shared users
  const updateSharedUsers = async (email: string) => {
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:3000/document", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          sharedWith: [email],
        }),
      });
      if (response.ok) {
        alert(`Shared with user: ${email}`);
        console.log("Shared with user: ", email);
      } else {
        alert(`Error while sharing with user: ${email}`);
        console.log("Error while sharing with user: ", email);
      }
    } catch {
      alert("Error while fetching shared users");
      console.log("Error while fetching shared users");
    }
  };

  // function for share
  const handleShare = () => {
    console.log(`Sharing to: ${email}`);
    updateSharedUsers(email);

    setIsPopupOpen(false); // close pop up after share
    setEmail(""); // clear email after share
  };

  // function to cancel document and go back to List page
  const handleCancelModal = () => {
    setIsCancelOpen(true);
  };

  // function to send data to DB
  const handleSave = async () => {
    // get delta with quill and convert to string
    const delta = quill?.getContents();
    const deltaString = JSON.stringify(delta);
    console.log("deltaString(useEffect):", deltaString);

    // save it to database as content
    // call PUT /document API here

    try {
      const token = await getToken(); // Token from Clerk
      const response = await fetch("http://localhost:3000/document", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // IMPORTANT! Don't forget to send this to the server
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          content: deltaString,
        }),
      });

      if (response.ok) {
        setIsSaveOpen(true);
      } else {
        alert("Error saving the document");
        console.log("Error response:", await response.json());
      }
    } catch (error) {
      alert("Error while saving the document");
      console.error("Error:", error);
    }
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
          {isCancelOpen && <CancelModal setIsCancelOpen={setIsCancelOpen} />}

          <Button
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={handleSave}
            children={"SAVE"}
          />
          {isSaveOpen && <SaveModal setIsSaveOpen={setIsSaveOpen} />}
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

function generateRandomColor(): string {
  const randomColor = Math.floor(Math.random() * 0xffffff).toString(16);

  return `#${randomColor.padStart(6, "0")}`;
}
