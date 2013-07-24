/**
 * Shape
 * Définition des formes 
 * Cette classe ne sert qu'à l'héritage, elle ne peut pas être utilisé seule.
 */
function Shape() {  
    this.xPosition = 0;
    this.yPosition = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.canvasW = 0;
    this.canvasH = 0;
    this.scale = 1;
    this.color = "#ffffff";
    this.body = null;
    this.context = null;

    if( typeof Shape.initialized == "undefined" ) { 

    	/**
        * Retourne la position en X de l'objet
        * @returns {number}
        */
    	Shape.prototype.getXAbsolutePosition = function() {
	        return this.xPosition;
	    };

        /**
        * Retourne la position en X de l'objet par rapport à la largeur de l'écran
        * @returns {number}
        */
        Shape.prototype.getXRelativePosition = function() {
            if (this.canvasW > 0) {
                return this.xPosition / this.canvasW; 
            } else {
                console.warn("You have to set the canvas size for the object first.");
                return 0;
            }
        };

	    /**
        * Retourne la position en Y de l'objet
        * @returns {number}
        */
	    Shape.prototype.getYAbsolutePosition = function() {
	        return this.yPosition;
	    };

        /**
        * Retourne la position en Y de l'objet par rapport à la hauteur de l'écran
        * @returns {number}
        */
        Shape.prototype.getYRelativePosition = function() {
            if (this.canvasH > 0) {
                return this.yPosition / this.canvasH;
            } else {
                console.warn("You have to set the canvas size for the object first.");
                return 0;
            }
        };

	    /**
        * Retourne l'échelle d'affichage
        * @returns {number}
        */
	    Shape.prototype.getScale = function() {
	        return this.scale;
	    };

	    /**
        * Retourne la couleur d'affichage
        * @returns {string} 	"#XXXXXX"
        */
	    Shape.prototype.getColor = function() {
	        return this.color;
	    };

        /**
        * Retourne le context d'affichage
        * @returns {context}
        */
        Shape.prototype.getContext = function() {
            return this.context;
        };

        /**
        * Définit la taille du canvas d'affichage
        * @param {number}
        * @param {number}
        */
        Shape.prototype.setCanvasSize = function(w,h) {
            this.canvasW = w;
            this.canvasH = h;
        };

	    /**
        * Positionne la forme en X
        * @param {number}
        */
	    Shape.prototype.setXAbsolutePosition = function(xPos) {
	        this.xPosition = xPos;
	        if (this.body != null) {
	        	var vect = new b2Vec2(xPos,this.yPosition);
	        	if (this.setAngle) {
                    this.body.SetCenterPosition(vect,this.getAngle() / 180 * Math.PI);    
                } else  {
                    this.body.SetCenterPosition(vect,0);
                }
	        }
	    };

        /**
        * Positionne la forme en X par rapport à la largeur de l'écran
        * @param {number}
        */
        Shape.prototype.setXRelativePosition = function(xPos) {
            if (this.canvasW == 0) {
                console.warn("You have to set the canvas size for the object first.");
                return;
            }
            this.xPosition = xPos * this.canvasW;
            if (this.body != null) {
                var vect = new b2Vec2(xPos * this.canvasW, this.getYAbsolutePosition());
                if (this.setAngle) {
                    this.body.SetCenterPosition(vect,this.getAngle() / 180 * Math.PI);    
                } else  {
                    this.body.SetCenterPosition(vect,0);
                }
            }
        };

	    /**
        * Positionne la forme en Y
        * @param {number}
        */
	    Shape.prototype.setYAbsolutePosition = function(yPos) {
	        this.yPosition = yPos;
	        if (this.body != null) {
	        	var vect = new b2Vec2(this.xPosition,yPos);
	        	if (this.setAngle) {
                    this.body.SetCenterPosition(vect,this.getAngle() / 180 * Math.PI);    
                } else  {
                    this.body.SetCenterPosition(vect,0);
                }
	        }
	    };

        /**
        * Positionne la forme en Y par rapport à la hauteur de l'écran
        * @param {number}
        */
        Shape.prototype.setYRelativePosition = function(yPos) {
            if (this.canvasH == 0) {
                console.warn("You have to set the canvas size for the object first.");
                return;
            }
            this.yPosition = yPos * this.canvasH;
            if (this.body != null) {
                var vect = new b2Vec2(this.getXAbsolutePosition(), yPos * this.canvasH);
                if (this.setAngle) {
                    this.body.SetCenterPosition(vect,this.getAngle() / 180 * Math.PI);
                } else  {
                    this.body.SetCenterPosition(vect,0);
                }
                
            }
        };

	    /**
        * Définit l'échelle d'affichage
        * @param {number}
        */
	    Shape.prototype.setScale = function(s) {
	        this.scale = s;
	        if (this.body != null) {
	        	this.body.m_scale = s;
	        }
	    };

	    /**
        * Définit la couleur d'affichage
        * @param {string}	"#XXXXXX"
        */
	    Shape.prototype.setColor = function(c) {
	        this.color = c;
	    };

        /**
        * Définit le context d'affichage
        * @param {context}
        */
        Shape.prototype.setContext = function(c) {
            this.context = c;
        };

    	Shape.initialized = true;
    }
};
