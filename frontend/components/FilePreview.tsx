import React, { useEffect, useState } from "react";
import Papa from 'papaparse';
import { ClipLoader } from "react-spinners";
import Modal from 'react-modal';

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




        // try {
        //     const body = {
        //         fileUrl: url
        //     }
        //     const options = {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(body)
        //     }
        //     const res = await fetch('http://localhost:8000/api/v1/download_file', options);
        //     if (!res.ok) {
        //         throw new Error('Failed to download file');
        //     }
        //     const data = await res.text();
        // } catch (error) {
        //     // Handle the error here
        //     console.error(error);
        // }
    }


    const handleCSV = (data: any) => {
        Papa.parse(data, {
            complete: (result) => {
                if (url.includes("form_path")) {
                    setContent(JSON.stringify(result.data.slice(8, 13), null, 2))
                    return;
                }
                setContent(JSON.stringify(result.data.slice(0, 5), null, 2))
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
        <div className="flex justify-center items-center">
            <button className="absolute top-10 right-10" onClick={downloadFile}>Download</button>
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
                <pre>
                    {content}
                </pre>
                }
            </div>
        </div>
    )
}