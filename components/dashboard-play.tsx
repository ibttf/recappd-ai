"use client";
import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, FastForward } from "lucide-react";
const DashboardPlay = ({ audioUrl }: { audioUrl: string }) => {
  const audioRef = useRef<any>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: any) => {
    const time = (e.target.value / 100) * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  const handleSpeedUp = () => {
    const newRate = playbackRate < 3 ? playbackRate + 0.5 : 1;
    audioRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-black w-5/6 -ml-4 fixed bottom-0 p-4">
      <audio ref={audioRef} src={audioUrl}></audio>

      <div className="flex justify-center items-center  space-x-8">
        <button
          onClick={() => {
            audioRef.current.currentTime -= 10;
            setCurrentTime(audioRef.current.currentTime);
          }}
          className="text-white"
        >
          <FastForward className="w-8 h-8 rotate-180" />
        </button>
        {isPlaying ? (
          <Pause className="text-white w-8 h-8" onClick={togglePlay} />
        ) : (
          <Play className="text-white w-8 h-8" onClick={togglePlay} />
        )}
        <button
          onClick={() => {
            audioRef.current.currentTime += 10;
            setCurrentTime(audioRef.current.currentTime);
          }}
          className="text-white"
        >
          <FastForward className="w-8 h-8" />
        </button>
        <div className="relative">
          <button onClick={handleSpeedUp} className="text-white">
            {playbackRate}x
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <span className="text-white mr-4">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="w-full mr-auto appearance-none bg-green-500 h-2 rounded z-0"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleProgressChange}
        />
        <span className="text-white ml-4 z-10">
          {!isNaN(duration) ? formatTime(duration) : "00:00"}
        </span>
      </div>
    </div>
  );
};

export default DashboardPlay;
