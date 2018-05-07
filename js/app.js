// Handles the scoring of the game
const scoreKeeper = {
    score: 0,
    incrementScore: function() {
        document.querySelector('h2 span').innerHTML = ++this.score;
    },
    resetScore: function() {
        this.score = 0;
        document.querySelector('h2 span').innerHTML = this.score;
    }
}

// Stipulates the size of a tile to aid movement
const tileSize = { y: 84, x: 101 };

/* Character Class */

class Character {
    constructor(spawnLocation, sprite) {
        this.sprite = sprite;
        this.respawn(spawnLocation);
    }
    respawn(spawnLocation) {
        this.x = spawnLocation.x;
        this.y = spawnLocation.y;
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    update(dt) {
        // update() is needed in engine.js even if not defined
    }
}

/* Enemy Class */

class Enemy extends Character {
    constructor() {
        const sprite = 'images/enemy-bug.png';
        super(Enemy.spawnLocation(), sprite);
        this.speed = Enemy.speed();
    }
    collisionHandler() {
        if (this.x + 50 >= player.x && this.x - tileSize.x < player.x && this.y > player.y && this.y - tileSize.y < player.y) {
            this.respawn();
            player.respawn(Player.spawnLocation());
            scoreKeeper.resetScore();
        }
    }
    respawn() {
        super.respawn(Enemy.spawnLocation());
        this.speed = Enemy.speed();
    }
    update(dt) {
        this.x += this.speed * dt;
        if (this.x >= 500) {
            this.respawn();
        }
        this.collisionHandler();
    }
    static spawnLocation() {
        return {
            x: -tileSize.x, 
            y: (tileSize.y * Math.floor(Math.random() * 3)) + 60    // 60px offset to center sprite on tile
        }
    }
    static speed() {
        return (Math.random() * 400) + 200;
    }
}

/* Player Class */

class Player extends Character {
    constructor() {
        const sprite = 'images/char-boy.png';
        super(Player.spawnLocation(), sprite);
    }
    // Move the player on screen
    handleInput(key) {
        switch (key) {
            case 'up' :
                if (this.y >= (1 * tileSize.y) + 40) {
                    this.y -= tileSize.y;
                } else {
                    scoreKeeper.incrementScore();
                    super.respawn(Player.spawnLocation());
                }
                break;
            case 'down' :
                if (this.y <= (3 * tileSize.y) + 40) {
                    this.y += tileSize.y;
                }
                break;
            case 'left' :
                if (this.x >= (1 * tileSize.x)) {
                    this.x -= tileSize.x;
                }
                break;
            case 'right' :
                if (this.x <= (3 * tileSize.x)) {
                    this.x += tileSize.x;
                }
        }
        console.log(this.x + ', ' + this.y);
    }
    static spawnLocation() {
        return {
            x: (2 * tileSize.x),
            y: (4 * tileSize.y) + 40    // 40px offset to center sprite on tile
        }
    }
}

// Place 3 enemy objects in an array called allEnemies
const allEnemies = [...Array(3)].map(() => new Enemy());

// Place the player object in a variable called player
const player = new Player();

// Valid key event listener and handler
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});