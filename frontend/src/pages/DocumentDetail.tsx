import { useParams } from "react-router-dom";
import { useCallback} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"
import { FaShareAlt } from 'react-icons/fa';


export const DocumentDetail = () => {
    const { id } = useParams(); 
    const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
        if (wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        new Quill(editor, { theme: "snow" });
    }, []);

    return (
        <div>
            <div className="flex items-center border-2 rounded-full p-2 w-auto m-8" style={{ borderColor: '#5c840c' }}>
                <div className="flex-1 px-4 py-2 text-gray-700">Document name</div>
                <div className="p-2 text-green-500 cursor-pointer"><FaShareAlt size={20} /></div>
            </div>
            {/* <h1 className= "bg-slate-800">Document Detail: {id}</h1> */}
            {/* Text Editor */}
            <div id="container" ref={wrapperRef} ></div>
        </div>
    );
}





