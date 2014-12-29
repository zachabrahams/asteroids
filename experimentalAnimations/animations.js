var AnimationView = function (ctx) {
  this.objects = [];
  this.ctx = ctx;
  setInterval(this.step.bind(this), 15);
};

AnimationView.prototype.step = function () {
  var aniView = this;
  aniView.ctx.clearRect(0, 0,  500, 500)
  for (var i=0; i < this.objects.length; i++) {
    var object = this.objects[i];
    object.currAnimations.forEach (function (animation) {
      animation.call(object);
    });
    object.draw(aniView.ctx);
    object.currAnimations = object.nextAnimations;
    object.nextAnimations = [];
  }
};


var Animations = {};

Animations.changeBright = function (obj, change, frames, callback) {
  var _changeBright = function _changeBright () {
    obj.color.brighten(change);
    if (frames > 0) {
      frames -= 1;
      obj.nextAnimations.push(_changeBright);
    } else {
      callback && callback();
    }
  };

  obj.nextAnimations.push(_changeBright);
};

Animations.pulse = function (obj, change, frames, callback) {
  var darkenFrames = frames;
  var darkenChange = change * -1;
  Animations.changeBright(obj, change, frames, function () {
    Animations.changeBright(obj, darkenChange, darkenFrames, callback);
  });
};

Animations.changeSize = function (obj, change, frames, callback) {
  var _changeSize = function _changeSize () {
    if (obj.radius + change > 0) {
      obj.radius += change;
    }
    if (frames > 0) {
      frames -= 1;
      obj.nextAnimations.push(_changeSize);
    } else {
      callback && callback();
    }
  };

  obj.nextAnimations.push(_changeSize);
};

Animations.sizePulse = function (obj, change, frames, callback) {
  var secondFrames = frames;
  var secondChange = change * -1;
  Animations.changeSize(obj, change, frames, function () {
    Animations.changeSize(obj, secondChange, secondFrames, callback);
  });
};



var Circle = function (options){
  this.pos = options.pos;
  this.color = options.color || new Color(Circle.COLOR);
  this.radius = options.radius || Circle.RADIUS;
  this.currAnimations = [];
  this.nextAnimations = [];
};

Circle.COLOR = "#40aa40";
Circle.RADIUS = 40;

Circle.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color.value;

  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
  ctx.stroke();

};