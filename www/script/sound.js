var BackgroundSound = Class.create(Node,{
    // The shop game scene.
    initialize: function() {
        Node.call(this);
        var game = Game.instance;
        this.selectedIndex=0;
        this.groupSound = new Group();
        this.groupSound.addChild(game.assets['www/sound/background.wav']);
        this.groupSound.addChild(game.assets['www/sound/backgroundBoss.wav']);

        this.addEventListener('enterframe', function () {

            if(Game.instance.soundTurn == true) {
                if( this.groupSound.childNodes[this.selectedIndex].currentTime >= this.groupSound.childNodes[this.selectedIndex].duration ){
                    this.groupSound.childNodes[this.selectedIndex].play();
                }
            }
        });      
    },
    changeIndex: function(index){
        this.groupSound.childNodes[this.selectedIndex].stop();
        this.selectedIndex = index;
        this.groupSound.childNodes[this.selectedIndex].play();
    }
});