import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";

export function Upload(props) {
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const inputRef = useRef(null);

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleDisplayFileDetails = () => {
    inputRef.current?.files &&
      setUploadedFileName(inputRef.current.files[0].name);
    props.onUpload && props.onUpload(inputRef.current.files[0]);
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        className="d-none"
        onChange={handleDisplayFileDetails}
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={handleUpload}
        style={{ float: "right" }}
      >
        {uploadedFileName ? uploadedFileName : "Upload"}
      </Button>
    </>
  );
}
