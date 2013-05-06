var Shoot = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, direction) {
        enchant.Sprite.call(this, 16, 16);
        var game = Game.instance;
        this.x = x;
        this.y = y;
        
        this.direction = direction;
        this.moveSpeed=10;
        this.damage=0;
        this.addEventListener('enterframe', function () {
            this.x += this.moveSpeed * Math.cos(this.direction);
            this.y -= this.moveSpeed * Math.sin(this.direction);
            if(this.y > game.height || this.x > game.gameW-this.width || this.x < -this.width || this.y < -this.height) {
                this.remove();
            }
        });
        Game.instance.scGame.addChild(this);
        
    },
    remove: function () {
        Game.instance.scGame.removeChild(this);
        delete this;
    }
});

var EnemyShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y,direction) {
        Shoot.call(this, x, y,direction);
        this.moveSpeed = 10;
        this.damage=1;

       this.addEventListener('enterframe', function () {
            if(Game.instance.playerShip.intersect(this)) {
                Game.instance.playerShip.getDmg(this.damage);
                this.remove();
            }
        });
    }
});

var RoundEnShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y,direction) {
        EnemyShoot.call(this, x, y,direction);
        this.moveSpeed = 8;
        this.image = Game.instance.assets['www/picture/ball.png'];
        this.frame = 4;
        this.damage=1;
    }
});

var LaserEnShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y) {
        EnemyShoot.call(this, x, y,3*Math.PI/2);
        this.moveSpeed = 12;
        this.image = Game.instance.assets['www/picture/enemy.png'];
        this.frame = 60;
        this.damage=2;
    }
});



var PlayerShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y,direction) {
        Shoot.call(this, x, y,direction);

        this.addEventListener('enterframe', function () {
            for(var i =0;i<Game.instance.enemies.length;i++){
                var enemy = Game.instance.enemies[i];
                if (this.intersect(enemy)){
                    enemy.getDmg(this.damage);
                    this.destroyShoot();
                }
            }
        });
    }
});

var BasePlayerShoot = enchant.Class.create(PlayerShoot, {
    initialize: function (x, y,direction) {
        PlayerShoot.call(this, x, y,direction);
        var game = Game.instance;
        this.moveSpeed = 20;
        this.image = game.assets['www/picture/ball.png'];
        this.sound = game.assets['www/sound/baseShoot.wav'];
        if(Game.instance.soundTurn == true) this.sound.clone().play();
        this.frame = 7;
        this.damage = 1;
    },

    destroyShoot: function () {
        this.moveSpeed = 0;
        this.damage = 0;
        new baseShootExplosion(this.x, this.y);
        this.remove();
    }
});

var baseShootExplosion = Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        enchant.Sprite.call(this, 16, 16);
        this.x = x;
        this.y = y;
        this.image = Game.instance.assets['www/picture/shoot_effect.png'];
        this.sound = this.sound = Game.instance.assets['www/sound/baseExplosion.wav'];
        if(Game.instance.soundTurn == true) this.sound.clone().play();
        this.frame = 0;

        this.addEventListener('enterframe', function () {
            if(Game.instance.fps%2 ==0){
                this.frame++;
                if(this.frame == 5){
                    this.remove();
                }
            }
        });
    }
});

var Explosion = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        enchant.Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        this.image=Game.instance.assets['www/picture/explosion.png'];
        this.addEventListener('enterframe', function () {
            this.frame=this.age*2;
            if(this.age==13){
                this.remove();
            }
        });

        Game.instance.scGame.addChild(this); 
    },
    remove: function () {
        Game.instance.scGame.removeChild(this);
        delete this;
    }
});


