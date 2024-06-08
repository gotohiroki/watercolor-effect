import { WebGLRenderer, WebGLRenderTarget, Scene, Mesh, PlaneGeometry, BoxGeometry, MeshBasicMaterial } from "three";

import { SetControls } from "./lib/SetControls";
import { SetGui } from "./lib/SetGui";

import { Stage } from "./Stage";
import { Object } from "./Object";
import { Pipeline } from "./Pipeline";

export class WebGL {
  constructor(body, params) {
    this.body = body;
    this.params = params;

    this.gui = null;
    this.controls = null;

    this.stage = null;
    this.object = null;

    this.time = null;

    this.setModule();
  }

  setModule() {
    // this.gui = new SetGui();
    this.stage = new Stage("#webgl", this.params);
    this.object = new Object(this.stage, this.params);
    this.fbo = new Pipeline(this.stage, this.params);
    // this.setBackground();
    // this.controls = new SetControls(this.stage, this.gui.getGui());
    // this.gui.add();
    // this.controls.addGui();
    this.onMouseMove();
    this.onUpdate();
  }

  onMouseMove() {
    this.body.addEventListener("pointermove", (event) => {
      this.object.onPointerMove(event);
      this.fbo.onPointerMove(event);
    });
  }

  // setBackground() {
  //   this.whiteTarget = new WebGLRenderTarget(this.params.w, this.params.h);
  //   this.whiteScene = new Scene();
  //   this.whiteBg = new Mesh(new PlaneGeometry(300, 300), new MeshBasicMaterial({ color: 0xffffff }));
  //   this.whiteScene.add(this.whiteBg);
  //   this.whiteBg.position.z = -1;

  //   this.box = new Mesh(new BoxGeometry(20, 20, 20), new MeshBasicMaterial({ color: 0x00ff00 }));
  //   this.whiteScene.add(this.box);
  // }

  // 毎フレーム呼び出す
  onUpdate() {
    requestAnimationFrame(this.onUpdate.bind(this));
    this.time += 0.05;
    if (this.object != null) this.object.onUpdate(this.time);
    // if (this.stage != null) this.stage.onUpdate();

    this.stage.renderer.setRenderTarget(this.fbo.sourceTarget);
    this.stage.renderer.render(this.stage.scene, this.stage.camera);

    this.stage.renderer.setRenderTarget(this.fbo.targetA);
    this.stage.renderer.render(this.fbo.fboScene, this.fbo.fboCamera);
    this.fbo.fboMaterial.uniforms.tDiffuse.value = this.fbo.sourceTarget.texture;
    this.fbo.fboMaterial.uniforms.tPrev.value = this.fbo.targetA.texture;
    this.fbo.fboMaterial.uniforms.time.value = this.time;

    this.fbo.finalQuad.material.map = this.fbo.targetA.texture;
    this.stage.renderer.setRenderTarget(null);
    this.stage.renderer.render(this.fbo.fboScene, this.fbo.fboCamera);

    // this.stage.renderer.setRenderTarget(null);
    // this.stage.renderer.render(this.whiteScene, this.stage.camera);

    let temp = this.fbo.targetA;
    this.fbo.targetA = this.fbo.targetB;
    this.fbo.targetB = temp;

    // if (this.controls != null) this.controls.onUpdate();
  }

  onResize(props) {
    this.params.w = props.w;
    this.params.h = props.h;
    this.params.aspect = props.aspect;
    this.params.shorter = props.shorter;
    this.params.longer = props.longer;

    this.stage.onResize(props);
    // this.background.onResize(props);
    this.object.onResize(props);
  }
}
