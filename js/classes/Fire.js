class Fire extends Sprite {
    constructor(
        {
            position, width, height, collisionBlocks, platformCollisionBlocks, imageSrc, frameRate, frameBuffer, scale = 0.5, animations,
            scaleBang = 0.25, imageBangSrc,
            frameBangRate = 6, frameBangBuffer = 6,
        }) {
        super({imageSrc, frameRate, frameBuffer, scale});
        this.position = position;
        this.width = width;
        this.height = height;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.area = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 12,
            height: 12,

        };

        // bang
        this.elapsedBangFrame = 0;
        this.currentBangFrame = 0;
        this.frameBangRate = frameBangRate;
        this.frameBangBuffer = frameBangBuffer;
        this.scaleBang = scaleBang;
        this.imageBang = new Image();
        this.loadedBang = false;
        this.imageBang.onload = () => {
            this.area.width = (this.imageBang.width/this.frameBangRate)*this.scaleBang;
            this.area.height = this.imageBang.height*this.scaleBang;
            this.loadedBang = true;
        };
        this.imageBang.src = imageBangSrc;

        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;

        this.animations = animations;

        for (const key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;
            this.animations[key].image = image;
        }
        this.flying = 0;
        this.var = 0;
        this.lineRight = 0;
        this.lineLeft = 0;
    }

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return;

        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
    }

    draw() {
        if (!this.image) return;

        const cropbox = {
            position: {
                x: this.currentFrame*(this.image.width/this.frameRate),
                y: 0,
            },
            width: this.image.width/this.frameRate,
            height: this.image.height,
        };
        context.globalAlpha = this.flying;
        context.drawImage(this.image, cropbox.position.x, cropbox.position.y,
            cropbox.width, cropbox.height,
            this.position.x, this.position.y,
            this.width, this.height);

        // context.fillStyle = `rgba(0, 255, 0, 0.5)`;
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    drawBang() {
        if (!this.imageBang) return;
        const cropboxBang = {
            position: {
                x: this.currentBangFrame*(this.imageBang.width/this.frameBangRate),
                y: 0,
            },
            width: this.imageBang.width/this.frameBangRate,
            height: this.imageBang.height,
        };
        context.globalAlpha = this.var;
        context.drawImage(this.imageBang, cropboxBang.position.x, cropboxBang.position.y,
            cropboxBang.width, cropboxBang.height,
            this.area.position.x, this.area.position.y,
            this.area.width, this.area.height);
    }

    update() {
        // context.fillStyle = `rgba(0, 0, 255, ${this.var})`;
        // context.fillRect(this.area.position.x, this.area.position.y, this.area.width, this.area.height);

        this.updateBangFrames();
        this.drawBang();
        this.draw();
        this.updateFrames();

        this.updateFlying();
        this.checkHorizontalCollissions();
    }

    updateArea({x}) {
        this.area = {
            position: {
                x: this.position.x + x,
                y: this.position.y - 2,
            },
            width: 12,
            height: 12,
        };
    }

    updateFlying() {
        this.position.x += this.velocity.x;

        if (this.position.x < this.lineLeft
            || this.position.x <= 0
            || this.position.x >= 576 - this.width
            || this.position.x >= this.lineRight) {
            this.stopFlying();
        }

    }

    stopFlying() {
        this.flying = 0;
        this.velocity.x = 0;
    }

    checkHorizontalCollissions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (attacked({
                object1: this,
                object2: collisionBlock,
            })) {
                if (collisionBlock.isLive && this.flying) {
                    // collisionBlock.isLive = 0;
                    collisionBlock.onBang();
                }
            }

            if (collision({
                object1: this,
                object2: collisionBlock,
            })) {
                if (this.flying) {
                    const x = this.width/2;
                    this.updateArea({x: (this.velocity.x > 0) ? x : -x});
                    if (this.var) {
                        this.var = 0;
                    } else {
                        this.var = 1;
                    }
                } else {
                    this.var = 0;
                }
                this.stopFlying();
                break;
                // if (this.velocity.x > 0) {
                //     this.velocity.x = 0;
                //     break;
                // }
                //
                // if (this.velocity.x < 0) {
                //     this.velocity.x = 0;
                //     break;
                // }
            }

        }
    }

    checkVerticalCollissions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (collision({
                object1: this,
                object2: collisionBlock,
            })) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    break;
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    break;
                }
            }

        }

        // platform
        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const platformCollisionBlock = this.platformCollisionBlocks[i];

            if (platformCollision({
                object1: this,
                object2: platformCollisionBlock,
            })) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;

                    break;
                }

                // if (this.velocity.y < 0) {
                //     this.velocity.y = 0;
                //     const offset = this.position.y - this.position.y;
                //     this.position.y = platformCollisionBlock.position.y + platformCollisionBlock.height - offset + 0.01;
                //     break;
                // }
            }

        }
    }

    updateBangFrames() {
        if (!this.var) return;
        this.elapsedBangFrame++;
        if (this.elapsedBangFrame%this.frameBangBuffer === 0) {
            if (this.currentBangFrame < this.frameBangRate - 1) {
                this.currentBangFrame++;
            } else {
                this.var = 0;
                this.currentBangFrame = 0;
            }
        }
    }
}
