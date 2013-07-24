/**
 * Manager
 * Définition du manager
 * Gestionnaire global des patterns, des blobs, de la gestuelle et de la physique
 */
function Manager() {
    window.touchList = [];
    window.onGesture = null;
	this.patternList = [];
    this.circleList = [];
    this.rectangleList = [];
	window.screenH = 0;
	window.screenW = 0;
    this.all_events = ["tap", "drag", "pinch", "rotate", "hold", "touch", "release"];
    this.hammertime = Hammer(window).on(this.all_events.join(" "), function(event) {
        window.onGesture(event);
    })
    this.hammertime.options.prevent_default = true;
    this.worldAABB = new b2AABB();
    this.gravity = new b2Vec2(0, 0);
    this.doSleep = true;
    this.world = null;
                
    if( typeof Manager.initialized == "undefined" ) { 

        Manager.prototype.distance = function(x1,y1,x2,y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        };

        Manager.prototype.projection = function(s,x,y,x0,y0) {
            if (s == 0) {
                var xR = x0;
                var yR = y;
            } else if (s == Infinity){
                var xR = x;
                var yR = y0;
            } else {
                var b1 = y - s * x;
                var b2 = y0 + 1 / s * x0;
                var xR = (b1-b2) / (- s - 1/s);
                var yR = (s*xR + b1);
            }
            
            return [xR,yR];
        };

        Manager.prototype.intersection = function(s1,x1,y1,s2,x2,y2) {
            if (s1 == Infinity || s2 == Infinity) {
                return [x1, Infinity];
            }
            var b1 = y1 - s1 * x1;
            var b2 = y2 - s2 * x2;
            if ((s1 - s2) != 0) {
                var xR = (b2 - b1) / (s1 - s2);
                var yR = s1 * xR + b1;
                return [xR,yR];
            } else if (s1 == 0) {
                return [Infinity, y1];
            } 

            
        };

        Manager.prototype.getWorld = function() {
            return this.world;
        };

        Manager.prototype.getObjects = function(xPos,yPos) {
            var objectList = [];
            for (var i = 0; i < this.circleList.length; i++) {
                if (distance(xPos,yPos,this.circleList[i].getXAbsolutePosition(), this.circleList[i].getYAbsolutePosition()) < this.circleList[i].getAbsoluteRadius()) {
                    objectList.push(this.circleList[i]);
                }
            }

            for (var i = 0; i < this.rectangleList.length; i++) {
                if ((xPos > this.rectangleList[i].getXAbsolutePosition() - this.rectangleList[i].getAbsoluteWidth() / 2) &&  (xPos < this.rectangleList[i].getXAbsolutePosition() + this.rectangleList[i].getAbsoluteWidth() / 2)
                    && (yPos > this.rectangleList[i].getYAbsolutePosition() - this.rectangleList[i].getAbsoluteHeight() / 2) &&  (yPos < this.rectangleList[i].getYAbsolutePosition() + this.rectangleList[i].getAbsoluteHeight() / 2)) {
                    objectList.push(this.rectangleList[i]);
                }
            }

            return objectList;
        };

        Manager.prototype.setGravity = function(x,y) {
            this.gravity = new b2Vec2(x,y);
        };

        Manager.prototype.setOnGesture = function (func) {
            window.onGesture = func;
        };

        Manager.prototype.setScreenSize = function (screenWidth, screenHeight) {
            window.screenW = screenWidth;
            window.screenH = screenHeight;
        };

        Manager.prototype.setFirstRectangle = function(rect) {
            this.rectangleList.splice(1, 0, this.rectangleList.splice(this.rectangleList.indexOf(rect), 1)[0]);
        };

        Manager.prototype.addPattern = function(newBlob) {
            this.patternList.push(newBlob);
        };

        Manager.prototype.addCircle = function(newCircle) {
            this.circleList.push(newCircle);
        };

        Manager.prototype.addRectangle = function(newRectangle) {
            this.rectangleList.push(newRectangle);
        };

        Manager.prototype.removeAllPatterns = function() {
            while (this.patternList.length > 0) {
                this.patternList.pop();
            }
        };

        Manager.prototype.removeAllCircle = function() {
            while (this.circleList.length > 0) {
                this.circleList.pop();
            }
        };

        Manager.prototype.removeRectangle = function(rect) {
            var i = this.rectangleList.indexOf(rect);
            if (i != -1) {
                this.rectangleList.splice(i,1);
            }
        }

        Manager.prototype.removeAllRectangle = function() {
            while (this.rectangleList.length > 0) {
                this.rectangleList.pop();
            }
        };

        Manager.prototype.initPhysics = function() {
            this.worldAABB.minVertex.Set(-2000, -2000);
            this.worldAABB.maxVertex.Set(2000, 2000);
            this.world = new b2World(this.worldAABB, this.gravity, this.doSleep);
        };

        Manager.prototype.stepPhysics = function(step) {
            var stepping = false;
            var timeStep = step;
            var iteration = 1;
            this.world.Step(timeStep, iteration);
            for (var i  = 0; i < this.circleList.length; i++){
                this.circleList[i].reposition();
            }
            for (var i  = 0; i < this.rectangleList.length; i++){
                this.rectangleList[i].reposition();
            }
        };


        Manager.prototype.addEvent = function(blob) {
            var exist = false;
            for (var i = 0; i < window.touchList.length; i++) {
                if (window.touchList[i].id == blob.getSessionId()) {
                    exist = true;
                }
            }
            if (!exist) {
                window.touchList.push({id:blob.getSessionId(), startX:blob.getScreenX(window.screenW), startY:blob.getScreenY(window.screenH), posX:blob.getScreenX(window.screenW), posY:blob.getScreenY(window.screenH)});
                for (var i = 0; i < this.patternList.length; i++) {
                    if (this.blobMatchPattern(blob,this.patternList[i])) {
                        if (this.patternList[i].isGestureEnable()) {
                            var evt = document.createEvent("MouseEvents");
                            evt.initMouseEvent("mousedown", true, true, window,
                                0, 0, 0, 0, 0, false, false, false, false, 0, document.elementFromPoint(blob.getScreenX(window.screenW), blob.getScreenY(window.screenH)));
                            document.elementFromPoint(blob.getScreenX(window.screenW), blob.getScreenY(window.screenH)).dispatchEvent(evt);
                        }
                    }
                }
            }
        };

        Manager.prototype.updateEvent = function(blob) {
            for (var i = 0; i < window.touchList.length; i++) {
                if (window.touchList[i].id == blob.getSessionId()) {
                    window.touchList[i].posX = blob.getScreenX(window.screenW);
                    window.touchList[i].posY = blob.getScreenY(window.screenH);
                    for (var j = 0; j < this.patternList.length; j++) {
                        if (this.blobMatchPattern(blob,this.patternList[j])) {
                            if (this.patternList[j].isGestureEnable()) {
                                var evt = document.createEvent("MouseEvents");
                                evt.initMouseEvent("mousemove", true, true, window,
                                    0,blob.getScreenX(window.screenW), blob.getScreenY(window.screenH), blob.getScreenX(window.screenW), blob.getScreenY(window.screenH), false, false, false, false, 0, document.elementFromPoint(blob.getScreenX(window.screenW), blob.getScreenY(window.screenH)));
                                evt.distance = 10;
                                document.elementFromPoint(blob.getScreenX(window.screenW), blob.getScreenY(window.screenH)).dispatchEvent(evt);
                            }
                        }
                    }
                }
            }
        };

        Manager.prototype.removeEvent = function(blob) {
            match = false;
            
            for (var i = 0; i < window.touchList.length; i++) {
                if (window.touchList[i].id == blob.getSessionId()) {
                    window.touchList.splice(window.touchList.indexOf(window.touchList[i]),1);
                    var j = 0;
                    while(j < this.patternList.length && !match) {
                        if (this.blobMatchPattern(blob,this.patternList[j])) {
                            if (this.patternList[j].isGestureEnable()) {
                                var evt = document.createEvent("MouseEvents");
                                evt.initMouseEvent("mouseup", true, true, window,
                                    0, 0, 0, 0, 0, false, false, false, false, 0, document.elementFromPoint(blob.getScreenX(window.screenW), blob.getScreenY(window.screenH)));
                                document.elementFromPoint(blob.getScreenX(window.screenW), blob.getScreenY(window.screenH)).dispatchEvent(evt);
                                match = true;
                            }
                        }
                        j++;
                    }
                }
            }
        };

        Manager.prototype.blobMatchPattern = function(blob, pattern) {
            if (pattern.isSizeLimited()) {
                if (blob.getArea() > (pattern.getSizeLimit() + pattern.getDeltaSize()) || blob.getArea() < (pattern.getSizeLimit() - pattern.getDeltaSize())) {
                    return false;
                }
            } 
            if (pattern.isAngleLimited()) {
                if (blob.getAngle() > (pattern.getAngleLimit() + pattern.getDeltaAngle()) || blob.getAngle() < (pattern.getAngleLimit() - pattern.getDeltaAngle())) {
                    return false;
                }
            }
            if (pattern.isXLimited()) {
                if ((blob.getX() + blob.getWidth() / 2) > pattern.getXMaxLimit() || (blob.getX() + blob.getWidth() / 2) < pattern.getXMinLimit()) {
                    return false;
                }
            }
            if (pattern.isYLimited()) {
                if ((blob.getY() + blob.getHeight() / 2) > pattern.getYMaxLimit() || (blob.getY() + blob.getHeight() / 2) < pattern.getYMinLimit()) {
                    return false;
                }
            }
            
            return true;
        };

        Manager.prototype.drawCircle = function() {
            for (var i = 0; i < this.circleList.length; i++) {
                this.circleList[i].draw();
            }
        };

        Manager.prototype.drawRectangle = function() {
            for (var i = this.rectangleList.length; i > 0; i--) {
                this.rectangleList[i-1].draw();
            }
        };

        Manager.prototype.drawBlobs = function(blobs) {
            var drawn = false;
            var j;
            for (var i in blobs) {
                j = 0;
                while (j < this.patternList.length && !drawn) {
                    if (blobs[i].getContext) {
                        if (this.blobMatchPattern(blobs[i],this.patternList[j])) {
                            this.patternList[j].draw(blobs[i]);
                            drawn = true;
                        }
                    }
                    j++
                }
                drawn = false;
            }
        };

        Manager.initialized = true;
    }
}(this); 

(function(Hammer) {
    Hammer.plugins.fakeMultitouch = function() {
        // test for msMaxTouchPoints to enable this for IE10 with only one pointer (a mouse in all/most cases)
        Hammer.HAS_POINTEREVENTS = navigator.msPointerEnabled && navigator.msMaxTouchPoints && navigator.msMaxTouchPoints >= 1;
        Hammer.event.getTouchList = function(ev, eventType) {
            // get the fake pointerEvent touchlist
            if(Hammer.HAS_POINTEREVENTS) {
                return Hammer.PointerEvent.getTouchList();
            }
            // get the touchlist
            else if(ev.touches) {
                return ev.touches;
            }

            var result = [];

            

            for (var i = 0; i < window.touchList.length; i++) {
                result.push({identifier:window.touchList[i].id, pageX:window.touchList[i].posX, pageY:window.touchList[i].posY, target:null});
            }
            return result;
        };
    };
})(window.Hammer);
