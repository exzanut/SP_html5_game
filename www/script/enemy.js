var EnemySpawner = enchant.Class.create(enchant.Node,{
    initialize: function () {
      var game = Game.instance;
      Node.call(this);
      var groupArray = new Array();
      var bossArray = new Array();
      var i = 0;
      var j = 0;
      var progress=0;
      Game.instance.boss=false;
      this.bossChance=0;
      groupArray[i++] = new EnemyGroup([[1,0,0],[3,0,14],[1,0,13],[1,0,13]]);
      groupArray[i++] = new EnemyGroup([[2,-50,0],[2,50,0],[5,0,5]]);
      groupArray[i++] = new EnemyGroup([[4,-20,0],[2,25,10],[2,55,5],[4,-50,10]]);
      groupArray[i++] = new EnemyGroup([[4,50,0],[3,0,14],[4,-50,0]]);
      groupArray[i++] = new EnemyGroup([[5,-50,0],[2,0,2],[5,50,20]]);
      groupArray[i++] = new EnemyGroup([[6,0,0]]);
      groupArray[i++] = new EnemyGroup([[7,0,0],[7,-Game.instance.gameW,10]]);
      groupArray[i++] = new EnemyGroup([[8,0,0]]);
      bossArray[j++] = new EnemyGroup([[10,0,55]]);
      bossArray[j++] = new EnemyGroup([[11,0,55]]);

      this.addEventListener('enterframe', function (){
        if(game.frame%(Math.floor((90-3*progress)/(Math.pow(game.ratio,1/4))))==0 && game.boss==false) {
          var treshold = 10*(Math.sqrt(game.ratio));
            if(this.bossChance>treshold){
                if((Math.random()*(treshold*2-this.bossChance))<1){
                    game.boss=true;
                    this.bossChance=0;
                    var r = Math.floor(Math.random()*(bossArray.length));
                    bossArray[r].spawnGroup(1); //any number
                    game.bgrndSound.changeIndex(1);
                    if(progress<4){
                      progress++;
                    }
                }
            }
            if(game.boss==false){
                var x = Math.random()*(game.gameW-70)+20;
                var r = Math.floor(Math.random()*(groupArray.length+progress-4));
                this.bossChance++;
                groupArray[r].spawnGroup(x);

            }
        }           
      });
       
    } 
});

var EnemyGroup = enchant.Class.create({
  initialize: function (enemyArray) {
    this.enemyArray=enemyArray; // [enemyID,relativeX,delayedTime]
  },
  spawnGroup: function(x){
     for(var i=0;i<this.enemyArray.length;i++){
        var enemy = this.getNewEnemy(this.enemyArray[i][0],x);
        enemy.x+=this.enemyArray[i][1];
;       enemy.x = Math.abs(enemy.x); 
          this.spawnDelayedEnemy(enemy,this.enemyArray[i][2]);
        
     }  
  },
  spawnDelayedEnemy: function(enemy,delayedTime){
    Game.instance.scGame.tl.delay(delayedTime).then(function(){
       Game.instance.enemies.addChild(enemy);

    });
  },
  getNewEnemy: function(id,x){
    switch(id){
      case 1:
        return new Enemy1(x,-10);
        break;
      case 2:
        return new Enemy2(x,-10);
        break;
      case 3:
        return new Enemy3(-10,x-50);
        break;
      case 4:
        return new Enemy4(x,-10);
        break;
      case 5:
        return new Enemy5(x,-10);
        break;
      case 6:
        return new Enemy6(x,-10);
        break;
      case 7:
        return new Enemy7(x,-10);
        break;
      case 8:
        return new Enemy8(x,-15);
        break;
      case 10:
        return new Boss1(Game.instance.gameW/2-140,-120);
        break;
      case 11:
        return new Boss2(Game.instance.gameW/2-100,-150);
        break;
    
    }
  }
});


