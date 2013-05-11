enchant();

window.onload = function () {
    var game = new Game(window.innerWidth, window.innerHeight);
    game.fps = 30;
    game.scale = 1;
    game.ratio = game.width/500;

    //image
    game.preload('www/picture/enemy.png');
    game.preload('www/picture/mine.png');
    game.preload('www/picture/laser.png');
    game.preload('www/picture/roundShoot.png');
    game.preload('www/picture/asteroid.png')
    game.preload('www/picture/star.png');
    game.preload('www/picture/game_over.png');
    game.preload('www/picture/enemyShipSmaller.png');
    game.preload('www/picture/enemyShipSmall.png');
    game.preload('www/picture/enemyShipMedium.png');
    game.preload('www/picture/enemyShipLarge.png');
    game.preload('www/picture/enemyShipLarger.png');
    game.preload('www/picture/bar.png');
    game.preload('www/picture/barFragment.png');
    game.preload('www/picture/spaceBG.png');
    game.preload('www/picture/explosion.png');
    game.preload('www/picture/bossS.png');
    game.preload('www/picture/boss2.png');
    game.preload('www/picture/shoot_effect.png');
    game.preload('www/picture/soundOn.png');
    game.preload('www/picture/soundOff.png');
    game.preload('www/picture/font0.png');
    game.preload('www/picture/shipMid.png');
    game.preload('www/picture/shipRight.png');
    game.preload('www/picture/shipLeft.png');
    game.preload('www/picture/baseShoot.png');
    game.preload('www/picture/rocketShoot.png');
    game.preload('www/picture/coverShoot.png');
    game.preload('www/picture/shipExplosion.png');

    //sound
    game.preload('www/sound/shipExplosion.wav');
    game.preload('www/sound/background.wav');
    game.preload('www/sound/backgroundOld.wav');
    game.preload('www/sound/baseShoot.wav');
    game.preload('www/sound/baseExplosion.wav');

    game.onload = function() {   
        game.soundTurn = true;

        var scMenu = new SceneMenu();
        game.scMenu = scMenu;
        game.pushScene(scMenu);

        var gameRun = false;

        game.gameW = game.width;    //sirka herni plochy
        game.shipUpgrade = new UpgradeList();
        game.playerShip = new Player();
        game.score = 0;
        game.bgrndSound = game.assets['www/sound/background.wav'];

        //keybind
        game.keybind(37, 'left');
        game.keybind(38, 'up');
        game.keybind(39, 'right');
        game.keybind(40, 'down');
        game.keybind(27, 'a'); //esc
        game.keybind(13, 'b'); //enter
    }

    game.start();
};

