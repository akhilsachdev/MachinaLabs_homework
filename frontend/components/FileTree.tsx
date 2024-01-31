import React, { useEffect, useState } from "react";
import { Tree, NodeRendererProps } from "react-arborist";
import { FaDownload, FaFolder, FaFile } from "react-icons/fa";

interface FileTreeProps {
    onSelectFile: any
}

export default function FileTree({ onSelectFile }: FileTreeProps) {

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
            <Tree 
            initialData={tree}
            openByDefault={false}
            width={600}
            height={1000}
            indent={24}
            rowHeight={36}
            overscanCount={1}
            paddingTop={30}
            paddingBottom={10}
            padding={25 /* sets both */}
            >
                {(props) => <Node {...props} onSelectFile={onSelectFile} />}
            </Tree>

        </div>
    )
}


function Node({ node, style, dragHandle, onSelectFile }: NodeRendererProps<any> & FileTreeProps) {

    const handleFileSelect = () => {
        node.toggle();
        if (node.data.type === "file") {
            onSelectFile(node.data.path);
        }
    }

    return (
        <div style={{ ...style, display: 'flex', justifyContent: 'space-between' }} ref={dragHandle}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleFileSelect}>
                {node.data.type === "folder" ? (
                    <FaFolder style={{ marginRight: "5px" }} />
                ) : (
                    <FaFile style={{ marginRight: "5px" }} />
                )}
                {node.data.name}
            </div>
        </div>
    )
}