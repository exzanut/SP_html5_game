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
        imgPlay.text = "PLAY";
        imgPlay.x = game.width/2-imgPlay.width/2;
        imgPlay.y = game.height/2+100;
        imgPlay.resume=false;
        imgPlay.addEventListener('touchend', function () {
            if(game.scMenu.buttons.childNodes[0].resume==false){
                game.scMenu.setNewGame();
            }else{
                game.popScene();
                if(Game.instance.soundTurn == true) {
                    game.bgrndSound.groupSound.childNodes[game.bgrndSound.selectedIndex].play(); 
                }
            }
        });
        imgPlay.tl.scaleTo(1.5,6);
        this.buttons.addChild(imgPlay);

        var imgArmory = new MutableText(100, 40);
        imgArmory.text = "ARMORY";
        imgArmory.x = game.width/2-imgArmory.width/2;
        imgArmory.y = game.height/2+150;
        imgArmory.addEventListener('touchend', function () {
            if(game.scMenu.buttons.childNodes[0].resume==true){
                game.pushScene(game.scArmory);
            }
        });
        this.buttons.addChild(imgArmory);

        var imgGuide = new MutableText(100, 40);
        imgGuide.text = "GUIDE";
        imgGuide.x = game.width/2-imgGuide.width/2;
        imgGuide.y = game.height/2+200;
        imgGuide.addEventListener('touchend', function () {
            game.pushScene(new SceneGuide());
        });
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
                        if(Game.instance.soundTurn == true) {
                            game.bgrndSound.groupSound.childNodes[game.bgrndSound.selectedIndex].play();
                        }
                        break;
                    case 1:
                        if(game.scMenu.buttons.childNodes[0].resume==true){
                            game.pushScene(game.scArmory);
                        }
                        break;
                    case 2:
                        game.pushScene(new SceneGuide());
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
        game.scArmory = new SceneArmory();
        game.scGame = new SceneGame();
        game.score = 0;
        game.playerShip.aLive = true;
        game.pushScene(game.scGame);
        game.pushScene(game.scArmory);
    }
});

