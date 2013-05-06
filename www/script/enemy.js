var EnemySpawner = enchant.Class.create(enchant.Node,{
    initialize: function () {
      var game = Game.instance;
      Node.call(this);
      var groupArray=new Array();
      var i=0;
      Game.instance.boss=false;
      this.bossChance=0;
      groupArray[i++] = new EnemyGroup([[1,0,0],[1,0,13],[1,0,13]]);
      groupArray[i++] = new EnemyGroup([[2,-20,0],[3,0,0],[2,20,0]]);
      groupArray[i++] = new EnemyGroup([[2,-20,0],[2,20,0],[4,50,10],[4,-50,20]]);
      groupArray[i++] = new EnemyGroup([[3,-50,0],[2,0,5],[3,50,20]]);
      groupArray[i++] = new EnemyGroup([[4,50,0],[5,0,14],[4,-50,0]]);
      var boss = new EnemyGroup([[10,0,40]]);
     


      this.addEventListener('enterframe', function (){
        
        if(game.frame%70==0 && game.boss==false) {
            if(this.bossChance>10){
                if((Math.random()*(20-this.bossChance))<1){
                    game.boss=true;
                    this.bossChance=0;
                    boss.spawnGroup(1); //any number
                }
            }
            if(game.boss==false){
                var x = Math.random()*(game.gameW-60)+30;
                var r = Math.floor(Math.random()*groupArray.length);
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
        enemy.x+=this.enemyArray[i][1]
;        
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
        return new Enemy3(x,-10);
        break;
      case 4:
        return new Enemy4(x,-10);
        break;
      case 5:
        return new Enemy5(-10,x-50);
        break;
      case 10:
        return new Boss(Game.instance.gameW/2-140,-120);
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
        this.moveArray=new Array(); //[age,angle,speed]

         this.addEventListener('enterframe', function () {
            if(this.y > Game.instance.height || this.x > Game.instance.gameW - this.width || this.x < -this.width || this.y < -this.height) {
                this.remove();
            }
          
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
          new LaserEnShoot(this.x,this.y+10);
        } 
    },
    getDmg: function (dmg) {
      this.HP-=dmg;
      if(this.HP<1){
        Game.instance.score+=Math.floor(this.HP*10);
        new Explosion(this.x,this.y);
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
       Enemy.call(this, x, y,16,16);
       if(x>Game.instance.width/2){
         this.moveArray=[[0,270,5],[40,155,4],[60,270,6],[90,210,7]]; 
       }else{
         this.moveArray=[[0,270,5],[40,25,4],[60,270,6],[90,330,7]];
       }
       this.HP*=2;
       this.image = Game.instance.assets['www/picture/enemy.png'];
       this.frame = 22;

    }
});


var Enemy2 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       Enemy.call(this, x, y,16,16);  
       if(x>Game.instance.width/2){
        this.moveArray=[[0,270,4],[20,210,9],[50,270,7]];
       }else{
        this.moveArray=[[0,270,4],[20,330,9],[50,270,7]]; 
       }
       this.image = Game.instance.assets['www/picture/enemy.png'];
       this.frame = 11;
    }
});

var Enemy3 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       Enemy.call(this, x, y,16,16);  
       this.moveArray=[[0,270,3],[90,270,1],[120,270,4]];
       
       this.image = Game.instance.assets['www/picture/enemy.png'];
       this.frame = 23;
       this.HP*=4;
    },
    shoot: function(){
      if (this.age%30==0){
          new RoundEnShoot(this.x,this.y+10,7/4*Math.PI);
          new RoundEnShoot(this.x,this.y+10,5/4*Math.PI);
      }else if(this.age%20==0){
          new LaserEnShoot(this.x,this.y+10);
      }

    }
});

var Enemy4 = enchant.Class.create(Enemy, {
  initialize: function(x,y){
    Enemy.call(this,x,y,16,16);
    this.image = Game.instance.assets['www/picture/enemy.png'];
    this.frame = 20;
    this.HP*=2;
  },
  move: function () {
      this.tl.moveBy(50,50,10).moveBy(0,50,10).moveBy(-50,50,10).moveBy(0,50,10).loop(); //zig-zag
    }
});

//bomb
var Enemy5 = enchant.Class.create(Enemy, {
  initialize: function(x,y){
    Enemy.call(this,x,y,16,16);
    this.moveArray=[[0,330,3],[150,220,3]];
    this.image = Game.instance.assets['www/picture/enemy.png'];
    this.frame = 25;
    this.HP*=5;
  },
  shoot: function () {
  },
  getDmg: function (dmg) {
     this.HP-=dmg;
      if(this.HP<=0){
        Game.instance.score+=Math.floor(this.HP*10);
        new Explosion(this.x,this.y);
        this.remove();
        for(var i=0;i<8;i++){
          new RoundEnShoot(this.x,this.y,i/4*Math.PI);
        }
      }
        
    }
});

var Boss = enchant.Class.create(Enemy, {
  initialize: function(x,y){
    Enemy.call(this,x,y,275,172);
    this.image = Game.instance.assets['www/picture/bossS.png'];
    this.frame = 0;
    this.HP*=40;
    this.tl.moveBy(0,140,40);
    this.tl.moveBy(-50,0,30)
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
        var difX = (Game.instance.playerShip.x-this.x-this.width/2);
        var difY = (Game.instance.playerShip.y-this.y-this.height+30);
        var scale = Math.sqrt(difX*difX+difY*difY);
        difX/=scale;
        difY/=scale;
        var dir = Math.acos(-difX)+Math.PI;
        new RoundEnShoot(this.x+this.width/2-30,this.y+this.height-30,dir+0.04);
        new RoundEnShoot(this.x+this.width/2+30,this.y+this.height-30,dir-0.04);
        
      }
    }
  }, 
  move: function () {
      
      this.tl.moveBy(100,0,60).moveBy(-100,0,60).loop(); //left-right
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
            Game.instance.scGame.removeChild(boss);
            boss.remove();
          }  
        }); 
  },
  getDmg: function (dmg) {
     this.HP-=dmg;
      if(this.HP<=0){
        Game.instance.score+=Math.floor(this.HP*10);
        this.explode(); 
      } 
    }
});

