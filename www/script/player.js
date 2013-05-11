var UpgradeList = Class.create({
    // The shop game scene.
    initialize: function() {

        this.moveSpeed = 10;

        this.hull_dmgReduction = 0; //0%
        this.hull_maxDmgCap = 20;   //hp

        this.shield_dmgAbsortion = 1;
        this.shield_energyConsumption = 0; //%

        this.generator_energyPerSec = 1;
        this.generator_maxEnergyCap = 10;

        this.baseS_damage = 1;
        this.baseS_projectiles = 2;
        this.baseS_moveSpeed = 20;
        this.baseS_cooldown = 10;

        this.rocketS_damage = 5;
        this.rocketS_moveSpeed = 15;
        this.rocketS_cooldown = 20;

        this.coverS_damage = 1;
        this.coverS_projectiles = 1;
        this.coverS_moveSpeed = 12;
        this.coverS_cooldown = 30;
        this.coverS_age = 3;

    }
});

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        var game = Game.instance;
        enchant.Sprite.call(this,
            game.assets['www/picture/shipMid.png'].width,
            game.assets['www/picture/shipMid.png'].height/3
        );

        this.image = game.assets['www/picture/shipMid.png'];
        this.frame = 1;
        this.x = x;
        this.y = y;
        this.gearScore = 0;
        this.moveSpeed = Game.instance.shipUpgrade.moveSpeed;
        this.aLive;

        //soucasti lodi
        this.hull = new Hull();
        this.shield = new Shield();
        this.generator = new Generator();

        this.baseS;
        this.rocketS;
        this.coverS = new Group();

        this.addEventListener('enterframe', function (e) {
            if(this.aLive == true) {
                this.move();
                this.enemyColision();
                this.fire();
                this.update();
            }

            //if(Game.instance.soundTurn == true) game.bgrndSound.play();
        });
    },

    update: function () {
        if(Game.instance.frame % Game.instance.fps == 0){
            if(this.generator.maxEnergyCap >= (this.generator.actEnergy + this.generator.energyPerSec)){
                this.generator.actEnergy += this.generator.energyPerSec;
            }
            else this.generator.actEnergy = this.generator.maxEnergyCap;
        }

        Game.instance.scoreLabel.score = Game.instance.score;
    },

    fire: function () {
        if(Game.instance.frame%Game.instance.shipUpgrade.baseS_cooldown == 0){
            var projectiles = Game.instance.shipUpgrade.baseS_projectiles;
            var angle=(projectiles-1)*Math.PI/30;
            if(angle>2*Math.PI/3){
                angle=2*Math.PI/3;
            }
            for(var i=1; i <= projectiles; i++){
                var dir=Math.PI/2;
                if(angle!=0){
                    dir=(Math.PI/2+angle/2-(i-1)*angle/(projectiles-1));
                }
                this.baseS = new BasePlayerShoot
                (this.x + (Game.instance.playerShip.width/projectiles)*i -
                    (Game.instance.playerShip.width/(projectiles))/2 - 4, this.y - this.height/2, dir);
            }

            if(Game.instance.soundTurn == true) Game.instance.playerShip.baseS.sound.clone().play();
        }

        if(Game.instance.frame%Game.instance.shipUpgrade.rocketS_cooldown == 0){
            if(Game.instance.frame/Game.instance.shipUpgrade.rocketS_cooldown%2==0){
                this.rocketS = new RocketPlayerShoot
                (this.x - 6, this.y + this.height/3, Math.PI/2);
            }else{
                this.rocketS = new RocketPlayerShoot
                (this.x +this.width-6, this.y + this.height/3, Math.PI/2);
            }

        }

        if(Game.instance.frame%Game.instance.shipUpgrade.coverS_cooldown == 0){
            for(var i=1; i <= Game.instance.shipUpgrade.coverS_projectiles; i++){
                this.coverS.addChild(new CoverPlayerShoot
                (this.x + this.width/2, this.y + this.height/2, (((Math.random()*360)%360)*Math.PI)/180, Game.instance.shipUpgrade.coverS_age));
            }

        }
    },

    enemyColision: function () {
        for(var i =0;i<Game.instance.enemies.childNodes.length;i++){
            var enemy = Game.instance.enemies.childNodes[i];
            if (this.intersect(enemy)){
                this.getDmg(enemy.HP);
                enemy.getDmg("kill");
            }
        }
    },

    move: function () {
        if(
            Game.instance.input.left ||
                Game.instance.input.right ||
                Game.instance.input.up ||
                Game.instance.input.down
            ) {
            if(this.moveSpeed < Math.sqrt(Game.instance.ratio)*Game.instance.shipUpgrade.moveSpeed) {
                //console.log("Speed:" + this.moveSpeed);
                this.moveSpeed += 1.5;
            }
        }
        else this.moveSpeed = 1;

        if (Game.instance.input.left && Game.instance.input.up) {
            this.width = Game.instance.assets['www/picture/shipLeft.png'].width;
            this.height = Game.instance.assets['www/picture/shipLeft.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipLeft.png'];
            this.frame = 0;

            if(this.x - this.moveSpeed >= 0 && this.y - this.moveSpeed >= 0){
                this.x -= this.moveSpeed;
                this.y -= this.moveSpeed;
            }
            else if(this.x - this.moveSpeed >= 0){
                this.x -= this.moveSpeed;
            }
            else if(this.y - this.moveSpeed >= 0){
                this.y -= this.moveSpeed;
            }
        }
        else if (Game.instance.input.left && Game.instance.input.down) {
            this.width = Game.instance.assets['www/picture/shipLeft.png'].width;
            this.height = Game.instance.assets['www/picture/shipLeft.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipLeft.png'];
            this.frame = 2;

            if(this.x - this.moveSpeed >= 0 && this.y + this.moveSpeed <= Game.instance.height - this.height){
                this.x -= this.moveSpeed;
                this.y += this.moveSpeed;
            }
            else if(this.x - this.moveSpeed >= 0){
                this.x -= this.moveSpeed;
            }
            else if(this.y + this.moveSpeed <= Game.instance.height - this.height){
                this.y += this.moveSpeed;
            }
        }
        else if (Game.instance.input.left) {
            this.width = Game.instance.assets['www/picture/shipLeft.png'].width;
            this.height = Game.instance.assets['www/picture/shipLeft.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipLeft.png'];
            this.frame = 1;

            if(this.x - this.moveSpeed >= 0){
                this.x -= this.moveSpeed;
            }
        }
        else if (Game.instance.input.right && Game.instance.input.up) {
            this.width = Game.instance.assets['www/picture/shipRight.png'].width;
            this.height = Game.instance.assets['www/picture/shipRight.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipRight.png'];
            this.frame = 0;

            if(this.x + this.moveSpeed < Game.instance.gameW - this.width*1.5 && this.y -this.moveSpeed >= 0){
                this.x += this.moveSpeed;
                this.y -= this.moveSpeed;
            }
            else if(this.x + this.moveSpeed < Game.instance.gameW - this.width*1.5){
                this.x += this.moveSpeed;
            }
            else if(this.y -this.moveSpeed >= 0){
                this.y -= this.moveSpeed;
            }
        }
        else if (Game.instance.input.right && Game.instance.input.down) {
            this.width = Game.instance.assets['www/picture/shipRight.png'].width;
            this.height = Game.instance.assets['www/picture/shipRight.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipRight.png'];
            this.frame = 2;

            if(this.x + this.moveSpeed < Game.instance.gameW - this.width*1.5 && this.y + this.moveSpeed <= Game.instance.height - this.height){
                this.x += this.moveSpeed;
                this.y += this.moveSpeed;
            }
            else if(this.x + this.moveSpeed < Game.instance.gameW - this.width*1.5){
                this.x += this.moveSpeed;
            }
            else if(this.y + this.moveSpeed <= Game.instance.height - this.height){
                this.y += this.moveSpeed;
            }
        }
        else if (Game.instance.input.right) {
            this.width = Game.instance.assets['www/picture/shipRight.png'].width;
            this.height = Game.instance.assets['www/picture/shipRight.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipRight.png'];
            this.frame = 1;

            if(this.x + this.moveSpeed < Game.instance.gameW - this.width*1.5){
                this.x += this.moveSpeed;
            }
        }
        else if (Game.instance.input.up) {
            this.width = Game.instance.assets['www/picture/shipMid.png'].width;
            this.height = Game.instance.assets['www/picture/shipMid.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipMid.png'];
            this.frame = 0;

            if(this.y -this.moveSpeed >= 0){
                this.y -= this.moveSpeed;
            }
        }
        else if (Game.instance.input.down) {
            this.width = Game.instance.assets['www/picture/shipMid.png'].width;
            this.height = Game.instance.assets['www/picture/shipMid.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipMid.png'];
            this.frame = 2;

            if(this.y + this.moveSpeed <= Game.instance.height - this.height){
                this.y += this.moveSpeed;
            }
        }
        else {
            this.width = Game.instance.assets['www/picture/shipMid.png'].width;
            this.height = Game.instance.assets['www/picture/shipMid.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipMid.png'];
            this.frame = 1;
        }
    },

    getDmg: function (dmg) {
        if(this.generator.actEnergy >= dmg*(1-(this.shield.energyConsumption/100))){
            this.generator.actEnergy -= dmg*(1-(this.shield.energyConsumption/100));
            if(dmg > this.shield.dmgAbsortion){
                dmg -= this.shield.dmgAbsortion;
                if(this.hull.actDmg > dmg*(1-(this.hull.dmgReduction/100))){
                    this.hull.actDmg -= dmg*(1-(this.hull.dmgReduction/100));
                }
                else{
                    this.hull.actDmg = 0;
                    this.aLive = false;
                    //zavolani efektu pro zniceni - vlozit
                    this.destroyShip();
                    //Game.instance.stop();
                }
            }
            else{
                //pohlceni strely - dmg = 0;
            }
        }
        else{
            if(dmg > (this.generator.actEnergy/(dmg*(1-this.shield.energyConsumption/100)))*this.shield.dmgAbsortion){
                dmg -= (this.generator.actEnergy/(dmg*(1-this.shield.energyConsumption/100)))*this.shield.dmgAbsortion;
                if(this.hull.actDmg > dmg*(1-(this.hull.dmgReduction/100))){
                    this.hull.actDmg -= dmg*(1-(this.hull.dmgReduction/100));
                }
                else{
                    this.hull.actDmg = 0;
                    this.aLive = false;
                    //zavolani efektu pro zniceni - vlozit
                    this.destroyShip();
                    //Game.instance.stop();
                }
            }
            else{
                //pohlceni strely - dmg = 0;
            }
            this.generator.actEnergy = 0;
        }
    },

    destroyShip: function () {
        this.width = Game.instance.assets['www/picture/shipExplosion.png'].width/6;
        this.height = Game.instance.assets['www/picture/shipExplosion.png'].height;
        this.image = Game.instance.assets['www/picture/shipExplosion.png'];
        this.sound = Game.instance.assets['www/sound/shipExplosion.wav'];
        if(Game.instance.soundTurn == true) this.sound.play();
        this.frame = 0;

        this.addEventListener('enterframe', function () {
            if(Game.instance.frame%2 == 0){
                this.frame++;
                if(this.frame == 5){
                    //Game.instance.playerShip = null;
                    Game.instance.scGame.removeChild(this);
                    delete this;
                    if(Game.instance.soundTurn == true) {
                        Game.instance.bgrndSound.groupSound.childNodes[Game.instance.bgrndSound.selectedIndex].stop();
                    }
                    Game.instance.pushScene(new SceneGameOver());
                }
            }
        });
    }
});
