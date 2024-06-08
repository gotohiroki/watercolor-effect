varying vec2 vUv;
varying float vNoise;

uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;

float PI = 3.1415926535897932384626433832795;

void main() {
  vUv = uv;

  vec3 newposition = position;

  float dist = distance(uv, uMouse);
  newposition.z += uHover * 10.0 * sin(dist * 10.0 + uTime);
  
  vNoise = uHover * sin(dist * 10.0 - uTime);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0);
}