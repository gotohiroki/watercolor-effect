import { WebGLRenderTarget, Scene, OrthographicCamera, BoxGeometry, ShaderMaterial, Mesh, Vector4, PlaneGeometry, MeshBasicMaterial } from "three";
import vertexShader from "./shader/fbo/vertex.glsl";
import fragmentShader from "./shader/fbo/fragment.glsl";

export class Pipeline {
  constructor(stage, params) {
    this.stage = stage;
    this.params = params;

    this.sourceTarget = null;
    this.whiteTarget = null;
    this.targetA = null;
    this.targetB = null;

    this.fboScene = null;
    this.fboCamera = null;
    this.fboMaterial = null;

    this.finalScene = null;
    this.finalQuad = null;

    this.whiteScene = null;

    this.setBackground();
    this.setup();
  }

  setBackground() {
    this.whiteTarget = new WebGLRenderTarget(this.params.w, this.params.h);
    this.whiteScene = new Scene();
    this.whiteBg = new Mesh(new PlaneGeometry(300, 300), new MeshBasicMaterial({ color: 0xffffff }));
    this.whiteScene.add(this.whiteBg);
    this.whiteBg.position.z = -1;

    this.box = new Mesh(new BoxGeometry(0, 0, 0), new MeshBasicMaterial({ color: 0x00ff00 }));
    this.whiteScene.add(this.box);
  }

  setup() {
    this.sourceTarget = new WebGLRenderTarget(this.params.w, this.params.h);

    this.targetA = new WebGLRenderTarget(this.params.w, this.params.h);
    this.targetB = new WebGLRenderTarget(this.params.w, this.params.h);

    this.stage.renderer.setRenderTarget(this.whiteTarget);
    this.stage.renderer.render(this.whiteScene, this.stage.camera);

    this.fboScene = new Scene();
    this.fboCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.fboMaterial = new ShaderMaterial({
      uniforms: {
        // tDiffuse: { value: this.sourceTarget.texture },
        time: { value: 0 },
        tDiffuse: { value: null },
        tPrev: { value: this.whiteTarget.texture },
        mouse: { value: 0.0 },
        resolution: { value: new Vector4(this.params.w, this.params.h, 1, 1) },
      },
      vertexShader,
      fragmentShader,
    });

    this.fboQuad = new Mesh(new PlaneGeometry(2, 2), this.fboMaterial);
    this.fboScene.add(this.fboQuad);

    this.finalScene = new Scene();
    this.finalQuad = new Mesh(new PlaneGeometry(2, 2), new MeshBasicMaterial({ map: this.targetA.texture }));
    this.finalScene.add(this.finalQuad);
  }

  onPointerMove(event) {
    if (this.fboMaterial && this.fboMaterial.uniforms && this.fboMaterial.uniforms.mouse) {
      this.fboMaterial.uniforms.mouse.value = 1.0;
    }
  }

  onUpdate() {
    // this.stage.renderer.setRenderTarget(this.sourceTarget);
    // this.stage.renderer.setRenderTarget(null);
    // this.stage.renderer.render(this.fboScene, this.fboCamera);
  }
}
