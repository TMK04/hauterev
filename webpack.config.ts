import { resolve } from "path";

import type { Configuration } from "webpack";

const include = [resolve("client")];

const config: Configuration = {
  entry: "./client/index.ts",
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
  },
  mode: "development"
};

export default config;
