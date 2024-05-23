import React, { useState } from "react"
import axios from 'axios'
import './fileupload.css'

function FileUpload() {
  const [file, setFile] = useState()
  const upload = () => {
    const formData = new FormData()
    formData.append('file', file)
    axios.post('http://localhost:3001/upload',formData )
    .then( res => {})
    .catch(er => console.log(er))
  }
   return (
    <>
<h1 class="file-upload-title">File Upload</h1>
<div class="file-upload-container">
  <input type="file" id="fileInput" class="file-input" onChange={(e) => setFile(e.target.files[0])}/>
  <button type="button" id="uploadButton" class="upload-button" onClick={upload}>Upload</button>
</div>
</>

  )
}

export default FileUpload;