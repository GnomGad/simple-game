const Enemy = require('./Enemy');

class Angler2 extends Enemy{
    constructor(game){
        super(game);
        this.lives = 3;
        this.score = this.lives;
        this.width = 213 ;
        this.height = 165 ;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('angler2');
        this.frameY = Math.floor(Math.random() * 2);
    }
}

module.exports = Angler2;