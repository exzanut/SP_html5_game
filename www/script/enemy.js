var EnemySpawner = enchant.Class.create(enchant.Sprite,{
    initialize: function () {
      var game = Game.instance;
      Sprite.call(this,0,0);
         this.addEventListener('enterframe', function () {
            if(game.frame%60==0) {
              var x = Math.random()*game.width;
              var enemy;
            if(Math.random()*2<1){
              enemy = new Bear(x, 0);
            }else{
              enemy = new Bear3(x, 0);
            } 
            enemy.key = game.frame;
            //game.enemies[game.frame] = enemy;
            game.scGame.addChild(enemy);   
          }
          if(game.frame%40==0) {
            var x = Math.random()*game.width;
            var enemy = new Bear2(x, 0); 
            enemy.key = game.frame;
            //game.enemies[game.frame] = enemy;
            game.scGame.addChild(enemy);
          }
          });
       
    } 
});



var Enemy = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y,mArray) {
        /**
         * As with the Player class, you set size at 16x16 Sprite base and expand.
         */
        enchant.Sprite.call(this, 16, 16);
        this.x = x;
        this.y = y;
        
        var moveArray;
        moveArray=mArray;

         this.addEventListener('enterframe', function () {
            if(this.y > Game.instance.height || this.x > Game.instance.width || this.x < -this.width || this.y < -this.height) {
              console.log("mazu");
                this.remove();
            }

            for(var i=0;i<moveArray.length;i++){
              if (this.age>moveArray[i][0]){
                  
                  this.direction=moveArray[i][1];
                  this.moveSpeed = moveArray[i][2];
             }
            }
            
            this.move(); 
            if(this.age%20==0){
              var shoot=new EnemyShoot(this.x,this.y+10,3/2*Math.PI);
              //var shoot=new EnemyShoot(this.x,this.y+10,5/4*Math.PI);
              //var shoot=new EnemyShoot(this.x,this.y+10,7/4*Math.PI);
            } 
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
    remove: function () {
        
        Game.instance.scGame.removeChild(this);
       // delete game.enemies[this.key];
    }
});        


var Bear = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       var moveArray = new Array(); //[age,angle,speed]
       if(x>Game.instance.width/2){
         moveArray=[[0,270,4],[40,135,3],[60,270,5],[90,210,7]];
       }else{
         moveArray=[[0,270,4],[40,45,3],[60,270,5],[90,330,7]];
       }
       Enemy.call(this, x, y,moveArray);
       Game.instance.assets['www/picture/enemy.png'];
       this.frame = 22;

    }
});


var Bear2 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       var moveArray = new Array();
       if(x>Game.instance.width/2){
        moveArray=[[0,270,4],[20,210,9],[50,270,7]];
       }else{
        moveArray=[[0,270,4],[20,330,9],[50,270,7]]; 
       }
       Enemy.call(this, x, y,moveArray);
       this.image = Game.instance.assets['www/picture/enemy.png'];
       this.frame = 11;
    }
});

var Bear3 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       var moveArray = new Array();  
       moveArray=[[0,270,3],[15,250,4],[35,290,4],[55,250,4],[75,290,4],[90,250,4]];
       Enemy.call(this, x, y,moveArray);
       this.image = Game.instance.assets['www/picture/enemy.png'];
       this.frame = 23;
    }
});