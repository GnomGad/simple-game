class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 25;
        this.fontFamily = 'Bangers';
        this.color = 'white'
        this.fps;
    }
    update(deltaTime){
        this.fps = (1000/deltaTime).toFixed(0);
    }
    draw(context){
        context.save();
        context.fillStyle = this.color;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        context.font = this.fontSize + 'px ' + this.fontFamily

        context.fillText('Fps: ' + this.fps, 20, 20);
        //score
        context.fillText('Score: ' + this.game.score, 20, 40)
        //ammo
        
        //timer 
        const formattedTime = (this.game.gameTime * 0.0001).toFixed(1);
        context.fillText('Timer: ' + formattedTime, 20, 100);
        // game over massage
        if(this.game.gameOver){
            context.textAlign = 'center';
            let message1;
            let message2;

            if(this.game.score >= this.game.winningScore){
                message1 = 'You Win!';
                message2 = 'Well done';
            } else {
                message1 = 'Game Over';
                message2 = 'Try again';
            }
            
            context.font = '50px ' + this.fontFamily;
            context.fillText(message1, this.game.width*0.5, this.game.height*0.5-40);
            context.font = '25px ' + this.fontFamily;
            context.fillText(message2, this.game.width*0.5, this.game.height*0.5+40);
        }
        context.fillStyle = this.game.player.powerUp?'yellow': this.color;
        for( let i = 0; i < this.game.ammo; i++){
            context.fillRect(20+ 5*i,50,3, 20);
        }
        context.restore();
    }
}

module.exports = UI;