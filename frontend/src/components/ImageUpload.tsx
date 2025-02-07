import { useState } from "react";
import { config } from "../utils";

const pinata = config.pinata;

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File>();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target?.files?.[0]);
  };

  const handleSubmission = async () => {
    try {
      const upload = await pinata.upload.file(selectedFile!);
      console.log(upload);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <label className="form-label"> Upload Image</label>
      <input type="image" onChange={changeHandler} />
      <button onClick={handleSubmission}>Submit</button>
    </>
  );
}

export default ImageUpload;
