/*! Tuio.js - v0.0.1 - 2012-10-14
* http://fe9lix.github.com/Tuio.js/
* Copyright (c) 2012 Felix Raab; Licensed GPL */

(function(root) {
    // Initial Setup, events mixin and extend/inherits taken from Backbone.js
    // See Backbone.js source for original version and comments.

    var previousTuio = root.Tuio;

    var slice = Array.prototype.slice;
    var splice = Array.prototype.splice;

    var Tuio;
    if (typeof exports !== "undefined") {
        Tuio = exports;
    } else {
        Tuio = root.Tuio = {};
    }

    Tuio.VERSION = "0.0.1";

    var _ = root._;

    if (!_ && (typeof require !== "undefined")) {
        _ = require("lodash");
    }

    Tuio.noConflict = function() {
        root.Tuio = previousTuio;
        return this;
    };

    var eventSplitter = /\s+/;

    var Events = Tuio.Events = {
        on: function(events, callback, context) {
            var calls, event, node, tail, list;
            if (!callback) {
                return this;
            }
            events = events.split(eventSplitter);
            calls = this._callbacks || (this._callbacks = {});

            while (event = events.shift()) {
                list = calls[event];
                node = list ? list.tail : {};
                node.next = tail = {};
                node.context = context;
                node.callback = callback;
                calls[event] = {tail: tail, next: list ? list.next : node};
            }

            return this;
        },

        off: function(events, callback, context) {
            var event, calls, node, tail, cb, ctx;

            if (!(calls = this._callbacks)) {
                return;
            }
            if (!(events || callback || context)) {
                delete this._callbacks;
                return this;
            }

            events = events ? events.split(eventSplitter) : _.keys(calls);
            while (event = events.shift()) {
                node = calls[event];
                delete calls[event];
                if (!node || !(callback || context)) {
                    continue;
                }
                tail = node.tail;
                while ((node = node.next) !== tail) {
                    cb = node.callback;
                    ctx = node.context;
                    if ((callback && cb !== callback) || (context && ctx !== context)) {
                        this.on(event, cb, ctx);
                    }
                }
            }

          return this;
        },

        trigger: function(events) {
            var event, node, calls, tail, args, all, rest;
            if (!(calls = this._callbacks)) {
                return this;
            }
            all = calls.all;
            events = events.split(eventSplitter);
            rest = slice.call(arguments, 1);

            while (event = events.shift()) {
                if (node = calls[event]) {
                    tail = node.tail;
                    while ((node = node.next) !== tail) {
                        node.callback.apply(node.context || this, rest);
                    }
                }
                if (node = all) {
                    tail = node.tail;
                    args = [event].concat(rest);
                    while ((node = node.next) !== tail) {
                        node.callback.apply(node.context || this, args);
                    }
                }
            }

            return this;
        }
    };

    var Model = Tuio.Model = function() {
        this.initialize.apply(this, arguments);
    };

    _.extend(Model.prototype, Events);

    var extend = function (protoProps, classProps) {
        var child = inherits(this, protoProps, classProps);
        child.extend = this.extend;
        return child;
    };

    Tuio.Model.extend = extend;

    var Ctor = function() {

    };

    var inherits = function(parent, protoProps, staticProps) {
        var child;

        if (protoProps && protoProps.hasOwnProperty("constructor")) {
            child = protoProps.constructor;
        } else {
            child = function() {
                parent.apply(this, arguments);
            };
        }

        _.extend(child, parent);

        Ctor.prototype = parent.prototype;
        child.prototype = new Ctor();

        if (protoProps) {
            _.extend(child.prototype, protoProps);
        }

        if (staticProps) {
            _.extend(child, staticProps);
        }

        child.prototype.constructor = child;

        child.__super__ = parent.prototype;

        return child;
    };
}(this));
Tuio.Time = Tuio.Model.extend({
    seconds: 0,
    microSeconds: 0,

    initialize: function(sec, usec) {
        this.seconds = sec || 0;
        this.microSeconds = usec || 0;
    },

    add: function(us) {
        return new Tuio.Time(
            this.seconds + Math.floor(us / 1000000),
            this.microSeconds + us % 1000000
        );
    },

    addTime: function(ttime) {
        var sec = this.seconds + ttime.getSeconds(),
        usec = this.microSeconds + ttime.getMicroseconds();
        sec += Math.floor(usec / 1000000);
        usec = usec % 1000000;
        
        return new Tuio.Time(sec, usec);
    },

    subtract: function(us) {
        var sec = this.seconds - Math.floor(us / 1000000),
        usec = this.microSeconds - us % 1000000;
        
        if (usec < 0) {
            usec += 1000000;
            sec = sec - 1;
        }
        
        return new Tuio.Time(sec, usec);
    },

    subtractTime: function(ttime) {
        var sec = this.seconds - ttime.getSeconds(),
        usec = this.microSeconds - ttime.getMicroseconds();

        if (usec < 0) {
            usec += 1000000;
            sec = sec - 1;
        }
        
        return new Tuio.Time(sec, usec);
    },

    equals: function(ttime) {
        return (
            (this.seconds === ttime.getSeconds()) &&
            (this.microSeconds === ttime.getMicroseconds())
        );
    },

    reset: function() {
        this.seconds = 0;
        this.microSeconds = 0;
    },

    getSeconds: function() {
        return this.seconds;
    },

    getMicroseconds: function() {
        return this.microSeconds;
    },

    getTotalMilliseconds: function() {
        return this.seconds * 1000 + Math.floor(this.microSeconds / 1000);
    }
}, {
    startSeconds: 0,
    startMicroSeconds: 0,

    fromMilliseconds: function(msec) {
        return new Tuio.Time(
            Math.floor(msec / 1000),
            1000 * (msec % 1000)
        );
    },

    fromTime: function(ttime) {
        return new Tuio.Time(
            ttime.getSeconds(),
            ttime.getMicroseconds()
        );
    },

    initSession: function() {
        var startTime = Tuio.Time.getSystemTime();
        Tuio.Time.startSeconds = startTime.getSeconds();
        Tuio.Time.startMicroSeconds = startTime.getMicroseconds();
    },

    getSessionTime: function() {
        return Tuio.Time.getSystemTime().subtractTime(Tuio.Time.getStartTime());
    },

    getStartTime: function() {
        return new Tuio.Time(
            Tuio.Time.startSeconds,
            Tuio.Time.startMicroSeconds
        );
    },

    getSystemTime: function() {
        var usec = new Date().getTime() * 1000;

        return new Tuio.Time(
            Math.floor(usec / 1000000),
            usec % 1000000
        );
    }
});
Tuio.Point = Tuio.Model.extend({
    xPos: null,
    yPos: null,
    currentTime: null,
    startTime: null,

    initialize: function(params) {
        this.xPos = params.xp || 0;
        this.yPos = params.yp || 0;
        this.currentTime = Tuio.Time.fromTime(params.ttime || Tuio.Time.getSessionTime());
        this.startTime = Tuio.Time.fromTime(this.currentTime);
    },

    update: function(params) {
        this.xPos = params.xp;
        this.yPos = params.yp;
        if (params.hasOwnProperty("ttime")) {
            this.currentTime = Tuio.Time.fromTime(params.ttime);
        }
    },

    updateToPoint: function(tpoint) {
        this.xPos = tpoint.getX();
        this.yPos = tpoint.getY();
    },

    getX: function() {
        return this.xPos;
    },

    getY: function() {
        return this.yPos;
    },

    getDistance: function(xp, yp) {
        var dx = this.xPos - xp,
        dy = this.yPos - yp;
        return Math.sqrt(dx * dx + dy * dy);
    },

    getDistanceToPoint: function(tpoint) {
        return this.getDistance(tpoint.getX(), tpoint.getY());
    },

    getAngle: function(xp, yp) {
        var side = this.xPos - xp,
        height = this.yPos - yp,
        distance = this.getDistance(xp, yp),
        angle = Math.asin(side / distance) + Math.PI / 2;

        if (height < 0) {
            angle = 2 * Math.PI - angle;
        }
        
        return angle;
    },

    getAngleToPoint: function(tpoint) {
        return this.getAngle(tpoint.getX(), tpoint.getY());
    },

    getAngleDegrees: function(xp, yp) {
        return (this.getAngle(xp, yp) / Math.PI) * 180;
    },

    getAngleDegreesToPoint: function(tpoint) {
        return (this.getAngleToPoint(tpoint) / Math.PI) * 180;
    },

    getScreenX: function(width) {
        return Math.round(this.xPos * width);
    },

    getScreenY: function(height) {
        return Math.round(this.yPos * height);
    },

    getTuioTime: function() {
        return Tuio.Time.fromTime(this.currentTime);
    },

    getStartTime: function() {
        return Tuio.Time.fromTime(this.startTime);
    }
}, {
    fromPoint: function(tpoint) {
        return new Tuio.Point({
            xp: tpoint.getX(),
            yp: tpoint.getY()
        });
    }
});
Tuio.Container = Tuio.Point.extend({
    sessionId: null,
    xSpeed: null,
    ySpeed: null,
    motionSpeed: null,
    motionAccel: null,
    path: null,
    state: null,
    color: null,

    initialize: function(params) {
        Tuio.Point.prototype.initialize.call(this, params);

        this.sessionId = params.si;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.motionSpeed = 0;
        this.motionAccel = 0;
        this.drawnColor = "#ffffff";
        this.path = [new Tuio.Point({
            ttime: this.currentTime,
            xp: this.xPos,
            yp: this.yPos
        })];
        this.state = Tuio.Container.TUIO_ADDED;
    },

    update: function(params) {
        var lastPoint = this.path[this.path.length - 1];
        Tuio.Point.prototype.update.call(this, params);
        
        if (
            params.hasOwnProperty("xs") &&
            params.hasOwnProperty("ys") &&
            params.hasOwnProperty("ma")) {

            this.xSpeed = params.xs;
            this.ySpeed = params.ys;
            this.motionSpeed = Math.sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed);
            this.motionAccel = params.ma;
        } else {
            var diffTime = this.currentTime.subtractTime(lastPoint.getTuioTime()),
            dt = diffTime.getTotalMilliseconds() / 1000,
            dx = this.xPos - lastPoint.getX(),
            dy = this.yPos - lastPoint.getY(),
            dist = Math.sqrt(dx * dx + dy * dy),
            lastMotionSpeed = this.motionSpeed;
            
            this.xSpeed = dx / dt;
            this.ySpeed = dy / dt;
            this.motionSpeed = dist / dt;
            this.motionAccel = (this.motionSpeed - lastMotionSpeed) / dt;
        }
        
        this.updatePathAndState();
    },

    updateContainer: function(tcon) {
        Tuio.Point.prototype.updateToPoint.call(this, tcon);

        this.xSpeed = tcon.getXSpeed();
        this.ySpeed = tcon.getYSpeed();
        this.motionSpeed = tcon.getMotionSpeed();
        this.motionAccel = tcon.getMotionAccel();

        this.updatePathAndState();
    },

    updatePathAndState: function() {
        this.path.push(new Tuio.Point({
            ttime: this.currentTime,
            xp: this.xPos,
            yp: this.yPos
        }));

        if (this.motionAccel > 0) {
            this.state = Tuio.Container.TUIO_ACCELERATING;
        } else if (this.motionAccel < 0) {
            this.state = Tuio.Container.TUIO_DECELERATING;
        } else {
            this.state = Tuio.Container.TUIO_STOPPED;
        }
    },

    stop: function(ttime) {
        this.update({
            ttime: ttime,
            xp: this.xPos,
            yp: this.yPos
        });
    },

    remove: function(ttime) {
        this.currentTime = Tuio.Time.fromTime(ttime);
        this.state = Tuio.Container.TUIO_REMOVED;
    },

    getSessionId: function() {
        return this.sessionId;
    },

    getXSpeed: function() {
        return this.xSpeed;
    },

    getYSpeed: function() {
        return this.ySpeed;
    },

    getPosition: function() {
        return new Tuio.Point(this.xPos, this.yPos);
    },

    getPath: function() {
        return this.path;
    },

    getMotionSpeed: function() {
        return this.motionSpeed;
    },

    getMotionAccel: function() {
        return this.motionAccel;
    },

    getTuioState: function() {
        return this.state;
    },

    getColor: function() {
        return this.drawnColor;
    },

    setColor: function(c) {
        this.drawnColor = c;
    },

    isMoving: function() {
        return (
            (this.state === Tuio.Container.TUIO_ACCELERATING) ||
            (this.state === Tuio.Container.TUIO_DECELERATING)
        );
    }
}, {
    TUIO_ADDED: 0,
    TUIO_ACCELERATING: 1,
    TUIO_DECELERATING: 2,
    TUIO_STOPPED: 3,
    TUIO_REMOVED: 4,

    fromContainer: function(tcon) {
        return new Tuio.Container({
            xp: tcon.getX(),
            yp: tcon.getY(),
            si: tcon.getSessionID()
        });
    }
});
Tuio.Cursor = Tuio.Container.extend({
    cursorId: null,

    initialize: function(params) {
        Tuio.Container.prototype.initialize.call(this, params);

        this.cursorId = params.ci;
    },

    getCursorId: function() {
        return this.cursorId;
    }
}, {
    fromCursor: function(tcur) {
        return new Tuio.Cursor({
            si: tcur.getSessionId(),
            ci: tcur.getCursorId(),
            xp: tcur.getX(),
            yp: tcur.getY()
        });
    }
});
Tuio.Blob = Tuio.Container.extend({
    blobId: null,
    angle: null,
    rotationSpeed: null,
    rotationAccel: null,
    w: null,
    h: null,
    area: null,
    boxSd: null,
    boxBd: null,
    body: null,
    context: null,
    categoryBits: -1,
    maskBits: -1,


    getContext: function() {
        return this.context;
    },

    setContext: function(c) {
        this.context = c;
    },

    addPhysics: function(world) {
        this.boxSd = new b2BoxDef(),
        this.boxBd = new b2BodyDef()
        size = (this.getScreenWidth(window.screenW) + this.getScreenHeight(window.screenH)) / 2;
        this.boxSd.density = 1.0;
        this.boxSd.restitution = 1.0;
        this.boxSd.extents.Set(size / 2, size / 2);          
        if (this.categoryBits != -1) {
            this.boxSd.categoryBits = this.categoryBits;
        }
        if (this.maskBits != -1) {
            this.boxSd.maskBits = this.maskBits;
        }
        this.boxBd.AddShape(this.boxSd);
        this.boxBd.position.Set(this.getScreenX(window.screenW), this.getScreenY(window.screenH));
        this.boxBd.rotation = (-this.angle / 180 * Math.PI);
        this.boxBd.type = b2Body.b2_dynamicBody;
        this.body = world.CreateBody(this.boxBd);
        this.body.m_userData = this.getSessionId();
    },


    getUserData: function() {
        return this.body.m_userData;
    },

    reposition: function() {
        if (this.body != null) {
            this.body.m_position.x = this.getScreenX(window.screenW);
            this.body.m_position.y = this.getScreenY(window.screenH);
            this.body.m_rotation = -this.getAngle() / 180 * Math.PI;
        } else {
            console.warn("You need to add physics to the blob before repositioning.");
        }
    },

    setCollisionFilter: function(c) {
        this.categoryBits = c;
    },

    setCollisionMask: function(m) {
        this.maskBits = m;
    },

    removePhysics: function(world) {
        if (this.body != null) {
            world.DestroyBody(this.body);
        }
    },

    initialize: function(params) {
        Tuio.Container.prototype.initialize.call(this, params);
        if (params.a > this.angle + 5 || params.a < this.angle - 5) {
            this.angle = params.a;
        }
        this.rotationSpeed = 0;
        this.rotationAccel = 0;
        this.w = params.w;
        this.h = params.h;
        this.area = params.ar; 
        this.blobId = params.bi;
    },

    update: function(params) {
        var lastPoint = this.path[this.path.length - 1];
        Tuio.Container.prototype.update.call(this, params);

        if (
            params.hasOwnProperty("rs") &&
            params.hasOwnProperty("ra")) {

            if (params.a > this.angle + 5 || params.a < this.angle - 5) {
                this.angle = params.a;
            }
            this.h = params.h;
            this.w = params.w;
            this.area = params.ar;
            this.rotationSpeed = params.rs;
            this.rotationAccel = params.ra;
        } else {
            var diffTime = this.currentTime.subtractTime(lastPoint.getTuioTime()),
            dt = diffTime.getTotalMilliseconds() / 1000,
            lastAngle = this.angle,
            lastRotationSpeed = this.rotationSpeed;
            if (params.a > this.angle + 5 || params.a < this.angle - 5) {
                this.angle = params.a;
            }
            this.w = params.w;
            this.h = params.h;
            this.area = params.ar;

            var da = (this.angle - lastAngle) / (2 * Math.PI);
            if (da > 0.75) {
                da -= 1;
            } else if (da < -0.75) {
                da += 1;
            }
            
            this.rotationSpeed = da / dt;
            this.rotationAccel = (this.rotationSpeed - lastRotationSpeed) / dt;
        }

        this.updateBlobState();
    },

    updateBlob: function(tblb) {
        Tuio.Container.prototype.updateContainer.call(this, tblb);

        if (params.a > this.angle + 5 || params.a < this.angle - 5) {
            this.angle = tblb.getAngle();
        }
        
        this.rotationSpeed = tblb.getRotationSpeed();
        this.rotationAccel = tblb.getRotationAccel();
        this.w = tblb.getWidth();
        this.h = tblb.getHeight();
        this.area = tblb.getArea();
        
        this.updateBlobState();
    },

    updateBlobState: function() {
        if ((this.rotationAccel !== 0) && (this.state !== Tuio.Blob.TUIO_STOPPED)) {
            this.state = Tuio.Blob.TUIO_ROTATING;
        }
    },

    stop: function(ttime) {
        this.update({
            ttime: ttime,
            xp: this.xPos,
            yp: this.yPos,
            a: this.angle
        });
    },

    getBlobId: function() {
        return this.blobId;
    },

    getAngle: function() {
        return this.angle;
    },

    getAngleDegrees: function() {
        return this.angle / Math.PI * 180;
    },

    getRotationSpeed: function() {
        return this.rotationSpeed;
    },

    getRotationAccel: function() {
        return this.rotationAccel;
    },

    getWidth: function() {
        return this.w / 0.6 / 2;
    },

    getScreenWidth: function() {
        return this.w * window.screenW / 0.6  / 2;
    },

    getHeight: function() {
        return this.h / 0.45 / 2;
    },

    getScreenHeight: function() {
        return this.h * window.screenH / 0.45 / 2 ;
    },

    getArea: function() {
        return this.area;
    },

    getScreenArea: function() {
        return this.w * window.screenW * this.h * window.screenH;
    },

    getCorners: function() {
        x1 = this.getScreenX(window.screenW) + ((Math.cos(this.getAngle() / 180 * Math.PI)) * (this.getScreenWidth(window.screenW) / 2) - Math.sin(this.getAngle() / 180 * Math.PI) * (this.getScreenHeight(window.screenH) / 2));
        y1 = this.getScreenY(window.screenH) - ((Math.sin(this.getAngle() / 180 * Math.PI) * (this.getScreenWidth(window.screenW) / 2)) + (Math.cos(this.getAngle() / 180 * Math.PI)) * (this.getScreenHeight(window.creenH) / 2));

        x2 = this.getScreenX(window.screenW) - ((Math.cos(this.getAngle() / 180 * Math.PI)) * (this.getScreenWidth(window.screenW) / 2) + Math.sin(this.getAngle() / 180 * Math.PI) * (this.getScreenHeight(window.screenH) / 2));
        y2 = this.getScreenY(window.screenH) + ((Math.sin(this.getAngle() / 180 * Math.PI) * (this.getScreenWidth(window.screenW) / 2)) - (Math.cos(this.getAngle() / 180 * Math.PI)) * (this.getScreenHeight(window.screenH) / 2));

        x3 = this.getScreenX(window.screenW) - ((Math.cos(this.getAngle() / 180 * Math.PI)) * (this.getScreenWidth(window.screenW) / 2) - Math.sin(this.getAngle() / 180 * Math.PI) * (this.getScreenHeight(window.screenH) / 2));
        y3 = this.getScreenY(window.screenH) + ((Math.sin(this.getAngle() / 180 * Math.PI) * (this.getScreenWidth(window.screenW) / 2)) + (Math.cos(this.getAngle() / 180 * Math.PI)) * (this.getScreenHeight(window.screenH) / 2));

        x4 = this.getScreenX(window.screenW) + ((Math.cos(this.getAngle() / 180 * Math.PI)) * (this.getScreenWidth(window.screenW) / 2) + Math.sin(this.getAngle() / 180 * Math.PI) * (this.getScreenHeight(window.screenH) / 2));
        y4 = this.getScreenY(window.screenH) - ((Math.sin(this.getAngle() / 180 * Math.PI) * (this.getScreenWidth(window.screenW) / 2)) - (Math.cos(this.getAngle() / 180 * Math.PI)) * (this.getScreenHeight(window.screenH) / 2));
        
        return [x1,y1,x2,y2,x3,y3,x4,y4];
    },

    getSlopes: function() {
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
    },

    isMoving: function() {
        return (
            (this.state === Tuio.Blob.TUIO_ACCELERATING) ||
            (this.state === Tuio.Blob.TUIO_DECELERATING) ||
            (this.state === Tuio.Blob.TUIO_ROTATING)
        );
    }
}, {
    TUIO_ROTATING: 5,
    fromBlob: function(tcur) {
        return new Tuio.Blob({
            si : tcur.getSessionId(),
            bi: tcur.getBlobId(),
            xp: tcur.getX(),
            yp: tcur.getY(),
            a: tcur.getAngle(),
            xs: tcur.getXSpeed(),
            ys: tcur.getYSpeed(),
            rs: tcur.getRotationSpeed(),
            ma: tcur.getMotionAccel(),
            ra: tcur.getRotationAccel(),
            w: tcur.getWidth(),
            h: tcur.getHeight(),
            ar: tcur.getArea()
        });
    }
});
Tuio.Object = Tuio.Container.extend({
    symbolId: null,
    angle: null,
    rotationSpeed: null,
    rotationAccel: null,

    initialize: function(params) {
        Tuio.Container.prototype.initialize.call(this, params);

        this.symbolId = params.sym;
        this.angle = params.a;
        this.rotationSpeed = 0;
        this.rotationAccel = 0;
    },

    update: function(params) {
        var lastPoint = this.path[this.path.length - 1];
        Tuio.Container.prototype.update.call(this, params);

        if (
            params.hasOwnProperty("rs") &&
            params.hasOwnProperty("ra")) {

            this.angle = params.a;
            this.rotationSpeed = params.rs;
            this.rotationAccel = params.ra;
        } else {
            var diffTime = this.currentTime.subtractTime(lastPoint.getTuioTime()),
            dt = diffTime.getTotalMilliseconds() / 1000,
            lastAngle = this.angle,
            lastRotationSpeed = this.rotationSpeed;
            this.angle = params.a;

            var da = (this.angle - lastAngle) / (2 * Math.PI);
            if (da > 0.75) {
                da -= 1;
            } else if (da < -0.75) {
                da += 1;
            }
            
            this.rotationSpeed = da / dt;
            this.rotationAccel = (this.rotationSpeed - lastRotationSpeed) / dt;
        }

        this.updateObjectState();
    },

    updateObject: function(tobj) {
        Tuio.Container.prototype.updateContainer.call(this, tobj);

        this.angle = tobj.getAngle();
        this.rotationSpeed = tobj.getRotationSpeed();
        this.rotationAccel = tobj.getRotationAccel();
        
        this.updateObjectState();
    },

    updateObjectState: function() {
        if ((this.rotationAccel !== 0) && (this.state !== Tuio.Object.TUIO_STOPPED)) {
            this.state = Tuio.Object.TUIO_ROTATING;
        }
    },

    stop: function(ttime) {
        this.update({
            ttime: ttime,
            xp: this.xPos,
            yp: this.yPos,
            a: this.angle
        });
    },

    getSymbolId: function() {
        return this.symbolId;
    },

    getAngle: function() {
        return this.angle;
    },

    getAngleDegrees: function() {
        return this.angle / Math.PI * 180;
    },

    getRotationSpeed: function() {
        return this.rotationSpeed;
    },

    getRotationAccel: function() {
        return this.rotationAccel;
    },

    isMoving: function() {
        return (
            (this.state === Tuio.Object.TUIO_ACCELERATING) ||
            (this.state === Tuio.Object.TUIO_DECELERATING) ||
            (this.state === Tuio.Object.TUIO_ROTATING)
        );
    }
}, {
    TUIO_ROTATING: 5,

    fromObject: function(tobj) {
        return new Tuio.Object({
            xp: tobj.getX(),
            yp: tobj.getY(),
            si: tobj.getSessionID(),
            sym: tobj.getSymbolId(),
            a: tobj.getAngle()
        });
    }
});
Tuio.Client = Tuio.Model.extend({
    host: null,
    socket: null,
    connected: null,
    objectList: null,
    aliveObjectList: null,
    newObjectList: null,
    blobList: null,
    aliveBlobList: null,
    newBlobList: null,
    cursorList: null,
    aliveCursorList: null,
    newCursorList: null,
    frameObjects: null,
    frameCursors: null,
    frameBlobs: null,
    freeCursorList: null,
    maxCursorId: null,
    currentFrame: null,
    currentTime: null,

    initialize: function(params) {
        this.host = params.host;
        this.connected = false;
        this.objectList = {};
        this.aliveObjectList = [];
        this.newObjectList = [];
        this.blobList = {};
        this.aliveBlobList = [];
        this.newBlobList = [];
        this.cursorList = {};
        this.aliveCursorList = [];
        this.newCursorList = [];
        this.frameObjects = [];
        this.frameBlobs = [];
        this.frameCursors = [];
        this.freeCursorList = [];
        this.maxCursorId = -1;
        this.currentFrame = 0;
        this.currentTime = null;

        _.bindAll(this, "onConnect", "acceptBundle", "onDisconnect");
    },

    connect: function() {
        Tuio.Time.initSession();
        this.currentTime = new Tuio.Time();
        this.currentTime.reset();

        this.socket = io.connect(this.host);
        this.socket.on("connect", this.onConnect);
        this.socket.on("disconnect", this.onDisconnect);
    },

    onConnect: function() {
        this.socket.on("osc", this.acceptBundle);
        this.connected = true;
        this.trigger("connect");
    },

    onDisconnect: function() {
        this.connected = false;
        this.trigger("disconnect");
    },

    isConnected: function() {
        return this.connected;
    },

    getTuioObjects: function() {
        return _.clone(this.objectList);
    },

    getTuioBlobs: function() {
        return _.clone(this.blobList);
    },

    getTuioCursors: function() {
        return _.clone(this.cursorList);
    },

    getTuioObject: function(sid) {
        return this.objectList[sid];
    },

    getTuioBlob: function(sid) {
        return this.blobList[sid];
    },

    getTuioCursor: function(sid) {
        return this.cursorList[sid];
    },

    acceptBundle: function(oscBundle) {
        var msg = null;

        for (var i = 0, max = oscBundle.length; i < max; i++) {
            msg = oscBundle[i];
            switch (msg[0]) {
                case "/tuio/2Dobj":
                case "/tuio/2Dcur":
                    this.acceptMessage(msg);
                    break;
                case "/tuio/2Dblb":
                    this.acceptMessage(msg);
                    break;
            }
        }
    },

    acceptMessage: function(oscMessage) {
        var address = oscMessage[0],
        command = oscMessage[1],
        args = oscMessage.slice(2, oscMessage.length);

        switch (address) {
            case "/tuio/2Dobj":
                this.handleObjectMessage(command, args);
                break;
            case "/tuio/2Dcur":
                this.handleCursorMessage(command, args);
                break;
            case "/tuio/2Dblb":
                this.handleBlobMessage(command, args);
                break;
        }
    },

    handleObjectMessage: function(command, args) {
        switch (command) {
            case "set":
                this.objectSet(args);
                break;
            case "alive":
                this.objectAlive(args);
                break;
            case "fseq":
                this.objectFseq(args);
                break;
        }
    },

    handleCursorMessage: function(command, args) {
        switch (command) {
            case "set":
                this.cursorSet(args);
                break;
            case "alive":
                this.cursorAlive(args);
                break;
            case "fseq":
                this.cursorFseq(args);
                break;
        }
    },

    handleBlobMessage: function(command, args) {
        switch (command) {
            case "set":
                this.blobSet(args);
                break;
            case "alive":
                this.blobAlive(args);
                break;
            case "fseq":
                this.blobFseq(args);
                break;
        }
    },

    blobSet: function(args) {       //Ajoute ou met à jour un blob
        var sid = args[0],
        xPos = args[1],
        yPos = args[2],
        angle = args[3],
        width = args[4],
        height = args[5],
        area = args[6],
        xSpeed = args[7],
        ySpeed = args[8],
        rSpeed = args[9],
        mAccel = args[10],
        rAccel = args[11];
        
        if (!_.has(this.blobList,sid)) {        //Si l'id du blob nous est inconnu
            var addBlob = new Tuio.Blob({
                si: sid,
                bi: -1,
                xp: xPos,
                yp: yPos,
                a: angle,
                xs: xSpeed,
                ys: ySpeed,
                rs: rSpeed,
                ma: mAccel,
                ra: rAccel,
                w: width,
                h: height,
                ar: area
            });
            this.frameBlobs.push(addBlob);
        } else {        //Si l'id du blob est déjà connu
            var tblb = this.blobList[sid];
            if (!tblb) {                //Si le blob n'existe pas
                return;
            }
            if (                            //Si le blob a été modifié
                (tblb.xPos !== xPos) ||
                (tblb.yPos !== yPos) ||
                (tblb.angle !== angle) ||
                (tblb.xSpeed !== xSpeed) ||
                (tblb.ySpeed !== ySpeed) ||
                (tblb.rotationSpeed !== rSpeed) ||
                (tblb.motionAccel !== mAccel) ||
                (tblb.rotationAccel !== rAccel) ||
                (tblb.h !== height) ||
                (tblb.w !== width) ||
                (tblb.area !== area)) {

                var updateBlob = new Tuio.Blob({
                    si: sid,
                    bi: -1,
                    xp: xPos,
                    yp: yPos,
                    a: angle,
                    w: width,
                    h: height,
                    ar: area
                });
                updateBlob.update({
                    xp: xPos,
                    yp: yPos,
                    a: angle,
                    xs: xSpeed,
                    ys: ySpeed,
                    rs: rSpeed,
                    ma: mAccel,
                    ra: rAccel,
                    w: width,
                    h: height,
                    ar: area
                });
                this.frameBlobs.push(updateBlob);
            }
        }
        

    },

    blobAlive: function(args) {         //Compare la précédente liste de Alive et la nouvelle et retire les blobs qui n'existent plus
        var removeBlob = null;
        this.newBlobList = args;
        this.aliveBlobList = _.difference(this.aliveBlobList, this.newBlobList);

        for (var i = 0, max = this.aliveBlobList.length; i < max; i++) {
            removeBlob = this.blobList[this.aliveBlobList[i]];
            if (removeBlob) {
                removeBlob.remove(this.currentTime);
                this.frameBlobs.push(removeBlob);
            }
        }
    },

    blobFseq: function(args) {
        var fseq = args[0],
        lateFrame = false,
        tblb = null;

        if (fseq > 0) {
            if (fseq > this.currentFrame) {
                this.currentTime = Tuio.Time.getSessionTime();
            }
            if ((fseq >= this.currentFrame) || ((this.currentFrame - fseq) > 100)) {
                this.currentFrame = fseq;
            } else {
                lateFrame = true;
            }
        } else if (Tuio.Time.getSessionTime().subtractTime(this.currentTime).getTotalMilliseconds() > 100) {
            this.currentTime = Tuio.Time.getSessionTime();
        }

        if (!lateFrame) {
            for (var i = 0, max = this.frameBlobs.length; i < max; i++) {
                tblb = this.frameBlobs[i];
                switch (tblb.getTuioState()) {
                    case Tuio.Blob.TUIO_REMOVED:
                        this.blobRemoved(tblb);
                        break;
                    case Tuio.Blob.TUIO_ADDED:
                        this.blobAdded(tblb);
                        break;
                    default:
                        this.blobDefault(tblb);
                        break;
                }
            }

            this.trigger("refresh", Tuio.Time.fromTime(this.currentTime));

            var buffer = this.aliveBlobList;
            this.BlobList = this.newBlobList;
            this.aliveBlobList = this.newBlobList;
            this.newBlobList = buffer;
        }

        this.frameBlobs = [];
    },

    blobRemoved: function(tblb) {
        var removeBlob = tblb;
        removeBlob.remove(this.currentTime);
        this.trigger("removeTuioBlob", removeBlob);
        delete this.blobList[removeBlob.getSessionId()];
    },

    blobAdded: function(tblb) {
        var addBlob = new Tuio.Blob({
            ttime: this.currentTime,
            si: tblb.getSessionId(),
            bi: tblb.getBlobId(),
            xp: tblb.getX(),
            yp: tblb.getY(),
            a: tblb.getAngle(),
            xs: tblb.getXSpeed(),
            ys: tblb.getYSpeed(),
            rs: tblb.getRotationSpeed(),
            ma: tblb.getMotionAccel(),
            ra: tblb.getRotationAccel(),
            w: tblb.getWidth(),
            h: tblb.getHeight(),
            ar: tblb.getArea()
        });
        this.blobList[addBlob.getSessionId()] = addBlob;
        this.trigger("addTuioBlob", addBlob);
    },

    blobDefault: function(tblb) {
        var updateBlob = this.blobList[tblb.getSessionId()];
        if (
            (tblb.getX() !== updateBlob.getX() && tblb.getXSpeed() === 0) ||
            (tblb.getY() !== updateBlob.getY() && tblb.getYSpeed() === 0)) {

            updateBlob.update({
                ttime: this.currentTime,
                xp: tblb.getX(),
                yp: tblb.getY(),
                a: tblb.getAngle(),
                w: tblb.getHeight(),
                h: tblb.getWidth(),
                ar: tblb.getArea()
            });
        } else {
            updateBlob.update({
                ttime: this.currentTime,
                xp: tblb.getX(),
                yp: tblb.getY(),
                a: tblb.getAngle(),
                xs: tblb.getXSpeed(),
                ys: tblb.getYSpeed(),
                rs: tblb.getRotationSpeed(),
                ma: tblb.getMotionAccel(),
                ra: tblb.getRotationAccel(),
                w: tblb.getWidth(),
                h: tblb.getHeight(),
                ar: tblb.getArea()
            });
        }
        
        this.trigger("updateTuioBlob", updateBlob);
    },

    objectSet: function(args) {
        var sid = args[0],
        cid = args[1],
        xPos = args[2],
        yPos = args[3],
        angle = args[4],
        xSpeed = args[5],
        ySpeed = args[6],
        rSpeed = args[7],
        mAccel = args[8],
        rAccel = args[9];

       if (!_.has(this.objectList, sid)) {
            var addObject = new Tuio.Object({
                si: sid,
                sym: cid,
                xp: xPos,
                yp: yPos,
                a: angle
            });
            this.frameObjects.push(addObject);
        } else {
            var tobj = this.objectList[sid];
            if (!tobj) {
                return;
            }
            if (
                (tobj.xPos !== xPos) ||
                (tobj.yPos !== yPos) ||
                (tobj.angle !== angle) ||
                (tobj.xSpeed !== xSpeed) ||
                (tobj.ySpeed !== ySpeed) ||
                (tobj.rotationSpeed !== rSpeed) ||
                (tobj.motionAccel !== mAccel) ||
                (tobj.rotationAccel !== rAccel)) {

                var updateObject = new Tuio.Object({
                    si: sid,
                    sym: cid,
                    xp: xPos,
                    yp: yPos,
                    a: angle
                });
                updateObject.update({
                    xp: xPos,
                    yp: yPos,
                    a: angle,
                    xs: xSpeed,
                    ys: ySpeed,
                    rs: rSpeed,
                    ma: mAccel,
                    ra: rAccel
                });
                this.frameObjects.push(updateObject);
            }
        }
    },

    objectAlive: function(args) {
        var removeObject = null;
        this.newObjectList = args;
        this.aliveObjectList = _.difference(this.aliveObjectList, this.newObjectList);

        for (var i = 0, max = this.aliveObjectList.length; i < max; i++) {
            removeObject = this.objectList[this.aliveObjectList[i]];
            if (removeObject) {
                removeObject.remove(this.currentTime);
                this.frameObjects.push(removeObject);
            }
        }
    },

    objectFseq: function(args) {
        var fseq = args[0],
        lateFrame = false,
        tobj = null;

        if (fseq > 0) {
            if (fseq > this.currentFrame) {
                this.currentTime = Tuio.Time.getSessionTime();
            }
            if ((fseq >= this.currentFrame) || ((this.currentFrame - fseq) > 100)) {
                this.currentFrame = fseq;
            } else {
                lateFrame = true;
            }
        } else if (Tuio.Time.getSessionTime().subtractTime(this.currentTime).getTotalMilliseconds() > 100) {
            this.currentTime = Tuio.Time.getSessionTime();
        }

        if (!lateFrame) {
            for (var i = 0, max = this.frameObjects.length; i < max; i++) {
                tobj = this.frameObjects[i];
                switch (tobj.getTuioState()) {
                    case Tuio.Object.TUIO_REMOVED:
                        this.objectRemoved(tobj);
                        break;
                    case Tuio.Object.TUIO_ADDED:
                        this.objectAdded(tobj);
                        break;
                    default:
                        this.objectDefault(tobj);
                        break;
                }
            }

            this.trigger("refresh", Tuio.Time.fromTime(this.currentTime));

            var buffer = this.aliveObjectList;
            this.aliveObjectList = this.newObjectList;
            this.newObjectList = buffer;
        }

        this.frameObjects = [];
    },

    objectRemoved: function(tobj) {
        var removeObject = tobj;
        removeObject.remove(this.currentTime);
        this.trigger("removeTuioObject", removeObject);
        delete this.objectList[removeObject.getSessionId()];
    },

    objectAdded: function(tobj) {
        var addObject = new Tuio.Object({
            ttime: this.currentTime,
            si: tobj.getSessionId(),
            sym: tobj.getSymbolId(),
            xp: tobj.getX(),
            yp: tobj.getY(),
            a: tobj.getAngle()
        });
        this.objectList[addObject.getSessionId()] = addObject;
        this.trigger("addTuioObject", addObject);
    },

    objectDefault: function(tobj) {
        var updateObject = this.objectList[tobj.getSessionId()];
        if (
            (tobj.getX() !== updateObject.getX() && tobj.getXSpeed() === 0) ||
            (tobj.getY() !== updateObject.getY() && tobj.getYSpeed() === 0)) {

            updateObject.update({
                ttime: this.currentTime,
                xp: tobj.getX(),
                yp: tobj.getY(),
                a: tobj.getAngle()
            });
        } else {
            updateObject.update({
                ttime: this.currentTime,
                xp: tobj.getX(),
                yp: tobj.getY(),
                a: tobj.getAngle(),
                xs: tobj.getXSpeed(),
                ys: tobj.getYSpeed(),
                rs: tobj.getRotationSpeed(),
                ma: tobj.getMotionAccel(),
                ra: tobj.getRotationAccel()
            });
        }
        
        this.trigger("updateTuioObject", updateObject);
    },

    cursorSet: function(args) {
        var sid = args[0],
        xPos = args[1],
        yPos = args[2],
        xSpeed = args[3],
        ySpeed = args[4],
        mAccel = args[5];

        if (!_.has(this.cursorList, sid)) {
            var addCursor = new Tuio.Cursor({
                si: sid,
                ci: -1,
                xp: xPos,
                yp: yPos
            });
            this.frameCursors.push(addCursor);
        } else {
            var tcur = this.cursorList[sid];
            if (!tcur) {
                return;
            }
            if (
                (tcur.xPos !== xPos) ||
                (tcur.yPos !== yPos) ||
                (tcur.xSpeed !== xSpeed) ||
                (tcur.ySpeed !== ySpeed) ||
                (tcur.motionAccel !== mAccel)) {

                var updateCursor = new Tuio.Cursor({
                    si: sid,
                    ci: tcur.getCursorId(),
                    xp: xPos,
                    yp: yPos
                });
                updateCursor.update({
                    xp: xPos,
                    yp: yPos,
                    xs: xSpeed,
                    ys: ySpeed,
                    ma: mAccel
                });
                this.frameCursors.push(updateCursor);
            }
        }
    },

    cursorAlive: function(args) {
        var removeCursor = null;
        this.newCursorList = args;
        this.aliveCursorList = _.difference(this.aliveCursorList, this.newCursorList);

        for (var i = 0, max = this.aliveCursorList.length; i < max; i++) {
            removeCursor = this.cursorList[this.aliveCursorList[i]];
            if (removeCursor) {
                removeCursor.remove(this.currentTime);
                this.frameCursors.push(removeCursor);
            }
        }
    },

    cursorFseq: function(args) {
        var fseq = args[0],
        lateFrame = false,
        tcur = null;

        if (fseq > 0) {
            if (fseq > this.currentFrame) {
                this.currentTime = Tuio.Time.getSessionTime();
            }
            if ((fseq >= this.currentFrame) || ((this.currentFrame - fseq) > 100)) {
                this.currentFrame = fseq;
            } else {
                lateFrame = true;
            }
        } else if (Tuio.Time.getSessionTime().subtractTime(this.currentTime).getTotalMilliseconds() > 100) {
            this.currentTime = Tuio.Time.getSessionTime();
        }

        if (!lateFrame) {
            for (var i = 0, max = this.frameCursors.length; i < max; i++) {
                tcur = this.frameCursors[i];
                switch (tcur.getTuioState()) {
                    case Tuio.Cursor.TUIO_REMOVED:
                        this.cursorRemoved(tcur);
                        break;
                    case Tuio.Cursor.TUIO_ADDED:
                        this.cursorAdded(tcur);
                        break;
                    default:
                        this.cursorDefault(tcur);
                        break;
                }
            }

            this.trigger("refresh", Tuio.Time.fromTime(this.currentTime));

            var buffer = this.aliveCursorList;
            this.aliveCursorList = this.newCursorList;
            this.newCursorList = buffer;
        }

        this.frameCursors = [];
    },

    cursorRemoved: function(tcur) {
        var removeCursor = tcur;
        removeCursor.remove(this.currentTime);

        this.trigger("removeTuioCursor", removeCursor);

        delete this.cursorList[removeCursor.getSessionId()];

        if (removeCursor.getCursorId() === this.maxCursorId) {
            this.maxCursorId = -1;
            if (_.size(this.cursorList) > 0) {
                var maxCursor = _.max(this.cursorList, function(cur) {
                    return cur.getCursorId();
                });
                if (maxCursor.getCursorId() > this.maxCursorId) {
                    this.maxCursorId = maxCursor.getCursorId();
                }

                this.freeCursorList = _.without(this.freeCursorList, function(cur) {
                    return cur.getCursorId() >= this.maxCursorId;
                });
            } else {
                this.freeCursorList = [];
            }
        } else if (removeCursor.getCursorId() < this.maxCursorId) {
            this.freeCursorList.push(removeCursor);
        }
    },

    cursorAdded: function(tcur) {
        var cid = _.size(this.cursorList),
        testCursor = null;

        if ((cid <= this.maxCursorId) && (this.freeCursorList.length > 0)) {
            var closestCursor = this.freeCursorList[0];
            for (var i = 0, max = this.freeCursorList.length; i < max; i++) {
                testCursor = this.freeCursorList[i];
                if (testCursor.getDistanceToPoint(tcur) < closestCursor.getDistanceToPoint(tcur)) {
                    closestCursor = testCursor;
                }
            }
            cid = closestCursor.getCursorId();
            this.freeCursorList = _.without(this.freeCursorList, function(cur) {
                return cur.getCursorId() === cid;
            });
        } else {
            this.maxCursorId = cid;
        }

        var addCursor = new Tuio.Cursor({
            ttime: this.currentTime,
            si: tcur.getSessionId(),
            ci: cid,
            xp: tcur.getX(),
            yp: tcur.getY()
        });
        this.cursorList[addCursor.getSessionId()] = addCursor;

        this.trigger("addTuioCursor", addCursor);
    },

    cursorDefault: function(tcur) {
        var updateCursor = this.cursorList[tcur.getSessionId()];
        if (
            (tcur.getX() !== updateCursor.getX() && tcur.getXSpeed() === 0) ||
            (tcur.getY() !== updateCursor.getY() && tcur.getYSpeed() === 0)) {

            updateCursor.update({
                ttime: this.currentTime,
                xp: tcur.getX(),
                yp: tcur.getY()
            });
        } else {
            updateCursor.update({
                ttime: this.currentTime,
                xp: tcur.getX(),
                yp: tcur.getY(),
                xs: tcur.getXSpeed(),
                ys: tcur.getYSpeed(),
                ma: tcur.getMotionAccel()
            });
        }
        
        this.trigger("updateTuioCursor", updateCursor);
    }
});