var SceneGame = Class.create(enchant.Scene, {
    // The game game scene.
    initialize: function() {
        // Call superclass constructor
        Scene.apply(this);
        var bgImg = new Sprite(Game.instance.width,Game.instance.height);
        var bgImg2 = new Sprite(Game.instance.width,Game.instance.height);
        bgImg.image=Game.instance.assets['www/picture/spaceBG.png'];
        bgImg2.image=Game.instance.assets['www/picture/spaceBG.png'];
        bgImg2.y=-Game.instance.height;

        var game = Game.instance;
        this.escCD=20;

        game.apLabel = new TextLabel(8, 8, "ARMORY POINT:");
        game.scoreLabel = new TextLabel(8, 22, "SCORE:");
        game.armoryPoint=500;

        this.touch = false;
        this.touchX = 0;
        this.touchY = 0;
        
        var backText = new MutableText(8, 8);
            backText.text = "BACK";
            backText.x = game.width - backText.width-2;
            backText.addEventListener('touchstart',function(){
                game.input.a = true;
        });

        var barHP = new Bar(Game.instance.width - (20), (Game.instance.height)/2 - (50)+15);
        var hpFrag = new BarFragment(Game.instance.width - (20)+1, 1);
        hpFrag.backgroundColor = 'darkred';

        var barMP = new Bar(Game.instance.width - (20+20), (Game.instance.height)/2 - (50)+15);
        var mpFrag = new BarFragment(Game.instance.width - (20+20)+1, 1);
        mpFrag.backgroundColor = 'orange';

        var player = new Player(game.gameW/2, game.height-100);
        var enemySpawner = new EnemySpawner();
        game.enemies = new Group();

        game.gameW = game.width - (barHP.width + barMP.width);
        game.playerShip = player;

        this.addEventListener('enterframe', function () {
            if(this.escCD>0)this.escCD--;
            if(this.escCD>18 && Game.instance.soundTurn == true) {
                game.bgrndSound.groupSound.childNodes[game.bgrndSound.selectedIndex].play();  
            }

            if(game.input.a && this.escCD == 0){
                game.input.a = false;
                game.pushScene(game.scMenu);
                game.bgrndSound.groupSound.childNodes[game.bgrndSound.selectedIndex].stop();
                this.releaseKeys();
            }

            hpFrag.height = ((game.height-30-2)/game.shipUpgrade.hull_maxDmgCap)*player.hull.actDmg;
            hpFrag.y = game.height-hpFrag.height-1;

            mpFrag.height = ((game.height-30-2)/game.shipUpgrade.generator_maxEnergyCap)*player.generator.actEnergy;
            mpFrag.y = game.height-mpFrag.height-1;

            bgImg.y+=1;
            bgImg2.y+=1;
            if (bgImg.y==Game.instance.height){
                bgImg.y=0;
                bgImg2.y=-Game.instance.height;

            }

            if(this.touch){
               this.holdKeys(this.touchX,this.touchY);
            }

        });

        this.addEventListener('touchstart', function (e) {
            this.touchX = e.x;
            this.touchY = e.y;
            this.touch = true;
        });
        this.addEventListener('touchmove', function (e) {
            this.touchX = e.x;
            this.touchY = e.y;
        });
        this.addEventListener('touchend', function (e) {
            this.releaseKeys();
            this.touch = false;
        });



        this.addChild(bgImg);
        this.addChild(bgImg2);
        this.addChild(player);
        this.addChild(enemySpawner);
        this.addChild(game.enemies);
        this.addChild(barHP);
        this.addChild(hpFrag);
        this.addChild(barMP);
        this.addChild(mpFrag);
        this.addChild(game.scoreLabel);
        this.addChild(game.apLabel);
        this.addChild(backText);
        this.addChild(game.bgrndSound);

    },
    releaseKeys: function() {
        Game.instance.input.up = false;
        Game.instance.input.down = false;
        Game.instance.input.right = false;
        Game.instance.input.left = false;
    },
    holdKeys: function(x,y) {
        var ship = Game.instance.playerShip;
        if(ship.aLive == true) {
                if(x-ship.x-45/2>30){
                    Game.instance.input.right=true;
                    Game.instance.input.left=false;
                }
                if(x-ship.x-45/2<-30){
                    Game.instance.input.left=true;
                    Game.instance.input.right=false;
                }
                if(y-ship.y-ship.height/2>25){
                    Game.instance.input.down=true;
                    Game.instance.input.up=false;
                }
                if(y-ship.y-ship.height/2<-25){
                    Game.instance.input.up=true;
                    Game.instance.input.down=false;
                }
                if(Math.abs(x - ship.x-45/2)<35){
                    Game.instance.input.right = false;
                    Game.instance.input.left = false;
                }
                if(Math.abs(y - ship.y-ship.height/2)<25){
                    Game.instance.input.up=false;
                    Game.instance.input.down=false;
                }              
        }
    }

});

