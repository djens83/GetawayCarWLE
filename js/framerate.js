WL.registerComponent(
  "framerate",
  {
    param: { type: WL.Type.Float, default: 1.0 },
  },
  {
    init: function () {
      //console.log('init() with param', this.param);
      this.fps = 0;
      this.lastDisplayedFps = -1;
      this.frames = 0;
      this.startTime = (window.performance || Date).now();
      this.interval = setInterval(() => this.updateDisplay(), 500);
    },
    start: function () {
      //console.log('start() with param', this.param);
    },

    updateDisplay: function () {
      let textComp = this.object.getComponent("text");
      textComp.text = this.fps.toString();
    },

    update: function (dt) {
      //console.log('update() with delta time', dt);

      this.frames++;
      //console.log((window.performance || Date).now() - this.startTime);
      if ((window.performance || Date).now() - this.startTime > 1000) {
        this.fps = this.frames;
        this.startTime = (window.performance || Date).now();
        this.frames = 0;
      }
    },
  }
);
