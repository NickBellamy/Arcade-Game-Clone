const scorer = {
    score: 0,
    incrementScore: function() {
        this.score++;
        this.showScore();
    },
    resetScore: function() {
        this.score = 0;
        this.showScore();
    },
    showScore: function() {
        document.querySelector('h2 span').innerHTML = this.score;
    }
}

// Enemies our player must avoid
class Enemy {
    constructor () {
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        this.speed = (Math.random() * 400) + 200;
        this.x = -200;
        this.y = 60 + (84 * Math.floor(Math.random() * 3));
    }
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += this.speed * dt;
        if (this.x >= 500) {
            this.respawn();
        }
        this.collisionHandler();
    }
    collisionHandler() {
        if(this.x + 50 >= player.x && this.x -100 < player.x && this.y > player.y && this.y -80 < player.y) {
            this.respawn();
            player.respawn();
            scorer.resetScore();
        }
    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    respawn() {
        this.x = -200;
        this.y = 60 + (84 * Math.floor(Math.random() * 3));
        this.speed = (Math.random() * 400) + 200;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 200;
        this.y = (4 * 84) + 40;
    }
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
    }
    // Draw the player on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    respawn() {
        this.x = 200;
        this.y = (4 * 84) + 40;
    }
    handleInput(key) {
        switch (key) {
            case 'up' :
                if (this.y > (0 * 84) + 40) {
                    this.y -= 84;
                } else {
                    scorer.incrementScore();
                    this.respawn();
                }
                break;
            case 'down' :
                if (this.y < (4 * 84) + 40) {
                    this.y += 84;
                }
                break;
            case 'left' :
                if (this.x > (2 * 101) - 200) {
                    this.x -= 101;
                }
                break;
            case 'right' :
            if (this.x < (2 * 101) + 200) {
                this.x += 101;
            }
        }
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [new Enemy(), new Enemy(), new Enemy()];
// Place the player object in a variable called player
const player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});