var Enemy = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y, w, h) {
        enchant.Sprite.call(this, w, h);
        this.x = x;
        this.y = y;
        this.HP = 1 + Game.instance.scGame.age/4000;
        this.score = Math.floor(this.HP*10);
        this.moveArray=new Array(); //[age,angle,speed]
        this.testRemove();

         this.addEventListener('enterframe', function () {
            this.testRemove();
          
            for(var i=0;i<this.moveArray.length;i++){
              if (this.age>this.moveArray[i][0]){
                  
                  this.direction = this.moveArray[i][1];
                  this.moveSpeed = this.moveArray[i][2];
             }
            }
            
            this.move(); 
            this.shoot();
           
        });


    },
    testRemove: function(){
      if(this.y > Game.instance.height || this.x > Game.instance.gameW - this.width || this.x < -this.width || this.y < -this.height) {
                this.remove();
      }
    },
    /**
     * Sets function called up for movement.
     * By overriding from outside this function, you can change movement partway through.
     */

    move: function () {
        this.x += this.moveSpeed * Math.cos(this.direction / 180 * Math.PI);
        this.y -= this.moveSpeed * Math.sin(this.direction / 180 * Math.PI)

    },
    shoot: function () {
        if(this.age%30==0){
          new LaserEnShoot(this.x+this.width/2-8,this.y+this.height-4);
        } 
    },
    getDmg: function (dmg) {
      if(dmg=="kill"){
        dmg=this.HP;
        var sound = Game.instance.assets['www/sound/shipExplosion.wav'];
        sound.clone().play();
      }
      this.HP-=dmg;
      if(this.HP<1){
        Game.instance.score+=this.score;
        var ex = new Explosion(this.x,this.y);
        ex.tl.scaleTo(this.width/32,12);
        var chance = Math.floor(this.width/10)
        if (Math.random()*(8-chance)<2){
          new Star(this.x,this.y,this.score*10);
        }
        this.remove();
      }
    },
    remove: function () {
        Game.instance.enemies.removeChild(this);
        delete this;
    }
});        


var Enemy1 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       Enemy.call(this, x, y,22,21);
       if(x>Game.instance.gameW/2){
         this.moveArray=[[0,270,5],[40,155,4],[60,270,6],[90,210,7]]; 
       }else{
         this.moveArray=[[0,270,5],[40,25,4],[60,270,6],[90,330,7]];
       }
       this.score = Math.floor(this.HP*10);
       this.image = Game.instance.assets['www/picture/enemyShipSmaller.png'];
       this.frame = 0;

    }
});


var Enemy2 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       Enemy.call(this, x, y,28,30);  
       if(x>Game.instance.gameW/2){
        this.moveArray=[[0,270,5],[20,210,9],[50,270,7]];
       }else{
        this.moveArray=[[0,270,5],[20,330,9],[50,270,7]]; 
       }
       this.image = Game.instance.assets['www/picture/enemyShipSmall.png'];
       this.frame = 3;
    }
});

//bomb
var Enemy3 = enchant.Class.create(Enemy, {
  initialize: function(x,y){
    Enemy.call(this,x,y,28,28);
    this.moveArray=[[0,330,3]];
    this.image = Game.instance.assets['www/picture/mine.png'];
    this.frame = 0;
    this.score = Math.floor(this.HP*10);
    
   this.addEventListener('enterframe', function () {
      if(this.age%30>15){
        this.frame=1;
      }else{
        this.frame=0;
      }
    });

  },
  shoot: function () {
  },
  getDmg: function (dmg) {
    if(dmg=="kill"){
        dmg=this.HP;
        var sound = Game.instance.assets['www/sound/shipExplosion.wav'];
        sound.clone().play();
      }
     this.HP-=dmg;
      if(this.HP<1){
        Game.instance.score+=this.score;
        new Explosion(this.x,this.y);
        this.remove();
        for(var i=0;i<8;i++){
          new RoundEnShoot(this.x,this.y,i/4*Math.PI);
        }
      }
        
    }
});

