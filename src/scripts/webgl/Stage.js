import { Color, PerspectiveCamera, OrthographicCamera, Scene, Vector3, WebGLRenderer } from "three";

export class Stage {
  constructor(selector, params) {
    this.container = document.querySelector(selector);
    this.params = params;

    this.renderParam = {
      clearColor: 0x000000,
      width: this.params.w,
      height: this.params.h,
    };

    this.cameraParam = {
      fov: 70,
      aspect: this.params.aspect,
      near: 0.01,
      far: 1000,
      fovRad: null,
      dist: null,
      lookAt: new Vector3(0, 0, 0),
      x: 0,
      y: 0,
      z: 100,
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.init();
  }

  init() {
    this.setRenderer();
    this.setScene();
    this.setCamera();
  }

  setScene() {
    this.scene = new Scene();
  }

  updateRenderer() {
    this.renderer.setSize(this.params.w, this.params.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  setRenderer() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      transparent: true,
    });
    this.renderer.setClearColor(new Color(this.renderParam.clearColor)); // 背景の色
    this.updateRenderer();

    this.container.appendChild(this.renderer.domElement);
  }

  updateCamera() {
    this.camera.aspect = this.params.aspect;
    this.camera.updateProjectionMatrix();
  }

  setCamera() {
    // ウィンドウとwebGLの座標を一致させるため、描画がウィンドウぴったりになるようカメラを調整
    // const radian = 2 * Math.atan(this.renderParam.height / 2 / this.cameraParam.z);
    // this.cameraParam.fov = radian * (180 / Math.PI);

    this.camera = new PerspectiveCamera(this.cameraParam.fov, this.params.aspect, this.cameraParam.near, this.cameraParam.far);
    this.camera.position.set(this.cameraParam.x, this.cameraParam.y, this.cameraParam.z);
    this.updateCamera();
  }

  onUpdate() {
    if (this.renderer != null) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onResize(props) {
    this.params.w = props.w;
    this.params.h = props.h;
    this.params.aspect = props.aspect;
    this.params.shorter = props.shorter;
    this.params.longer = props.longer;

    this.updateRenderer();
    this.updateCamera();
  }
}
