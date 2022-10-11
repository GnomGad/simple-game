const Projectile = require('./Projectile');

class Player {
    constructor(game){
        this.game = game;
        this.width = 120;
        this.height = 190;
        this.x = 20;
        this.y = 100;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame=37;
        this.speedY = 0;
        this.maxSpeed = 2;
        this.projectiles = [];
        this.image = document.getElementById('player');
        this.powerUp = false;
        this.powerUpTimer = 0;
        this.poweUpLimit = 10000
    }
    update(deltaTime){
        if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
        else if(this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
        else this.speedY = 0;
        this.y += this.speedY;

        if(this.y > this.game.height - this.height*0.5) this.y = this.game.height -this.height *0.5;
        else if (this.y < -this.height*0.5) this.y = -this.height*0.5;
        
        this.projectiles.forEach(projectile => {
            projectile.update();
        });
        this.projectiles = this.projectiles.filter(projectile => !projectile.makedForDeletion);
        //sprite animate
        if(this.frameX < this.maxFrame){
            this.frameX++;
        }
        else this.frameX = 0;
        
        //power up
        if(this.powerUp){
            
            if(this.powerUpTimer > this.poweUpLimit){
                this.powerUp = false;
                this.powerUpTimer = 0;
                this.frameY = 0;
            }
            else{
                this.powerUpTimer += deltaTime;
                
                this.frameY = 1;
                this.game.ammoTimer += deltaTime;
            }
        }
    }
    draw(context){
        if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        this.projectiles.forEach(projectile => {
            projectile.draw(context);
        });
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width,this.height, this.x, this.y, this.width, this.height)
        
    }

    shootTop(){
        if(this.game.ammo > 0){
            this.projectiles.push(new Projectile(this.game,this.x +80 ,this.y + 20));
            this.game.ammo--;
        }
        if(this.powerUp) this.shootBot();
    }

    shootBot(){
        if(this.game.ammo > 0){
            this.projectiles.push(new Projectile(this.game,this.x +80 ,this.y + 175));
        }
    }

    enterPowerUp(){
        this.powerUp= true;
        this.powerUpTimer = 0;
        if(this.game.ammo < this.game.maxAmmo) this.game.ammo = this.game.maxAmmo;
    }
}  

module.exports = Player;