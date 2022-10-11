const Enemy = require('./Enemy');

class Test extends Enemy{
    constructor(game){
        super(game);
        this.lives = 150;
        this.score = 15;
        this.width = 400 ;
        this.height = 227 ;
        this.type = '1'
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('hivewhale');
        this.frameY = 0;
    }
    update(){
        this.x = 500;
        if(this.x + this.width < 0) this.makedForDeletion = true;

        // animate sprite
        if(this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        
    }
}

module.exports = Test;