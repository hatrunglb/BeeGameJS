class Enemy extends Player {
    constructor({position, collisionBlocks, platformCollisionBlocks, imageSrc, frameRate, frameBuffer,scale = 0.5, animations}) {
        super({position, collisionBlocks, platformCollisionBlocks, imageSrc, frameRate, frameBuffer, animations, scale})
        this.positionInit = {
                x: position.x,
                y: position.y,
        }
        // this.scale = scale;
        this.area = 30;
        this.checkLeft = false;
        this.isEnemy = true;
        this.isDie = false;
        this.isLive = 1;
    }

    draw() {
        if (!this.image) return;

        const cropbox = {
            position: {
                x: this.currentFrame*(this.image.width/this.frameRate),
                y: 0,
            },
            width: (this.image.width/this.frameRate),
            height: this.image.height,
            // width: this.image.width/this.frameRate * this.isLive,
            // height: this.image.height * this.isLive,
        };
        context.drawImage(this.image, cropbox.position.x, cropbox.position.y,
            cropbox.width, cropbox.height,
            this.position.x, this.position.y,
            this.width, this.height);
            
    }

    onBang() {
        if(!this.isLive) return;

        const key = 'Bang';
        this.isLive = 0;
        if (this.image === this.animations[key].image || !this.loaded) return;
        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate; 
           
    }

    update() {
        // super.update();
        this.updateFramesE();
        this.updateHitbox();

        this.draw();

        this.position.x += this.velocity.x;
        this.updateHitbox();
        this.checkHorizontalCollissions();
        // this.applyGravity();
        this.updateHitbox();
        this.checkVerticalCollissions();

        //hitbox
        // context.fillStyle = 'rgba(255, 0,0, 0.2)';
        // context.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
        this.runAroundkHorizonta();   
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + this.offsetHitbox.x,
                y: this.position.y + this.offsetHitbox.y,
            },
            width: 14 * this.isLive,
            height: 16 * this.isLive,
        };
    }

    updateFramesE() {
            if (this.isDie) {
                this.image.width = 0;
                return;
            }
            if (!this.isLive) {
                setTimeout(() => {
                    this.isDie = true;
                }, 300)
            }
        this.updateFrames();
    }

    runAroundkHorizonta() {
        if(!this.isLive) {
            this.velocity.x = 0;
            return;
        }
        const x = Math.round(this.hitbox.position.x);
        const left = this.positionInit.x + this.offsetHitbox.x - this.area;
        const right = this.positionInit.x + this.area + this.offsetHitbox.x + this.hitbox.width ;
        
        if (!this.checkLeft) {
            this.velocity.x = -0.4;
            this.switchSprite('RunLeft');
            if(x === Math.round(left)) {
                this.checkLeft = true;
                this.velocity.x = 0;
            }
            return;
        }   
            this.velocity.x = 0.4;
            this.switchSprite('Run');
            if(x === Math.round(right)) {
                this.velocity.x = 0;
                this.checkLeft = false;
            }
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
                    this.checkLeft = false;
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                    this.position.x = collisionBlock.position.x - offset - 0.01;
                    break;
                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                    this.checkLeft = false;
                    const offset = this.hitbox.position.x - this.position.x;
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                    break;
                }
            }

        }
    }

    checkVerticalCollissions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            // console.log(honey({
            //     object1: this.hitbox,
            //     object2: collisionBlock,
            // }));
            // if (attacked({
                // object1: this.hitbox,
                // object2: collisionBlock,
            // })) {
                // console.log('va');
                
            // }
        

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
