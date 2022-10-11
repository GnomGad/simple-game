const Explosion = require('./Explosion');
class SmokeExplosion extends Explosion{
    constructor(game,x,y){
        super(game,x,y);
        this.image = document.getElementById('smoke');
    }
}

module.exports = SmokeExplosion;