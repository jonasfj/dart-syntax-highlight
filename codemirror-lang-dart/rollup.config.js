import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from '@rollup/plugin-typescript';
import { lezer } from "@lezer/generator/rollup"

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
    lezer(),
    nodeResolve(),
    typescript(),
  ]
}
