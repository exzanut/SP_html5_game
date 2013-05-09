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
    game.preload('www/picture/enemyShipSmaller.png');
    game.preload('www/picture/enemyShipSmall.png');
    game.preload('www/picture/enemyShipMedium.png');
    game.preload('www/picture/enemyShipLarge.png');
    game.preload('www/picture/enemyShipLarger.png');
    game.preload('www/picture/resume.png');
    game.preload('www/picture/play.png');
    game.preload('www/picture/shop.png');
    game.preload('www/picture/guide.png');
    game.preload('www/picture/okraj.png');
    game.preload('www/picture/bar.png');
    game.preload('www/picture/barFragment.png');
    game.preload('www/picture/spaceBG.png');
    game.preload('www/picture/explosion.png');
    game.preload('www/picture/bossS.png');
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

        game.enemyCnt=0;
        game.gameW = game.width;    //sirka herni plochy
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

        this.backgroundColor = 'grey';
        var game = Game.instance;

        var imgResume = new Sprite(100, 40);
        imgResume.image = game.assets['www/picture/resume.png'];
        imgResume.x = game.width/2-imgResume.width/2;
        imgResume.y = game.height/2+50;
        imgResume.visible = false;

        var imgPlay = new Sprite(100, 40);
        imgPlay.image = game.assets['www/picture/play.png'];
        imgPlay.x = game.width/2-imgPlay.width/2;
        imgPlay.y = game.height/2+100;

        var imgShop = new Sprite(100, 40);
        imgShop.image = game.assets['www/picture/shop.png'];
        imgShop.x = game.width/2-imgShop.width/2;
        imgShop.y = game.height/2+150;

        var imgGuide = new Sprite(100, 40);
        imgGuide.image = game.assets['www/picture/guide.png'];
        imgGuide.x = game.width/2-imgGuide.width/2;
        imgGuide.y = game.height/2+200;

        var imgOkraj = new Sprite(100, 40);
        imgOkraj.image = game.assets['www/picture/okraj.png'];
        imgOkraj.x = imgPlay.x;
        imgOkraj.y = imgPlay.y;

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

        /*imgOkraj.addEventListener('touchend', function () {
            if(imgOkraj.x == imgPlay.x && imgOkraj.y == imgPlay.y){
                game.pushScene(game.scGame);
            }
        });*/

        this.addEventListener('enterframe', function () {
            if(game.input.down && game.frame%2 == 0){
                if(imgOkraj.x == imgResume.x && imgOkraj.y == imgResume.y && imgResume.visible == true){
                    this.removeChild(imgOkraj);
                    imgOkraj.x = imgPlay.x;
                    imgOkraj.y = imgPlay.y;
                    this.addChild(imgOkraj);
                }

                else if(imgOkraj.x == imgPlay.x && imgOkraj.y == imgPlay.y){
                    this.removeChild(imgOkraj);
                    imgOkraj.x = imgShop.x;
                    imgOkraj.y = imgShop.y;
                    this.addChild(imgOkraj);
                }

                else if(imgOkraj.x == imgShop.x && imgOkraj.y == imgShop.y){
                    this.removeChild(imgOkraj);
                    imgOkraj.x = imgGuide.x;
                    imgOkraj.y = imgGuide.y;
                    this.addChild(imgOkraj);
                }
            }

            if(game.input.up && game.frame%3 == 0){
                if(imgOkraj.x == imgGuide.x && imgOkraj.y == imgGuide.y){
                    this.removeChild(imgOkraj);
                    imgOkraj.x = imgShop.x;
                    imgOkraj.y = imgShop.y;
                    this.addChild(imgOkraj);
                }

                else if(imgOkraj.x == imgShop.x && imgOkraj.y == imgShop.y){
                    this.removeChild(imgOkraj);
                    imgOkraj.x = imgPlay.x;
                    imgOkraj.y = imgPlay.y;
                    this.addChild(imgOkraj);
                }

                else if(imgOkraj.x == imgPlay.x && imgOkraj.y == imgPlay.y && imgResume.visible == true){
                    this.removeChild(imgOkraj);
                    imgOkraj.x = imgResume.x;
                    imgOkraj.y = imgResume.y;
                    this.addChild(imgOkraj);
                }
            }

            if(game.input.b){
                if(imgOkraj.x == imgPlay.x && imgOkraj.y == imgPlay.y){
                    imgResume.visible = true;
                    this.addChild(imgResume);
                    game.scGame = new SceneGame();
                    game.score = 0;
                    game.playerShip.aLive = true;
                    game.pushScene(game.scGame);
                }

                else if(imgOkraj.x == imgResume.x && imgOkraj.y == imgResume.y){
                    imgResume.visible = true;
                    game.popScene();
                }
            }


        });

        this.addChild(imgPlay);
        this.addChild(imgShop);
        this.addChild(imgGuide);
        this.addChild(imgOkraj);
        this.addChild(sound);
    }
});

