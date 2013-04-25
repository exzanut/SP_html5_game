var Hull = Class.create({
    // trup
    initialize: function() {
        this.dmgReduction = 0;
        this.actDmg = 100;
        this.maxDmgCap = 100;
    }
});

var Shield = Class.create({
    // stit
    initialize: function() {
        this.dmgAbsortion = 1;
        this.energyConsumption = 100;
    }
});

var Generator = Class.create({
    // generator
    initialize: function() {
        this.energyPerSec = 1;
        this.actEnergy = 100;
        this.maxEnergyCap = 100;
    }
});


