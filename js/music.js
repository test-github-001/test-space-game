'use strict';

/****************************
 * 
 *   Проигрование звуков
 */

const BG_MUSIC = new Audio();

// массив с названием фоновых музык игры
const bgMusicsArr = [
    'bgm_space_0.mp3',
    'bgm_space_1.mp3',
    'bgm_space_2.mp3',
    'bgm_space_3.mp3',
    'bgm_space_4.mp3',
];
// выбераем случайную фоновую музыку
let bgMusicIndex = Math.floor(Math.random() * bgMusicsArr.length);

// функция для проигрования фоновых музык по очереди
function playBgMusic() {
    BG_MUSIC.src = SOUNDS_PATH + bgMusicsArr[bgMusicIndex];
    BG_MUSIC.play(); // включить выбранную из массива музыку
    bgMusicIndex++; // задать номер следующей музыки из массива
    // если это была последняя музыка - переключиться на первую
    if (bgMusicIndex === bgMusicsArr.length) bgMusicIndex = 0;
    // после окончания музыки вызываьб функцию "playBgMusic()"
    BG_MUSIC.addEventListener('ended', playBgMusic);
}