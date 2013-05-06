//jednotlive komponenty lodi
var Hull = Class.create({
    // trup
    initialize: function() {
        this.dmgReduction = 1; //0% dmg strely - on start
        this.actDmg = 10;
        this.maxDmgCap = 10;
    }
});

var Shield = Class.create({
    // stit
    initialize: function() {
        this.dmgAbsortion = 1;
        this.energyConsumption = 1; //100% dmg strely - on start
    }
});

var Generator = Class.create(enchant.Sprite, {
    // generator
    initialize: function() {
        enchant.Sprite.call(this);
        this.energyPerSec = 1;
        this.actEnergy = 10;
        this.maxEnergyCap = 10;

        /*this.addEventListener('enterframe', function () {
            console.log("Time 1s: " + (Game.instance.frame % Game.instance.fps));
            if(Game.instance.frame % Game.instance.fps == 0){
                if(this.maxEnergyCap > this.actEnergy){
                    this.actEnergy += this.energyPerSec;
                }
            }
        });*/
    }
});


