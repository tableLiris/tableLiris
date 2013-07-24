function Ray() {
    this.width = 0;
    this.height = 0;
    this.angle = 0;
    this.aSpeed = 0;
    this.moveAcc = 0;
    this.image = new Image();
    this.boxSd = new b2BoxDef();
    this.boxBd = new b2BodyDef();
    this.xSource = 0;
    this.ySource = 0;
    this.xDir = 0;
    this.yDir = 0;
    this.sourceId = 0;
}

Ray.prototype = new Rectangle();

if( typeof Ray.initialized == "undefined" ) {

	Ray.prototype.getXSource = function() {
		return this.xSource;
	}

	Ray.prototype.getYSource = function() {
		return this.ySource;
	}

	Ray.prototype.getXDir = function() {
		return this.xDir;
	}

	Ray.prototype.getYDir = function() {
		return this.yDir;
	}

	Ray.prototype.getSourceId = function() {
		return this.sourceId;
	}

	Ray.prototype.setXSource = function(x) {
		this.xSource = x;
	}

	Ray.prototype.setYSource = function(y) {
		this.ySource = y;
	}

	Ray.prototype.setXDir = function(x) {
		this.xDir = x;
	}

	Ray.prototype.setYDir = function(y) {
		this.yDir = y;
	}

	Ray.prototype.setSourceId = function(id) {
		this.sourceId = id;
	}

	Ray.prototype.addPhysics = function(world, rest) {
        delete this.boxSd;
        delete this.boxBd;
        delete this.body;
        this.boxSd = new b2BoxDef();
        this.boxBd = new b2BodyDef();
        this.boxSd.extents.Set(this.width / 2, this.height / 2);
        this.boxSd.restitution = rest;
        if (this.categoryBits != -1) {
            this.boxSd.categoryBits = this.categoryBits;
        }
        if (this.categoryMask != -1) {
            this.boxSd.maskBits = this.categoryMask;
        }
        this.boxSd.density = 0.0;
        this.boxBd.AddShape(this.boxSd);
        this.boxBd.type = b2Body.b2_staticBody;
        this.boxBd.position.Set(this.xPosition, this.yPosition);
        this.boxBd.rotation = (-this.angle / 180 * Math.PI);
        this.boxBd.allowSleep = false;
        this.body = world.CreateBody(this.boxBd);
        this.body.m_mass = 0.0;
    };

	Ray.initialized = true;
}