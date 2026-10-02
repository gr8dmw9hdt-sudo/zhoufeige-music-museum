"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type BackgroundAudio = {
  playing: boolean;
  toggle: () => void;
};

const AudioContext = createContext<BackgroundAudio>({
  playing: false,
  toggle: () => {},
});

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [playing]);

  return (
    <AudioContext.Provider value={{ playing, toggle }}>
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="/audio/jinye-de-wange.mp3"
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useBackgroundMusic() {
  return useContext(AudioContext);
}
