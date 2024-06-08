import { WebGL } from "./webgl";
import { SetPropertySize } from "./helper/SetPropertySize";

window.addEventListener("DOMContentLoaded", (e) => {
  const body = document.body;
  const params = {
    w: window.innerWidth,
    h: window.innerHeight,
    beforeWidth: window.innerWidth,
    longer: 0,
    shorter: 0,
    aspect: 0,
  };
  params.aspect = params.w / params.h;
  params.longer = params.w > params.h ? params.w : params.h;
  params.shorter = params.w < params.h ? params.w : params.h;

  SetPropertySize(params.w, params.h);

  const webgl = new WebGL(body, params);

  let timerId = null;
  window.addEventListener("resize", () => {
    params.w = window.innerWidth;
    params.h = window.innerHeight;
    params.aspect = params.w / params.h;
    params.longer = params.w > params.h ? params.w : params.h;
    params.shorter = params.w < params.h ? params.w : params.h;
    const props = {
      w: params.w,
      h: params.h,
      aspect: params.aspect,
      longer: params.longer,
      shorter: params.shorter,
    };

    clearTimeout(timerId);
    timerId = setTimeout(() => {
      SetPropertySize(params.w, params.h);
      webgl.onResize(props);
    }, 500);
  });
});
