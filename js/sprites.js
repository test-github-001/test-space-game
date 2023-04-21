'use strict';

/********************** 
 * 
 *   КЛАССЫ СПРАЙТОВ
 */

class Sprite {
    constructor(imageName, x, y, size = null) {
        this.img = IMG[imageName];
        this.x = x;
        this.y = y;
        this.w = this.img.width;
        this.h = this.img.height;
        this.hw = Math.floor(this.w / 2);
        this.hh = Math.floor(this.h / 2);
        this.size = size || Math.floor( (this.w + this.h) / 4 );
        this.isExist = true;
    }

    draw() {
        ctx.drawImage( this.img, this.x - this.hw,  this.y - this.hh );
    }

    isCollided(sprite) {
        let dy = sprite.x - this.x;
        let dx = sprite.y - this.y;
        let d = Math.sqrt(dx * dx + dy * dy);
        console.log('this.size =', this.size, '; sprite.size =', sprite.size);
        return this.size + sprite.size > d;
    }
}

class RotatedSprite extends Sprite {
    constructor(imageName, x, y, size = null, startAngle = 0) {
        super(imageName, x, y, size);
        this.direction = startAngle;
    }

    draw() {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y);
        ctx.rotate(this.direction);
        ctx.drawImage( this.img, -this.hw, -this.hh );
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

class SpriteSheet extends Sprite {
    constructor(imageName, x, y, size, fw, fh, frames) {
        super(imageName, x, y, size);
        this.framesArr = this.getFramesArr(fw, fh, frames);
        this.frame = 0
        this.fw = fw;
        this.fh = fh;
        this.fhw = Math.floor(this.fw / 2);
        this.fhh = Math.floor(this.fh / 2);
        this.frames = frames;
    }

    getFramesArr(fw, fh, frames) {
        const framesArr = [];
        for( let yy = 0; yy < this.h; yy += fh) {
            for( let xx = 0; xx < this.w; xx += fw) {
                framesArr.push( {x: xx, y: yy} );
            }
        }
        framesArr.length = frames;
        return framesArr;
    }

    draw() {
        ctx.drawImage( this.img,
            this.framesArr[this.frame].x, this.framesArr[this.frame].y, this.fw, this.fh,
            this.x - this.fhw,  this.y - this.fhh, this.fw, this.fh
        );
    }
}

class AnimationSpriteSheet extends SpriteSheet {
    constructor(imageName, x, y, size, fw, fh, frames, fps = 60, isInfinity = true) {
        super(imageName, x, y, size, fw, fh, frames);
        this.nextFrameTime = Math.floor(1000 / fps);
        this.nextFrameTimeout = this.nextFrameTime
        this.isInfinity = isInfinity;
        this.isAnimationCompleted = false;
    }

    draw(dt) {
        if (this.isAnimationCompleted) return;

        this.nextFrameTimeout -= dt
        if (this.nextFrameTimeout < 0) {
            this.nextFrameTimeout += this.nextFrameTime;
            this.frame++;
            if (this.frame === this.frames) {
                if ( this.isInfinity ) this.frame = 0;
                else {
                    this.isAnimationCompleted = true;
                    return;
                }
            }
        }
        super.draw();
    }
}