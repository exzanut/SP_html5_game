var EnemySpawner = enchant.Class.create(enchant.Node,{
    initialize: function () {
      var game = Game.instance;
      Node.call(this);
      var group1 = new EnemyGroup([[1,0,0],[1,0,13],[1,0,13]]);
      var group2 = new EnemyGroup([[2,-20,0],[2,20,0]]);
      var group3 = new EnemyGroup([[2,-20,0],[2,20,0],[4,50,10],[4,-50,20]]);
      var groupArray = [group1,group2,group3];


      this.addEventListener('enterframe', function (){
        if(game.frame%60==0) {
          var x = Math.random()*(game.gameW-60)+30;
          var r = Math.floor(Math.random()*groupArray.length);
          groupArray[r].spawnGroup(x);
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
        
          this.spawnDelayedEnemy(enemy,this.enemyArray[i][2]);
        
     }  
  },
  spawnDelayedEnemy: function(enemy,delayedTime){
    Game.instance.scGame.tl.delay(delayedTime).then(function(){
       Game.instance.scGame.addChild(enemy);
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
        return new Enemy5(x,-10);
        break;
    }
  }
});


var Enemy = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y) {
        /**
         * As with the Player class, you set size at 16x16 Sprite base and expand.
         */
        enchant.Sprite.call(this, 16, 16);
        this.x = x;
        this.y = y;
        this.HP = 1;

        this.moveArray=new Array(); //[age,angle,speed]
        this.key=Game.instance.enemyCnt;
        Game.instance.enemies[Game.instance.enemyCnt++]=this;
        if(Game.instance.enemyCnt>30){
          Game.instance.enemyCnt=0;
        }

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
        if(this.age%40==0){
          new EnemyShoot(this.x,this.y+10,3/2*Math.PI);
          new RoundEnShoot(this.x,this.y+10,7/4*Math.PI);
          new RoundEnShoot(this.x,this.y+10,5/4*Math.PI);
          //var shoot=new EnemyShoot(this.x,this.y+10,5/4*Math.PI);
          //var shoot=new EnemyShoot(this.x,this.y+10,7/4*Math.PI);
        } 
    },
    getDmg: function (dmg) {
      this.HP-=dmg;
      if(this.HP<=0){
        this.remove();
      }
    },
    remove: function () {
        Game.instance.scGame.removeChild(this);
        delete Game.instance.enemies[this.key];
    }
});        


var Enemy1 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       Enemy.call(this, x, y);
       if(x>Game.instance.width/2){
         this.moveArray=[[0,270,5],[40,155,4],[60,270,6],[90,210,7]]; 
       }else{
         this.moveArray=[[0,270,5],[40,25,4],[60,270,6],[90,330,7]];
       }
       this.HP=2;
       this.image = Game.instance.assets['www/picture/enemy.png'];
       this.frame = 22;

    }
});


var Enemy2 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       Enemy.call(this, x, y);  
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
       Enemy.call(this, x, y);  
       this.moveArray=[[0,270,3],[15,250,4],[35,290,4],[55,250,4],[75,290,4],[90,250,4]];
       
       this.image = Game.instance.assets['www/picture/enemy.png'];
       this.frame = 23;
    }
});

var Enemy4 = enchant.Class.create(Enemy, {
  initialize: function(x,y){
    Enemy.call(this,x,y);
    this.image = Game.instance.assets['www/picture/enemy.png'];
    this.frame = 25;
    this.HP=4;
  },
  move: function () {
      this.tl.moveBy(50,50,10).moveBy(0,50,10).moveBy(-50,50,10).moveBy(0,50,10).loop(); //zig-zag
    }
});

