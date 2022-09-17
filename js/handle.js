WL.registerComponent(
  "handle",
  {
    LeftHand: { type: WL.Type.Object, default: null },
    RightHand: { type: WL.Type.Object, default: null },
    Car: { type: WL.Type.Object, default: null },
  },
  {
    init: function () {
      this.rightHandGrabbed = false;
      this.leftHandGrabbed = false;
      this.rightgrab = null;
      this.leftgrab = null;
      this.midpoint = null;
      this.rightHandPos = new Float32Array(3);
      this.leftHandPos = new Float32Array(3);
      this.lastRotationDeg = 0;
    },

    onXRSessionStart: function (session) {
      session.addEventListener("squeezestart", this.onSqueezeDown.bind(this));
      session.addEventListener("squeezeend", this.onSqueezeUp.bind(this));
    },

    start: function () {
      WL.onXRSessionStart.push(this.onXRSessionStart.bind(this));
      this.carComponent = this.Car.getComponent("car");
    },
    update: function (dt) {
      if (this.leftHandGrabbed && this.rightHandGrabbed) {
        this.RightHand.getTranslationLocal(this.rightHandPos);
        this.LeftHand.getTranslationLocal(this.leftHandPos);

        let leftrelativeX = this.Clamp(
          this.leftHandPos[0] - this.midpoint.x,
          Number.NEGATIVE_INFINITY,
          -0.0001
        );
        let leftrelativeY = this.leftHandPos[1] - this.midpoint.y;
        let rightrelativeX = this.Clamp(
          this.rightHandPos[0] - this.midpoint.x,
          0.0001,
          Number.POSITIVE_INFINITY
        );
        let rightrelativeY = this.rightHandPos[1] - this.midpoint.y;
        let angleLeft = this.CalcAngleDeg(leftrelativeX, leftrelativeY);
        let angleRight = this.CalcAngleDeg(rightrelativeX, rightrelativeY);
        let ang = (angleRight + angleLeft) / 2;

        this.object.rotateAxisAngleDegObject(
          [0, 1, 0],
          ang - this.lastRotationDeg
        );
        this.lastRotationDeg = ang;

        this.carComponent.turn(ang);
      }
    },

    onSqueezeDown: function (evt) {
      this.grabWheel(evt.inputSource.handedness);
    },
    onSqueezeUp: function (evt) {
      this.releaseWheel(evt.inputSource.handedness);
    },

    Midpoint: function (vec1, vec2) {
      let x = (vec1.x + vec2.x) / 2;
      let y = (vec1.y + vec2.y) / 2;
      return { x: x, y: y };
    },

    Clamp: function (num, min, max) {
      return Math.min(Math.max(num, min), max);
    },

    CalcAngleDeg: function (x, y) {
      let rad = Math.atan(y / x);
      return rad * (180 / Math.PI);
    },

    grabWheel: function (hand) {
      if (!hand) return;
      if (hand === "right") {
        this.rightHandGrabbed = true;
      }
      if (hand === "left") {
        this.leftHandGrabbed = true;
      }

      if (this.leftHandGrabbed && this.rightHandGrabbed) {
        this.RightHand.getTranslationLocal(this.rightHandPos);
        this.LeftHand.getTranslationLocal(this.leftHandPos);
        this.rightgrab = {
          x: this.rightHandPos[0],
          y: this.rightHandPos[1],
        };
        this.leftgrab = {
          x: this.leftHandPos[0],
          y: this.leftHandPos[0],
        };
        this.midpoint = this.Midpoint(this.leftgrab, this.rightgrab);
        console.log(
          "Both hands on wheel! rh: ",
          this.rightgrab,
          " lh: ",
          this.leftgrab
        );
      }
    },

    releaseWheel: function (hand) {
      if (!hand) return;
      if (hand === "right") {
        this.rightHandGrabbed = false;
      }
      if (hand === "left") {
        this.leftHandGrabbed = false;
      }
    },
  }
);