var SceneMenu = Class.create(enchant.Scene, {
    // The main menu scene.
    initialize: function() {
        // Call superclass constructor
        Scene.apply(this);

        //this.backgroundColor = 'grey';
        var game = Game.instance;

        this.selectedIndex=0;
        this.buttons = new Group();
        this.cdChange=0;

        //background
        var bgImg= new Sprite(Game.instance.width*2,Game.instance.height*2);
        bgImg.image=Game.instance.assets['www/picture/spaceBG.png'];
        bgImg.x=-Game.instance.width/2;
        bgImg.y=-Game.instance.height/2;
        bgImg.tl.moveBy(0,140,70).moveBy(-140,0,70).moveBy(0,-140,70).moveBy(140,0,70).loop();
        this.addChild(bgImg);

        var imgPlay = new MutableText(100, 40);
        //imgPlay.image = game.assets['www/picture/play.png'];
        imgPlay.text = "PLAY";
        imgPlay.x = game.width/2-imgPlay.width/2;
        imgPlay.y = game.height/2+100;
        imgPlay.resume=false;
        imgPlay.addEventListener('touchend', function () {
            if(game.scMenu.buttons.childNodes[0].resume==false){
                game.scMenu.setNewGame();
            }else{
                game.popScene();
            }
        });
        imgPlay.tl.scaleTo(1.5,6);
        this.buttons.addChild(imgPlay);

        var imgArmory = new MutableText(100, 40);
        //imgShop.image = game.assets['www/picture/shop.png'];
        imgArmory.text = "ARMORY";
        imgArmory.x = game.width/2-imgArmory.width/2;
        imgArmory.y = game.height/2+150;
        imgArmory.addEventListener('touchend', function () {
            game.pushScene(game.scShop);
        });
        this.buttons.addChild(imgArmory);

        var imgGuide = new MutableText(100, 40);
        //imgGuide.image = game.assets['www/picture/guide.png'];
        imgGuide.text = "GUIDE";
        imgGuide.x = game.width/2-imgGuide.width/2;
        imgGuide.y = game.height/2+200;
        this.buttons.addChild(imgGuide);

        var sound = new Sprite(20, 20);
        if(game.soundTurn == true) sound.image = game.assets['www/picture/soundOn.png'];
        else sound.image = game.assets['www/picture/soundOff.png'];
        sound.scaleX = 2;
        sound.scaleY = 2;
        sound.x = 50;
        sound.y = game.height - sound.height - 50;

        sound.addEventListener('touchend', function () {
            if(game.soundTurn == true) {
                sound.image = game.assets['www/picture/soundOff.png'];
                game.soundTurn = false;
            }
            else {
                sound.image = game.assets['www/picture/soundOn.png'];
                game.soundTurn = true;
            }
        });


        this.addEventListener('enterframe', function () {
            if(this.cdChange>0)this.cdChange--;
                         
            if(game.input.down && this.cdChange==0){
                this.buttons.childNodes[this.selectedIndex].tl.scaleTo(1,8);
                this.selectedIndex=(++this.selectedIndex)%3;
                this.buttons.childNodes[this.selectedIndex].tl.scaleTo(1.5,6);
                this.cdChange=8;
            }

            if(game.input.up && this.cdChange==0){
                this.buttons.childNodes[this.selectedIndex].tl.scaleTo(1,8);
                this.selectedIndex=(--this.selectedIndex+3)%3;
                this.buttons.childNodes[this.selectedIndex].tl.scaleTo(1.5,6);
                this.cdChange=8;
            }

            if(game.input.b){
                switch(this.selectedIndex){
                    case 0:
                        if(game.scMenu.buttons.childNodes[0].resume==false){
                            this.setNewGame();
                        }else{
                            game.popScene();
                        }
                        break;
                    case 1:
                        if(game.scMenu.buttons.childNodes[0].resume==true){
                            game.pushScene(game.scShop);
                        }
                        break;
                    case 2:
                        //game.pushScene(game.scGuide);
                        break;        
                }
            }
        });
        this.addChild(this.buttons);
        this.addChild(sound);
    },
    setNewGame: function() {
        var game = Game.instance;
        game.scMenu.buttons.childNodes[0].text = "RESUME"; 
        game.scMenu.buttons.childNodes[0].x = game.width/2-game.scMenu.buttons.childNodes[0].width/2;
        game.scMenu.buttons.childNodes[0].resume=true;
        game.scGame = new SceneGame();
        game.scShop = new SceneShop();
        game.score = 0;
        game.playerShip.aLive = true;
        game.pushScene(game.scGame);
    }
});

var SceneGame = Class.create(enchant.Scene, {
    // The game game scene.
    initialize: function() {
        // Call superclass constructor
        Scene.apply(this);

       // this.backgroundColor = 'blue';
        var bgImg = new Sprite(Game.instance.width,Game.instance.height);
        var bgImg2 = new Sprite(Game.instance.width,Game.instance.height);
        bgImg.image=Game.instance.assets['www/picture/spaceBG.png'];
        bgImg2.image=Game.instance.assets['www/picture/spaceBG.png'];
        bgImg2.y=-Game.instance.height;

        var game = Game.instance;
        game.scoreLabel = new ScoreLabel(8, 8);
        game.currency=0;

        var barHP = new Bar(Game.instance.width - (20), Game.instance.height/2 - (50));
        var hpFrag = new BarFragment(Game.instance.width - (20)+1, 1);
        hpFrag.backgroundColor = 'darkred';

        var barMP = new Bar(Game.instance.width - (20+20), Game.instance.height/2 - (50));
        var mpFrag = new BarFragment(Game.instance.width - (20+20)+1, 1);
        mpFrag.backgroundColor = 'orange';

        var player = new Player(game.gameW/2, game.height-100);
        var enemySpawner = new EnemySpawner();
        game.enemies = new Group();

        game.gameW = game.width - (barHP.width + barMP.width);
        game.playerShip = player;

        this.addEventListener('enterframe', function () {
            if(game.input.a){
                game.pushScene(game.scMenu);
            }

            hpFrag.height = (game.height/player.hull.maxDmgCap)*player.hull.actDmg-2;
            hpFrag.y = game.height-hpFrag.height-1;

            mpFrag.height = (game.height/player.generator.maxEnergyCap)*player.generator.actEnergy-2;
            mpFrag.y = game.height-mpFrag.height-1;

            bgImg.y+=1;
            bgImg2.y+=1;
            if (bgImg.y==Game.instance.height){
                bgImg.y=0;
                bgImg2.y=-Game.instance.height;

            }

        });
        this.addChild(bgImg);
        this.addChild(bgImg2);
        this.addChild(player);
        this.addChild(barHP);
        this.addChild(hpFrag);
        this.addChild(barMP);
        this.addChild(mpFrag);
        this.addChild(enemySpawner);
        this.addChild(game.scoreLabel);
        this.addChild(game.enemies)

    }
});

