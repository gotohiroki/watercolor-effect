import {TextureLoader, sRGBEncoding} from "three";

export function TextureLoad(src) {
  const texture = new TextureLoader().load(src);
  texture.encoding = sRGBEncoding;
  return texture;
}