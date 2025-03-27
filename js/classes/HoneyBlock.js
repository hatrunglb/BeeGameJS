class HoneyBlock {
    constructor({position, height = 16, scale = 1}) {
        this.position = position;
        this.isHoney = true;
        this.isEaten = 1;
        this.image = new Image();
        this.image.src = '../../images/honey_1.png';
        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
        };
        this.width = 16;
        this.height = height;
        this.scale = scale;
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 16,
            height: 16,
        };
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + (this.image.width*this.scale) / 4,
                y: this.position.y + 8 + (this.image.height*this.scale - 6) / 4,
            },
            width: (this.image.width*this.scale) / 2 * this.isEaten,
            height: (this.image.height*this.scale - 6) / 2  * this.isEaten,
        };
    }

    draw() {
        if (!this.image) return;

        const cropbox = {
            position: {
                x: 0,
                y: 0,
            },
            width: this.image.width*this.scale * this.isEaten,
            height: this.image.height*this.scale * this.isEaten,
        };

        context.drawImage(this.image, this.position.x, this.position.y, cropbox.width, cropbox.height);
        // context.fillStyle = 'rgba(255, 202 , 0, 0.5)';
        // context.fillRect(this.position.x, this.position.y, cropbox.width, cropbox.height);

        //hitbox
        // context.fillStyle = 'rgba(0, 255,0, 0.5)';
        // context.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

    }

    update() {
        this.draw();
        this.updateHitbox();
    }
}
