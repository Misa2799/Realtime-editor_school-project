import { useParams } from "react-router-dom";
import { useCallback} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"


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
            <h1 className= "bg-slate-800">Document Detail: {id}</h1>
            Text Editor
            <div id="container" ref={wrapperRef} ></div>
        </div>
    );
}





