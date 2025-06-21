type SoundMap = {
    flip: HTMLAudioElement;
    matchPair: HTMLAudioElement;
    woosh: HTMLAudioElement;
    click: HTMLAudioElement;
    mouseOver: HTMLAudioElement;
    applause: HTMLAudioElement;
    wow: HTMLAudioElement;
    scratch: HTMLAudioElement;
    gameOver: HTMLAudioElement;
    score: HTMLAudioElement;
    greatCombo: HTMLAudioElement;
    coolCombo: HTMLAudioElement;
    crazyCombo: HTMLAudioElement;
    maniacCombo: HTMLAudioElement;
    insaneCombo: HTMLAudioElement;
    seerCombo: HTMLAudioElement;
    godlikeCombo: HTMLAudioElement;
};


export const sounds: SoundMap = {
    flip: new Audio("../assets/sounds/flip.mp3"),
    matchPair: new Audio("../assets/sounds/clink.wav"),
    woosh: new Audio("../assets/sounds/woosh.mp3"),
    click: new Audio("../assets/sounds/click.mp3"),
    mouseOver: new Audio("../assets/sounds/menu5.mp3"),
    applause: new Audio("../assets/sounds/applause.mp3"),
    wow: new Audio("../assets/sounds/wow.mp3"),
    scratch: new Audio("../assets/sounds/scratch.mp3"),
    gameOver: new Audio("../assets/sounds/gameover.mp3"),
    score: new Audio("../assets/sounds/score.mp3"),
    greatCombo: new Audio("../assets/sounds/great.wav"),
    coolCombo: new Audio("../assets/sounds/cool.wav"),
    crazyCombo: new Audio("../assets/sounds/crazy.wav"),
    maniacCombo: new Audio("../assets/sounds/maniac.wav"),
    insaneCombo: new Audio("../assets/sounds/insane.wav"),
    seerCombo: new Audio("../assets/sounds/seer.wav"),
    godlikeCombo: new Audio("../assets/sounds/godlike.wav"),
};