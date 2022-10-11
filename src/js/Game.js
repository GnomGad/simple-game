const Background = require('./Background');
const Player = require('./Player');
const InputHandler = require('./InputHandler');
const UI = require('./UI');
const Enemy = require('./Enemy');
const Angler1 = require('./Angler1');
const Angler2 = require('./Angler2');
const Drone = require('./Drone');
const HiveWhale = require('./HiveWhale');
const LuckyFish = require('./LuckyFish');
const Explosion = require('./Explosion');
const SmokeExplosion = require('./SmokeExplosion');
const FireExplosion = require('./FireExplosion');
const Projectile = require('./Projectile');
const Particle = require('./Particle');

class Game {
    constructor(w,h){
        this.debug = false;
        this.gameOver = false;
        this.speed = 1;
        this.width = w;
        this.height = h;
        this.bg = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.ui = new UI(this);
        this.keys = [];
        this.enemies= [];
        this.particles = [];
        this.explosions = [];    
        this.enemyTimer = 0;
        this.enemyInterval = 2000;

        this.ammo = 20;
        this.maxAmmo = 50;
        this.ammoTimer = 0;
        this.ammoInterval = 350;

        this.score = 0;
        this.winningScore = 250;

        this.gameTime = 0;
        this.timeLimit = 100000;
        
    }
    update(deltaTime){
        if(!this.gameOver) this.gameTime += deltaTime;
        if(this.gameTime > this.timeLimit) this.gameOver = true;

        this.bg.update();
        this.bg.layer4.update();
        this.player.update(deltaTime);
        if (this.ammoTimer > this.ammoInterval){
            if(this.ammo < this.maxAmmo) this.ammo++;
            this.ammoTimer = 0;
        } else {
            this.ammoTimer += deltaTime;
        };
        this.particles.forEach(particle => particle.update(deltaTime));
        this.particles = this.particles.filter(particle => !particle.markedForDeletion);
        this.explosions.forEach(explosion => explosion.update(deltaTime));
        this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);

        if(this.enemyTimer > this.enemyInterval && !this.gameOver){
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        };

        this.enemies.forEach(enemy => {
            enemy.update();
            if(this.checkCollision(this.player, enemy)){
                enemy.makedForDeletion = true;
                this.addExplosion(enemy);
                for(let i = 0; i < 10; i++){
                    this.particles.push(new Particle(this,enemy.x+enemy.width *0.5,enemy.y + enemy.height *0.5));
                }
                if(enemy.type === 'lucky') this.player.enterPowerUp();
                else if(!this.gameOver) this.score--;
            }
            this.player.projectiles.forEach(projectile => {
                if(this.checkCollision(projectile, enemy)){
                    enemy.lives--;
                    projectile.makedForDeletion = true;
                    this.addExplosion(enemy);
                    for(let i = 0; i < 1; i++){
                        this.particles.push(new Particle(this,enemy.x+enemy.width *0.5,enemy.y + enemy.height *0.5));
                    }
                    if(enemy.lives <= 0) {
                        enemy.makedForDeletion = true;
                        if(enemy.type === 'hive'){
                            for(let i=0;i< 5;i++){
                                this.enemies.push(new Drone(this,enemy.x + Math.random() * enemy.width ,enemy.y + Math.random() * enemy.height * 0.5));
                            }
                            
                        }
                        for(let i = 0; i < 10; i++){
                            this.particles.push(new Particle(this,enemy.x+enemy.width *0.5,enemy.y + enemy.height *0.5));
                        }
                        if(!this.gameOver) this.score += enemy.score;
                        if(this.score > this.winningScore) this.gameOver = true;
                    } 
                }
            });
        });
        this.enemies = this.enemies.filter(enemy => !enemy.makedForDeletion);
        this.ui.update(deltaTime);
    }
    draw(context){
        this.bg.draw(context);
        this.ui.draw(context);
        this.player.draw(context);
        
        this.particles.forEach(particle => particle.draw(context));
        
        this.enemies.forEach(enemy => {
            enemy.draw(context);
        });

        this.explosions.forEach(explosion => explosion.draw(context));
        this.bg.layer4.draw(context);
    }

    addEnemy(){
        const random = Math.random();
        
        
        if(random < 0.3)
            this.enemies.push(new Angler1(this));
        else if(random < 0.6)
            this.enemies.push(new Angler2(this));
        else if(random < 0.8)
            this.enemies.push(new HiveWhale(this));
        else
            this.enemies.push(new LuckyFish(this));
    }

    addExplosion(enemy){
        const random = Math.random();
        if(random < 0.5){
            this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width*0.5 ,enemy.y + enemy.height*0.5));
        }
        else{
            this.explosions.push(new FireExplosion(this, enemy.x + enemy.width*0.5 ,enemy.y + enemy.height*0.5));
        }
        
        
    }

    checkCollision(rect1, rect2){
        return (    rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.y + rect1.height > rect2.y );
    }
}

module.exports = Game;