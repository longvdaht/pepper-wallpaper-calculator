import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import livereload from "rollup-plugin-livereload";
import replace from "@rollup/plugin-replace";
import serve from "rollup-plugin-serve";
import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import image from "@rollup/plugin-image";

const { ROLLUP_WATCH } = process.env;
const NODE_ENV = ROLLUP_WATCH ? "development" : "production";

export default {
  input: "src/index.js",
  output: {
    file: "build/index.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    replace({ "process.env.NODE_ENV": JSON.stringify(NODE_ENV) }),
    image(),
    nodeResolve({
      extensions: [".mjs", ".jsx", ".js", ".json", ".node"],
    }),
    commonjs({ include: "node_modules/**" }),
    !ROLLUP_WATCH && terser(),
    babel({
      plugins: [
        [
          "@babel/transform-react-jsx",
          {
            pragma: "h",
            pragmaFrag: "Fragment",
          },
        ],
      ],
      sourceMaps: true,
      inputSourceMap: true,
      babelHelpers: "bundled",
    }),
    copy({
      targets: [{ src: "src/index.html", dest: "build" }],
    }),
    ROLLUP_WATCH &&
      serve({
        contentBase: "build",
        port: 8000,
      }),
    ROLLUP_WATCH && livereload(),
  ],
};
