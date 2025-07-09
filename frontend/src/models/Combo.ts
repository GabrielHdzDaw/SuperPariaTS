import { playSound } from '../audio/audioManager';
import type { SoundName } from '../audio/audioManager';

export default class Combo {
    public readonly name: string
    public readonly value: number
    public readonly sound: SoundName
    constructor(name: string, value: number, sound: SoundName) {
        this.name = name;
        this.value = value;
        this.sound = sound;
    }

    public playSound(volume: number = 1): void {
        playSound[this.sound](volume);
    }

}