var SceneArmory = Class.create(enchant.Scene, {
    // The armory game scene.
    initialize: function() {
        // Call superclass constructor
        enchant.Scene.apply(this);
        this.backgroundColor = 'black';

        var game = Game.instance;

        //armory point

        var imgArmory = new TextLabel(8,8*1, "ARMORY POINT:");
        //imgArmory.easing = 0;
        this.addEventListener('enterframe', function(){
            imgArmory.score = game.armoryPoint;

            imgShipHealth.score = game.shipUpgrade.hull_maxDmgCap;
            imgShipEnergy.score = game.shipUpgrade.generator_maxEnergyCap;
            imgShipDmgRed.score = game.shipUpgrade.hull_dmgReduction;
            imgShipDmgAbs.score = game.shipUpgrade.shield_dmgAbsortion;
            imgShipEnergyRegen.score = game.shipUpgrade.generator_energyPerSec;
            imgShipEnergyConsum.score = game.shipUpgrade.shield_energyConsumption;
            imgShipSpeed.score = game.shipUpgrade.moveSpeed;

            imgBaseDamage.score = game.shipUpgrade.baseS_damage;
            imgBaseProjectile.score = game.shipUpgrade.baseS_projectiles;
            imgBaseSpeed.score = game.shipUpgrade.baseS_moveSpeed;
            imgBaseCooldown.score = game.shipUpgrade.baseS_cooldown;

            imgRocketDamage.score = game.shipUpgrade.rocketS_damage;
            imgRocketSpeed.score = game.shipUpgrade.rocketS_moveSpeed;
            imgRocketCooldown.score = game.shipUpgrade.rocketS_cooldown;

            imgCoverDamage.score = game.shipUpgrade.coverS_damage;
            imgCoverProjectile.score = game.shipUpgrade.coverS_projectiles;
            imgCoverRange.score = game.shipUpgrade.coverS_age;
            imgCoverSpeed.score = game.shipUpgrade.coverS_moveSpeed;
            imgCoverCooldown.score = game.shipUpgrade.coverS_cooldown;

            imgRepair.score = Math.ceil(game.playerShip.hull.actDmg);

            Game.instance.playerShip.hull_maxDmgCap = game.shipUpgrade.hull_maxDmgCap;
            Game.instance.playerShip.generator.maxEnergyCap = game.shipUpgrade.generator_maxEnergyCap;
            Game.instance.playerShip.hull.dmgReduction = game.shipUpgrade.hull_dmgReduction;
            Game.instance.playerShip.shield.dmgAbsortion = game.shipUpgrade.shield_dmgAbsortion;
            Game.instance.playerShip.generator.energyPerSec = game.shipUpgrade.generator_energyPerSec;
            Game.instance.playerShip.shield.energyConsumption = game.shipUpgrade.shield_energyConsumption;

            if(game.input.a){
                game.input.a = false;
                game.popScene();
            }
        });

        //status text
        {
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

        var imgShipDmgAbs = new TextLabel(8+14+14+8,14*7, "SHIELD ABSORPTION:");
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

            var imgBack = new MutableText(game.width-80, 14*30);
            imgBack.text = "BACK";
            imgBack.addEventListener('touchstart',function(){
                game.input.a = true;
            });

            var imgRepair = new TextLabel(8, 14*30, "REPAIR:");
            imgRepair.score = (1/game.shipUpgrade.hull_maxDmgCap)*game.playerShip.hull.actDmg*100;

            var repairCounter = 0;
            imgRepair.score = game.playerShip.hull.actDmg;
            imgRepair.addEventListener('touchend', function(){
                if(game.playerShip.hull.actDmg + 1 <= game.shipUpgrade.hull_maxDmgCap){
                    if(repairCounter*game.shipUpgrade.costAP/10 <= game.armoryPoint){
                        game.armoryPoint -= repairCounter*game.shipUpgrade.costAP/10;
                        game.playerShip.hull.actDmg++;
                        repairCounter++;
                    }
                }
            });
        }

        //ship listener
        {
        imgShipHealthPlus.addEventListener('touchend', function () {
            if(Math.pow((game.shipUpgrade.hull_maxDmgCap - game.shipUpgradeDefault.hull_maxDmgCap + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                game.armoryPoint -= Math.pow((game.shipUpgrade.hull_maxDmgCap - game.shipUpgradeDefault.hull_maxDmgCap + 1), 2)*game.shipUpgrade.costAP;
                //imgShipHealth.score++;
                game.shipUpgrade.hull_maxDmgCap++;
            }
        });

        imgShipHealthMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.hull_maxDmgCap < game.shipUpgrade.hull_maxDmgCap){
                game.armoryPoint += Math.pow((game.shipUpgrade.hull_maxDmgCap - game.shipUpgradeDefault.hull_maxDmgCap), 2)*game.shipUpgrade.costAP;
                //imgShipHealth.score--;
                game.shipUpgrade.hull_maxDmgCap--;
            }
        });

        imgShipEnergyPlus.addEventListener('touchend', function () {
            if(Math.pow((game.shipUpgrade.generator_maxEnergyCap - game.shipUpgradeDefault.generator_maxEnergyCap + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                game.armoryPoint -= Math.pow((game.shipUpgrade.generator_maxEnergyCap - game.shipUpgradeDefault.generator_maxEnergyCap + 1), 2)*game.shipUpgrade.costAP;
                //imgShipEnergy.score++;
                game.shipUpgrade.generator_maxEnergyCap++;
            }
        });

        imgShipEnergyMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.generator_maxEnergyCap < game.shipUpgrade.generator_maxEnergyCap){
                game.armoryPoint += Math.pow((game.shipUpgrade.generator_maxEnergyCap - game.shipUpgradeDefault.generator_maxEnergyCap), 2)*game.shipUpgrade.costAP;
                //imgShipEnergy.score--;
                game.shipUpgrade.generator_maxEnergyCap--;
            }
        });

        imgShipDmgRedPlus.addEventListener('touchend', function () {
            if(game.shipUpgrade.hull_dmgReduction < 99){
                if(Math.pow(((game.shipUpgrade.hull_dmgReduction - game.shipUpgradeDefault.hull_dmgReduction)/5)+1, 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                    game.armoryPoint -= Math.pow(((game.shipUpgrade.hull_dmgReduction - game.shipUpgradeDefault.hull_dmgReduction)/5)+1, 2)*game.shipUpgrade.costAP;
                    //imgShipDmgRed.score++;
                    game.shipUpgrade.hull_dmgReduction+=5;
                }
            }
        });

        imgShipDmgRedMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.hull_dmgReduction < game.shipUpgrade.hull_dmgReduction){
                game.armoryPoint += Math.pow(((game.shipUpgrade.hull_dmgReduction - game.shipUpgradeDefault.hull_dmgReduction)/5), 2)*game.shipUpgrade.costAP;
                //imgShipDmgRed.score--;
                game.shipUpgrade.hull_dmgReduction-=5;
            }
        });

        imgShipDmgAbsPlus.addEventListener('touchend', function () {
            if(game.shipUpgrade.shield_dmgAbsortion < 99){
                if(Math.pow((game.shipUpgrade.shield_dmgAbsortion - game.shipUpgradeDefault.shield_dmgAbsortion + 1), 2)*game.shipUpgrade.costAPNext <= game.armoryPoint){
                    game.armoryPoint -= Math.pow((game.shipUpgrade.shield_dmgAbsortion - game.shipUpgradeDefault.shield_dmgAbsortion + 1), 2)*game.shipUpgrade.costAPNext;
                    //imgShipDmgAbs.score++;
                    game.shipUpgrade.shield_dmgAbsortion++;
                }
            }
        });

        imgShipDmgAbsMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.shield_dmgAbsortion < game.shipUpgrade.shield_dmgAbsortion){
                game.armoryPoint += Math.pow((game.shipUpgrade.shield_dmgAbsortion - game.shipUpgradeDefault.shield_dmgAbsortion), 2)*game.shipUpgrade.costAPNext;
                //imgShipDmgAbs.score--;
                game.shipUpgrade.shield_dmgAbsortion--;
            }
        });

        imgShipEnergyRegenPlus.addEventListener('touchend', function () {
            if(Math.pow((game.shipUpgrade.generator_energyPerSec - game.shipUpgradeDefault.generator_energyPerSec + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                game.armoryPoint -= Math.pow((game.shipUpgrade.generator_energyPerSec - game.shipUpgradeDefault.generator_energyPerSec + 1), 2)*game.shipUpgrade.costAP;
                //imgShipEnergyRegen.score++;
                game.shipUpgrade.generator_energyPerSec++;
            }
        });

        imgShipEnergyRegenMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.generator_energyPerSec < game.shipUpgrade.generator_energyPerSec){
                game.armoryPoint += Math.pow((game.shipUpgrade.generator_energyPerSec - game.shipUpgradeDefault.generator_energyPerSec), 2)*game.shipUpgrade.costAP;
                //imgShipEnergyRegen.score--;
                game.shipUpgrade.generator_energyPerSec--;
            }
        });

        imgShipEnergyConsumPlus.addEventListener('touchend', function () {
            if(game.shipUpgrade.shield_energyConsumption < 99){
                if(Math.pow(((game.shipUpgrade.shield_energyConsumption - game.shipUpgradeDefault.shield_energyConsumption)/5)+1, 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                    game.armoryPoint -= Math.pow(((game.shipUpgrade.shield_energyConsumption - game.shipUpgradeDefault.shield_energyConsumption)/5)+1, 2)*game.shipUpgrade.costAP;
                    //imgShipEnergyConsum.score++;
                    game.shipUpgrade.shield_energyConsumption+=5;
                }
            }
        });

        imgShipEnergyConsumMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.shield_energyConsumption < game.shipUpgrade.shield_energyConsumption){
                game.armoryPoint += Math.pow(((game.shipUpgrade.shield_energyConsumption - game.shipUpgradeDefault.shield_energyConsumption)/5), 2)*game.shipUpgrade.costAP;
                //imgShipEnergyConsum.score--;
                game.shipUpgrade.shield_energyConsumption-=5;
            }
        });

        imgShipSpeedPlus.addEventListener('touchend', function () {
            if(game.shipUpgrade.moveSpeed < 15) {
                if(Math.pow((game.shipUpgrade.moveSpeed - game.shipUpgradeDefault.moveSpeed + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                    game.armoryPoint -= Math.pow((game.shipUpgrade.moveSpeed - game.shipUpgradeDefault.moveSpeed + 1), 2)*game.shipUpgrade.costAP;
                    //imgShipSpeed.score++;
                    game.shipUpgrade.moveSpeed++;
                }
            }
        });

        imgShipSpeedMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.moveSpeed < game.shipUpgrade.moveSpeed){
                game.armoryPoint += Math.pow((game.shipUpgrade.moveSpeed - game.shipUpgradeDefault.moveSpeed), 2)*game.shipUpgrade.costAP;
                //imgShipSpeed.score--;
                game.shipUpgrade.moveSpeed--;
            }
        });
        }

        //base shoot listener
        {
        imgBaseDamagePlus.addEventListener('touchend', function () {
            if(Math.pow((game.shipUpgrade.baseS_damage - game.shipUpgradeDefault.baseS_damage + 1), 2)*game.shipUpgrade.costAP*game.shipUpgrade.baseS_projectiles <= game.armoryPoint){
                game.armoryPoint -= Math.pow((game.shipUpgrade.baseS_damage - game.shipUpgradeDefault.baseS_damage + 1), 2)*game.shipUpgrade.costAP*game.shipUpgrade.baseS_projectiles;
                //imgBaseDamage.score++;
                game.shipUpgrade.baseS_damage++;
            }
        });

        imgBaseDamageMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.baseS_damage < game.shipUpgrade.baseS_damage){
                //if(Math.pow((game.shipUpgrade.baseS_damage - game.shipUpgradeDefault.baseS_damage + 1), 2)*game.shipUpgrade.costAPNext*game.shipUpgrade.baseS_projectiles <= game.armoryPoint)
                {
                    game.armoryPoint += Math.pow((game.shipUpgrade.baseS_damage - game.shipUpgradeDefault.baseS_damage), 2)*game.shipUpgrade.costAP*game.shipUpgrade.baseS_projectiles;
                    //imgBaseDamage.score--;
                    game.shipUpgrade.baseS_damage--;
                }
            }
        });

        imgBaseProjectilePlus.addEventListener('touchend', function () {
            if(Math.pow((game.shipUpgrade.baseS_projectiles - game.shipUpgradeDefault.baseS_projectiles + 1), 2)*game.shipUpgrade.costAP*game.shipUpgrade.baseS_damage <= game.armoryPoint){
                game.armoryPoint -= Math.pow((game.shipUpgrade.baseS_projectiles - game.shipUpgradeDefault.baseS_projectiles + 1), 2)*game.shipUpgrade.costAP*game.shipUpgrade.baseS_damage;
                //imgBaseProjectile.score++;
                game.shipUpgrade.baseS_projectiles++;
            }
        });

        imgBaseProjectileMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.baseS_projectiles < game.shipUpgrade.baseS_projectiles){
                game.armoryPoint += Math.pow((game.shipUpgrade.baseS_projectiles - game.shipUpgradeDefault.baseS_projectiles), 2)*game.shipUpgrade.costAP*game.shipUpgrade.baseS_damage;
                //imgBaseProjectile.score--;
                game.shipUpgrade.baseS_projectiles--;
            }
        });

        imgBaseSpeedPlus.addEventListener('touchend', function () {
            if(game.shipUpgrade.baseS_moveSpeed < 20){
                if(Math.pow((game.shipUpgrade.baseS_moveSpeed - game.shipUpgradeDefault.baseS_moveSpeed + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                    game.armoryPoint -= Math.pow((game.shipUpgrade.baseS_moveSpeed - game.shipUpgradeDefault.baseS_moveSpeed + 1), 2)*game.shipUpgrade.costAP;
                    //imgBaseSpeed.score++;
                    game.shipUpgrade.baseS_moveSpeed++;
                }
            }
        });

        imgBaseSpeedMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.baseS_moveSpeed < game.shipUpgrade.baseS_moveSpeed){
                game.armoryPoint += Math.pow((game.shipUpgrade.baseS_moveSpeed - game.shipUpgradeDefault.baseS_moveSpeed), 2)*game.shipUpgrade.costAP;
                //imgBaseSpeed.score--;
                game.shipUpgrade.baseS_moveSpeed--;
            }
        });

        imgBaseCooldownPlus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.baseS_cooldown > game.shipUpgrade.baseS_cooldown){
                game.armoryPoint += Math.pow((game.shipUpgradeDefault.baseS_cooldown - game.shipUpgrade.baseS_cooldown), 2)*game.shipUpgrade.costAP;
                //imgBaseCooldown.score++;
                game.shipUpgrade.baseS_cooldown++;
            }
        });

        imgBaseCooldownMinus.addEventListener('touchend', function () {
            if(game.shipUpgrade.baseS_cooldown > 2){
                if(Math.pow((game.shipUpgradeDefault.baseS_cooldown - game.shipUpgrade.baseS_cooldown + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                    game.armoryPoint -= Math.pow((game.shipUpgradeDefault.baseS_cooldown - game.shipUpgrade.baseS_cooldown + 1), 2)*game.shipUpgrade.costAP;
                    //imgBaseCooldown.score--;
                    game.shipUpgrade.baseS_cooldown--;
                }
            }
        });
        }

        //rocket shoot listener
        {
        imgRocketDamagePlus.addEventListener('touchend', function () {
            if(Math.pow(((game.shipUpgrade.rocketS_damage - game.shipUpgradeDefault.rocketS_damage)/5)+1, 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                game.armoryPoint -= Math.pow(((game.shipUpgrade.rocketS_damage - game.shipUpgradeDefault.rocketS_damage)/5)+1, 2)*game.shipUpgrade.costAP;
                //imgRocketDamage.score++;
                game.shipUpgrade.rocketS_damage += 5;
            }
        });

        imgRocketDamageMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.rocketS_damage < game.shipUpgrade.rocketS_damage){
                game.armoryPoint += Math.pow(((game.shipUpgrade.rocketS_damage - game.shipUpgradeDefault.rocketS_damage)/5), 2)*game.shipUpgrade.costAP;
                //imgRocketDamage.score--;
                game.shipUpgrade.rocketS_damage -= 5;
            }
        });

        imgRocketSpeedPlus.addEventListener('touchend', function () {
            if(Math.pow((game.shipUpgrade.rocketS_moveSpeed - game.shipUpgradeDefault.rocketS_moveSpeed + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                game.armoryPoint -= Math.pow((game.shipUpgrade.rocketS_moveSpeed - game.shipUpgradeDefault.rocketS_moveSpeed + 1), 2)*game.shipUpgrade.costAP;
                //imgRocketSpeed.score++;
                game.shipUpgrade.rocketS_moveSpeed += 1;
            }
        });

        imgRocketSpeedMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.rocketS_moveSpeed < game.shipUpgrade.rocketS_moveSpeed){
                game.armoryPoint += Math.pow((game.shipUpgrade.rocketS_moveSpeed - game.shipUpgradeDefault.rocketS_moveSpeed), 2)*game.shipUpgrade.costAP;
                //imgRocketSpeed.score--;
                game.shipUpgrade.rocketS_moveSpeed -= 1;
            }
        });

        imgRocketCooldownPlus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.rocketS_cooldown > game.shipUpgrade.rocketS_cooldown){
                game.armoryPoint += Math.pow(((game.shipUpgradeDefault.rocketS_cooldown - game.shipUpgrade.rocketS_cooldown)/5), 2)*game.shipUpgrade.costAP;
                //imgRocketCooldown.score++;
                game.shipUpgrade.rocketS_cooldown += 5;
            }
        });

        imgRocketCooldownMinus.addEventListener('touchend', function () {
            if(game.shipUpgrade.rocketS_cooldown > 2){
                if(Math.pow(((game.shipUpgradeDefault.rocketS_cooldown - game.shipUpgrade.rocketS_cooldown)/5)+1, 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                    game.armoryPoint -= Math.pow(((game.shipUpgradeDefault.rocketS_cooldown - game.shipUpgrade.rocketS_cooldown)/5)+1, 2)*game.shipUpgrade.costAP;
                    //imgRocketCooldown.score--;
                    game.shipUpgrade.rocketS_cooldown -= 5;
                }
            }
        });
        }

        //cover shoot listener
        {
        imgCoverDamagePlus.addEventListener('touchend', function () {
            if(Math.pow((game.shipUpgrade.coverS_damage - game.shipUpgradeDefault.coverS_damage + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                game.armoryPoint -= Math.pow((game.shipUpgrade.coverS_damage - game.shipUpgradeDefault.coverS_damage + 1), 2)*game.shipUpgrade.costAP;
                //imgCoverDamage.score++;
                game.shipUpgrade.coverS_damage++;
            }
        });

        imgCoverDamageMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.coverS_damage < game.shipUpgrade.coverS_damage){
                game.armoryPoint += Math.pow((game.shipUpgrade.coverS_damage - game.shipUpgradeDefault.coverS_damage), 2)*game.shipUpgrade.costAP;
                //imgCoverDamage.score--;
                game.shipUpgrade.coverS_damage--;
            }
        });

        imgCoverProjectilePlus.addEventListener('touchend', function () {
            if(Math.pow((game.shipUpgrade.coverS_projectiles - game.shipUpgradeDefault.coverS_projectiles + 1), 2)*game.shipUpgrade.costAPNext <= game.armoryPoint){
                game.armoryPoint -= Math.pow((game.shipUpgrade.coverS_projectiles - game.shipUpgradeDefault.coverS_projectiles + 1), 2)*game.shipUpgrade.costAPNext;
                //imgCoverProjectile.score++;
                game.shipUpgrade.coverS_projectiles++;}

        });

        imgCoverProjectileMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.coverS_projectiles < game.shipUpgrade.coverS_projectiles){
                game.armoryPoint += Math.pow((game.shipUpgrade.coverS_projectiles - game.shipUpgradeDefault.coverS_projectiles), 2)*game.shipUpgrade.costAPNext;
                //imgCoverProjectile.score--;
                Game.instance.shipUpgrade.coverS_projectiles--;
            }
        });

        imgCoverRangePlus.addEventListener('touchend', function () {
            if(Math.pow((game.shipUpgrade.coverS_age - game.shipUpgradeDefault.coverS_age + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                game.armoryPoint -= Math.pow((game.shipUpgrade.coverS_age - game.shipUpgradeDefault.coverS_age + 1), 2)*game.shipUpgrade.costAP;
                //imgCoverRange.score++;
                game.shipUpgrade.coverS_age++;
            }
        });

        imgCoverRangeMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.coverS_age < game.shipUpgrade.coverS_age){
                game.armoryPoint += Math.pow((game.shipUpgrade.coverS_age - game.shipUpgradeDefault.coverS_age), 2)*game.shipUpgrade.costAP;
                //imgCoverRange.score--;
                game.shipUpgrade.coverS_age--;
            }
        });

        imgCoverSpeedPlus.addEventListener('touchend', function () {
            if(Math.pow((game.shipUpgrade.coverS_moveSpeed - game.shipUpgradeDefault.coverS_moveSpeed + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                game.armoryPoint -= Math.pow((game.shipUpgrade.coverS_moveSpeed - game.shipUpgradeDefault.coverS_moveSpeed + 1), 2)*game.shipUpgrade.costAP;
                //imgCoverSpeed.score++;
                game.shipUpgrade.coverS_moveSpeed++;
            }
        });

        imgCoverSpeedMinus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.coverS_moveSpeed < game.shipUpgrade.coverS_moveSpeed){
                game.armoryPoint += Math.pow((game.shipUpgrade.coverS_moveSpeed - game.shipUpgradeDefault.coverS_moveSpeed), 2)*game.shipUpgrade.costAP;
                //imgCoverSpeed.score--;
                game.shipUpgrade.coverS_moveSpeed--;
            }
        });

        imgCoverCooldownPlus.addEventListener('touchend', function () {
            if(game.shipUpgradeDefault.coverS_cooldown > game.shipUpgrade.coverS_cooldown){
                game.armoryPoint += Math.pow((game.shipUpgradeDefault.coverS_cooldown - game.shipUpgrade.coverS_cooldown), 2)*game.shipUpgrade.costAP;
                //imgCoverCooldown.score++;
                game.shipUpgrade.coverS_cooldown++;
            }
        });

        imgCoverCooldownMinus.addEventListener('touchend', function () {
            if(game.shipUpgrade.coverS_cooldown > 2){
                if(Math.pow((game.shipUpgradeDefault.coverS_cooldown - game.shipUpgrade.coverS_cooldown + 1), 2)*game.shipUpgrade.costAP <= game.armoryPoint){
                    game.armoryPoint -= Math.pow((game.shipUpgradeDefault.coverS_cooldown - game.shipUpgrade.coverS_cooldown + 1), 2)*game.shipUpgrade.costAP;
                    //imgCoverCooldown.score--;
                    game.shipUpgrade.coverS_cooldown--;
                }
            }
        });
        }

        this.addChild(imgArmory);
        this.addChild(imgRepair);
        this.addChild(imgBack);

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
        this.addChild(imgCoverCooldown);

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
        this.addChild(imgCoverCooldownPlus);
        this.addChild(imgCoverCooldownMinus);
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

        if(Game.instance.soundTurn == true) { 
            this.tl.delay(15).then(function(){
                var sound = game.assets['www/sound/gameover.wav'];
                sound.play();
            });
        }

        this.addChild(gameOverImg);
        this.addChild(finalScore);

        this.addEventListener('touchstart',function(){
            game.input.a = true;
        });

        this.addEventListener('enterframe', function () {
            if(game.input.a){
                game.input.a = false;
                game.scGame.releaseKeys();
                game.popScene();
                game.popScene();
                game.onload();
            }
        });
    }
});

