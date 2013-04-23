var Enemy = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y,mArray) {
        /**
         * As with the Player class, you set size at 16x16 Sprite base and expand.
         */
        enchant.Sprite.call(this, 32, 32);
        Game.instance.assets['enemy.png'];
        this.x = x;
        this.y = y;
        
        var moveArray;
        moveArray=mArray;

         this.addEventListener('enterframe', function () {
            if(this.y > 700 || this.x > 320 || this.x < -this.width || this.y < -this.height) {
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
              var shoot=new EnemyShoot(this.x,this.y+10,5/4*Math.PI);
              var shoot=new EnemyShoot(this.x,this.y+10,7/4*Math.PI);
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
        
        Game.instance.scene.removeChild(this);
        delete enemies[this.key];
    }
});        


var Bear = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       var moveArray = new Array(); //[age,angle,speed]
       if(x>250){
         moveArray=[[0,270,4],[40,135,3],[60,270,5],[90,210,7]];
       }else{
         moveArray=[[0,270,4],[40,45,3],[60,270,5],[90,330,7]];
       }
       Enemy.call(this, x, y,moveArray);
       this.frame = 3;
    }
});


var Bear2 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       var moveArray = new Array();
       if(x>250){
        moveArray=[[0,270,4],[20,210,9],[50,270,7]];
       }else{
        moveArray=[[0,270,4],[20,330,9],[50,270,7]]; 
       }
       Enemy.call(this, x, y,moveArray);
       this.frame = 4;
    }
});

var Bear3 = enchant.Class.create(Enemy, {

   initialize: function (x, y) {
       var moveArray = new Array();  
       moveArray=[[0,270,3],[15,250,4],[35,290,4],[55,250,4],[75,290,4],[90,250,4]];
       Enemy.call(this, x, y,moveArray);
       this.frame = 5;
    }
});