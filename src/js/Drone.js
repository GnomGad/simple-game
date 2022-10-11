const Enemy = require('./Enemy');

class Drone extends Enemy{
    constructor(game, x,y){
        super(game);
        this.lives = 3;
        this.score = 3;
        this.width = 115 ;
        this.height = 95 ;
        this.type = 'drone'
        this.x = x;
        this.y = y;
        this.image = document.getElementById('drone');
        this.frameY = Math.floor(Math.random()*2);
        this.speedX = Math.random() * -4.2 - 0.5
    }
}

module.exports = Drone;