var SceneShop = Class.create(enchant.Scene, {
    // The shop game scene.
    initialize: function() {
        // Call superclass constructor
        enchant.Scene.apply(this);



        this.addEventListener('enterframe', function () {
        });
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

        var barHP = new Bar(Game.instance.width - (20), Game.instance.height/2 - (50));
        var hpFrag = new BarFragment(Game.instance.width - (20)+1, 1);
        hpFrag.backgroundColor = 'darkred';

        var barMP = new Bar(Game.instance.width - (20+20), Game.instance.height/2 - (50));
        var mpFrag = new BarFragment(Game.instance.width - (20+20)+1, 1);
        mpFrag.backgroundColor = 'darkblue';

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
        this.moveSpeed = 10;
        this.aLive;

        //soucasti lodi
        this.hull = new Hull();
        this.shield = new Shield();
        this.generator = new Generator();

        this.baseS;
        this.rocketS;
        this.coverS;

        this.addEventListener('enterframe', function (e) {
            if(this.aLive == true) {
                this.move(Math.sqrt(Game.instance.ratio)*this.moveSpeed);
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
        if(Game.instance.frame%5 == 0){
            this.baseS = new BasePlayerShoot
                (this.x + this.width/2 - 4, this.y - this.height/2, Math.PI/2);
        }

        if(Game.instance.frame%20 == 0){
            this.rocketS = new RocketPlayerShoot
                (this.x-8, this.y-16, Math.PI/2);
        }

        if(Game.instance.frame%10 == 0){
            this.coverS = new CoverPlayerShoot
                (this.x + this.width/2, this.y + this.height/2, (((Math.random()*360)%360)*Math.PI)/180, 5);
        }
    },

    enemyColision: function () {
        for(var i =0;i<Game.instance.enemies.childNodes.length;i++){
            var enemy = Game.instance.enemies.childNodes[i];
            if (this.intersect(enemy)){
                this.getDmg(enemy.HP);
                enemy.getDmg(100*Game.instance.frame);
                enemy.remove();
            }
        }
    },

    move: function (moveSpeed) {
        if (Game.instance.input.left && Game.instance.input.up) {
            this.width = Game.instance.assets['www/picture/shipLeft.png'].width;
            this.height = Game.instance.assets['www/picture/shipLeft.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipLeft.png'];
            this.frame = 0;

            if(this.x - moveSpeed >= 0 && this.y - moveSpeed >= 0){
                this.x -= moveSpeed;
                this.y -= moveSpeed;
            }
            else if(this.x - moveSpeed >= 0){
                this.x -= moveSpeed;
            }
            else if(this.y - moveSpeed >= 0){
                this.y -= moveSpeed;
            }
        }
        else if (Game.instance.input.left && Game.instance.input.down) {
            this.width = Game.instance.assets['www/picture/shipLeft.png'].width;
            this.height = Game.instance.assets['www/picture/shipLeft.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipLeft.png'];
            this.frame = 2;

            if(this.x - moveSpeed >= 0 && this.y + moveSpeed <= Game.instance.height - this.height){
                this.x -= moveSpeed;
                this.y += moveSpeed;
            }
            else if(this.x - moveSpeed >= 0){
                this.x -= moveSpeed;
            }
            else if(this.y + moveSpeed <= Game.instance.height - this.height){
                this.y += moveSpeed;
            }
        }
        else if (Game.instance.input.left) {
            this.width = Game.instance.assets['www/picture/shipLeft.png'].width;
            this.height = Game.instance.assets['www/picture/shipLeft.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipLeft.png'];
            this.frame = 1;

            if(this.x - moveSpeed >= 0){
                this.x -= moveSpeed;
            }
        }
        else if (Game.instance.input.right && Game.instance.input.up) {
            this.width = Game.instance.assets['www/picture/shipRight.png'].width;
            this.height = Game.instance.assets['www/picture/shipRight.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipRight.png'];
            this.frame = 0;

            if(this.x + moveSpeed < Game.instance.gameW - this.width*1.5 && this.y -moveSpeed >= 0){
                this.x += moveSpeed;
                this.y -= moveSpeed;
            }
            else if(this.x + moveSpeed < Game.instance.gameW - this.width*1.5){
                this.x += moveSpeed;
            }
            else if(this.y -moveSpeed >= 0){
                this.y -= moveSpeed;
            }
        }
        else if (Game.instance.input.right && Game.instance.input.down) {
            this.width = Game.instance.assets['www/picture/shipRight.png'].width;
            this.height = Game.instance.assets['www/picture/shipRight.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipRight.png'];
            this.frame = 2;

            if(this.x + moveSpeed < Game.instance.gameW - this.width*1.5 && this.y + moveSpeed <= Game.instance.height - this.height){
                this.x += moveSpeed;
                this.y += moveSpeed;
            }
            else if(this.x + moveSpeed < Game.instance.gameW - this.width*1.5){
                this.x += moveSpeed;
            }
            else if(this.y + moveSpeed <= Game.instance.height - this.height){
                this.y += moveSpeed;
            }
        }
        else if (Game.instance.input.right) {
            this.width = Game.instance.assets['www/picture/shipRight.png'].width;
            this.height = Game.instance.assets['www/picture/shipRight.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipRight.png'];
            this.frame = 1;

            if(this.x + moveSpeed < Game.instance.gameW - this.width*1.5){
                this.x += moveSpeed;
            }
        }
        else if (Game.instance.input.up) {
            this.width = Game.instance.assets['www/picture/shipMid.png'].width;
            this.height = Game.instance.assets['www/picture/shipMid.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipMid.png'];
            this.frame = 0;

            if(this.y -moveSpeed >= 0){
                this.y -= moveSpeed;
            }
        }
        else if (Game.instance.input.down) {
            this.width = Game.instance.assets['www/picture/shipMid.png'].width;
            this.height = Game.instance.assets['www/picture/shipMid.png'].height/3;
            this.image = Game.instance.assets['www/picture/shipMid.png'];
            this.frame = 2;

            if(this.y + moveSpeed <= Game.instance.height - this.height){
                this.y += moveSpeed;
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
                }
            }
        });
    }
});
