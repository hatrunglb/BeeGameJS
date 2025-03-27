class CollisionBlock {
    constructor({position, height = 16}) {
        this.position = position;
        this.width = 16;
        this.height = height;
        this.isCollision = true;
    }

    draw() {
        context.fillStyle = 'rgba(255, 0 , 0, 0)';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
    }
}
