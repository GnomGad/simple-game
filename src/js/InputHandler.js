class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener('keydown', (event) => {
            if(((event.key === 'ArrowUp') || (event.key === 'ArrowDown')) &&
                (this.game.keys.indexOf(event.key) === -1)
            ){
                this.game.keys.push(event.key);
            } else if (event.key === ' '){
                this.game.player.shootTop();
            }
            else if (event.key === 'd'){
                this.game.debug = !this.game.debug;
            }
            else if(event.key === 'g'){
                this.game.player.enterPowerUp();
            }
        });
        window.addEventListener('keyup', (event) => {
            if(this.game.keys.indexOf(event.key) > -1){
                this.game.keys.splice(this.game.keys.indexOf(event.key),1);
            }
        });

    }
}

module.exports = InputHandler;