var SceneShop = Class.create(enchant.Scene, {
    // The shop game scene.
    initialize: function() {
        // Call superclass constructor
        enchant.Scene.apply(this);
        this.backgroundColor = 'black';

        var player = new Player(Game.instance.gameW/2 - Game.instance.playerShip.width/2, Game.instance.height/2);
        //player = Game.instance.playerShip;

        this.addEventListener('enterframe', function () {
        });

        this.addChild(player);
    }
});

var SceneGameOver = Class.create(enchant.Scene, {
    // The game over game scene.
    initialize: function() {
        // Call superclass constructor
        Scene.apply(this);
        var game = Game.instance;
        var gameOverImg = new Sprite(189,97);
        gameOverImg.image=game.assets['www/picture/game_over.png'];
        gameOverImg.x = game.gameW/2 - gameOverImg.width/2;
        gameOverImg.y = game.height/2 - gameOverImg.height/2;

        var finalScore = new MutableText(game.gameW/2,0);
        finalScore.text = "YOUR SCORE: "+game.score;
        finalScore.x -= finalScore.width/2;
        finalScore.y += gameOverImg.y+gameOverImg.height+50;
        finalScore.scaleX = 1.5;
        finalScore.scaleY = 1.5;
        this.addChild(gameOverImg);
        this.addChild(finalScore);
        this.addEventListener('enterframe', function () {
            if(game.input.a){
                game.popScene();
                game.popScene();
                game.onload();
            }
        });
    }
});

var UpgradeList = Class.create({
    // The shop game scene.
    initialize: function() {

        this.moveSpeed = 5;

        this.hull_dmgReduction = 1; //%
        this.hull_maxDmgCap = 10;   //hp

        this.shield_dmgAbsortion = 1;
        this.shield_energyConsumption = 1; //%

        this.generator_energyPerSec = 0.1;
        this.generator_maxEnergyCap = 10;

        this.baseS_damage = 1;
        this.baseS_projectiles = 2;
        this.baseS_moveSpeed = 20;
        this.baseS_cooldown = 10;

        this.rocketS_damage = 5;
        this.rocketS_moveSpeed = 15;
        this.rocketS_cooldown = 100;

        this.coverS_damage = 1;
        this.coverS_projectiles = 1;
        this.coverS_moveSpeed = 12;
        this.coverS_cooldown = 30;
        this.coverS_age = 3;

    }
});

var Bar = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        var game = Game.instance;
        enchant.Sprite.call(this, 20, 100);
        this.image = game.assets['www/picture/bar.png'];
        this.x = x;
        this.y = y;
        this.scaleY = game.height/this.height;

        this.addEventListener('enterframe', function (e) {
        });
    }
});

var BarFragment = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        var game = Game.instance;
        enchant.Sprite.call(this, 18, 100);
        this.image = game.assets['www/picture/barFragment.png'];
        this.x = x;
        this.y = y;

        this.addEventListener('enterframe', function (e) {
        });
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
                this.move(/*Math.sqrt(Game.instance.ratio)*this.moveSpeed*/);
                this.enemyColision();
                this.fire();
                this.update();
            }

            if(Game.instance.soundTurn == true) game.bgrndSound.play();
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
        if(this.generator.actEnergy >= dmg*this.shield.energyConsumption){
            this.generator.actEnergy -= dmg*this.shield.energyConsumption;
            if(dmg > this.shield.dmgAbsortion){
                dmg -= this.shield.dmgAbsortion;
                if(this.hull.actDmg > dmg*this.hull.dmgReduction){
                    this.hull.actDmg -= dmg*this.hull.dmgReduction;
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
            if(dmg > (this.generator.actEnergy/this.shield.energyConsumption)*this.shield.dmgAbsortion){
                dmg -= (this.generator.actEnergy/this.shield.energyConsumption)*this.shield.dmgAbsortion;
                if(this.hull.actDmg > dmg*this.hull.dmgReduction){
                    this.hull.actDmg -= dmg*this.hull.dmgReduction;
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
                    Game.instance.pushScene(new SceneGameOver());
                }
            }
        });
    }
});
