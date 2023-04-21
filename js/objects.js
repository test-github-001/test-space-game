'use strict';

const _2PI = Math.PI * 2;
const PI_d_180 = Math.PI / 180;

/********************** 
 * 
 *   ИГРОВЫЕ ОБЪЕКТЫ
 */

class Background extends Sprite {
    constructor () {
        super('scrolling-dark-bg-2000x900px.png', 0, 0)
        this.x = Math.floor((vw -  this.w) / 2) ;
        this.y1 = -this.h;
        this.y2 = 0;
        this.scrollSpeed = 30 /* px/s */ / 1000 /* px/ms */;
    }

    update(dt) {
        let speed = this.scrollSpeed * dt;
        this.y1 += speed;
        this.y2 += speed;
        if (this.y2 >= this.h) {
            this.y1 = -this.h;
            this.y2 = 0;
        }
        ctx.drawImage(this.img, this.x, this.y1);
        ctx.drawImage(this.img, this.x, this.y2);
    }
}

class Cursor extends AnimationSpriteSheet {
    constructor() {
        super('player_cursor_48x48px_16frames.png', vcx, vcy, 24, 48, 48, 16, 15);
    }

    update(dt) {
        this.x = mouseX;
        this.y = mouseY;
        this.draw(dt);
    }
}

class Player extends Sprite {
    constructor() {
        super('player_74x84px.png', vcx, vcy);
        this.speed = 100 /* px/s */ / 1000 /* px/ms */;
        this.shutSpeed = 1 /* shut/s */ * 1000 /* ms for shut */;
        this.nextShutTimeout = this.shutSpeed;

        // add fire
        this.flyFireOffsetX = 12;
        this.flyFireOffsetY = 56;
        this.flyFireLeft = new AnimationSpriteSheet('spaceship_fire_32x60px_16frames.png', 0, 0, 0, 32, 60, 16, 30);
        this.flyFireRight = new AnimationSpriteSheet('spaceship_fire_32x60px_16frames.png', 0, 0, 0, 32, 60, 16, 30);
        this.flyFireRight.frame = Math.floor(this.flyFireRight.framesArr.length / 2);
    }

    update(dt) {
        // turn
        if (mouseX !== this.x || mouseY !== this.y) {
            let dx = mouseX - this.x;
            let dy = mouseY - this.y;
            let distance = Math.sqrt( dx**2 + dy**2 );
            let fly = this.speed * dt;
            
            if (distance <= fly) {
                this.x = mouseX;
                this.y = mouseY;
            } else {
                let flyRate = fly / distance;
                this.x += flyRate * dx;
                this.y += flyRate * dy;
            }

            // flyFire
            this.flyFireLeft.x = this.x - this.flyFireOffsetX;
            this.flyFireLeft.y = this.y + this.flyFireOffsetY;

            this.flyFireRight.x = this.x + this.flyFireOffsetX;
            this.flyFireRight.y = this.y + this.flyFireOffsetY;
        }

        // flyFire
        this.flyFireLeft.draw(dt);
        this.flyFireRight.draw(dt);

        // shut
        this.nextShutTimeout -= dt;
        if (this.nextShutTimeout <= 0) {
            this.nextShutTimeout += this.shutSpeed;
            playerBulletsArr.push( new PlayerBullet(this.x, this.y, 0.5) );
            SE['se_laser_shut_low.mp3'].play();
        }

        // draw
        this.draw();
    }
}

class PlayerBullet extends Sprite {
    constructor(x, y, speed) {
        super('player_bullet_10x40px.png', x, y, 3);
        this.speed = speed;
    }

    update(dt) {
        this.y -= this.speed * dt;
        if (this.y < -this.h) this.isExist = false;
        else this.draw();
    }
}

class Asteroid extends AnimationSpriteSheet {
    constructor() {
        let x = Math.floor( Math.random() * vw );
        let y = -64;
        let speed = 29 + Math.ceil( Math.random() * 30 );
        super('asteroid_128x128px_64frames.png', x, y, 45, 128, 128, 64, 15);
        this.speedY = speed /* px/s */ / 1000 /* px/ms */;
        this.isExist = true;
    }

