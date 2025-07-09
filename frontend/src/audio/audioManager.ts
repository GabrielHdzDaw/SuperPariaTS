import flipSoundUrl from '../assets/sounds/flip.mp3';
import matchPairSoundUrl from '../assets/sounds/clink.wav';
import wooshSoundUrl from '../assets/sounds/woosh.mp3';
import clickSoundUrl from '../assets/sounds/click.mp3';
import mouseOverSoundUrl from '../assets/sounds/menu5.mp3';
import applauseSoundUrl from '../assets/sounds/applause.mp3';
import wowSoundUrl from '../assets/sounds/wow.mp3';
import scratchSoundUrl from '../assets/sounds/scratch.mp3';
import gameOverSoundUrl from '../assets/sounds/gameover.mp3';
import scoreSoundUrl from '../assets/sounds/score.mp3';
import greatComboSoundUrl from '../assets/sounds/great.wav';
import coolComboSoundUrl from '../assets/sounds/cool.wav';
import crazyComboSoundUrl from '../assets/sounds/crazy.wav';
import maniacComboSoundUrl from '../assets/sounds/maniac.wav';
import insaneComboSoundUrl from '../assets/sounds/insane.wav';
import seerComboSoundUrl from '../assets/sounds/seer.wav';
import godlikeComboSoundUrl from '../assets/sounds/godlike.wav';

const soundUrls = {
    flip: flipSoundUrl,
    matchPair: matchPairSoundUrl,
    woosh: wooshSoundUrl,
    click: clickSoundUrl,
    mouseOver: mouseOverSoundUrl,
    applause: applauseSoundUrl,
    wow: wowSoundUrl,
    scratch: scratchSoundUrl,
    gameOver: gameOverSoundUrl,
    score: scoreSoundUrl,
    greatCombo: greatComboSoundUrl,
    coolCombo: coolComboSoundUrl,
    crazyCombo: crazyComboSoundUrl,
    maniacCombo: maniacComboSoundUrl,
    insaneCombo: insaneComboSoundUrl,
    seerCombo: seerComboSoundUrl,
    godlikeCombo: godlikeComboSoundUrl,
} as const;

export type SoundName = keyof typeof soundUrls;

type PlaySound = {
    [K in SoundName]: (volume?: number) => void;
};

export const playSound: PlaySound = Object.fromEntries(
    Object.entries(soundUrls).map(([name, url]) => [
        name,
        (volume: number = 1) => {
            const audio = new Audio(url);
            audio.volume = volume;
            audio.play();
        },
    ])
) as PlaySound;
