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
    game.preload('www/picture/lblPlus.png');
    game.preload('www/picture/lblMinus.png');

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
        game.shipUpgrade = new UpgradeList();
        game.shipUpgradeDefault = new UpgradeList();
        game.playerShip = new Player();
        game.score = 0;
        game.currency = 0;
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
                else if(imgOkraj.x == imgShop.x && imgOkraj.y == imgShop.y){
                    game.scArmory = new SceneArmory();
                    game.pushScene(game.scArmory);
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
        game.scoreLabel = new TextLabel(8, 8, "SCORE:");
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

var SceneArmory = Class.create(enchant.Scene, {
    // The armory game scene.
    initialize: function() {
        // Call superclass constructor
        enchant.Scene.apply(this);
        this.backgroundColor = 'black';

        var game = Game.instance;

        var player = new Player(Game.instance.gameW/2 - Game.instance.playerShip.width/2, Game.instance.height/2);
        //player = Game.instance.playerShip;

        //armory point
        var imgArmory = new TextLabel(8,8*1, "ARMORY POINT:");
        imgArmory.score = game.currency;


        //ship
        var imgShip = new MutableText(8,14*3);
        imgShip.text = "SHIP";

        var imgShipHealth = new TextLabel(8+14+14+8,14*4, "HEALTH:");
        imgShipHealth.score = game.shipUpgrade.hull_maxDmgCap;

        var imgShipHealthPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgShipHealthPlus.image = game.assets['www/picture/lblPlus.png'];
        imgShipHealthPlus.x = 8;
        imgShipHealthPlus.y = 14*4;

        var imgShipHealthMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgShipHealthMinus.image = game.assets['www/picture/lblMinus.png'];
        imgShipHealthMinus.x = 8+14;
        imgShipHealthMinus.y = 14*4;

        var imgShipEnergy = new TextLabel(8+14+14+8,14*5, "ENERGY:");
        imgShipEnergy.score = game.shipUpgrade.generator_maxEnergyCap;

        var imgShipEnergyPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgShipEnergyPlus.image = game.assets['www/picture/lblPlus.png'];
        imgShipEnergyPlus.x = 8;
        imgShipEnergyPlus.y = 14*5;

        var imgShipEnergyMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgShipEnergyMinus.image = game.assets['www/picture/lblMinus.png'];
        imgShipEnergyMinus.x = 8+14;
        imgShipEnergyMinus.y = 14*5;

        var imgShipDmgRed = new TextLabel(8+14+14+8,14*6, "DAMAGE REDUCTION:");
        imgShipDmgRed.score = game.shipUpgrade.hull_dmgReduction;

        var imgShipDmgRedPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgShipDmgRedPlus.image = game.assets['www/picture/lblPlus.png'];
        imgShipDmgRedPlus.x = 8;
        imgShipDmgRedPlus.y = 14*6;

        var imgShipDmgRedMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgShipDmgRedMinus.image = game.assets['www/picture/lblMinus.png'];
        imgShipDmgRedMinus.x = 8+14;
        imgShipDmgRedMinus.y = 14*6;

        var imgShipDmgAbs = new TextLabel(8+14+14+8,14*7, "DAMAGE ABSORPTION:");
        imgShipDmgAbs.score = game.shipUpgrade.shield_dmgAbsortion;

        var imgShipDmgAbsPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgShipDmgAbsPlus.image = game.assets['www/picture/lblPlus.png'];
        imgShipDmgAbsPlus.x = 8;
        imgShipDmgAbsPlus.y = 14*7;

        var imgShipDmgAbsMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgShipDmgAbsMinus.image = game.assets['www/picture/lblMinus.png'];
        imgShipDmgAbsMinus.x = 8+14;
        imgShipDmgAbsMinus.y = 14*7;

        var imgShipEnergyRegen = new TextLabel(8+14+14+8,14*8, "ENERGY REGENERATION:");
        imgShipEnergyRegen.score = game.shipUpgrade.generator_energyPerSec;

        var imgShipEnergyRegenPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgShipEnergyRegenPlus.image = game.assets['www/picture/lblPlus.png'];
        imgShipEnergyRegenPlus.x = 8;
        imgShipEnergyRegenPlus.y = 14*8;

        var imgShipEnergyRegenMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgShipEnergyRegenMinus.image = game.assets['www/picture/lblMinus.png'];
        imgShipEnergyRegenMinus.x = 8+14;
        imgShipEnergyRegenMinus.y = 14*8;

        var imgShipEnergyConsum = new TextLabel(8+14+14+8,14*9, "ENERGY CONSUMPTION:");
        imgShipEnergyConsum.score = game.shipUpgrade.shield_energyConsumption;

        var imgShipEnergyConsumPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgShipEnergyConsumPlus.image = game.assets['www/picture/lblPlus.png'];
        imgShipEnergyConsumPlus.x = 8;
        imgShipEnergyConsumPlus.y = 14*9;

        var imgShipEnergyConsumMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgShipEnergyConsumMinus.image = game.assets['www/picture/lblMinus.png'];
        imgShipEnergyConsumMinus.x = 8+14;
        imgShipEnergyConsumMinus.y = 14*9;

        var imgShipSpeed = new TextLabel(8+14+14+8,14*10, "SPEED:");
        imgShipSpeed.score = game.shipUpgrade.moveSpeed;

        var imgShipSpeedPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgShipSpeedPlus.image = game.assets['www/picture/lblPlus.png'];
        imgShipSpeedPlus.x = 8;
        imgShipSpeedPlus.y = 14*10;

        var imgShipSpeedMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgShipSpeedMinus.image = game.assets['www/picture/lblMinus.png'];
        imgShipSpeedMinus.x = 8+14;
        imgShipSpeedMinus.y = 14*10;


        //base shoot
        var imgBase = new MutableText(8,14*12);
        imgBase.text = "BASE SHOOT";

        var imgBaseDamage = new TextLabel(8+14+14+8,14*13, "DAMAGE:");
        imgBaseDamage.score = game.shipUpgrade.baseS_damage;

        var imgBaseDamagePlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgBaseDamagePlus.image = game.assets['www/picture/lblPlus.png'];
        imgBaseDamagePlus.x = 8;
        imgBaseDamagePlus.y = 14*13;

        var imgBaseDamageMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgBaseDamageMinus.image = game.assets['www/picture/lblMinus.png'];
        imgBaseDamageMinus.x = 8+14;
        imgBaseDamageMinus.y = 14*13;

        var imgBaseProjectile = new TextLabel(8+14+14+8,14*14, "PROJECTILE:");
        imgBaseProjectile.score = game.shipUpgrade.baseS_projectiles;

        var imgBaseProjectilePlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgBaseProjectilePlus.image = game.assets['www/picture/lblPlus.png'];
        imgBaseProjectilePlus.x = 8;
        imgBaseProjectilePlus.y = 14*14;

        var imgBaseProjectileMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgBaseProjectileMinus.image = game.assets['www/picture/lblMinus.png'];
        imgBaseProjectileMinus.x = 8+14;
        imgBaseProjectileMinus.y = 14*14;

        var imgBaseSpeed = new TextLabel(8+14+14+8,14*15, "SPEED:");
        imgBaseSpeed.score = game.shipUpgrade.baseS_moveSpeed;

        var imgBaseSpeedPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgBaseSpeedPlus.image = game.assets['www/picture/lblPlus.png'];
        imgBaseSpeedPlus.x = 8;
        imgBaseSpeedPlus.y = 14*15;

        var imgBaseSpeedMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgBaseSpeedMinus.image = game.assets['www/picture/lblMinus.png'];
        imgBaseSpeedMinus.x = 8+14;
        imgBaseSpeedMinus.y = 14*15;

        var imgBaseCooldown = new TextLabel(8+14+14+8,14*16, "COOLDOWN:");
        imgBaseCooldown.score = game.shipUpgrade.baseS_cooldown;

        var imgBaseCooldownPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgBaseCooldownPlus.image = game.assets['www/picture/lblPlus.png'];
        imgBaseCooldownPlus.x = 8;
        imgBaseCooldownPlus.y = 14*16;

        var imgBaseCooldownMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgBaseCooldownMinus.image = game.assets['www/picture/lblMinus.png'];
        imgBaseCooldownMinus.x = 8+14;
        imgBaseCooldownMinus.y = 14*16;


        //rocket shoot
        var imgRocket = new MutableText(8,14*18);
        imgRocket.text = "ROCKET SHOOT";

        var imgRocketDamage = new TextLabel(8+14+14+8,14*19, "DAMAGE:");
        imgRocketDamage.score = game.shipUpgrade.rocketS_damage;

        var imgRocketDamagePlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgRocketDamagePlus.image = game.assets['www/picture/lblPlus.png'];
        imgRocketDamagePlus.x = 8;
        imgRocketDamagePlus.y = 14*19;

        var imgRocketDamageMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgRocketDamageMinus.image = game.assets['www/picture/lblMinus.png'];
        imgRocketDamageMinus.x = 8+14;
        imgRocketDamageMinus.y = 14*19;

        var imgRocketSpeed = new TextLabel(8+14+14+8,14*20, "SPEED:");
        imgRocketSpeed.score = game.shipUpgrade.rocketS_moveSpeed;

        var imgRocketSpeedPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgRocketSpeedPlus.image = game.assets['www/picture/lblPlus.png'];
        imgRocketSpeedPlus.x = 8;
        imgRocketSpeedPlus.y = 14*20;

        var imgRocketSpeedMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgRocketSpeedMinus.image = game.assets['www/picture/lblMinus.png'];
        imgRocketSpeedMinus.x = 8+14;
        imgRocketSpeedMinus.y = 14*20;

        var imgRocketCooldown = new TextLabel(8+14+14+8,14*21, "COOLDOWN:");
        imgRocketCooldown.score = game.shipUpgrade.rocketS_cooldown;

        var imgRocketCooldownPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgRocketCooldownPlus.image = game.assets['www/picture/lblPlus.png'];
        imgRocketCooldownPlus.x = 8;
        imgRocketCooldownPlus.y = 14*21;

        var imgRocketCooldownMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgRocketCooldownMinus.image = game.assets['www/picture/lblMinus.png'];
        imgRocketCooldownMinus.x = 8+14;
        imgRocketCooldownMinus.y = 14*21;


        //cover shoot
        var imgCover = new MutableText(8,14*23);
        imgCover.text = "COVER SHOOT";

        var imgCoverDamage = new TextLabel(8+14+14+8,14*24, "DAMAGE:");
        imgCoverDamage.score = game.shipUpgrade.coverS_damage;

        var imgCoverDamagePlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgCoverDamagePlus.image = game.assets['www/picture/lblPlus.png'];
        imgCoverDamagePlus.x = 8;
        imgCoverDamagePlus.y = 14*24;

        var imgCoverDamageMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgCoverDamageMinus.image = game.assets['www/picture/lblMinus.png'];
        imgCoverDamageMinus.x = 8+14;
        imgCoverDamageMinus.y = 14*24;

        var imgCoverProjectile = new TextLabel(8+14+14+8,14*25, "PROJECTILE:");
        imgCoverProjectile.score = game.shipUpgrade.coverS_projectiles;

        var imgCoverProjectilePlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgCoverProjectilePlus.image = game.assets['www/picture/lblPlus.png'];
        imgCoverProjectilePlus.x = 8;
        imgCoverProjectilePlus.y = 14*25;

        var imgCoverProjectileMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgCoverProjectileMinus.image = game.assets['www/picture/lblMinus.png'];
        imgCoverProjectileMinus.x = 8+14;
        imgCoverProjectileMinus.y = 14*25;

        var imgCoverRange = new TextLabel(8+14+14+8,14*26, "RANGE:");
        imgCoverRange.score = game.shipUpgrade.coverS_age;

        var imgCoverRangePlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgCoverRangePlus.image = game.assets['www/picture/lblPlus.png'];
        imgCoverRangePlus.x = 8;
        imgCoverRangePlus.y = 14*26;

        var imgCoverRangeMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgCoverRangeMinus.image = game.assets['www/picture/lblMinus.png'];
        imgCoverRangeMinus.x = 8+14;
        imgCoverRangeMinus.y = 14*26;

        var imgCoverSpeed = new TextLabel(8+14+14+8,14*27, "SPEED:");
        imgCoverSpeed.score = game.shipUpgrade.coverS_moveSpeed;

        var imgCoverSpeedPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgCoverSpeedPlus.image = game.assets['www/picture/lblPlus.png'];
        imgCoverSpeedPlus.x = 8;
        imgCoverSpeedPlus.y = 14*27;

        var imgCoverSpeedMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgCoverSpeedMinus.image = game.assets['www/picture/lblMinus.png'];
        imgCoverSpeedMinus.x = 8+14;
        imgCoverSpeedMinus.y = 14*27;

        var imgCoverCooldown = new TextLabel(8+14+14+8,14*28, "COOLDOWN:");
        imgCoverCooldown.score = game.shipUpgrade.coverS_cooldown;

        var imgCoverCooldownPlus = new Sprite(game.assets['www/picture/lblPlus.png'].width, game.assets['www/picture/lblPlus.png'].height);
        imgCoverCooldownPlus.image = game.assets['www/picture/lblPlus.png'];
        imgCoverCooldownPlus.x = 8;
        imgCoverCooldownPlus.y = 14*28;

        var imgCoverCooldownMinus = new Sprite(game.assets['www/picture/lblMinus.png'].width, game.assets['www/picture/lblMinus.png'].height);
        imgCoverCooldownMinus.image = game.assets['www/picture/lblMinus.png'];
        imgCoverCooldownMinus.x = 8+14;
        imgCoverCooldownMinus.y = 14*28;


        //ship listener
        imgShipHealthPlus.addEventListener('touchend', function () {
            imgShipHealth.score++;
            game.shipUpgrade.hull_maxDmgCap++;
        });

        imgShipHealthMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.hull_maxDmgCap < game.shipUpgrade.hull_maxDmgCap){
                imgShipHealth.score--;
                game.shipUpgrade.hull_maxDmgCap--;
            }
        });

        imgShipEnergyPlus.addEventListener('touchend', function () {
            imgShipEnergy.score++;
            game.shipUpgrade.generator_maxEnergyCap++;
        });

        imgShipEnergyMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.generator_maxEnergyCap < game.shipUpgrade.generator_maxEnergyCap){
                imgShipEnergy.score--;
                game.shipUpgrade.generator_maxEnergyCap--;
            }
        });

        imgShipDmgRedPlus.addEventListener('touchend', function () {
            if(game.shipUpgrade.hull_dmgReduction < 99){
                imgShipDmgRed.score++;
                game.shipUpgrade.hull_dmgReduction++;
            }
        });

        imgShipDmgRedMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.hull_dmgReduction < game.shipUpgrade.hull_dmgReduction){
                imgShipDmgRed.score--;
                game.shipUpgrade.hull_dmgReduction--;
            }
        });

        imgShipDmgAbsPlus.addEventListener('touchend', function () {
            if(game.shipUpgrade.shield_dmgAbsortion < 99){
                imgShipDmgAbs.score++;
                game.shipUpgrade.shield_dmgAbsortion++;
            }
        });

        imgShipDmgAbsMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.shield_dmgAbsortion < game.shipUpgrade.shield_dmgAbsortion){
                imgShipDmgAbs.score--;
                game.shipUpgrade.shield_dmgAbsortion--;
            }
        });

        imgShipEnergyRegenPlus.addEventListener('touchend', function () {
            imgShipEnergyRegen.score++;
            game.shipUpgrade.generator_energyPerSec++;
        });

        imgShipEnergyRegenMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.generator_energyPerSec < game.shipUpgrade.generator_energyPerSec){
                imgShipEnergyRegen.score--;
                game.shipUpgrade.generator_energyPerSec--;
            }
        });

        imgShipEnergyConsumPlus.addEventListener('touchend', function () {
            if (game.shipUpgrade.shield_energyConsumption < 99){
                imgShipEnergyConsum.score++;
                game.shipUpgrade.shield_energyConsumption++;
            }
        });

        imgShipEnergyConsumMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.shield_energyConsumption < game.shipUpgrade.shield_energyConsumption){
                imgShipEnergyConsum.score--;
                game.shipUpgrade.shield_energyConsumption--;
            }
        });

        imgShipSpeedPlus.addEventListener('touchend', function () {
            if(game.shipUpgrade.moveSpeed < 15) {
                imgShipSpeed.score++;
                game.shipUpgrade.moveSpeed++;
            }
        });

        imgShipSpeedMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.moveSpeed < game.shipUpgrade.moveSpeed){
                imgShipSpeed.score--;
                game.shipUpgrade.moveSpeed--;
            }
        });


        //base shoot listener
        imgBaseDamagePlus.addEventListener('touchend', function () {
            imgBaseDamage.score++;
            Game.instance.shipUpgrade.baseS_damage++;
        });

        imgBaseDamageMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.baseS_damage < game.shipUpgrade.baseS_damage){
                imgBaseDamage.score--;
                Game.instance.shipUpgrade.baseS_damage--;
            }
        });

        imgBaseProjectilePlus.addEventListener('touchend', function () {
            imgBaseProjectile.score++;
            Game.instance.shipUpgrade.baseS_projectiles++;
        });

        imgBaseProjectileMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.baseS_projectiles < game.shipUpgrade.baseS_projectiles){
                imgBaseProjectile.score--;
                Game.instance.shipUpgrade.baseS_projectiles--;
            }
        });

        imgBaseSpeedPlus.addEventListener('touchend', function () {
            if(game.shipUpgrade.baseS_moveSpeed < 20){
                imgBaseSpeed.score++;
                Game.instance.shipUpgrade.baseS_moveSpeed++;
            }
        });

        imgBaseSpeedMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.baseS_moveSpeed < game.shipUpgrade.baseS_moveSpeed){
                imgBaseSpeed.score--;
                Game.instance.shipUpgrade.baseS_moveSpeed--;
            }
        });

        imgBaseCooldownPlus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.baseS_cooldown > game.shipUpgrade.baseS_cooldown){
                imgBaseCooldown.score++;
                Game.instance.shipUpgrade.baseS_cooldown++;
            }
        });

        imgBaseCooldownMinus.addEventListener('touchend', function () {
            if(game.shipUpgrade.baseS_cooldown > 2){
                imgBaseCooldown.score--;
                game.shipUpgrade.baseS_cooldown--;
            }
        });


        //rocket shoot listener
        imgRocketDamagePlus.addEventListener('touchend', function () {
            imgRocketDamage.score++;
            Game.instance.shipUpgrade.rocketS_damage++;
        });

        imgRocketDamageMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.rocketS_damage > game.shipUpgrade.rocketS_damage){
                imgRocketDamage.score--;
                Game.instance.shipUpgrade.rocketS_damage--;
            }
        });

        imgRocketSpeedPlus.addEventListener('touchend', function () {
            imgRocketSpeed.score++;
            Game.instance.shipUpgrade.rocketS_moveSpeed++;
        });

        imgRocketSpeedMinus.addEventListener('touchend', function () {
            imgRocketSpeed.score--;
            Game.instance.shipUpgrade.rocketS_moveSpeed--;
        });

        imgRocketCooldownPlus.addEventListener('touchend', function () {
            imgRocketCooldown.score++;
            Game.instance.shipUpgrade.rocketS_cooldown++;
        });

        imgRocketCooldownMinus.addEventListener('touchend', function () {
            imgRocketCooldown.score--;
            Game.instance.shipUpgrade.rocketS_cooldown--;
        });

        //cover shoot listener
        imgCoverDamagePlus.addEventListener('touchend', function () {
            imgCoverDamage.score++;
            Game.instance.shipUpgrade.coverS_damage++;
        });

        imgCoverDamageMinus.addEventListener('touchend', function () {
            imgCoverDamage.score--;
            Game.instance.shipUpgrade.coverS_damage--;
        });

        imgCoverProjectilePlus.addEventListener('touchend', function () {
            imgCoverProjectile.score++;
            Game.instance.shipUpgrade.coverS_projectiles++;
        });

        imgCoverProjectileMinus.addEventListener('touchend', function () {
            imgCoverProjectile.score--;
            Game.instance.shipUpgrade.coverS_projectiles--;
        });

        imgCoverRangePlus.addEventListener('touchend', function () {
            imgCoverRange.score++;
            Game.instance.shipUpgrade.coverS_age++;
        });

        imgCoverRangeMinus.addEventListener('touchend', function () {
            imgCoverRange.score--;
            Game.instance.shipUpgrade.coverS_age--;
        });

        imgCoverSpeedPlus.addEventListener('touchend', function () {
            imgCoverSpeed.score++;
            Game.instance.shipUpgrade.coverS_moveSpeed++;
        });

        imgCoverSpeedMinus.addEventListener('touchend', function () {
            imgCoverSpeed.score--;
            Game.instance.shipUpgrade.coverS_moveSpeed--;
        });

        imgCoverCooldownPlus.addEventListener('touchend', function () {
            imgCoverCooldown.score++;
            Game.instance.shipUpgrade.coverS_cooldown++;
        });

        imgCoverCooldownMinus.addEventListener('touchend', function () {
            imgCoverCooldown.score--;
            Game.instance.shipUpgrade.coverS_cooldown--;
        });

        this.addEventListener('enterframe', function () {
            if(game.input.a){
                game.popScene();
            }
        });

        this.addChild(player);

        this.addChild(imgArmory);

        this.addChild(imgShip);
        this.addChild(imgShipHealth);
        this.addChild(imgShipEnergy);
        this.addChild(imgShipDmgRed);
        this.addChild(imgShipDmgAbs);
        this.addChild(imgShipEnergyRegen);
        this.addChild(imgShipEnergyConsum);
        this.addChild(imgShipSpeed);

        this.addChild(imgBase);
        this.addChild(imgBaseDamage);
        this.addChild(imgBaseProjectile);
        this.addChild(imgBaseSpeed);
        this.addChild(imgBaseCooldown);

        this.addChild(imgRocket);
        this.addChild(imgRocketDamage);
        this.addChild(imgRocketSpeed);
        this.addChild(imgRocketCooldown);

        this.addChild(imgCover);
        this.addChild(imgCoverDamage);
        this.addChild(imgCoverProjectile);
        this.addChild(imgCoverRange);
        this.addChild(imgCoverSpeed);
        this.addChild(imgRocketCooldown);

        this.addChild(imgShipHealthPlus);
        this.addChild(imgShipHealthMinus);
        this.addChild(imgShipEnergyPlus);
        this.addChild(imgShipEnergyMinus);
        this.addChild(imgShipDmgRedPlus);
        this.addChild(imgShipDmgRedMinus);
        this.addChild(imgShipDmgAbsPlus);
        this.addChild(imgShipDmgAbsMinus);
        this.addChild(imgShipEnergyRegenPlus);
        this.addChild(imgShipEnergyRegenMinus);
        this.addChild(imgShipEnergyConsumPlus);
        this.addChild(imgShipEnergyConsumMinus);
        this.addChild(imgShipSpeedPlus);
        this.addChild(imgShipSpeedMinus);

        this.addChild(imgBaseDamagePlus);
        this.addChild(imgBaseDamageMinus);
        this.addChild(imgBaseProjectilePlus);
        this.addChild(imgBaseProjectileMinus);
        this.addChild(imgBaseSpeedPlus);
        this.addChild(imgBaseSpeedMinus);
        this.addChild(imgBaseCooldownPlus);
        this.addChild(imgBaseCooldownMinus);

        this.addChild(imgRocketDamagePlus);
        this.addChild(imgRocketDamageMinus);
        this.addChild(imgRocketSpeedPlus);
        this.addChild(imgRocketSpeedMinus);
        this.addChild(imgRocketCooldownPlus);
        this.addChild(imgRocketCooldownMinus);

        this.addChild(imgCoverDamagePlus);
        this.addChild(imgCoverDamageMinus);
        this.addChild(imgCoverProjectilePlus);
        this.addChild(imgCoverProjectileMinus);
        this.addChild(imgCoverRangePlus);
        this.addChild(imgCoverRangeMinus);
        this.addChild(imgCoverSpeedPlus);
        this.addChild(imgCoverSpeedMinus);
        this.addChild(imgRocketCooldownPlus);
        this.addChild(imgRocketCooldownMinus);
    }
});

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
        this.baseS_projectiles = 1;
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
                this.move();
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
            for(var i=1; i <= Game.instance.shipUpgrade.baseS_projectiles; i++){
                this.baseS = new BasePlayerShoot
                (this.x + (Game.instance.playerShip.width/Game.instance.shipUpgrade.baseS_projectiles)*i -
                    (Game.instance.playerShip.width/(Game.instance.shipUpgrade.baseS_projectiles))/2 - 4, this.y - this.height/2, Math.PI/2);
            }

            if(Game.instance.soundTurn == true) Game.instance.playerShip.baseS.sound.clone().play();
        }

        if(Game.instance.frame%Game.instance.shipUpgrade.rocketS_cooldown == 0){
            this.rocketS = new RocketPlayerShoot
                (this.x - 6, this.y + this.height/3, Math.PI/2);
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
                enemy.getDmg(100*Game.instance.frame);
                enemy.remove();
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
                }
            }
        });
    }
});