    update(dt) {
        for (let bullet of playerBulletsArr) {
            if ( this.isCollided(bullet) ) {
                SE['se_explosion.mp3'].currentTime = 0;
                SE['se_explosion.mp3'].play();
                this.isExist = false;
                bullet.isExist = false;
                let explosion = new Explosion(
                    'explosion_small_200x200px_16frames.png',
                    this.x, this.y, 100, 200, 200, 16, 30,  false);
                explosionsArr.push( explosion );
                asteroidsArr.push( new Asteroid() );
                return;
            }
        }

        this.y += this.speedY * dt;
        if (this.y > vh + this.fhh) this.isExist = false;
        else this.draw(dt);
    }
}

class Explosion extends AnimationSpriteSheet {
    update(dt) {
        if (this.isAnimationCompleted) this.isExist = false;
        else this.draw(dt);
    }
}

class Compass extends RotatedSprite {
    constructor() {
        super('compass_200x200px.png', 120, 120);
        /*
        10s  = 360deg
        1s   = 36deg
        1ms = 36 / 1000 = 0.036
        1deg = π/180
        */
        this.rotationSpeed = 0.036 * PI_d_180;
    }

    update(dt) {
        this.direction += this.rotationSpeed * dt;
        this.draw();
    }
}

class Arrow extends RotatedSprite {
    constructor() {
        super('arrow_120x120px.png', vcx, vcy);
        /*
        10s  = 360deg
        1s   = 36deg
        1ms = 36 / 1000 = 0.036
        1deg = π/180
        */
        this.turnSpeed = 0.036 * PI_d_180;
    }

    update(dt) {

        // TURN
        let pointDirection = Math.atan2(mouseY - this.y, mouseX - this.x);
        let d = (pointDirection - this.direction) % _2PI;

        if (d < -Math.PI) d += _2PI;
        if (d >  Math.PI) d -= _2PI;

        if (d >= 0 &&  d > this.turnSpeed) this.direction += this.turnSpeed * dt;
        if (d <  0 && -d > this.turnSpeed) this.direction -= this.turnSpeed * dt;

        this.draw();
    }
}

class Weapon extends SpriteSheet {
    constructor() {
        super('weapon_60x60px_4frames.png', vw - 80, vh - 80, 30, 60, 60, 4);
        this.isChanged = false;
        this.lightningColorsArr = ['#ffffff', '#00ffff', '#ffffff', '#ff00ff', '#ffffff', '#00ffff'];
        this.lightningColorsIndex = 0;
    }

    update() {
        if ( KEY.space && !this.isChanged ) {
            this.isChanged = true;
            this.frame++;
            if ( this.frame >= this.frames ) this.frame = 0;
        }
        if ( !KEY.space && this.isChanged ) this.isChanged = false;
        this.draw();

        if (KEY.q) {
            this.lightningColorsIndex++;
            if ( this.lightningColorsIndex === this.lightningColorsArr.length ) this.lightningColorsIndex = 0;
            ctx.strokeStyle = this.lightningColorsArr[ this.lightningColorsIndex ];

            let point = player;
            let target= cursor;

            function getDistance(x1, y1, x2, y2) {
                let dy = x1 - x2;
                let dx = y1 - y2;
                return Math.sqrt(dx * dx + dy * dy);
            }

            let distance = getDistance(point.x, point.y, target.x, target.y);

            let xx = point.x;
            let yy = point.y;
            let stepsCount = Math.ceil(distance * Math.random() / 3);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xx, yy);
            for (let i = stepsCount; i > 1; i--) {
                let pathLength = getDistance(xx, yy, point.x, point.y);
                let offset = Math.sin(pathLength / distance * Math.PI) * 5;
                xx += (target.x - xx) / i + Math.random() * offset * 2 - offset;
                yy += (target.y - yy) / i + Math.random() * offset * 2 - offset;
                ctx.lineTo(xx, yy);
            }
            ctx.stroke();
        }
    }
}