import { useParams } from "react-router-dom";
import { useCallback, useEffect} from "react";
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

    useEffect(() => {
        // add class Tailwind for `ql-container`
        document.querySelectorAll('.ql-container').forEach((element) => {
            element.classList.add('p-4', 'border', 'border-gray-300', 'rounded-lg');
        });

        // add class Tailwind for `ql-editor`
        document.querySelectorAll('.ql-editor').forEach((element) => {
            element.classList.add( 
            'w-[1430px]',   //816px 
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
            'border-none'
        );
        (element as HTMLElement).style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
    });

    }, []);

    return (
        <div>
            <div className="flex items-center border-2 rounded-full p-2 w-auto m-8" style={{ borderColor: '#5c840c' }}>
                <div className="flex-1 px-4 py-2 text-gray-700"><h1>Document Detail: {id}</h1></div>
                <div className="p-2 cursor-pointer" style={{ color: '#889f28' }} ><FaShareAlt size={20} /></div>
            </div>
            
            {/* Text Editor */}
            <div className = "container border-2 rounded-lg p-4 ml-8" style={{ borderColor: '#5c840c' }} ref={wrapperRef} ></div>

        </div>
    );
}





