'use strict';

/*******************
 * 
 *   ЗАПУСК ИГРЫ
 */

let background,
    cursor,
    player,
    compass,
    arrow,
    weapon,
    playerBulletsArr = [],
    asteroidsArr = [],
    explosionsArr = [];


function startGame() {
    background = new Background();
    cursor = new Cursor();
    player = new Player();
    compass = new Compass();
    arrow = new Arrow();
    weapon = new Weapon()
    asteroidsArr.push( new Asteroid(), new Asteroid(), new Asteroid() );
}

/******************
 * 
 *  ИГРОВОЙ ЦИКЛ
 */

let previousTimeStamp;
function animation(timeStamp) {
    // обновляем временные метки
    const dt = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;

    // обнавляем canvas
    ctx.clearRect(0, 0, vw, vh);

    background.update(dt);

    cursor.update(dt, mouseX, mouseY);
    
    playerBulletsArr.forEach( bullet => bullet.update(dt) );
    playerBulletsArr = playerBulletsArr.filter( bullet => bullet.isExist );
    
    player.update(dt);

    compass.update(dt);
    arrow.update(dt);

    weapon.update(dt);

    asteroidsArr.forEach( asteroid => asteroid.update(dt) );
    asteroidsArr = asteroidsArr.filter( asteroid => asteroid.isExist );
    if (asteroidsArr.length < 3) asteroidsArr.push( new Asteroid() );

    explosionsArr.forEach( explosion => explosion.update(dt) );
    explosionsArr = explosionsArr.filter( explosion => explosion.isExist );
 
    // запускаем занова анимацию
    if (isOnFocus) requestAnimationFrame( animation );
}