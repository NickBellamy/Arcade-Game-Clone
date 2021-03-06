// Handles the scoring of the game
const scoreKeeper = (() => {
    let score = 0;
    const incrementScore = () => document.querySelector('h2 span').innerHTML = ++score;
    const resetScore = () => {
        score = 0;
        document.querySelector('h2 span').innerHTML = score;
    }
    return {
        incrementScore: incrementScore, 
        resetScore: resetScore
    };
})();

// Helper object for position calculations
const tileSize = {x: 101, y: 84};

/* Character Class */

class Character {
    constructor(spawnLocation, image) {
        this.img = image;
        this.respawn(spawnLocation);
    }
    // Respawns the character at a given location
    respawn(spawnLocation) {
        this.x = (spawnLocation.x * tileSize.x);
        this.y = (spawnLocation.y * tileSize.y);
    }
    // Returns a string to easily compare locations for collision detection
    get charLocation() {
        return `${Math.floor(this.x / tileSize.x)}:${Math.floor(this.y / tileSize.y)}`;
    }
    render() {
        ctx.drawImage(Resources.get(this.img.location), this.x + this.img.offset.x, this.y + this.img.offset.y);
    }
}

/* Enemy Class */

class Enemy extends Character {
    constructor() {
        super(Enemy.spawnLocation, Enemy.image);
        this.speed = Enemy.speed;
    }
    // Respawns the enemy and assigns a new random speed
    respawn() {
        super.respawn(Enemy.spawnLocation);
        this.speed = Enemy.speed;
    }
    // Moves the enemy and checks for collisions with player
    update(dt) {
        this.x += this.speed * dt;
        // If enemy has moved off screen, then respawn
        if (this.x >= (5 * tileSize.x) - Enemy.image.offset.x) {
            this.respawn();
        }
    }
    static get image() {
        return {
            location: 'images/enemy-bug.png',
            offset: {x: -50, y: 60}
        };
    }
    static get spawnLocation() {
        return {x: -1, y: Math.floor(Math.random() * 3)};
    }
    static get speed() {
        return (Math.random() * 400) + 200;
    }
}

/* Player Class */

class Player extends Character {
    constructor() {
        super(Player.spawnLocation, Player.image);
    }
    // Player input handler
    handleInput(key) {
        switch (key) {
            case 'up':
                if (this.y >= tileSize.y) {
                    this.y -= tileSize.y;
                } else {
                    scoreKeeper.incrementScore();
                    super.respawn(Player.spawnLocation);
                }
                break;
            case 'down':
                if (this.y <= (3 * tileSize.y)) {
                    this.y += tileSize.y;
                }
                break;
            case 'left':
                if (this.x >= tileSize.x) {
                    this.x -= tileSize.x;
                }
                break;
            case 'right':
                if (this.x <= (3 * tileSize.x)) {
                    this.x += tileSize.x;
                }
            // No default as we only want the above cases handled
        }
    }
    static get image() {
        return {
            location: 'images/char-boy.png',
            offset: {x: 0, y: 40}
        };
    }
    static get spawnLocation() {
        return {x: 2, y: 4};
    }
}

// Place 3 enemy objects in an array called allEnemies
const allEnemies = [...Array(3)].map(() => new Enemy());

// Place the player object in a variable called player
const player = new Player();

// Valid key event listener and handler
document.addEventListener('keyup', function (e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});