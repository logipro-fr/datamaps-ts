const path = require("path");

module.exports = {
  // The current mode, defaults to production
  mode: "development",

  // The entry points ("location to store": "location to find")
  entry: {
    "public/resources/js": [`./src/public/resources/ts/mapCreator.ts`],
  },
  // Transpile Typescript code
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  // Used for generating source maps (used for debugging)
  devtool: "eval-source-map",

  // Find MapCreator under MapConfigurator when used in Front
  output: {
    library: {
      name: "MapConfigurator",
      type: "var",
      export: "default",
    }
  }
};