var Enemy4 = enchant.Class.create(Enemy, {
  initialize: function(x,y){
    Enemy.call(this,x,y,32,36);
    this.image = Game.instance.assets['www/picture/enemyShipMedium.png'];
    this.frame = 0;
    this.HP*=2;
    this.score = Math.floor(this.HP*10);
  },
  move: function () {
      this.tl.moveBy(50,50,10).moveBy(0,50,10).moveBy(-50,50,10).moveBy(0,50,10).loop(); //zig-zag
    }
});

var Enemy5 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       Enemy.call(this, x, y,42,48);  
       this.moveArray=[[0,270,3],[90,270,1],[120,270,4]];
       
       this.image = Game.instance.assets['www/picture/enemyShipLarge.png'];
       this.frame = 1;
       this.HP*=3.5;
       this.score = Math.floor(this.HP*10);
    },
    shoot: function(){
      if (this.age%35==0){
          new RoundEnShoot(this.x,this.y+this.height/2,5/4*Math.PI);
          new RoundEnShoot(this.x+this.width-16,this.y+this.height/2,7/4*Math.PI);
      }else if(this.age%30==0){
          new LaserEnShoot(this.x+this.width/2-8,this.y+this.height-4);
      }

    }
});

//Asteroid
var Enemy6 = enchant.Class.create(Enemy, {
  initialize: function(x,y){
    Enemy.call(this,x,y,55,55);
    this.image = Game.instance.assets['www/picture/asteroid.png'];
    this.frame = 1;
    this.HP*=10;
    this.score = Math.floor(this.HP*10);
    console.log("asteroid");
    
  },
  shoot: function(){
  },
  move: function(){
    this.tl.moveBy(10,60,30).and().rotateBy(20,30).loop();
  }
});

//sniper
var Enemy7 = enchant.Class.create(Enemy, {
  initialize: function(x,y){
    Enemy.call(this,x,y,28,30);
    this.moveArray=[[0,270,4],[12,270,0],[40,180,4],[52,270,0],[80,0,4],[92,270,0],[140,270,8]];
    this.image = Game.instance.assets['www/picture/enemyShipSmall.png'];
    this.frame = 3;
    this.HP*=2;
    this.score = Math.floor(this.HP*10);
  },
  shoot: function(){
    if (this.age%30>20){
      if (this.age%3==0){
        new AimEnShoot(this.x+this.width/2-8,this.y+this.height);
      }
    }
  }
});

//cruiser
var Enemy8 = enchant.Class.create(Enemy, {
  initialize: function(x,y){
    Enemy.call(this,x,y,48,54);
    this.moveArray=[[0,270,1.5]];
    this.image = Game.instance.assets['www/picture/enemyShipLarger.png'];
    this.frame = 4;
    this.HP*=6;
    this.score = Math.floor(this.HP*10);
  },
  shoot: function(){
    if (this.age%36>18){
      if (this.age%2==0){
      new RoundEnShoot(this.x+this.width/2-8,this.y+this.height/2-8,this.age*Math.PI/7);
      }
    }
  }
});



var Boss = enchant.Class.create(Enemy, {
  initialize: function(x,y){
    Enemy.call(this,x,y,275,172);
  },
  shoot: function () {
  }, 
  move: function () { 
  },
  spawnExplosives: function (num) {
    for(var i=0;i<num;i++){
             new Explosion(this.x+Math.random()*(this.width-16),this.y+Math.random()*(this.height-16));
    }
  },
  explode: function () {
    var boss=this;
    this.remove();
    Game.instance.scGame.addChild(boss);
    Game.instance.scGame.tl.cue({
          0:function(){boss.spawnExplosives(3);},
          10:function(){boss.spawnExplosives(5);},
          20:function(){boss.spawnExplosives(7);},
          30:function(){boss.spawnExplosives(9);},
          40:function(){
            Game.instance.boss=false;
            var ex = new Explosion(boss.x+boss.width/2,boss.y+boss.height/2);
            ex.tl.scaleTo(5,12);
            var star = new Star(boss.x+boss.width/2,boss.y+boss.height/2,boss.score*10);
            star.tl.scaleTo(2,20);

            Game.instance.scGame.removeChild(boss);
            boss.remove();
            Game.instance.bgrndSound.changeIndex(0);
          }  
        }); 
  },
  getDmg: function (dmg) {
    if(dmg=="kill"){
        dmg=0;
      }
     this.HP-=dmg;
      if(this.HP<=0){
        Game.instance.score+=this.score;
        this.explode(); 
      } 
    }
});


