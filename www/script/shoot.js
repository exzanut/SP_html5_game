var Shoot = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, direction) {
        enchant.Sprite.call(this, 16, 16);
        this.image = Game.instance.assets['icon0.png'];
        this.x = x;
        this.y = y;
        this.frame = 11;
        this.direction = direction;
        this.moveSpeed = 10;
        this.addEventListener('enterframe', function () {
            this.x += this.moveSpeed * Math.cos(this.direction);
            this.y -= this.moveSpeed * Math.sin(this.direction);
            if(this.y > 700 || this.x > 320 || this.x < -this.width || this.y < -this.height) {
                this.remove();
            }
        });
        Game.instance.scene.addChild(this);
        
    },
    remove: function () {
        Game.instance.scene.removeChild(this);
        delete this;
    }
});

var EnemyShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y,direction) {
        Shoot.call(this, x, y,direction);
       /* this.addEventListener('enterframe', function () {
            if(player.within(this, 8)) {
                game.end(game.score, "SCORE: " + game.score)
            }
        });*/
    }
});
