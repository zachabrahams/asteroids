(function () {
    if (typeof window.Asteroids === "undefined" ) {
        window.Asteroids = {};
      }

    var Ship = Asteroids.Ship = function (options) {
        if (options.game.DIM_X/60 < 12) {
          options.radius = 12;
        } else {
          options.radius = options.game.DIM_X/60;
        }
        options.color =  new Color(Ship.COLOR);
        Asteroids.MovingObject.call(this, options);
        this.angle = Ship.START_ANGLE;
        this.innerColor = new Color(Ship.INNER_COLOR);
        this.dying = false;
        this.lives = 5;
    };

    Ship.START_ANGLE = 3*(Math.PI/2);
    Ship.COLOR = "#9163b6";
    Ship.INNER_COLOR = "#a17ac1";


    Asteroids.Util.inherits.call(Ship, Asteroids.MovingObject);

    Ship.prototype.draw = function (ctx) {
      Asteroids.MovingObject.prototype.draw.call(this, ctx);

      ctx.save();
      ctx.translate(this.pos[0], this.pos[1]);
      ctx.rotate(this.angle)

      ctx.fillStyle = this.innerColor.value;
      ctx.beginPath();

      ctx.arc(
        0,
        0,
        this.radius - 2,
        Math.PI,
        2 * Math.PI,
        false
      );

      ctx.fill();
      ctx.restore();
    };

    Ship.prototype.relocate = function () {
        this.pos = this.game.randomPosition();
        this.vel = 0;
    };

    Ship.prototype.rotate = function (rad) {
      this.angle = (this.angle + rad) % (Math.PI*2);
    }

    Ship.prototype.power = function (impulse) {
        if (Math.abs(this.vel + impulse) < Asteroids.Game.MAX_VEL) {
          this.vel += impulse;
        }
    };

    Ship.prototype.fireBullet = function () {
      if (this.game.bulletCounter === 0 && this.game.bullets.length < 10) {
        this.game.bullets.push(new Asteroids.Bullet( {
            vel: ((Math.abs(this.vel)+1) *2),
            pos: this.pos.slice(),
            game: this.game,
            radius: 3,
            angle: this.angle
        }));
        this.game.bulletCounter = 10;
      }
    };

    Ship.prototype.decelerate = function () {
      this.vel = Ship.decelerateComp(this.vel);
    };

    Ship.decelerateComp = function (velComp) {
      if (velComp === 0) {
        return 0;
      }
      return  (-0.2 * (velComp/(Math.abs(velComp)))) + velComp;
    };

    Ship.prototype.takeHit = function () {
      this.lives--;
      this.game.hud.loseLife();
      this.dying = true;
      this.animateDeath();
    };

    Ship.prototype.animateDeath = function () {
      Animations.changeSize({
        obj: this,
        change: 1,
        frames: 30,
        callback: this.animateImplosion.bind(this)
      });
    };

    Ship.prototype.animateImplosion = function () {
      Animations.changeSize({
        obj: this,
        change: -2,
        frames: 20,
        callback: this.die.bind(this)
      });
    };

    Ship.prototype.die = function () {
      if (this.lives <= 0) {
        delete this.game.ship;
      } else {
        this.dying = false;
        if (this.game.DIM_X/60 < 12) {
          this.radius = 12;
        } else {
          this.radius = this.game.DIM_X/60;
        }
        this.relocate();
      }
    };


})();
