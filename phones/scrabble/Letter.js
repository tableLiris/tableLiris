function Letter() {
    this.width = 0;
    this.height = 0;
    this.angle = 0;
    this.aSpeed = 0;
    this.moveAcc = 0;
    this.image = new Image();
    this.boxSd = new b2BoxDef();
    this.boxBd = new b2BodyDef();
    this.letter = '';
    this.used = false;
}

Letter.prototype = new Rectangle();

if( typeof Letter.initialized == "undefined" ) {

    // Return the letter
	Letter.prototype.getLetter = function() {
		return this.letter;
	}

    // Set the letter
    Letter.prototype.setLetter = function(l) {
        this.letter = l;
    }

    // Return if the letter is already used or not
    Letter.prototype.isUsed = function() {
        return this.used;
    }

    // Set if the letter is already used or not
    Letter.prototype.setUsed = function(u) {
        this.used = u;
    }

    // Draw the letter
    Letter.prototype.draw = function() {
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

	Letter.initialized = true;
}