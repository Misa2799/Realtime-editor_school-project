import { useParams } from "react-router-dom";

export const DocumentDetail = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Document Detail: {id}</h1>
        </div>
    );
}