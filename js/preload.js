'use strict';

/*****************
 * 
 *   ЗАГРУЗЧИК
 */

const SOUNDS_PATH = './src/sounds/';
const IMAGES_PATH = './src/images/';
const SCRIPTS_PATH = './js/';

const SOUNDS_UPLOAD_ARR = [
    'se_laser_shut_low.mp3',
    'se_explosion.mp3',
];

const IMAGES_UPLOAD_ARR = [
    'scrolling-dark-bg-2000x900px.png',
    'player_74x84px.png',
    'player_bullet_10x40px.png',
    'player_cursor_48x48px_16frames.png',
    'asteroid_128x128px_64frames.png',
    'explosion_big_400x400px_16frames.png',
    'explosion_small_200x200px_16frames.png',
    'compass_200x200px.png',
    'arrow_120x120px.png',
    'spaceship_fire_32x60px_16frames.png',
    'weapon_60x60px_4frames.png',
];

const SCRIPTS_UPLOAD_ARR = [
    'initialization.js',
    'sprites.js',
    'objects.js',
    'music.js',
    'control.js',
    'main.js',
];
let scriptsToUpload = SCRIPTS_UPLOAD_ARR.length;

let uploadSize = SOUNDS_UPLOAD_ARR.length + IMAGES_UPLOAD_ARR.length;
let loadingStep = 100 / uploadSize;
let loadingProgress = 0;

const SE = {/* sound effects */};
function uploadSound(sound_name) {
    SE[sound_name] = new Audio();
    SE[sound_name].src = SOUNDS_PATH + sound_name;
    SE[sound_name].oncanplaythrough = (event) => {
        event.target.oncanplaythrough = null;
        updateLoadingProgress();
    };
}

const IMG = {/* game images */};
function uploadImage(image_name) {
    IMG[image_name] = new Image();
    IMG[image_name].src = IMAGES_PATH + image_name;
    IMG[image_name].onload = () => updateLoadingProgress();
}

function uploadScripts(script_name) {
    const script = document.createElement('script')
    script.src = SCRIPTS_PATH + script_name;
    script.onload = () => updateLoadingScripts();
    document.body.append(script);
}

function updateLoadingProgress() {
    uploadSize--; console.log('src =', uploadSize);
    loadingProgress += loadingStep;
    loadingStatusDiv.innerHTML = `<b>Loading</b> ${loadingProgress.toFixed()} <b>%</b>`;
    if (uploadSize < 1) SCRIPTS_UPLOAD_ARR.forEach( script => uploadScripts(script));
}

function updateLoadingScripts() {
    scriptsToUpload--; console.log('scripts =', scriptsToUpload);
    if (scriptsToUpload < 1) loadingDone();
}

IMAGES_UPLOAD_ARR.forEach( data => uploadImage(data) );
SOUNDS_UPLOAD_ARR.forEach( data => uploadSound(data) );

const loadingStatusDiv = document.createElement('div');
loadingStatusDiv.id = 'loadingStatusDiv';
loadingStatusDiv.innerHTML = `<b>Loading</b> ${loadingProgress.toFixed()} <b>%</b>`;
document.body.prepend(loadingStatusDiv);

function loadingDone() {
    loadingStatusDiv.remove();

    const loadingReadyButton = document.createElement('button');
    loadingReadyButton.id = 'loadingReadyButton';
    loadingReadyButton.innerText = 'START';
    loadingReadyButton.onclick = () => {
        loadingReadyButton.remove();
        userPushStart();
    };
    document.body.prepend(loadingReadyButton);
}