import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response,setResponse] = useState('');

  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully!', response.message);
      setResponse(response. message)

    } catch (error) {
      console.error('Error uploading file:', error);
      setResponse(`Failed to upload`)
    }
  };

  useEffect(() =>{
    //alert(response)
  },[response])


  //Requesting for a audio file  
    const fetchAudio = async () => {
      try {
        setLoading(true);
        // Make a GET request to the server to fetch the audio file URL
        const response = await axios.get('http://localhost:5000/audio', {
          responseType: 'blob' // Ensure the response type is blob to handle binary data
        });
  
        // Create a URL for the audio blob
        const audioBlob = new Blob([response.file], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
  
        setAudioUrl(audioUrl);
      } catch (error) {
        console.error('Error fetching audio:', error);
      } finally {
        setLoading(false);
      }
    };


  return (
    <center>
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button><br></br><br></br>
      <h3>{response}</h3><br></br><br></br><br></br>

      <h4> Get Audio</h4>
      <div>
      <button onClick={fetchAudio} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Audio'}
      </button>
      {audioUrl && (
        <div>
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
    </center>
  );
};

export default App;
