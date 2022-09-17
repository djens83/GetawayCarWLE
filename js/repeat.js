WL.registerComponent(
  "repeat",
  {
    player: { type: WL.Type.Object, default: null },
    interval: { type: WL.Type.Int, default: 100 },
    triggerDistance: { type: WL.Type.Int, default: 60 },
  },
  {
    init: function () {
      this.tempPosition = new Float32Array(3);
      this.tempPosition2 = new Float32Array(3);
      this.objects = this.object.children;
      this.indOfLast = 0;
      this.xOfLast = Number.NEGATIVE_INFINITY;
      this.SetLastObject();
      console.log("found last road to be ", this.objects[this.indOfLast].name);
    },
    start: function () {
      if (this.player == null) {
        console.warn("No player set in repeater!");
        return;
      }
      console.log("num objects ", this.objects.length);
    },
    update: function (dt) {
      if (this.player == null) return;

      this.player.getTranslationWorld(this.tempPosition2);
      this.objects[this.indOfLast].getTranslationWorld(this.tempPosition);

      let distToPlayer = Math.abs(this.tempPosition[0] - this.tempPosition2[0]);

      if (distToPlayer < this.triggerDistance) {
        console.log("Repeater has been triggered... Move first obj");
        this.MoveFirstRoad();
      }
    },

    SetLastObject() {
      for (let ind in this.objects) {
        this.objects[ind].getTranslationWorld(this.tempPosition);
        if (this.tempPosition[0] > this.xOfLast) {
          this.indOfLast = ind;
          this.xOfLast = this.tempPosition[0];
        }
      }
    },

    GetFirstRoad: function () {
      console.log("finding first road");
      let firstInd = 0;
      let xOfFirst = Number.POSITIVE_INFINITY;
      for (let ind in this.objects) {
        this.objects[ind].getTranslationWorld(this.tempPosition);
        console.log(this.tempPosition[0], xOfFirst);
        if (this.tempPosition[0] < xOfFirst) {
          console.log("updating fisrt to be ", firstInd);
          firstInd = ind;
          xOfFirst = this.tempPosition[0];
        }
      }
      console.log("first road is ", this.objects[firstInd].name);
      return this.objects[firstInd];
    },

    MoveFirstRoad: function () {
      let first = this.GetFirstRoad();
      console.log(first);
      first.getTranslationWorld(this.tempPosition);
      console.log(
        "moving first road from ",
        this.tempPosition[0],
        " to ",
        this.tempPosition[0] + this.interval * this.objects.length
      );

      first.translate([this.interval * this.objects.length, 0, 0]);
      this.SetLastObject();
    },
  }
);
