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
            if(this.y > game.height || this.x > game.width || this.x < -this.width || this.y < -this.height) {
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
        this.image = Game.instance.assets['www/picture/enemy.png'];
        this.frame = 60;
        this.damage=1;
        
       /* this.addEventListener('enterframe', function () {
            if(player.within(this, 8)) {
                game.end(game.score, "SCORE: " + game.score)
            }
        });*/
    }
});

var RoundEnShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y,direction) {
        EnemyShoot.call(this, x, y,direction);
        this.moveSpeed = 10;
        this.image = Game.instance.assets['www/picture/ball.png'];
        this.frame = 4;
        this.damage=1;
        
       
    }
});


var PlayerShoot = enchant.Class.create(Shoot, {

    initialize: function (x, y,direction) {
        var game = Game.instance;
        Shoot.call(this, x, y,direction);
        this.moveSpeed = 20;
        
        
        this.image = game.assets['www/picture/ball.png'];
        this.sound = game.assets['www/sound/M4A1_Single.wav'];
        this.sound.clone().play();
        this.frame = 7;
        this.damage = 1;

        this.addEventListener('enterframe', function () {
            for(var i =0;i<Game.instance.enemies.length;i++){
                var enemy = Game.instance.enemies[i];
                if (this.intersect(enemy)){
                    this.remove();
                    enemy.getDmg(this.damage);
                }
            }
        });
    }
});