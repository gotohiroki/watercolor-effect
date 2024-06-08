import gsap from "gsap";
import { Mesh, PlaneGeometry, SphereGeometry, Raycaster, DoubleSide, MeshBasicMaterial, ShaderMaterial, TextureLoader, Vector2, Vector4 } from "three";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import { TextureLoad } from "./TextureLoad";
// import t from "../assets/img/brush.png";

export class Object {
  constructor(stage, params) {
    this.stage = stage;
    this.params = params;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.canvas = this.stage.renderer.domElement;
    this.canvasRect = this.canvas.getBoundingClientRect();

    this.raycaster = new Raycaster();
    this.pointer = new Vector2();

    this.init();
  }

  init() {
    this.setObjects();
  }

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycast();
  }

  raycast() {
    this.raycaster.setFromCamera(this.pointer, this.stage.camera);
    const intersects = this.raycaster.intersectObjects([this.raycastPlane]);
    // if (intersects.length > 0) {
    //   this.dummy.position.copy(intersects[0].point);
    // }
    for (let i = 0; i < intersects.length; i++) {
      // const obj = intersects[i].object;
      const intersectPoint = intersects[i].point;
      this.dummy.position.copy(intersects[i].point);
      console.log(this.dummy.position);
      // this.dummy.position.copy(intersects[0].point);
      // obj.material.uniforms.uMouse.value = intersects[i].uv;
    }
  }

  getPostion(rect, canvasRect) {
    const x = rect.left + rect.width / 2 - canvasRect.width / 2;
    const y = -rect.top - rect.height / 2 + canvasRect.height / 2;
    return { x, y };
  }

  // getScroll(o) {
  //   const { $el, mesh } = o;
  //   const rect = $el.getBoundingClientRect();
  //   const { x, y } = this.getPostion(rect, this.canvasRect);
  //   // mesh.position.x = x;
  //   mesh.position.y = y;
  // }

  getResize(o, newCanvasRect) {
    const { $el, mesh, geometry, rect } = o;
    const nextRect = $el.getBoundingClientRect();
    const { x, y } = this.getPostion(nextRect, newCanvasRect);
    mesh.position.x = x;
    mesh.position.y = y;
    geometry.scale(nextRect.width / rect.width, nextRect.height / rect.height, 1);
    o.rect = nextRect;
    console.log(o.rect.width);
  }

  setObjects() {
    this.geometry = new PlaneGeometry(2, 2, 32, 32);
    this.materials = [];
    // this.material = new MeshBasicMaterial({ color: 0x6699ff });
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vector4(0, 0, 0, 0) },
        uTexture: { value: this.texture },
        uNoiseFreq: { value: 3.5 },
        uNoiseAmp: { value: 0.15 },
      },
      vertexShader,
      fragmentShader,
      // wireframe: true,
      side: DoubleSide,
    });

    // this.mesh = new Mesh(this.geometry, this.material);
    // this.stage.scene.add(this.mesh);

    this.raycastPlane = new Mesh(new PlaneGeometry(1000, 1000), new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide }));
    this.dummy = new Mesh(
      // new PlaneGeometry(8, 8, 10, 10),
      new SphereGeometry(3, 10, 10),
      new MeshBasicMaterial({
        color: 0xffffff,
        // map: TextureLoad("assets/img/particle.png"),
        // transparent: true,
      }),
    );
    this.stage.scene.add(this.dummy);
  }

  onUpdate(time) {
    this.material.uniforms.uTime.value = time;
  }

  onResize(props) {
    this.params.w = props.w;
    this.params.h = props.h;
    this.params.aspect = props.aspect;
    this.params.shorter = props.shorter;
    this.params.longer = props.longer;

    const newCanvasRect = this.canvas.getBoundingClientRect();
    // this.os.forEach((o) => this.getResize(o, newCanvasRect));
  }
}
