import typescript from "@rollup/plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

export default {
  input:"./src/index.ts",
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
      "process.env.VUE_ENV": JSON.stringify("browser"),
      "process.env.LANGUAGE": JSON.stringify(process.env.LANGUAGE),
    }),
    resolve(),
    commonjs(),
    typescript(),
    sourceMaps(),
  ],
  output: [
    {
      name: "JSPP",
      format: "system",
      file: "./dist/JSPP.system.js",
      sourcemap: true,
    },
    {
      name: "JSPP",
      format: "amd",
      file: "./dist/JSPP.amd.js",
      sourcemap: true,
    },
    {
      name: "JSPP",
      format: "es",
      file: "./dist/JSPP.es.js",
      sourcemap: true,
    },
    {
      name: "JSPP",
      format: "iife",
      file: "./dist/JSPP.iife.js",
      sourcemap: true,
    },
    {
      name: "JSPP",
      format: "umd",
      file: "./dist/JSPP.umd.js",
      sourcemap: true,
    },
    {
      name: "JSPP",
      format: "cjs",
      file: "./dist/JSPP.cjs.js",
      sourcemap: true,
    }
  ],
  onwarn: (msg, warn) => {
    // 忽略 Circular 的错误
    if (!/Circular/.test(msg)) {
      warn(msg);
    }
  },
};