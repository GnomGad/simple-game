const Enemy = require('./Enemy');

class LuckyFish extends Enemy{
    constructor(game){
        super(game);
        this.lives = 2;
        this.score = 15;
        this.width = 99 ;
        this.height = 95 ;
        this.type = 'lucky'
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('lucky');
        this.frameY = Math.floor(Math.random() * 2);
    }
}

module.exports = LuckyFish;