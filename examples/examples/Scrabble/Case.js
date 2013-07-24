function Case() {
    this.width = 0;
    this.height = 0;
    this.angle = 0;
    this.aSpeed = 0;
    this.moveAcc = 0;
    this.image = new Image();
    this.boxSd = new b2BoxDef();
    this.boxBd = new b2BodyDef();
    this.letter = '';
    this.posI = -1;
    this.posJ = -1;
    this.valide = false;
    this.special = "";
}

Case.prototype = new Rectangle();

if( typeof Case.initialized == "undefined" ) {

	Case.prototype.getLetter = function() {
		return this.letter;
	}

    Case.prototype.setLetter = function(l) {
        this.letter = l;
    }

    Case.prototype.getPosI = function() {
        return this.posI;
    }

    Case.prototype.setPosI = function(i) {
        this.posI = i;
    }

    Case.prototype.getPosJ = function() {
        return this.posJ;
    }

    Case.prototype.setPosJ = function(j) {
        this.posJ = j;
    }

    Case.prototype.isValide = function() {
        return this.valide;
    }

    Case.prototype.setValide = function(v) {
        this.valide = v;
    }

    Case.prototype.getSpecial = function () {
        return this.special;
    }

    Case.prototype.setSpecial = function(s) {
        this.special = s;
    }

    Case.prototype.draw = function() {
        if (this.context != null) {
            this.context.save();
            this.context.translate(this.xPosition, this.yPosition);
            this.context.rotate(this.angle * Math.PI / 180);
            this.context.fillStyle = this.color;
            this.context.fillRect(this.width * this.scale / -2, this.height * this.scale / -2, this.width * this.scale , this.height * this.scale);
            this.context.font = "30px Arial";
            this.context.fillStyle = "#FF0000";
            this.context.fillText(this.letter, -10, 10);

            this.context.restore();
        } else {
            console.warn("A context is needed to draw.");
        }
    }

	Case.initialized = true;
}