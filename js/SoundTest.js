WL.registerComponent(
  "SoundTest",
  {
    param: { type: WL.Type.Float, default: 1.0 },
  },
  {
    init: function () {},
    start: function () {
      //   this.sound = this.object.getComponent("howler-audio-source");
      //   console.log(this.sound.audio);
      //   this.sound.audio._rate = 3;
      //this.sound.audio.rate(2.0, this.sound._id);
      //this.sound.audio.stop();
      //let rateret = this.sound.audio.rate(2.0, this.sound._id);
      //console.log(rateret);
    },
    update: function (dt) {},
  }
);
