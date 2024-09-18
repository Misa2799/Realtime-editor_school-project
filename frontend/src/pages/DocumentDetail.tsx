import { useParams } from "react-router-dom";
import { useEffect} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"

export const DocumentDetail = () => {
    const { id } = useParams(); 

    useEffect(() => {
        new Quill("#container", {theme: "snow"})
    }, [])

    return (
        <div>
            <h1>Document Detail: {id}</h1>
            Text Editor
            <div id="container"></div>
        </div>
    );
}

