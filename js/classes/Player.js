class Player extends Sprite {
    constructor({ position, collisionBlocks, platformCollisionBlocks, imageSrc, frameRate, frameBuffer, scale = 0.5, animations }) {
        super({ imageSrc, frameRate, frameBuffer, scale });
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1,
        };
        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 16,
            height: 16,
        };
        this.animations = animations;
        this.lastDirection = 'right';

        for (const key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;
            this.animations[key].image = image;
        }

        this.cameraBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        };

        this.offsetHitbox = {
            x: 19,
            y: 20,
        }

        this.goal = 0;
    }

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return;

        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
    }

    updateCameraBox() {
        this.cameraBox = {
            position: {
                x: this.position.x - 100 + this.width / 2,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        };
    }

    checkForHorizontalCanvaCollision() {
        if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
            this.hitbox.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0;
        }
    }

    shouldPanCameraToTheLeft({ canvas, camera }) {
        const cameraRightSide = this.cameraBox.position.x + this.cameraBox.width;
        const scaleDownCanvasWidth = canvas.width / 4;
        if (cameraRightSide >= 575) return;
        if (cameraRightSide >= scaleDownCanvasWidth + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x;
        }
    }

    shouldPanCameraToTheRight({ canvas, camera }) {
        if (this.cameraBox.position.x <= 0) {
            return;
        }
        if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x;
        }
    }

    shouldPanCameraDown({ canvas, camera }) {
        if (Math.round(this.cameraBox.position.y + this.velocity.y) <= 0) return;

        if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y;
        }
    }

    shouldPanCameraUp({ canvas, camera }) {
        if (this.cameraBox.position.y + this.cameraBox.height + this.velocity.y >= 432) return;

        const scaleDownCanvasHeight = canvas.height / 4;
        if (this.cameraBox.position.y + this.cameraBox.height >= Math.abs(camera.position.y) + scaleDownCanvasHeight) {
            camera.position.y -= this.velocity.y;
        }
    }

    update() {
        this.updateFrames();
        this.updateHitbox();

        this.updateCameraBox();
        // context.fillStyle = 'rgba(0, 0, 255, 0.2)';
        // context.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);

        // context.fillStyle = 'rgba(0, 255, 0, 0.2)';
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);

        //hitbox
        // context.fillStyle = 'rgba(255, 0,0, 0.2)';
        // context.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
        this.draw();

        this.position.x += this.velocity.x;
        this.updateHitbox();
        this.checkHorizontalCollissions();
        this.applyGravity();
        this.updateHitbox();
        this.checkVerticalCollissions();
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + this.offsetHitbox.x,
                y: this.position.y + this.offsetHitbox.y,
            },
            width: 14,
            height: 16,
        };
    }

    checkHorizontalCollissions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (collision({
                object1: this.hitbox,
                object2: collisionBlock,
            })) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                    this.position.x = collisionBlock.position.x - offset - 0.01;
                    break;
                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                    const offset = this.hitbox.position.x - this.position.x;
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                    break;
                }
            }

        }
    }

    applyGravity() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
    }

    checkVerticalCollissions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            // console.log(honey({
            //     object1: this.hitbox,
            //     object2: collisionBlock,
            // }));
            if (attacked({
                object1: this.hitbox,
                object2: collisionBlock,
            })) {
                const point = collisionBlock.position.x + collisionBlock.width / 2;
                if (collisionBlock.isLive && this.hearth > 0) {
                    if ((this.hitbox.position.x + this.hitbox.width) <= point) {
                        console.log('trái');
                        this.position.x -= 8;
                    }

                    if (this.hitbox.position.x > point) {
                        console.log('phải');
                        this.position.x += 8;
                    }

                    this.hearth -= 1;
                }
            }



            if (eatHoney({
                object1: this.hitbox,
                object2: collisionBlock,
            })) {
                // collisionBlocks[i] = { ...collisionBlock, isEaten: 0}
                if (collisionBlock.isEaten) {
                    this.goal += 1;
                    collisionBlocks[i].isEaten = 0;
                }

            }

            if (collision({
                object1: this.hitbox,
                object2: collisionBlock,
            })) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
                    this.position.y = collisionBlock.position.y - offset - 0.01;
                    break;
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    const offset = this.hitbox.position.y - this.position.y;
                    this.position.y =
                        collisionBlock.position.y
                        + collisionBlock.height
                        - offset
                        + 0.01;
                    break;
                }
            }

        }

        // platform
        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const platformCollisionBlock = this.platformCollisionBlocks[i];

            if (platformCollision({
                object1: this.hitbox,
                object2: platformCollisionBlock,
            })) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
                    this.position.y = platformCollisionBlock.position.y - offset - 0.01;
                    break;
                }

                // if (this.velocity.y < 0) {
                //     this.velocity.y = 0;
                //     const offset = this.hitbox.position.y - this.position.y;
                //     this.position.y = platformCollisionBlock.position.y + platformCollisionBlock.height - offset + 0.01;
                //     break;
                // }
            }

        }
    }
}
