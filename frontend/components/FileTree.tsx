import React, { useEffect, useState } from "react";
import { Tree } from "react-arborist";

export default function FileTree() {

    const [tree, setTree] = useState();

    async function getTree() {
        const res = await fetch("http://localhost:8000/api/v1/file_tree");
        const data = await res.json();
        
        return data;
    }

    useEffect(() => {
        getTree().then(res => {
            setTree(res);
        });
    }, []);

    return (
        <div>
            <Tree initialData={tree} />
        </div>
    )
}