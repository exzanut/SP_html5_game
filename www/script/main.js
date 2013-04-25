enchant();

window.onload = function () {
    var game = new Game(480, 640);
    game.fps = 30;
    game.scale = 1;

    //image
    game.preload('www/picture/spaceship.png');
    game.preload('www/picture/ball.png');
    game.preload('www/picture/enemy.png');
    game.preload('www/picture/resume.png');
    game.preload('www/picture/play.png');
    game.preload('www/picture/shop.png');
    game.preload('www/picture/guide.png');
    game.preload('www/picture/okraj.png');
    game.preload('www/picture/bar.png');
    game.preload('www/picture/barFragment.png');

    //sound
    game.preload('www/sound/M4A1_Single.wav');

    game.onload = function() {
        var scGame = new SceneGame();
        game.scGame = scGame;

        var scMenu = new SceneMenu();
        game.scMenu = scMenu;

        game.pushScene(scMenu);

        var gameRun = false;
        game.enemies = new Array();
        game.enemyCnt=0;

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

        /*imgOkraj.addEventListener('touchend', function () {
            if(imgOkraj.x == imgPlay.x && imgOkraj.y == imgPlay.y){
                game.pushScene(game.scGame);
            }
        });*/

        this.addEventListener('enterframe', function () {
            if(game.input.down && game.frame%3 == 0){
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
    }
});

var SceneGame = Class.create(enchant.Scene, {
    // The main game scene.
    initialize: function() {
        // Call superclass constructor
        Scene.apply(this);

        this.backgroundColor = 'blue';
        var game = Game.instance;
        var player = new Player(100,600);

        var barHP = new Bar(440, 270);
        var hpFrag = new BarFragment(441,1);
        hpFrag.backgroundColor = 'darkgreen';
        //hpFrag.height = (game.height/player.hull.maxDmgCap)*player.hull.actDmg-2;
       // hpFrag.y = game.height-hpFrag.height-1;

        var barMP = new Bar(460, 270);
        var mpFrag = new BarFragment(461,1);
        mpFrag.backgroundColor = 'darkblue';
        //mpFrag.height = (game.height/player.generator.maxEnergyCap)*player.generator.actEnergy-2;
        //mpFrag.y = game.height-mpFrag.height-1;

        var enemySpawner = new EnemySpawner();

        this.addEventListener('touchend', function () {

        });

        this.addEventListener('enterframe', function () {
            if(game.input.a){
                game.pushScene(game.scMenu);

            }

            hpFrag.height = (game.height/player.hull.maxDmgCap)*player.hull.actDmg-2;
            hpFrag.y = game.height-hpFrag.height-1;

            mpFrag.height = (game.height/player.generator.maxEnergyCap)*player.generator.actEnergy-2;
            mpFrag.y = game.height-mpFrag.height-1;

            if(game.frame%10 == 0){
                //if(player.hull.actDmg > 0)player.hull.actDmg--;
            }
        });

        this.addChild(player);
        this.addChild(barHP);
        this.addChild(hpFrag);
        this.addChild(barMP);
        this.addChild(mpFrag);
        this.addChild(enemySpawner);
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
        enchant.Sprite.call(this, 32, 64);
        this.image = game.assets['www/picture/spaceship.png'];
        this.x = x;
        this.y = y;

        //soucasti lodi
        this.hull = new Hull();
        this.shield = new Shield();
        this.generator = new Generator();

        this.addEventListener('enterframe', function (e) {
            if (game.input.left) {
                this.x -= 10;
            }
            if (game.input.right) {
                this.x += 10;
            }
            if (game.input.up) {
                this.y -= 10;
            }
            if (game.input.down) {
                this.y += 10;
            }

            if(game.frame%5 == 0){
                var shoot = new PlayerShoot(this.x+8, this.y-16, Math.PI/2);
            }
        });
    }
});

