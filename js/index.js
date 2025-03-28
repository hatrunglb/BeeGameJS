const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
// const pathPage = window.location.pathname;
const pathPage = './';
canvas.width = 1024;
canvas.height = 576;

const scaleCanvas = {
    with: canvas.width / 4,
    height: canvas.height / 4,
};
const gravity = 0.3;

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    w: {
        pressed: false,
        count: 0,
    },
};

const backgound = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: pathPage + 'images/map_1.png',
});
const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}
const collisionBlocks = [];
const enemyBlocks = [];
floorCollisions2D.forEach((row, indexY) => {
    row.forEach((symbol, indexX) => {
        if (symbol === 202) {
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: indexX * 16,
                        y: indexY * 16,
                    },
                }));
        }
        if (symbol === 111) {
            collisionBlocks.push(
                new HoneyBlock({
                    position: {
                        x: indexX * 16 - 2,
                        y: indexY * 16 - 3,
                    },
                    scale: 0.7
                })
            )
        }

        if (symbol === 100) {
            collisionBlocks.push(
                new Enemy({
                    position: {
                        x: indexX * 16,
                        y: indexY * 16 - 10,
                    },
                    collisionBlocks: collisionBlocks,
                    platformCollisionBlocks: collisionBlocks,
                    imageSrc: pathPage + 'images/bee-left.png',
                    frameRate: 6,
                    frameBuffer: 6,
                    animations: {
                        Idle: {
                            imageSrc: pathPage + 'images/bee.png',
                            frameRate: 6,
                            frameBuffer: 6,
                        },
                        IdleLeft: {
                            imageSrc: pathPage + 'images/bee-left.png',
                            frameRate: 6,
                            frameBuffer: 6,
                        },
                        Run: {
                            imageSrc: pathPage + 'images/bee-run.png',
                            frameRate: 6,
                            frameBuffer: 4,
                        },
                        RunLeft: {
                            imageSrc: pathPage + 'images/bee-run-left.png',
                            frameRate: 6,
                            frameBuffer: 4,
                        },
                        Bang: {
                            imageSrc: pathPage + 'images/bang_1.png',
                            frameRate: 6,
                            frameBuffer: 4,
                        },
                    },
                }
                )
            )
        }

    });

});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}
const platformCollisionBlocks = [];
const enmyBlocks = [];
platformCollisions2D.forEach((row, indexY) => {
    row.forEach((symbol, indexX) => {
        if (symbol === 202) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: indexX * 16,
                        y: indexY * 16,
                    },
                    height: 8,
                }));
        }
    });
});

const player = new Player({
    position: {
        x: 0,
        y: 300,
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    imageSrc: pathPage + 'images/bee.png',
    frameRate: 6,
    frameBuffer: 6,
    animations: {
        Die: {
            imageSrc: pathPage + 'images/bee-die.png',
            frameRate: 1,
            frameBuffer: 1,
        },
        DieLeft: {
            imageSrc: pathPage + 'images/bee-die-left.png',
            frameRate: 1,
            frameBuffer: 1,
        },
        Idle: {
            imageSrc: pathPage + 'images/bee.png',
            frameRate: 6,
            frameBuffer: 6,
        },
        IdleLeft: {
            imageSrc: pathPage + 'images/bee-left.png',
            frameRate: 6,
            frameBuffer: 6,
        },
        Run: {
            imageSrc: pathPage + 'images/bee-run.png',
            frameRate: 6,
            frameBuffer: 4,
        },
        RunLeft: {
            imageSrc: pathPage + 'images/bee-run-left.png',
            frameRate: 6,
            frameBuffer: 4,
        },
        Jump: {
            imageSrc: pathPage + 'images/bee-jump.png',
            frameRate: 2,
            frameBuffer: 4,
        },
        JumpLeft: {
            imageSrc: pathPage + 'images/bee-jump-left.png',
            frameRate: 2,
            frameBuffer: 4,
        },
        Fall: {
            imageSrc: pathPage + 'images/bee-fall.png',
            frameRate: 2,
            frameBuffer: 4,
        },
        FallLeft: {
            imageSrc: pathPage + 'images/bee-fall-left.png',
            frameRate: 2,
            frameBuffer: 4,
        },
    },
});

const fire = new Fire({
    position: {
        x: 0,
        y: 384,
    },
    width: 12,
    height: 12,
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    imageSrc: pathPage + 'images/fire_1.png',
    frameRate: 6,
    frameBuffer: 6,
    imageBangSrc: pathPage + 'images/bang_1.png',
    animations: {
        'Right': {
            imageSrc: pathPage + 'images/fire_1.png',
            frameRate: 6,
            frameBuffer: 6,
        },
        'Left': {
            imageSrc: pathPage + 'images/fire_1-left.png',
            frameRate: 6,
            frameBuffer: 6,
        },
        'Bang': {
            imageSrc: pathPage + 'images/bang_1.png',
            frameRate: 6,
            frameBuffer: 12,
        },
    }
});

const backgroundImageHeight = 432;
const stepValue = 1.5;
const jump = 4;

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaleCanvas.height,
    },
};

const colorSky = '#9adffc';

