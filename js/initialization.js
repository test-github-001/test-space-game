'use strict';

/*************
 * 
 *   CANVAS
 */

let vw, vh, vcx, vcy;
const canvas = document.createElement('canvas');
canvas.width = vw = innerWidth;
canvas.height = vh = innerHeight;
vcx = Math.floor(vw / 2);
vcy = Math.floor(vh / 2);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, vw, vh);
document.body.prepend(canvas);

/*****************
 * 
 *  АКТИВАЦИЯ
 */
 
let isGameStart = false;

function userPushStart() {
    startGame();
    previousTimeStamp = performance.now();
    if (isOnFocus) requestAnimationFrame( animation );
    isGameStart = true;
    document.body.style.cursor = 'none';
    playBgMusic();
}

/**********************
 * 
 *  ПОКИДАНИЕ ЭКРАНА
 */

let isOnFocus = true;
window.onfocus = () => {
    isOnFocus = true;
    if (isGameStart) {
        previousTimeStamp = performance.now();
        requestAnimationFrame ( animation );
        BG_MUSIC.play()
    }
};
window.onblur = () => {
    isOnFocus = false
    BG_MUSIC.pause()
};