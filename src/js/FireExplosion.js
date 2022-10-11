const Explosion = require('./Explosion');

class FireExplosion extends Explosion{
    constructor(game,x,y){
        super(game,x,y);
        this.image = document.getElementById('fire');
    }
}

module.exports = FireExplosion;