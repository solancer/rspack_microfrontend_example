const { ModuleFederationPlugin } = require("@rspack/core").container;
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { ProvidePlugin, HtmlRspackPlugin } = require("@rspack/core");

const APP_NAME = require("./package.json").name;
const deps = require("./package.json").dependencies;

dotenv.config();

let devServerConfig = {
  historyApiFallback: true,
  static: {
    directory: path.join(__dirname, "public"),
  },
  client: {
    overlay: false,
  },
};

if (process.env.NODE_ENV === "development") {
  console.log("Using .env file for devServer configuration.");
  const dotenvPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(dotenvPath)) {
    const env = dotenv.config({ path: dotenvPath }).parsed;

    // Ensuring that the necessary environment variables are available
    if (env.HOST && env.PORT) {
      devServerConfig = {
        ...devServerConfig,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
        host: env.HOST,
        port: env.PORT,
      };
    } else {
      console.warn(
        "Missing required environment variables for devServer in .env file."
      );
    }
  } else {
    console.warn("No .env file found. Using default devServer configuration.");
  }
}

module.exports = {
  mode: "development",
  devServer: devServerConfig,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
    publicPath: 'auto'
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: `${APP_NAME}`,
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        [`./${APP_NAME}App`]: "./src/App.jsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
      },
    }),
    new HtmlRspackPlugin({
      template: "./src/index.html",
      publicPath: "/",
    }),
    new ProvidePlugin({
      React: "react",
    }),
  ],
};
