class Enemy {
    constructor(game){
        this.game = game;
        this.x = this.game.width;
        this.speed = Math.random() * -0.5 - 0.1;
        this.makedForDeletion = false;
        this.lives = 5;
        this.score = this.lives;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 37;
    }
    update(){
        this.x += this.speed - this.game.speed;
        if(this.x + this.width < 0) this.makedForDeletion = true;

        // animate sprite
        if(this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        
    }
    draw(context){
        if(this.game.debug){
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.fillStyle = 'yellow';
            context.font = '25px Helvetica'
            context.fillText(this.lives, this.x,this.y);
        }
        context.drawImage(this.image, this.frameX*this.width,this.frameY*this.height,this.width, this.height,  this.x, this.y, this.width, this.height);
        
        
    }
}

module.exports = Enemy;