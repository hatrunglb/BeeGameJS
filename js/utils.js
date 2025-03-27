function collision({object1, object2}) {
    return (
        object1.position.y + object1.height >= object2.position.y &&
        object1.position.y <= object2.position.y + object2.height &&
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x &&
        object2.isCollision
    );

}

function platformCollision({object1, object2}) {
    return (
        object1.position.y + object1.height >= object2.position.y &&
        object1.position.y + object1.height <= object2.position.y + object2.height &&
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x
    );
}

function eatHoney({object1, object2}) {
    if (object2.isHoney)
    return (
        object1.position.y + object1.height >= object2.hitbox.position.y &&
        object1.position.y <= object2.hitbox.position.y + object2.hitbox.height &&
        object1.position.x <= object2.hitbox.position.x + object2.hitbox.width &&
        object1.position.x + object1.width >= object2.hitbox.position.x
    );

}

function attacked({object1, object2}) {
    if (object2.isEnemy)
    return (
        object1.position.y + object1.height >= object2.hitbox.position.y &&
        object1.position.y <= object2.hitbox.position.y + object2.hitbox.height &&
        object1.position.x <= object2.hitbox.position.x + object2.hitbox.width &&
        object1.position.x + object1.width >= object2.hitbox.position.x &&
        object2.isEnemy
    );

}