const cooldown = document.getElementById('cooldown-mask');
const heightRule = document.getElementById('height-rule');
const goal = document.getElementById('goal');
const hearth = document.getElementById('hearth');
function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = colorSky;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.scale(4, 4);
    context.translate(camera.position.x, camera.position.y);

    backgound.update();

    collisionBlocks.forEach((block) => {
        block.update();
    });
    platformCollisionBlocks.forEach((block) => {
        block.update();
    });

    // honeyBlocks.forEach((honey) => {
    //   honey.update();
    // })
    player.checkForHorizontalCanvaCollision();

    if(player.hearth < 1) {
        if (player.lastDirection === 'right')
            player.switchSprite('Die');
        else
        player.switchSprite('DieLeft');
    }
    player.update();
    player.velocity.x = 0;
    if (keys.d.pressed) {
        player.switchSprite('Run');
        player.velocity.x = stepValue;
        player.lastDirection = 'right';
        player.shouldPanCameraToTheLeft({ canvas, camera });
    } else if (keys.a.pressed) {
        player.switchSprite('RunLeft');
        player.velocity.x = -stepValue;
        player.lastDirection = 'left';
        player.shouldPanCameraToTheRight({ canvas, camera });
    } else if (player.velocity.x === 0) {
        player.shouldPanCameraUp({ canvas, camera });
        if (player.lastDirection === 'right')
            player.switchSprite('Idle');
        else
            player.switchSprite('IdleLeft');
    }

    if (player.velocity.y < 0) {
        player.shouldPanCameraDown({ canvas, camera });
        if (player.lastDirection === 'right')
            player.switchSprite('Jump');
        else
            player.switchSprite('JumpLeft');
    } else if (player.velocity.y > 0) {
        player.shouldPanCameraUp({ canvas, camera });
        if (player.lastDirection === 'right')
            player.switchSprite('Fall');
        else
            player.switchSprite('FallLeft');
    }
    fire.update();
    goal.innerText = player.goal + ' / 6';
    hearth.innerText = player.hearth;
    context.restore();
    if (!fire.flying) {
        const classes = cooldown.classList;
        let check = false;
        classes.forEach((c) => {
            if (c === 'hidden') {
                check = true;
            }
        })
        if (!check) cooldown.classList.add('hidden');
    } else {
        cooldown.classList.remove('hidden');
    }

    if (player.position.y > 32) {
        if (heightRule.textContent.charCodeAt(0) === 8612) {
            return;
        }
        heightRule.innerHTML = '&#8612;';
    } else {
        if (heightRule.textContent.charCodeAt(0) === 8602) {
            return;
        }
        heightRule.innerHTML = '&#8602;'
    }
}

animate();

const btnJump = document.getElementById('btn-jump');
btnJump.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.repeat) return;
    console.log('click');

    if (player.position.y <= 32) {
        return;
    }
    player.velocity.y = -jump;
});

const btnShoot = document.getElementById('btn-shoot');
btnShoot.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (fire.flying) return;
    fire.position.y = player.hitbox.position.y + 2;
    const value = 16 * 8;
    if (player.lastDirection === 'left') {
        fire.position.x = player.hitbox.position.x - player.hitbox.width;
        fire.lineLeft = player.hitbox.position.x - value;
        fire.lineRight = player.hitbox.position.x + player.hitbox.width;
        fire.switchSprite('Left');
        fire.velocity.x = -2;
    } else {
        fire.position.x = player.hitbox.position.x + player.hitbox.width;
        fire.lineRight = player.hitbox.position.x + player.hitbox.width + value;
        fire.switchSprite('Right');
        fire.velocity.x = 2;
    }
    fire.flying = 1;
});

const btnRight = document.getElementById('btn-right');
const btnLeft = document.getElementById('btn-left');

btnRight.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (player.hearth < 1) return;
    keys.d.pressed = true
});
btnRight.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.d.pressed = false
});
btnLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (player.hearth < 1) return;
    keys.a.pressed = true
});
btnLeft.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.a.pressed = false
});

window.addEventListener('keydown', (e) => {
    if (player.hearth < 1) return;
    switch (e.key) {
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = true;
            break;
        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = true;
            break;
        case 'w':
        case 'ArrowUp':
            if (e.repeat) return;
            if (player.position.y <= 32) {
                return;
            }
            player.velocity.y = -jump;
            break;
        case ' ':
            if (fire.flying) return;
            fire.position.y = player.hitbox.position.y + 2;
            const value = 16 * 8;
            if (player.lastDirection === 'left') {
                fire.position.x = player.hitbox.position.x - player.hitbox.width;
                fire.lineLeft = player.hitbox.position.x - value;
                fire.lineRight = player.hitbox.position.x + player.hitbox.width;
                fire.switchSprite('Left');
                fire.velocity.x = -2;
            } else {
                fire.position.x = player.hitbox.position.x + player.hitbox.width;
                fire.lineRight = player.hitbox.position.x + player.hitbox.width + value;
                fire.switchSprite('Right');
                fire.velocity.x = 2;
            }
            fire.flying = 1;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = false;
            break;
        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = false;
            break;
        case 'w':
            // if (player.velocity.y === 0) keys.w.count = 0;
            break;
    }
});

