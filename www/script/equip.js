//jednotlive komponenty lodi
var Hull = Class.create({
    // trup
    initialize: function() {
        this.dmgReduction = Game.instance.shipUpgrade.hull_dmgReduction;
        this.actDmg = Game.instance.shipUpgrade.hull_maxDmgCap;
        this.maxDmgCap = Game.instance.shipUpgrade.hull_maxDmgCap;
    }
});

var Shield = Class.create({
    // stit
    initialize: function() {
        this.dmgAbsortion = Game.instance.shipUpgrade.shield_dmgAbsortion;
        this.energyConsumption = Game.instance.shipUpgrade.shield_energyConsumption;
    }
});

var Generator = Class.create({
    // generator
    initialize: function() {
        enchant.Sprite.call(this);
        this.energyPerSec = Game.instance.shipUpgrade.generator_energyPerSec;
        this.actEnergy = Game.instance.shipUpgrade.generator_maxEnergyCap;
        this.maxEnergyCap = Game.instance.shipUpgrade.generator_maxEnergyCap;
    }
});


