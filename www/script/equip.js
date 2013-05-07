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

var Generator = Class.create({
    // generator
    initialize: function() {
        enchant.Sprite.call(this);
        this.energyPerSec = 0.1;
        this.actEnergy = 10;
        this.maxEnergyCap = 10;
    }
});


