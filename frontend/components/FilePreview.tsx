import React, { useEffect, useState } from "react";
import Papa from 'papaparse';
import { ClipLoader } from "react-spinners";
import { useReactTable } from "@tanstack/react-table";
import Modal from 'react-modal';
import Table from "./Table";

Modal.setAppElement('#__next');

interface FilePreviewProps {
    url: string;
}

export default function FilePreview({ url }: FilePreviewProps) {
    const [fileContent, setFileContent] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    console.log(url)

    const fetchContent = async () => {
        setLoading(true);
        const body = {
            fileUrl: url
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
        const res = await fetch('http://localhost:8000/api/v1/read_file', options);
        const data = await res.text();
        return data;
       
    }

    
    const downloadFile = async () => {
        if (url) {
            const content_type = url.split(".").pop();
            const blob = new Blob([fileContent], { type: `text/${content_type}` });
            const download_url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = download_url;
            a.download = url.split("/").pop() ?? "";
            a.style.display = 'none'

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }


    const handleCSV = (data: any) => {
        Papa.parse(data, {
            complete: (result) => {
                setContent(JSON.stringify(result.data.slice(0, 5), null, 2))
                console.log(JSON.parse(JSON.stringify(result.data.slice(0, 5), null, 2)));
            },
            header: true,
        });
    }

    const handleJSON = (data: any) => {
        try {
            const parsed = JSON.parse(data);
            setContent(JSON.stringify(parsed, null, 2));
        } catch (e: any) {
            setError(e.message);
        }
    }

    const handleLog = (data: any) => {
        setContent(data);
    }



    useEffect(() => {
        
        fetchContent().then(res => {
            setFileContent(res);
            setLoading(false);
        });
    }, [url]);

    useEffect(() => {
        switch(url.split(".").pop()) {
            case "csv":
                handleCSV(fileContent);
                break;
            case "json":
                handleJSON(fileContent);
                break;
            case "log":
                handleLog(fileContent);
                break;
            default:
                setContent("No preview available");
        }

    }, [url, content, fileContent]);

    return (
        <div>
            <button onClick={downloadFile}>Download</button>
            <div className="flex items-center justify-center">
                <div>
                    {loading ? 
                    <Modal 
                    isOpen={loading}
                    contentLabel="Loading Modal"
                    style={{
                        overlay: {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        content: {
                            position: 'relative',
                            top: 'auto',
                            left: 'auto',
                            right: 'auto',
                            bottom: 'auto',
                            textAlign: 'center',
                        },
                    }}>
                        <ClipLoader />
                    </Modal>
                    :
                    <div>
                        <pre>
                            {content}
                        </pre>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}


                                