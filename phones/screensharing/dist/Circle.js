/**
 * Circle
 * Définition d'un cercle
 */
function Circle() {
    this.radius = 0;
    this.ballSd = new b2CircleDef();
    this.ballBd = new b2BodyDef();
}

Circle.prototype = new Shape(); 

if( typeof Circle.initialized == "undefined" ) {

    /**
    * Retourne le rayon du cercle mis à l'échelle
    * @returns {number}
    */
    Circle.prototype.getAbsoluteRadius = function() {
        return this.radius * this.scale;
    };

    /**
    * Retourne le rayon du cercle par rapport à la plus grande dimension de l'écran et  mis à l'échelle
    * @returns {number}
    */
    Circle.prototype.getRelativeRadius = function() {
        if (this.canvasW > this.canvasH && this.canvasW > 0) {
            return this.radius * this.scale / this.canvasW;
        } else if (this.canvasW < this.canvasH && this.canvasH > 0) {
            return this.radius * this.scale / this.canvasH;
        } else if (this.canvasW == this.canvasH && this.canvasH > 0) {
            return this.radius * this.scale / this.canvasH;
        } else {
            console.warn("You have to set the canvas size for the object first.");
        }
    };

    /**
    * Retourne le rayon du cercle sans mise à l'échelle
    * @returns {number}
    */
    Circle.prototype.getOriginalAbsoluteRadius = function() {
        return this.radius;
    };

    /**
    * Retourne le rayon du cercle par rapport à la plus grande dimension de l'écran et sans mise à l'échelle
    * @return {number}
    */
    Circle.prototype.getOriginalRelativeRadius = function() {
        if (this.canvasW > this.canvasH && this.canvasW > 0) {
            return this.radius / this.canvasW;
        } else if (this.canvasW < this.canvasH && this.canvasH > 0) {
            return this.radius / this.canvasH;
        } else if (this.canvasW == this.canvasH && this.canvasH > 0) {
            return this.radius / this.canvasH;
        } else {
            console.warn("You have to set the canvas size for the object first.");
        }
    };

    /**
    * Retourne la vitesse de l'objet sur l'axe x
    * @returns {number}
    */
    Circle.prototype.getXLinearVelocity = function() {
        return this.canvasW / this.body.m_linearVelocity.x  * 100;
    };

    /**
    * Retourne la vitesse de l'objet sur l'axe y
    * @returns {number}
    */
    Circle.prototype.getYLinearVelocity = function() {
        return  this.canvasH / this.body.m_linearVelocity.y * 100;
    };

    /**
    * Définit le rayon du cercle
    * @param {number}
    */
    Circle.prototype.setAbsoluteRadius = function(r) {
        this.radius = r;
    };

    /**
    * Définit le rayon du cercle par rapport à la plus grande dimension de l'écran
    * @param {number}
    */
    Circle.prototype.setRelativeRadius = function(r) {
        if (r >= 0) {
            if (this.canvasW > this.canvasH) {
                this.radius = r * this.canvasW; 
            } else if (this.canvasH > this.canvasW) {
                this.radius = r * this.canvasH;
            } else if (this.canvasH == this.canvasW && this.canvasH != 0) {
                this.radius = r * this.canvasH;
            } else {
                console.warn("You have to set the canvas size for the object first.");
            }
        }

    };

    /**
    * Ajoute un comportement physique au cercle
    * @param {world}    Monde dans lequelle la physique s'applique
    * @param {number}   Restitution des forces après collision
    */
    Circle.prototype.addPhysics = function(world,rest) {
        this.ballSd.density = 1;
        this.ballSd.radius = this.radius;
        this.ballSd.restitution = rest;
        this.ballBd.AddShape(this.ballSd);
        this.ballBd.position.Set(this.xPosition,this.yPosition);
        this.body = world.CreateBody(this.ballBd);
    };

    /**
    * Suppresion du comportement physique
    * @param {world}    Monde dans lequelle la physique s'applique
    */
    Circle.prototype.removePhysics = function(world) {
        if (this.body != null) {
            world.DestroyBody(this.body);
        }
    };

    /**
    * Définit la densité du cercle
    * Doit être effectué avant d'activer la physique pour le rectangle
    * @param {number}
    */
    Circle.prototype.setDensity = function(d) {
        if (this.body == null) {
            this.ballSd.density = d;
        } else {
            console.warn("You must set density before activating physics for the shape.");
        }
        
    };

    /**
    * Définit la vitesse linéaire du cercle
    * Ne fonctionne que si la physique a été activé pour le cercle
    * @param {number}   vitesse en X
    * @param {number}   vitesse en Y
    */
    Circle.prototype.setLinearVelocity = function(x,y) {
        if (this.body != null) {
            this.body.SetLinearVelocity(new b2Vec2(this.canvasW / x * 100,this.canvasH / y * 100)) ;
        } else {
            console.warn("You need to add physics to the shape before setting linear velocity.");
        }
    };

    /**
    * Définit la régression de la vitesse linéaire du cercle
    * @param {number}   
    */
    Circle.prototype.setLinearDamping = function(d) {
        if (this.body != null) {
             this.body.m_linearDamping = d;
        } else {
            this.ballBd.linearDamping = d;
        }
    };

    /**
    * Recalibre la position d'affichage du cercle avec celle de son ombre physique
    * Ne fonctionne que si la physique a été activé pour le cercle
    */
    Circle.prototype.reposition = function() {
        if (this.body != null) {
            this.xPosition = this.body.m_position.x;
            this.yPosition = this.body.m_position.y;
        } else {
            console.warn("You need to add physics to the shape before repositioning.");
        }
    };

    /**
    * Affiche le cercle à l'écran
    * @param {context}
    */
    Circle.prototype.draw = function() {
        if (this.context) {
            this.context.save();
            this.context.fillStyle = this.color;
            this.context.beginPath();
            this.context.arc(this.xPosition,this.yPosition,this.radius*this.scale,0,2*Math.PI);
            this.context.fill();
            this.context.restore();
        } else {
            console.warn("A context is needed to draw.");
        }
    };

    Circle.initialized = true;
}
