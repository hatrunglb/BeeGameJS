class Sprite {
    constructor({position, imageSrc, frameRate = 1, frameBuffer = 3, scale = 1}) {
        this.position = position;
        this.image = new Image();
        this.loaded = false
        this.image.onload = () => {
            this.width = (this.image.width/this.frameRate)*this.scale;
            this.height = this.image.height*this.scale;
            this.loaded = true;
        };
        this.image.src = imageSrc;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.frameBuffer = frameBuffer;
        this.elapsedFrame = 0;
        this.scale = scale;
        this.hearth = 3;
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
        context.drawImage(this.image, cropbox.position.x, cropbox.position.y,
            cropbox.width, cropbox.height,
            this.position.x, this.position.y,
            this.width, this.height);
    }

    update() {
        this.draw();
        this.updateFrames();
    }

    updateFrames() {
        if (this.hearth > 0)
            this.elapsedFrame++;
        if (this.elapsedFrame%this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1)
                this.currentFrame++;
            else {
                this.currentFrame = 0;
            }
        }
    }
}