var SceneGuide = Class.create(enchant.Scene, {
    // The game over game scene.
    initialize: function() {
        // Call superclass constructor
        Scene.apply(this);
        var game = Game.instance;

        this.backgroundColor = 'black';        
        var shipImg = new Sprite(game.assets['www/picture/shipMid.png'].width,game.assets['www/picture/shipMid.png'].height/3);
        shipImg.image = game.assets['www/picture/shipMid.png'];
        shipImg.frame = 1;
        shipImg.x = game.width/2 - shipImg.width/2;
        shipImg.y = game.height/2 - shipImg.height/2;

        var moveText = new MutableText(5,5);
        moveText.text = "MOVE WITH ARROW KEYS OR BY TOUCH";
        moveText.x = game.width/2 - moveText.width/2;
        moveText.y = shipImg.y + 50;

        var backText = new MutableText(0, moveText.y+50);
            backText.text = "BACK";
            backText.x = game.width/2 - backText.width/2;
            backText.addEventListener('touchstart',function(){
                game.input.a = true;
            });

        var roundShootText = new MutableText(5,5);
        roundShootText.text = "BASIC ENEMY SHOT";
        roundShootText.x = game.width/2 - roundShootText.width/2;
        roundShootText.y = 10;

        var laserText = new MutableText(5,5);
        laserText.text = "STRONG ENEMY LASER";
        laserText.x = game.width/2 - laserText.width/2;
        laserText.y = 30;

        var starText = new MutableText(5,5);
        starText.text = "COLLECT THESE TO GET AP";
        starText.x = game.width/2 - starText.width/2;
        starText.y = 50;

        var armoryText = new MutableText(5,5);
        armoryText.text = "AP CAN BE SPENT IN ARMORY";
        armoryText.x = game.width/2 - armoryText.width/2;
        armoryText.y = 90;

        var armoryText2 = new MutableText(5,5);
        armoryText2.text = "TO BUY UPGRADES";
        armoryText2.x = game.width/2 - armoryText2.width/2;
        armoryText2.y = 110;

        var starImg = new Sprite(16,16);
        starImg.image = game.assets['www/picture/star.png'];
        starImg.x = starText.x  -20;
        starImg.y = starText.y;

        var laserImg = new Sprite(8,16);
        laserImg.image = game.assets['www/picture/laser.png'];
        laserImg.x = laserText.x  -20;
        laserImg.y = laserText.y;

        var roundShootImg = new Sprite(12,12);
        roundShootImg.image = game.assets['www/picture/roundShoot.png'];
        roundShootImg.x = roundShootText.x - 20;
        roundShootImg.y = roundShootText.y;


        this.addChild(laserImg);
        this.addChild(laserText);
        this.addChild(starImg);
        this.addChild(starText);
        this.addChild(armoryText);
        this.addChild(armoryText2);
        this.addChild(roundShootImg);
        this.addChild(roundShootText);
        this.addChild(shipImg);
        this.addChild(moveText);
        this.addChild(backText);
        this.addEventListener('enterframe', function () {
            if(game.input.a){
                game.input.a = false;
                game.popScene();
            }
        });
    }
});

var Bar = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        var game = Game.instance;
        enchant.Sprite.call(this, 20, 100);
        this.image = game.assets['www/picture/bar.png'];
        this.x = x;
        this.y = y;
        this.scaleY = (game.height-30)/this.height;

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