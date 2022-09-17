WL.registerComponent(
  "input-broadcaster",
  {
    param: { type: WL.Type.Float, default: 1.0 },
  },
  {
    init: function () {
      this.thumbstickcbs = [];
      this.triggercbs = [];
    },
    start: function () {
      this.input = this.object.getComponent("input");
      this.oldAxes = [0, 0, 0, 0];
      this.old0 = { pressed: false, touched: false, value: 0 };
      this.old1 = { pressed: false, touched: false, value: 0 };
      this.old3 = { pressed: false, touched: false, value: 0 };
      this.old4 = { pressed: false, touched: false, value: 0 };
      this.old5 = { pressed: false, touched: false, value: 0 };
    },
    update: function (dt) {
      let newAxes = this.input.xrInputSource.gamepad.axes;

      let new0 = this.input.xrInputSource.gamepad.buttons[0];
      // let new1 = this.input.xrInputSource.gamepad.buttons[1];
      // let new3 = this.input.xrInputSource.gamepad.buttons[3];
      // let new4 = this.input.xrInputSource.gamepad.buttons[4];
      // let new5 = this.input.xrInputSource.gamepad.buttons[5];

      if (newAxes !== this.oldAxes) {
        this.ReportChange(this.thumbstickcbs, "onThumbstickChanged", newAxes);
        this.oldAxes = newAxes;
      }

      if (!this.Equals(new0, this.old0)) {
        this.ReportChange(this.triggercbs, "onTriggerChanged", new0);
        this.Copy(this.old0, new0);
      }

      //   if (!this.Equals(new1, this.old1)) {
      //     console.log("Grip Changed", new1);
      //     this.Copy(this.old1, new1);
      //   }

      //   if (!this.Equals(new3, this.old3)) {
      //     console.log("StickBtn Changed", new3);
      //     this.Copy(this.old3, new3);
      //   }

      //   if (!this.Equals(new4, this.old4)) {
      //     console.log("A Changed", new4);
      //     this.Copy(this.old4, new4);
      //   }

      //   if (!this.Equals(new5, this.old5)) {
      //     console.log("B Changed", new5);
      //     this.Copy(this.old5, new5);
      //   }
    },

    Equals: function (oldBtn, newBtn) {
      return (
        oldBtn.pressed === newBtn.pressed &&
        oldBtn.touched === newBtn.touched &&
        oldBtn.value === newBtn.value
      );
    },

    Copy: function (oldBtn, newBtn) {
      oldBtn.pressed = newBtn.pressed;
      oldBtn.touched = newBtn.touched;
      oldBtn.value = newBtn.value;
    },

    ReportChange: function (subscribers, callback, change) {
      for (let sub of subscribers) {
        sub[callback](change);
      }
    },

    SubscribeTo: function (inputtype, component) {
      if (inputtype === "thumbstick") {
        this.thumbstickcbs.push(component);
      }
      if (inputtype === "trigger") {
        this.triggercbs.push(component);
      }
    },
  }
);

// [0] : Trigger, [1]: Grip, [3]: StickBtn, [4]: A, [5]: B
