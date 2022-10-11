window.addEventListener('load',() => {
    //canvas setup
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;

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

    class Projectile {
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.makedForDeletion = false;
            this.image = document.getElementById('projectile');
        }

        update(){
            this.x += this.speed;
            if(this.x > this.game.width * 0.8) this.makedForDeletion = true;
        }

        draw(context){
            context.drawImage(this.image,this.x, this.y);
        }
    }
    
    class Particle {
        constructor(game,x,y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('gears');
            this.frameX = Math.floor(Math.random() * 3);
            this.frameY = Math.floor(Math.random() * 3);
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
            this.size = this.spriteSize * this.sizeModifier;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * -15;
            this.gravity = 0.5;
            this.markedForDeletion = false;
            this.angle = 0;
            this.va = Math.random() * 0.2 - 0.1;
            this.bounced = Math.floor(Math.random() *1+2);
            this.bottomBounceBoundary = Math.random() * 80 + 60;
        }
        update(){
            this.angle += this.va;
            this.speedY += this.gravity;
            this.x -= this.speedX + this.game.speed;
            this.y += this.speedY;
            if(this.y > this.game.height + this.size || this.x < 0 - this.size) this.makedForDeletion = true;
            if(this.y > this.game.height - this.bottomBounceBoundary && this.bounced){
                this.bounced--;
                this.speedY *= -0.5;
            }
        }
        draw(context){
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(this.image,this.frameX * this.spriteSize, this.frameY * this.spriteSize,this.spriteSize,this.spriteSize, this.size*-0.5,this.size*-0.5,this.size, this.size);
            context.restore();
        }
    }

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

    class Angler1 extends Enemy{
        constructor(game){
            super(game);
            this.lives = 2;
            this.score = this.lives;
            this.width = 228 ;
            this.height = 169 ;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random() * 3);
        }
    }

    class Angler2 extends Enemy{
        constructor(game){
            super(game);
            this.lives = 3;
            this.score = this.lives;
            this.width = 213 ;
            this.height = 165 ;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random() * 2);
        }
    }
    class LuckyFish extends Enemy{
        constructor(game){
            super(game);
            this.lives = 2;
            this.score = 15;
            this.width = 99 ;
            this.height = 95 ;
            this.type = 'lucky'
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random() * 2);
        }
    }
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
    

    class Layer {
        constructor(game, image, speedModifier){
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        update(){
            if(this.x <= -this.width) this.x = 0;
            else this.x -= this.game.speed * this.speedModifier;
        }
        draw(context){
            context.drawImage(this.image, this.x,this.y);
            context.drawImage(this.image, this.x + this.width,this.y);
        }
    }
    class Background {
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            this.layer1 = new Layer(this.game,this.image1, 0.2);
            this.layer2 = new Layer(this.game,this.image2, 0.4);
            this.layer3 = new Layer(this.game,this.image3, 1);
            this.layer4 = new Layer(this.game,this.image4, 2);
            this.layers = [this.layer1, this.layer2, this.layer3];
        }
        update(){
            this.layers.forEach(layer => layer.update());
        }
        draw(context){
            this.layers.forEach(layer => layer.draw(context));
        };
    }

    class Explosion {
        constructor(game,x,y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.frameX = 0;
            this.spriteHeight = 200;
            this.fps=30;
            this.timer = 0;
            this.interval = 1000/this.fps;
            this.markedForDeletion = false;
            this.maxFrame = 8;
            this.spriteWidth = 200;
            this.spriteHeight = 200;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x - this.width * 0.5;
            this.y = y - this.height * 0.5;
        }
        update(deltaTime){
            this.x -= this.game.speed;
            if(this.timer > this.interval) {
                this.frameX++;
                this.timer = 0;
            }
            else this.timer += deltaTime;
            if(this.frameX > this.maxFrame) this.markedForDeletion = true;
        }
        draw(context){
            context.drawImage(this.image,this.frameX *this.spriteWidth,0,this.spriteWidth,this.spriteHeight, this.x, this.y, this.width, this.height);

        }
    }
    
    class SmokeExplosion extends Explosion{
        constructor(game,x,y){
            super(game,x,y);
            this.image = document.getElementById('smoke');
        }
    }

    class FireExplosion extends Explosion{
        constructor(game,x,y){
            super(game,x,y);
            this.image = document.getElementById('fire');
        }
    }

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

    const game = new Game(canvas.width,canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate(0);
});