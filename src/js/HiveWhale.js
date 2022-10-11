const Enemy = require('./Enemy');

class HiveWhale extends Enemy{
    constructor(game){
        super(game);
        this.lives = 15;
        this.score = 15;
        this.width = 400 ;
        this.height = 227 ;
        this.type = 'hive'
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('hivewhale');
        this.frameY = 0;
        this.speedX = Math.random() * -1.2 - 0.2
    }
}

module.exports = HiveWhale;