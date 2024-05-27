// AudioContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AudioContextType {
    audio: HTMLAudioElement | null;
    play: (src: string) => void;
    pause: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within a AudioProvider');
    }
    return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
                audio.removeAttribute('src'); // Remove source to stop downloading
                audio.load();
            }
        };
    }, [audio]);

    const play = (src: string) => {
        if (!audio) {
            const newAudio = new Audio(src);
            setAudio(newAudio);
            newAudio.play();
        } else {
            audio.src = src;
            audio.play();
        }
    };

    const pause = () => {
        if (audio) {
            audio.pause();
        }
    };

    return (
        <AudioContext.Provider value={{ audio, play, pause }}>
            {children}
        </AudioContext.Provider>
    );
};
