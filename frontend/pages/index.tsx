import React, { useState } from "react";
import FileTree from "@/components/FileTree";
import FilePreview from "@/components/FilePreview";

export default function Home() {

  const [selectedFile, setSelectedFile] = useState('');

  return (
    <div className="flex flex-row">
      <div className="w-1/2">
        <FileTree onSelectFile={setSelectedFile} />
      </div>
      {selectedFile &&
      <div className="w-1/2">
        <FilePreview url={selectedFile} />
      </div>
      }
    </div>
  );
}
