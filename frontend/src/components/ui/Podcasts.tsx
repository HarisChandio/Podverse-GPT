import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { ChainlitAPI, sessionState, useChatSession } from "@chainlit/react-client";
import { IoChatbubble } from "react-icons/io5";
import { useRecoilValue } from "recoil";
import { useNavigate } from 'react-router-dom';
const CHAINLIT_SERVER = "http://localhost:8000";
const userEnv = {};

const apiClient = new ChainlitAPI(CHAINLIT_SERVER, "app");
interface Podcast {
    _id: string,
    author: string,
    title: string,
    description: string,
    image: string,
    mp3: string,
    duration: number,
    __version: number,
    transcript: number,
    aws_id: string,
}

export const Podcasts = () => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([])
    const [filter, setFilter] = useState("");
    const [playingPodId, setPlayingPodId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/api/v1/podcast/bulk?filter=${filter}`
                );
                setPodcasts(response.data.podcast);
            } catch (error) {
                console.error("Error fetching podcasts:", error);
            }
        };

        fetchData();
    }, [filter]);

    const handlePlayToggle = (podId: string) => {
        setPlayingPodId(prevPodId => prevPodId === podId ? null : podId); // Toggle play state based on whether it's the current podcast
    };

    return (
        <>
            <div className="justify-item-center">
            <div className="font-bold mt-6 text-lg ">Podcasts</div>
            </div>
            <div className="my-2">
                <input
                    type="text"
                    placeholder="Search podcasts..."
                    onChange={(e) => {
                        setTimeout(() => {
                            setFilter(e.target.value);
                        }, 200);
                    }}
                    className="w-full outline-none border border-black px-2 py-1 rounded"
                ></input>
            </div>
            <div className="flex flex-wrap justify-center">
                {podcasts.map(pod => (
                    <Pod
                        key={pod._id}
                        pod={pod}
                        isPlaying={playingPodId === pod._id} // Check if this podcast is the one playing
                        onPlayToggle={() => handlePlayToggle(pod._id)}
                    />
                ))}
            </div>
        </>
    );
};
import { useAudio } from '../../hooks/AudioContext';
interface PodProps {
    pod: Podcast;
    isPlaying: boolean;
    onPlayToggle: () => void;
}
const Pod: React.FC<PodProps> = ({ pod, isPlaying, onPlayToggle }) => {
    const navigate = useNavigate();
    // Initialize audio playback with the provided mp3 URL
    const { connect } = useChatSession();
    const session = useRecoilValue(sessionState)
    const handlePodcastSelect = async (aws_id: string) => {
        try {
            // if (session?.socket.connected) {
            //     console.log("Already connected in podcasts");
            // }
            // console.log("connecting..")
            // const token = localStorage.getItem('token')
            // console.log("token", token)
            // connect({
            //     client: apiClient,
            //     userEnv: { aws_id },
            //     accessToken: `Bearer: ${token}`,
            // });
            // if (session?.socket.connected) {
            //     connect.log("connected")
            // }
            // Navigate to the playground immediately
            localStorage.setItem('aws_id', aws_id);
            navigate(`/playground/${aws_id}`);
        } catch (error) {
            console.error('Error training on podcast:', error);
        }
    };

    const { play, pause } = useAudio();

    const handlePlayClick = () => {
        if (isPlaying) {
            pause();
        } else {
            play(pod.mp3);
        }
        onPlayToggle();
    };

    return (
        <div className="max-w-xs p-2 mb-2 rounded overflow-hidden shadow-lg" >
            <img className="w-min" src={pod.image} alt="Podcast Cover" />
            <div className="px-4 py-2">
                <div className="font-bold text-lg mb-1">{pod.title}</div>
            </div>
            <div className="px-4 py-2 flex justify-center items-center "> {/* Added items-center for vertical alignment */}
                <button onClick={handlePlayClick} className="bg-purple-500 text-white p-2 rounded-full" style={{ width: 50, height: 50 }}>
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </button>
                <b className="m-2"></b>
                <IoChatbubble onClick={() => handlePodcastSelect(pod.aws_id)} className="bg-purple-500 text-white p-2 rounded-full" style={{ width: 50, height: 50, fontSize: '1.25rem' }} />
            </div>
        </div >
    );
}
