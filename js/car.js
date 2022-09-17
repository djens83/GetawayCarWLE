WL.registerComponent(
  "car",
  {
    friction: { type: WL.Type.Float, default: 0.02 },
    turnSensitivity: { type: WL.Type.Float, default: 0.02 },
    power: { type: WL.Type.Float, default: 0.001 },
    terminalVelocity: { type: WL.Type.Float, default: 1.32 },
    inputObject: { type: WL.Type.Object, default: null },
  },
  {
    init: function () {
      this.throttle = 0;
      this.thrust = 0;
      this.disabled = false;
      this.running = false;
      this.turntarget = 0;
      this.velocity = 0;
      this.invicible = false;
      this.tireSquealThrottle = 35;
      this.initPos = new Float32Array(3);
      this.forward = new Float32Array(3);
      this.translateVector = new Float32Array(3);
      this.object.getTranslationWorld(this.initPos);
      this.startingX = this.initPos[0];
      this.initRot = { x: 0, y: -90, z: 0 };
      this.capVelocity = false;
      this.VELOCITY_CAP = 0.05;
      this.metersDriven = 0;

      //this.speedometer = document.getElementById("speedometer");
      this.IDLE_RATE = 1;
      this.IDLE_VOL = 0.3;
      //this.pointCounter = document.getElementById("point-counter");

      this.D_VOL = 0.01;
      this.D_RATE = 0.005;

      // setInterval(() => {
      //   this.UpdateDashboard();
      // }, 500);
    },

    start: function () {
      this.inputObject
        .getComponent("input-broadcaster")
        .SubscribeTo("trigger", this);
    },

    update: function (dt) {
      //if (!this.running) return;
      // if (this.disabled && !AudioControls.sounds.carBeep.isPlaying) {
      //   AudioControls.sounds.carBeep.play();
      // }
      this.ApplyThrust(dt);
      this.ApplyFriction();
      this.ApplyRotation();
      this.Move();
    },

    onTriggerChanged: function (evt) {
      //if (!this.running) return;
      //if (this.disabled) return;

      let mulitplier = Math.floor(evt.value * 100);
      //this.SetEngineSound(mulitplier);
      // if (Math.abs(this.throttle - mulitplier) > this.tireSquealThrottle) {
      //   AudioControls.sounds.tireSqueal.play();
      // }
      this.throttle = mulitplier;
    },

    // UpdateDashboard: function () {
    //   let meters = Math.floor(this.el.object3D.position.x - this.startingX);
    //   this.speedometer.setAttribute(
    //     "text",
    //     "value",
    //     `${Math.floor(MapRange(1.33, 100, this.velocity.toFixed(3)))}mph`
    //   );
    //   this.pointCounter.setAttribute("text", "value", `${meters} meters`);
    //   if (meters > GameEvents.nextLevelMilage) {
    //     GameEvents.IncreaseDifficulty();
    //   }
    // },

    // Crash: function () {
    //   if (this.invicible) return;
    //   if (!this.disabled) {
    //     this.disable_car();

    //     setTimeout(() => {
    //       this.enable_car();
    //     }, 3000);
    //   }
    // },

    // SwellEngine: function () {
    //   let mult = 0.2;
    //   let rising = true;
    //   let interval = setInterval(() => {
    //     this.SetEngineSound(Math.floor(mult * 100));

    //     if (rising) {
    //       mult += 0.07;
    //       if (mult >= 1) rising = false;
    //     } else {
    //       mult -= 0.03;
    //       if (mult <= 0) clearInterval(interval);
    //     }
    //   }, 35);
    // },

    // SetEngineSound: function (mulitplier) {
    //   if (!AudioControls || !AudioControls.sounds.carEngine) return;
    //   let sound = AudioControls.sounds.carEngine;
    //   sound.setPlaybackRate(this.IDLE_RATE + this.D_RATE * mulitplier);
    //   sound.setVolume(this.IDLE_VOL + this.D_VOL * mulitplier);
    // },

    StartCar: function () {
      //audioControls.sounds.pass.play();
      if (this.running) return;

      //AudioControls.sounds.carIgnition.play();
      this.running = true;
      this.disabled = true;
      // document
      //   .getElementById("robber-counter")
      //   .setAttribute("text", "opacity", 1);

      setTimeout(() => {
        //GameEvents.Start();
        this.enable_car();
      }, 2500);

      setTimeout(() => {
        //AudioControls.sounds.carEngine.play();
        //this.SwellEngine();
      }, 570);
    },

    Move: function () {
      this.object.getForward(this.forward);
      glMatrix.vec3.scale(
        this.translateVector,
        this.forward,
        this.velocity * -1
      );
      this.object.translateWorld(this.translateVector);
    },

    turn: function (angle) {
      this.turntarget = angle;
    },

    // Reset: function () {
    //   this.el.object3D.position.setX(this.initPos.x);
    //   this.el.object3D.position.setY(this.initPos.y);
    //   this.el.object3D.position.setZ(this.initPos.z);

    //   this.el.setAttribute(
    //     "rotation",
    //     `${this.initRot.x} ${this.initRot.y} ${this.initRot.z}`
    //   );
    // },

    ApplyThrust: function (deltaTime) {
      //console.log(this.throttle, this.power, deltaTime);
      let thrust = this.throttle * this.power * deltaTime;

      if (this.capVelocity)
        this.velocity = Math.min(this.VELOCITY_CAP, this.velocity + thrust);
      else
        this.velocity = Math.min(this.velocity + thrust, this.terminalVelocity);
    },

    ApplyFriction: function () {
      this.velocity = this.lerp(
        0,
        this.velocity,
        this.friction - this.velocity * 0.01
      );
    },

    enable_car: function () {
      if (GameEvents.gameOver || !GameEvents.started) return;
      this.disabled = false;

      document
        .getElementById("robber-counter")
        .setAttribute("text", "value", "DRIVE!");
      document
        .getElementById("robber-counter")
        .setAttribute("text", "color", "green");

      if (AudioControls.sounds.carBeep.isPlaying)
        AudioControls.sounds.carBeep.stop();
      AudioControls.sounds.clickUp.play();
      this.invicible = true;
      setTimeout(() => {
        this.invicible = false;
      }, 2000);
    },

    disable_car: function () {
      this.disabled = true;
      document
        .getElementById("robber-counter")
        .setAttribute("text", "value", "STANDBY");
      document
        .getElementById("robber-counter")
        .setAttribute("text", "color", "red");

      this.throttle = 0;
      this.SetEngineSound(0);
      AudioControls.sounds.tireSqueal.play();
    },

    ApplyRotation: function () {
      if (this.velocity <= this.MIN_VELOCITY) return;
      this.object.rotateAxisAngleDegObject(
        [0, 1, 0],
        this.turntarget * this.turnSensitivity * this.velocity
      );
    },

    StopCar: function () {
      this.disable_car();
      this.velocity = 0;
      AudioControls.sounds.carEngine.pause();
      this.running = false;
    },

    lerp: function (x, y, t) {
      return x * t + y * (1 - t);
    },
  }
);
