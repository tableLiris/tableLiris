/**
 * Pattern
 * Définition des patterns 
 * De base un pattern n'a pas de limitation et match tous les blobs
 */
function Pattern() { 

	this.sizeLimited = false;
	this.angleLimited = false;
	this.xLimited = false;
	this.yLimited = false;
    this.size = 0;
    this.deltaSize = 0;
    this.angle = 0;
    this.deltaAngle = 0;
	this.xMinimum = 0;
	this.xMaximum = 0;
	this.yMinimum = 0;
	this.yMaximum = 0;
    this.gesture = false;

    if( typeof Pattern.initialized == "undefined" ) { 

        /**
        * Retourne la limite de taille du pattern
        * @returns {number}
        */
        Pattern.prototype.getSizeLimit = function() { 
            return this.size;
        };

        /**
        * Retourne le delta sur la limite de taille du pattern
        * @returns {number}
        */
        Pattern.prototype.getDeltaSize = function() {
            return this.deltaSize;
        };

        /**
        * Retourne la limite d'angle du pattern
        * @returns {number}
        */
        Pattern.prototype.getAngleLimit = function() {
            return this.angle;
        };

        /**
        * Retourne le delta sur la limite d'angle du pattern
        * @returns {number}
        */
        Pattern.prototype.getDeltaAngle = function() {
            return this.deltaAngle;
        };

        /**
        * Retourne la limite de position minimum en X du pattern
        * @returns {number}
        */
        Pattern.prototype.getXMinLimit = function() {
            return this.xMinimum;
        };

        /**
        * Retourne la limite de position maximum en X du pattern
        * @returns {number}
        */
        Pattern.prototype.getXMaxLimit = function() {
            return this.xMaximum;
        };

        /**
        * Retourne la limite de position minimum en Y du pattern
        * @returns {number}
        */
        Pattern.prototype.getYMinLimit = function() {
            return this.yMinimum;
        };

        /**
        * Retourne la limite de position maximum en Y du pattern
        * @returns {number}
        */
        Pattern.prototype.getYMaxLimit = function() {
            return this.yMaximum;
        };

        /**
        * Retourne si un pattern est limité en taille ou non
        * @returns {boolean}
        */
        Pattern.prototype.isSizeLimited = function() {
            return this.sizeLimited;
        };

        /**
        * Retourne si un pattern est limité sur l'angle ou non
        * @returns {boolean}
        */
        Pattern.prototype.isAngleLimited = function() {
            return this.angleLimited;
        };

        /**
        * Retourne si un pattern est limité sur l'axe X ou non
        * @returns {boolean}
        */
        Pattern.prototype.isXLimited = function() {
            return this.xLimited;
        };

        /**
        * Retourne si un pattern est limité sur l'axe Y ou non
        * @returns {boolean}
        */
        Pattern.prototype.isYLimited = function() {
            return this.yLimited;
        };

        /**
        * Retourne si un pattern reconnait la gestuelle ou non
        * @returns {boolean}
        */
        Pattern.prototype.isGestureEnable = function() {
            return this.gesture;
        };

        /**
        * Ajoute une limite sur la taille au pattern
        * @param {number}   aire
        * @param {number}   delta
        */
        Pattern.prototype.addSizeLimit = function(ar, delta) {
            this.sizeLimited = true;
            this.size = ar; 
            this.deltaSize = delta;
        };

        /**
        * Retire une limite sur la taille au pattern
        */
        Pattern.prototype.removeSizeLimit = function() {
            this.sizeLimited = false;
            this.size = 0;
            this.deltaSize = 0;
        };

        /**
        * Ajoute une limite sur l'angle au pattern
        * @param {number}   angle
        * @param {number}   delta
        */
        Pattern.prototype.addAngleLimit = function(a, delta) {
            this.angleLimited = true;
            this.angle = a;
            this.deltaAngle = delta;
        };

        /**
        * Retire une limite sur l'angle au pattern
        */
        Pattern.prototype.removeAngleLimit = function() {
            this.angleLimited = false;
            this.angle = 0;
            this.deltaAngle = delta;
        };

        /**
        * Ajoute une limite sur l'axe X au pattern
        * @param {number}   xMin
        * @param {number}   xMax
        */
        Pattern.prototype.addXLimit = function(xMin, xMax) {
            this.xLimited = true;
            this.xMinimum = xMin;
            this.xMaximum = xMax;
        };

        /**
        * Retire une limite sur l'axe X au pattern
        */
        Pattern.prototype.removeXLimit = function() {
            this.xLimited = false;
            this.xMinimum = 0;
            this.xMaximum = 0;
        };

        /**
        * Ajoute une limite sur l'axe Y au pattern
        * @param {number}   yMin
        * @param {number}   yMax
        */
        Pattern.prototype.addYLimit = function(yMin, yMax) {
            this.yLimited = true;
            this.yMinimum = yMin;
            this.yMaximum = yMax;
        };

        /**
        * Retire une limite sur l'axe Y au pattern
        */
        Pattern.prototype.removeYLimit = function() {
            this.yLimited = false;
            this.yMinimum = 0;
            this.yMaximum = 0;
        };

        /**
        * Définit si oui ou non un pattern réagit à la gestuelle
        * @param {boolean}   state
        */
        Pattern.prototype.enableGesture = function(state) {
            this.gesture = state;
        };

        /**
        * Dessine un blob correspondant à un pattern à l'écran
        * @param {context}   context
        * @param {TUIOBlob}   blob
        */
        Pattern.prototype.draw = function(blob) {
            if (blob.getContext() != null) {
                var screenW = window.screenW;
                var screenH = window.screenH;
                var size = (blob.getScreenWidth(screenW) + blob.getScreenHeight(screenH)) / 2;
                blob.getContext().save();
                blob.getContext().fillStyle = blob.getColor();
                blob.getContext().translate(blob.getScreenX(screenW), blob.getScreenY(screenH));
                blob.getContext().rotate(-blob.getAngle() * Math.PI / 180);
                blob.getContext().fillRect(size / -2, size / -2, size , size);
                blob.getContext().restore();
            } else {
                console.warn("A context is needed to draw.");
            }
            
        };

        Pattern.initialized = true;
    }
}; 
