/**
 * Rectangle
 * Définition d'un rectangle
 */
function Rectangle() {
    this.width = 0;
    this.height = 0;
    this.angle = 0;
    this.aSpeed = 0;
    this.moveAcc = 0;
    this.image = new Image();
    this.boxSd = null;
    this.boxBd = null;
    this.categoryBits = -1;
    this.categoryMask = -1;
    this.density = 1.0;
}

Rectangle.prototype = new Shape();     

if( typeof Rectangle.initialized == "undefined" ) {

    /**
    * Retourne la largeur du rectangle mise à l'échelle
    * @returns {number}
    */
    Rectangle.prototype.getAbsoluteWidth = function() {
        return this.width * this.scale;
    };

    /**
    * Retourne la largeur du rectangle par rapport à la largeur de l'écran et mis à l'échelle
    * @returns {number}
    */
    Rectangle.prototype.getRelativeWidth = function() {
        if (this.canvasW > 0) {
            return this.width * this.scale / this.canvasW;
        } else {
            console.warn("You have to set the canvas size for the object first.");
            return 0;
        }
    };

    /**
    * Retourne la largeur du rectangle sans mise à l'échelle
    * @returns {number}
    */
    Rectangle.prototype.getOriginalAbsoluteWidth = function() {
        return this.width;
    };

    /**
    * Retourne la largeur du rectangle par rapport à la largeur de l'écran sans mise à l'échelle
    * @returns {number}
    */
    Rectangle.prototype.getOriginalRelativeWidth = function() {
        if (this.canvasW > 0) {
            return this.width / this.canvasW;
        } else {
            console.warn("You have to set the canvas size for the object first.");
            return 0;
        }
    };

    /**
    * Retourne la hauteur du rectangle mise à l'échelle
    * @returns {number}
    */
    Rectangle.prototype.getAbsoluteHeight = function() {
        return this.height * this.scale;
    };

    /**
    * Retourne la hauteur du rectangle par rapport à la hauteur de l'écran et mis à l'échelle
    * @returns {number}
    */
    Rectangle.prototype.getRelativeHeight = function() {
        if (this.canvasH > 0) {
            return this.height * this.scale / this.canvasH;
        } else {
            console.warn("You have to set the canvas size for the object first.");
            return 0;
        }
    };

    /**
    * Retourne la hauteur du rectangle sans mise à l'échelle
    * @returns {number}
    */
    Rectangle.prototype.getOriginalAbsoluteHeight = function() {
        return this.height;
    };

    /**
    * Retourne la hauteur du rectangle par rapport à la hauteur de l'écran sans mise à l'échelle
    * @returns {number}
    */
    Rectangle.prototype.getOriginalRelativeHeight = function() {
        if (this.canvasH > 0) {
            return this.height / this.canvasH;
        } else {
            console.warn("You have to set the canvas size for the object first.");
            return 0;
        }
    };

    /**
    * Retourne l'angle du rectangle
    * @returns {number}
    */
    Rectangle.prototype.getAngle = function() {
        return this.angle;
    };

    /**
    * Retourne l'image d'affichage du rectangle
    * @returns {image}
    */
    Rectangle.prototype.getImage = function() {
        return this.image;
    };

    /**
    * Retourne un tableau de coordonnées des quatres coins du rectangle
    * @returns {array}  
    */
    Rectangle.prototype.getCorners = function() {
        x1 = this.getXAbsolutePosition() + ((Math.cos(-this.getAngle() / 180 * Math.PI)) * (this.getAbsoluteWidth() / 2) - Math.sin(-this.getAngle() / 180 * Math.PI) * (this.getAbsoluteHeight() / 2));
        y1 = this.getYAbsolutePosition() - ((Math.sin(-this.getAngle() / 180 * Math.PI) * (this.getAbsoluteWidth() / 2)) + (Math.cos(-this.getAngle() / 180 * Math.PI)) * (this.getAbsoluteHeight() / 2));

        x2 = this.getXAbsolutePosition() - ((Math.cos(-this.getAngle() / 180 * Math.PI)) * (this.getAbsoluteWidth() / 2) + Math.sin(-this.getAngle() / 180 * Math.PI) * (this.getAbsoluteHeight() / 2));
        y2 = this.getYAbsolutePosition() + ((Math.sin(-this.getAngle() / 180 * Math.PI) * (this.getAbsoluteWidth() / 2)) - (Math.cos(-this.getAngle() / 180 * Math.PI)) * (this.getAbsoluteHeight() / 2));

        x3 = this.getXAbsolutePosition() - ((Math.cos(-this.getAngle() / 180 * Math.PI)) * (this.getAbsoluteWidth() / 2) - Math.sin(-this.getAngle() / 180 * Math.PI) * (this.getAbsoluteHeight() / 2));
        y3 = this.getYAbsolutePosition() + ((Math.sin(-this.getAngle() / 180 * Math.PI) * (this.getAbsoluteWidth() / 2)) + (Math.cos(-this.getAngle() / 180 * Math.PI)) * (this.getAbsoluteHeight() / 2));

        x4 = this.getXAbsolutePosition() + ((Math.cos(-this.getAngle() / 180 * Math.PI)) * (this.getAbsoluteWidth() / 2) + Math.sin(-this.getAngle() / 180 * Math.PI) * (this.getAbsoluteHeight() / 2));
        y4 = this.getYAbsolutePosition() - ((Math.sin(-this.getAngle() / 180 * Math.PI) * (this.getAbsoluteWidth() / 2)) - (Math.cos(-this.getAngle() / 180 * Math.PI)) * (this.getAbsoluteHeight() / 2));
        
        return [x1,y1,x2,y2,x3,y3,x4,y4];
    };

    Rectangle.prototype.getSlopes = function() {
        var points = this.getCorners();
        if ((points[2] - points[0]) != 0) {
            s1 = (points[3] - points[1]) / (points[2] - points[0]);
        } else {
            s1 = Infinity;
        }
        if ((points[4] - points[2]) != 0) {
            s2 = (points[5] - points[3]) / (points[4] - points[2]);
        } else {
            s2 = Infinity;
        }
        if ((points[6] - points[4]) != 0) {
            s3 = (points[7] - points[5]) / (points[6] - points[4]);
        } else {
            s3 = Infinity;
        }
        if ((points[0] - points[6]) != 0) {
            s4 = (points[1] - points[7]) / (points[0] - points[6]);
        } else {
            s4 = Infinity;
        }
        return [s1,s2,s3,s4];
    }


    /**
    * Retourne la liste des contacts de l'objet
    * @returns {contact}
    */
    Rectangle.prototype.getContactList = function() {
        if (this.body != null) {
            return this.body.GetContactList();    
        }
    }

    /**
    * Définit la largeur du rectangle
    * @param {number}
    */
    Rectangle.prototype.setAbsoluteWidth = function(w) {
        this.width = w;
    };

    /**
    * Définit la largeur du rectangle par rapport à la largeur de l'écran
    * @param {number}
    */
    Rectangle.prototype.setRelativeWidth = function(w) {
        if (this.canvasW > 0) {
            this.width = w * this.canvasW;
        } else {
            console.warn("You have to set the canvas size for the object first.");
            return;
        }
    };

    /**
    * Définit la hauteur du rectangle
    * @param {number}
    */
    Rectangle.prototype.setAbsoluteHeight = function(h) {
        this.height = h;
    };


    /**
    * Définit la hauteur du rectangle par rapport à la hauteur de l'écran
    * @param {number}
    */
    Rectangle.prototype.setRelativeHeight = function(h) {
        if (this.canvasH > 0) {
            this.height = h * this.canvasH;
        } else {
            console.warn("You have to set the canvas size for the object first.");
            return;
        }
    };

    /**
    * Définit l'angle du rectangle
    * @param {number}
    */
    Rectangle.prototype.setAngle = function(a) {
        this.angle = a;
        if (this.body != null) {
            var vect = new b2Vec2(this.getXAbsolutePosition(),this.getYAbsolutePosition());
            this.body.SetCenterPosition(vect,a / 180 * Math.PI);
        }
    };

    /**
    * Définit l'image d'affichage du rectangle
    * @param {string}   url ou chemin
    */
    Rectangle.prototype.setImage = function(img) {
        this.image.src = img;
    };

    /**
    * Ajoute un comportement physique au rectangle
    * @param {world}    Monde dans lequelle la physique s'applique
    * @param {number}   Restitution des forces après collision
    */
    Rectangle.prototype.addPhysics = function(world, rest) {
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
        this.boxSd.density = this.density;
        this.boxBd.AddShape(this.boxSd);
        this.boxBd.type = b2Body.b2_dynamicBody;
        this.boxBd.position.Set(this.xPosition, this.yPosition);
        this.boxBd.rotation = (-this.angle / 180 * Math.PI);
        this.boxBd.allowSleep = false;
        this.body = world.CreateBody(this.boxBd);
    };

    /**
    * Suppresion du comportement physique
    * @param {world}    Monde dans lequelle la physique s'applique
    */
    Rectangle.prototype.removePhysics = function(world) {
        if (this.body != null) {
            world.DestroyBody(this.body);
        }
    };

    /**
    * Définit la densité du rectangle
    * Doit être effectué avant d'activer la physique pour le rectangle
    * @param {number}
    */
    Rectangle.prototype.setDensity = function(d) {
        if (this.body == null) {
            this.density = d;
        } else {
            console.warn("You must set density before activating physics for the shape.");
        }
    };

    Rectangle.prototype.setCollisionFilter = function(c) {
        this.categoryBits = c;
    };

    Rectangle.prototype.setCollisionMask = function(m) {
        this.categoryMask = m;
    };

    /**
    * Définit la vitesse linéaire du rectangle
    * Ne fonctionne que si la physique a été activé pour le rectangle
    * @param {number}   vitesse en X
    * @param {number}   vitesse en Y
    */
    Rectangle.prototype.setLinearVelocity = function(x,y) {
        if (this.body != null) {
            var vect = new b2Vec2(x, y);
            this.body.m_linearVelocity = vect;
            this.body.SetLinearVelocity(vect);
        } else {
            console.warn("You need to add physics to the shape before setting linear velocity.");
        }
    };

    /**
    * Définit la régression de la vitesse linéaire du rectangle
    * @param {number}   
    */
    Rectangle.prototype.setLinearDamping = function(d) {
        if (this.body != null) {
             this.body.m_linearDamping = d;
        } else {
            this.boxBd.linearDamping = d;
        }
    };

    /**
    * Recalibre la position d'affichage du rectangle avec celle de son ombre physique
    * Ne fonctionne que si la physique a été activé pour le rectangle
    */
    Rectangle.prototype.reposition = function() {
        if (this.body != null) {
            this.xPosition = this.body.m_position.x;
            this.yPosition = this.body.m_position.y;
            this.angle = this.body.m_rotation / Math.PI * 180;
        } else {
           // console.warn("You need to add physics to the shape before repositioning.");
        }
    };

    /**
    * Affiche le rectangle à l'écran
    * @param {context}
    */
    Rectangle.prototype.draw = function() {
        if (this.context != null) {
            this.context.save();
            this.context.translate(this.xPosition, this.yPosition);
            this.context.rotate(this.angle * Math.PI / 180);
            if (this.image.src == "") {
                this.context.fillStyle = this.color;
                this.context.fillRect(this.width * this.scale / -2, this.height * this.scale / -2, this.width * this.scale , this.height * this.scale);
            } else {
                this.context.drawImage(this.image,this.width * this.scale / -2, this.height * this.scale / -2,this.width * this.scale,this.height * this.scale);
            }
            this.context.restore();
        } else {
            console.warn("A context is needed to draw.");
        }
    };

    Rectangle.initialized = true;
}
