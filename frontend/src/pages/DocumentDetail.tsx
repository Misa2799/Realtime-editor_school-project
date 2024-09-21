import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"
import { FaShareAlt } from 'react-icons/fa';
import { io } from 'socket.io-client'
import QuillCursors from 'quill-cursors';
import { useUser } from "@clerk/clerk-react";

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
]

export const DocumentDetail = () => {
    const { id } = useParams(); 

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [receivedDelta, setDelta] = useState<any>();
    const [quill, setQuill] = useState<Quill>();

    const { user } = useUser();
    const currentUserId = user?.id || "";
    const currentUserName = user?.username || "";
    console.log("currentUser:", currentUserId, currentUserName);

    const socket = io("http://localhost:3001")

    const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
        if (wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        Quill.register('modules/cursors', QuillCursors);
        const quill = new Quill(
            editor,
            { 
                theme: "snow",
                modules: {
                    cursors: true,
                    toolbar: TOOLBAR_OPTIONS
                }
            }
        );
        setQuill(quill);

        quill.on('text-change', (delta: any, oldDelta: any, source: any) => {
            if (source === "user") {
                console.log("text-changed", delta, oldDelta, source);
                socket.emit("send-changes", delta, id)
            }
        });

        quill.on("selection-change", (range: any, oldRange: any, source: any) => {
            if (source === "user") {
                console.log("selection-changed", range, oldRange, source);
                socket.emit("send-selection-changes", range, id, currentUserId, currentUserName)
            }
        })
    }, []);

    //socket.io-client
    useEffect (() => {
        socket.emit("join-room", id);

        socket.on("send-changes", (data: any, range: any, editorId, editorUserName) => {
            console.log("This is socket",data)

            console.log("received-range(useEffect)", range);
            console.log("editorId(useEffect)", editorId);
            console.log("editorUserName(useEffect)", editorUserName);

            setDelta(data)
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
        })

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
        })

        if (quill != undefined) {
            quill.updateContents(receivedDelta)
        }

        return () => {
            socket.off("send-changes")
        }
    }, [receivedDelta]);

    useEffect(() => {
        // add class Tailwind for `ql-container`
        document.querySelectorAll('.ql-container').forEach((element) => {
            element.classList.add('p-4', 'border', 'border-gray-300', 'rounded-lg');
        });

        // add class Tailwind for `ql-editor`
        document.querySelectorAll('.ql-editor').forEach((element) => {
            element.classList.add( 
            'min-h-[1056px]', 
            'p-[96px]', 
            'm-4',
            'shadow-md');
            (element as HTMLElement).style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
        });

        // add class Tailwind for `.ql-toolbar`
        document.querySelectorAll('.ql-toolbar').forEach((element) => {
            element.classList.add(
            'flex', 
            'justify-center', 
            'sticky', 
            'top-0', 
            'z-10',
            'bg-gray-200',
            'border-none' );
        (element as HTMLElement).style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
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

    return (
        <div>
            <div className="flex items-center border-2 rounded-full p-2 w-auto m-8" style={{ borderColor: '#5c840c' }}>
                <div className="flex-1 px-4 py-2 text-gray-700"><h1>Document Detail: {id}</h1></div>
                <div className="p-2 cursor-pointer" style={{ color: '#889f28' }} onClick={togglePopup}><FaShareAlt size={20} /></div>
            </div>

            {isPopupOpen && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg w-72 z-50" style={{ background: '#889f28' }} >
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
                        className=" text-black font-bold py-2 px-4 rounded-full w-full"  style={{ background: '#ecd90e' }}
                    >
                        Share
                    </button>
                </div>
            )}
            
            {/* Text Editor */}
            <div className = "container border-2 rounded-lg p-4 ml-8" style={{ borderColor: '#5c840c' }} ref={wrapperRef} ></div>

        </div>
    );
}

function generateRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 0xFFFFFF).toString(16);

    return `#${randomColor.padStart(6, '0')}`;
}



