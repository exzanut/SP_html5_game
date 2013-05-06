var MutableText = enchant.Class.create(enchant.Sprite, {

    initialize: function(x, y, width) {
        enchant.Sprite.call(this, 0, 0);
        this.fontSize = 16;
        this.widthItemNum = 16;
        this.x = x;
        this.y = y;
        this._imageAge = Number.MAX_VALUE;
        this.text = '';
        if (arguments[2]) {
            this.row = Math.floor(arguments[2] / this.fontSize);
        }
    },

    setText: function(txt) {
        var i, x, y, wNum, charCode, charPos;
        this._text = txt;
        var newWidth;
        if (!this.returnLength) {
            this.width = Math.min(this.fontSize * this._text.length, enchant.Game.instance.width);
        } else {
            this.width = Math.min(this.returnLength * this.fontSize, enchant.Game.instance.width);
        }
        this.height = this.fontSize * (Math.ceil(this._text.length / this.row) || 1);
        // if image is to small or was to big for a long time create new image
        if(!this.image || this.width > this.image.width || this.height > this.image.height || this._imageAge > 300) {
            this.image = new enchant.Surface(this.width, this.height);
            this._imageAge = 0;
        } else if(this.width < this.image.width || this.height < this.image.height) {
            this._imageAge++;
        } else {
            this._imageAge = 0;
        }
        this.image.context.clearRect(0, 0, this.width, this.height);
        for (i = 0; i < txt.length; i++) {
            charCode = txt.charCodeAt(i);
            if (charCode >= 32 && charCode <= 127) {
                charPos = charCode - 32;
            } else {
                charPos = 0;
            }
            x = charPos % this.widthItemNum;
            y = (charPos / this.widthItemNum) | 0;
            this.image.draw(enchant.Game.instance.assets['www/picture/font0.png'],
                x * this.fontSize, y * this.fontSize, this.fontSize, this.fontSize,
                (i % this.row) * this.fontSize, ((i / this.row) | 0) * this.fontSize, this.fontSize, this.fontSize);
        }
    },

    text: {
        get: function() {
            return this._text;
        },
        set: function(txt) {
            this.setText(txt);
        }
    },

    row: {
        get: function() {
            return this.returnLength || this.width / this.fontSize;
        },
        set: function(row) {
            this.returnLength = row;
            this.text = this.text;
        }
    }
});

var ScoreLabel = enchant.Class.create(MutableText, {

    initialize: function(x, y) {
        MutableText.call(this, 0, 0);
        switch (arguments.length) {
            case 2:
                this.y = y;
                this.x = x;
                break;
            case 1:
                this.x = x;
                break;
            default:
                break;
        }
        this._score = 0;
        this._current = 0;
        this.easing = 2.5;
        this.text = this.label = 'SCORE:';
        this.addEventListener('enterframe', function() {
            if (this.easing === 0) {
                this.text = this.label + (this._current = this._score);
            } else {
                this._current += Math.ceil((this._score - this._current) / this.easing);
                this.text = this.label + this._current;
            }
        });
    },

    score: {
        get: function() {
            return this._score;
        },
        set: function(newscore) {
            this._score = newscore;
        }
    }
});
