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
    game.preload('www/picture/lblPlus.png');
    game.preload('www/picture/lblMinus.png');

    //sound
    game.preload('www/sound/shipExplosion.wav');
    game.preload('www/sound/background.wav');
    game.preload('www/sound/backgroundBoss.wav');
    game.preload('www/sound/baseShoot.wav');
    game.preload('www/sound/baseExplosion.wav');
    game.preload('www/sound/gameover.wav');

    game.onload = function() {   
        game.soundTurn = true;

        var scMenu = new SceneMenu();
        game.scMenu = scMenu;
        game.pushScene(scMenu);

        var gameRun = false;

        game.gameW = game.width; //sirka herni plochy
        game.shipUpgrade = new UpgradeList();
        game.shipUpgradeDefault = new UpgradeList();
        game.playerShip = new Player();

        game.score = 0;
        game.armoryPoint = 0;
        game.bgrndSound = new BackgroundSound();

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
