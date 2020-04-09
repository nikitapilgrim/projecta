import WaveSurfer from "wavesurfer.js";
import {useEffect, useRef} from "react";

export default ({audio}) => {
    const waveform = useRef(null)
    const ref = useRef(null);
    const refWave = useRef(null);

    const handlePlay = () => {
        console.log(waveform.current, audio)
        waveform.current.playPause();
    };

    useEffect(() => {
        if (ref.current && refWave.current) {
            waveform.current = WaveSurfer.create({
                barWidth: 3,
                cursorWidth: 1,
                container: refWave.current,
                backend: 'WebAudio',
                height: 80,
                progressColor: '#2D5BFF',
                responsive: true,
                waveColor: '#EFEFEF',
                cursorColor: 'transparent',
            });

        }

    }, [ref, refWave]);
    useEffect(() => {
        if (waveform.current) {
            waveform.current.load(ref.current);
        }
    },[audio]);

    return (
        <>
            <div onClick={handlePlay} ref={refWave}></div>
            <audio ref={ref} src={audio}/>
        </>
    )
}