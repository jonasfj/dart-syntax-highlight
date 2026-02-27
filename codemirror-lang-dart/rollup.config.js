import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from '@rollup/plugin-typescript';

export default {
  input: "./src/index.ts",
  output: [{
    format: "cjs",
    file: "./dist/index.cjs",
    sourcemap: true
  }, {
    format: "es",
    file: "./dist/index.js",
    sourcemap: true
  }],
  external(id) { return !/^[\.\/]/.test(id) },
  plugins: [
    nodeResolve(),
    typescript(),
  ]
}
