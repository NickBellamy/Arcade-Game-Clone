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

// Stipulates the size of a tile to aid movement calculations
const tileSize = { y: 84, x: 101 };

/* Character Class */

class Character {
    constructor(spawnLocation, image) {
        this.sprite = image.location;
        this.respawn(spawnLocation, image.offset);
    }
    respawn(spawnLocation, offset) {
        this.x = (spawnLocation.x * tileSize.x) + offset.x;
        this.y = (spawnLocation.y * tileSize.y) + offset.y;
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
        super(Enemy.spawnLocation(), Enemy.image());
        this.speed = Enemy.speed();
    }
    collisionHandler() {
        if (this.x + (0.5 * tileSize.x) >= player.x && this.x - tileSize.x < player.x && this.y > player.y && this.y - tileSize.y < player.y) {
            this.respawn();
            player.respawn(Player.spawnLocation());
            scoreKeeper.resetScore();
        }
    }
    respawn() {
        super.respawn(Enemy.spawnLocation(), Enemy.image().offset);
        this.speed = Enemy.speed();
    }
    update(dt) {
        this.x += this.speed * dt;
        if (this.x >= 5 * tileSize.x) {
            this.respawn();
        }
        this.collisionHandler();
    }
    static image() {
        return {
            location: 'images/enemy-bug.png',
            offset: {
                x: 0,
                y: 60
            }
        }
    }
    static spawnLocation() {
        return {
            x: -1, 
            y: Math.floor(Math.random() * 3)
        }
    }
    static speed() {
        return (Math.random() * 400) + 200;
    }
}

/* Player Class */

class Player extends Character {
    constructor() {
        super(Player.spawnLocation(), Player.image());
    }
    // Move the player on screen
    handleInput(key) {
        switch (key) {
            case 'up' :
                if (this.y >= (1 * tileSize.y) + Player.image().offset.y) {
                    this.y -= tileSize.y;
                } else {
                    scoreKeeper.incrementScore();
                    super.respawn(Player.spawnLocation(), Player.image().offset);
                }
                break;
            case 'down' :
                if (this.y <= (3 * tileSize.y) + Player.image().offset.y) {
                    this.y += tileSize.y;
                }
                break;
            case 'left' :
                if (this.x >= (1 * tileSize.x) + Player.image().offset.x) {
                    this.x -= tileSize.x;
                }
                break;
            case 'right' :
                if (this.x <= (3 * tileSize.x) + Player.image().offset.x) {
                    this.x += tileSize.x;
                }
        }
        console.log(this.x + ', ' + this.y);
    }
    static image() {
        return {
            location: 'images/char-boy.png',
            offset: {
                x: 0,
                y: 40
            }
        }
    }
    static spawnLocation() {
        return {
            x: 2,
            y: 4
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