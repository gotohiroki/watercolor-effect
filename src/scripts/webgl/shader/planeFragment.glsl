varying vec2 vUv;
varying float vNoise;

uniform float uHover;
uniform sampler2D uTexture;

void main() {
  vec2 uv = vUv;
  vec2 p = uv;
  float x = uHover;
  x = smoothstep(0.0, 1.0, (x * 2.0 + p.y - 1.0));

  vec4 texture = mix(
    texture2D(uTexture, (p - 0.5) * (1.0 -x) + 0.5),
    texture2D(uTexture, (p - 0.5) * x + 0.5),
    x
  );
  
  gl_FragColor= vec4(1.0,0.0,0.0,1.0);
  gl_FragColor= vec4(texture);
}