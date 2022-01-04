import { resolve } from "path";

import type { Configuration } from "webpack";

const include = [resolve("public-ts")];

const config: Configuration = {
  entry: "./public-ts/index.ts",
  module: {
    rules: [
      {
        include,
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: resolve("public")
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: include,
    roots: include
  }
};

export default config;
