WL.registerComponent(
  "spawner",
  {
    Obj1: { type: WL.Type.Object, default: null },
  },
  {
    init: function () {
      // let bookstore = WL.scene.addObject(this.object);
      // for (let component of this.Obj1.getComponents()) {
      //   bookstore.addComponent(component.type, component);
      // }
      // bookstore.rotationWorld = this.object.rotationWorld;
      // bookstore.translationWorld = this.object.translationWorld;
      // console.log(bookstore);
    },
    start: function () {
      WL.scene
        .append("/models/meshtest4.glb")
        .then((obj) => {
          obj.scale([1, 1, 1]);
          console.log("loaded obj ", obj);
          obj.transformWorld = this.object.transformWorld;
          obj.rotationWorld = this.object.rotationWorld;
        })
        .catch((error) => {
          console.error("Failed to load GLB file:", error);
        });
    },
    update: function (dt) {},
  }
);
