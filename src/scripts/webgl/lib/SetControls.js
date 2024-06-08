import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class SetControls {
  constructor(stage, gui) {
    this.controls = null;
    this.controls = new OrbitControls(stage.camera, stage.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.enabled = true;
    this.controls.dampingFactor = 0.2;

    this.gui = gui;
  }

  addGui() {
    if (this.gui) {
      const controls = this.gui.addFolder("controls");
      controls.close();
      controls.addFolder(this.controls, "enabled").onChange((value) => {
        this.controls.enabled = value;
      });
    }
  }

  disableDamping() {
    this.controls.enableDamping = false;
  }

  update() {
    if (this.controls != null) {
      this.controls.update();
    }
  }
}