var Boss1 = enchant.Class.create(Boss, {
  initialize: function(x,y){
    Boss.call(this,x,y);
    this.image = Game.instance.assets['www/picture/bossS.png'];
    this.frame = 0;
    this.HP*=40;
    this.score = Math.floor(this.HP*10);
    this.tl.moveBy(0,140,50);
    this.tl.moveBy(this.width/2-(Game.instance.gameW-30)/2,0,60)
  },
  shoot: function () {
    if(this.age%100>35){
      if(this.age%5==0){
          new LaserEnShoot(this.x+20,this.y+this.height-20);
          new LaserEnShoot(this.x+30,this.y+this.height-20);
          new LaserEnShoot(this.x+this.width-20,this.y+this.height-20);
          new LaserEnShoot(this.x+this.width-30,this.y+this.height-20);  
      }
      if(this.age%10==0){
        var home1 = new HomingEnShoot(this.x+this.width/2-30,this.y+this.height-30);
        home1.tl.scaleTo(2,60);
        var home2 = new HomingEnShoot(this.x+this.width/2+30,this.y+this.height-30);
        home2.tl.scaleTo(2,60);
      }
    }
  }, 
  move: function () { 
      this.tl.moveBy((Game.instance.gameW-this.width-30),0,120).moveBy(-(Game.instance.gameW-this.width-30),0,120).loop(); //left-right
  }
  
});

var Boss2 = enchant.Class.create(Boss, {
  initialize: function(x,y){
    Boss.call(this,x,y);
    this.width=169;
    this.height=224;
    this.image = Game.instance.assets['www/picture/boss2.png'];
    this.frame = 0;
    this.HP*=50;
    this.score = Math.floor(this.HP*10);
    this.tl.moveBy(0,140,50);
  },
  shoot: function () {
    if (this.age%30==0){
        new LaserEnShoot(this.x+this.width/2 -10-8,this.y+this.height);
        new LaserEnShoot(this.x+this.width/2 +10,this.y+this.height);
    }
    if(this.age%100>40){
      if(this.age%15==0){
        var leftExplosiveShot = new RoundEnShoot(this.x+20,this.y+this.height-20,(this.age%100/15+10)/12*Math.PI);
        leftExplosiveShot.moveSpeed=12;
        leftExplosiveShot.addEventListener('enterframe', function (){
          if(leftExplosiveShot.age==14){
            leftExplosiveShot.remove();
            for(var i=0;i<6;i++){
              new RoundEnShoot(this.x,this.y,i/3*Math.PI+Math.PI/6);
            }
            new AimEnShoot(this.x,this.y);
          }
        });

        var rightExplosiveShot = new RoundEnShoot(this.x+this.width-20-12,this.y+this.height-20,(26-this.age%100/15)/12*Math.PI);
        rightExplosiveShot.moveSpeed=12;
        rightExplosiveShot.addEventListener('enterframe', function (){
          if(rightExplosiveShot.age==14){
            rightExplosiveShot.remove();
            for(var i=0;i<6;i++){
              new RoundEnShoot(this.x,this.y,i/3*Math.PI+Math.PI/6);
            }
            new AimEnShoot(this.x,this.y);
          }
        });

      }
    }
  }, 
  move: function () { 
     this.tl.moveBy(0,140,50).moveBy(30,30,20).moveBy(-60,0,30).moveBy(30,-30,20).moveBy(0,-140,50);
    }
});

