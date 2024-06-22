import React from "react";
import styles from './CSS/SongsList.module.css'

const SongsList = ({name,startFun}) => {

//const [mpdUrl, setMpdUrl] = useState('');

// Get the network speed of the running device
/*   const getNetworkSpeed = () => {
    if (navigator.connection && navigator.connection.effectiveType) {
      return navigator.connection.effectiveType; // This can be 'slow-2g', '2g', '3g', or '4g'
    }
    return '4g'; // Default to '4g' if NetworkInformation API is not supported
  }; */


// Fetching Audio from server as respected to network speed
/*   const fetchAudio = async (name) => {
    //console.log(`Audio Name : ${name}`)
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
      const response = await axios.get(`http://localhost:5000/audio?bitrate?=${encodeURIComponent(bitrate)}&name=${encodeURIComponent(name)}`);
      const { mpdUrl } = response.data;
      setMpdUrl(`http://localhost:5000${mpdUrl}`);
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  }; */

  //Assigning the audio MDP file segments to the MediaPlayer to play the audio as it's peridically fetches the segments
/*   useEffect(() => {
    if (mpdUrl) {
      const player = dashjs.MediaPlayer().create();
      player.initialize(audioRef.current, mpdUrl, true);

      return () => {
        player.destroy();
      };
    }
  }, [mpdUrl]); */

const startAudio = () => {
    //startAudio(name);
    startFun(name)
}


    return(
        <>
            <div class={styles.mdiv}>
                <p onClick={startAudio}>{name}</p>
            </div>
        </>
    )
}

export default SongsList;