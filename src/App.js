import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import dashjs from 'dashjs';
import styles from './App.css'

import SongsList from './SongList';

const DashAudioPlayer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading,setLoading] = useState(false);
  const [response, setResponse] = useState(false);
  const audioRef = useRef(null);
  const [mpdUrl, setMpdUrl] = useState('');
  const [allAudios, setAllAudios] = useState([])

  const server = process.env.SERVER_URL || 'https://streamingserver-ajue.onrender.com/'

  //console.log(server_url)
  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

//Retriving all the Audio file names from server
  const AllAudios = async () =>{
    try{
      const response = await axios.get(`${server}allaudios`);
      const nestedArray = response.data; // Assuming the response is the nested array [[...]]
      // Extract filenames from nested json array " [[{},{}]]"
      const extractedFilenames = nestedArray[0].map(file => file.filename);
      setAllAudios(extractedFilenames);
    }
    catch(err){
      console.log(`Error from AllAudios : ${err}`)
    }
  }

  
  useEffect(() =>{
    AllAudios();
  },[])

  useEffect(() =>{
    console.log(allAudios)
  },[allAudios])



  //Uploading audio to the server
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    setLoading(true)
    try {
      const response = await axios.post(`${server}upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResponse(true)
      setLoading(false)
      AllAudios();
      //console.log('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(`Failed to upload`)
    }
  };

  useEffect(() => {
    console.log(`File upload Loading: ${loading}`)
  },[loading])
  useEffect(() => {
    console.log(`File upload Response : ${response}`)
  },[response])



// Fetching Audio from server as respected to network speed
  const getNetworkSpeed = () => {
    if (navigator.connection && navigator.connection.effectiveType) {
      return navigator.connection.effectiveType; // This can be 'slow-2g', '2g', '3g', or '4g'
    }
    return '4g'; // Default to '4g' if NetworkInformation API is not supported
  };

  const fetchAudio = async (name) => {
    console.log(`Audio Name : ${name}`)
    try {
      const networkSpeed = getNetworkSpeed();
      let bitrate;
      switch (networkSpeed) {
        case 'slow-2g':
        case '2g':
          bitrate = '64k';
          break;
        case '3g':
          bitrate = '128k';
          break;
        case '4g':
        default:
          bitrate = '320k';
          break;
      }

      const response = await axios.get(`${server}audio?bitrate?=${encodeURIComponent(bitrate)}&name=${encodeURIComponent(name)}`);
      const { mpdUrl } = response.data;
      setMpdUrl(`https://streamingserver-ajue.onrender.com${mpdUrl}`);
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };

  //Fetching audio onloading page
  useEffect(() => {
    //fetchAudio();
  }, []);

  useEffect(() => {
    if (mpdUrl) {
      const player = dashjs.MediaPlayer().create();
      player.initialize(audioRef.current, mpdUrl, true);

      return () => {
        player.destroy();
      };
    }
  }, [mpdUrl]);


  const funDemo = (name) => {
    console.log(`funDemo : ${name}`)
  }

  return (
    <div>
      <center>
        <h1>File Upload</h1>
        <input class='fileSelect' type="file" onChange={handleFileChange} />
        <button class='uploadBtn' onClick={handleUpload}>Upload</button><br></br>
        {loading && <div>Loading...</div>}
        {!loading && response && <h3>Uploaded successfully</h3>}
      </center>

      {/* To Display all the audio names  */}
        {
          allAudios.map((name, idx) => 
             <SongsList key={idx} startFun={ fetchAudio} name={name}/>,
             {/* <h3 key={idx} onClick={() => fetchAudio(name)}>{name}</h3> */}, 
          )
        }
      
         
      <center>
        <br></br>
        <h3>{response}</h3><br></br><br></br><br></br>
        <audio ref={audioRef} controls />
      </center>
    </div>
  );
};

export default DashAudioPlayer;
