const {
  ProvidePlugin,
  CopyRspackPlugin,
  HtmlRspackPlugin,
} = require("@rspack/core");
const { ContainerManager } = require('@module-federation/managers');
const { StatsPlugin } = require('@module-federation/manifest');
const { ModuleFederationPlugin } = require('@rspack/core').container;

const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const deps = require("./package.json").dependencies;

const containerManager = new ContainerManager();

// I would ideally need this is runtime
const mfOptions = {
  name: 'rspact_remote',
  filename: 'remoteEntry.js',
  remotes: {},
  exposes: {}
};

// Initialize the container manager
containerManager.init(mfOptions);
mfOptions.exposes = containerManager.containerPluginExposesOptions;

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
  const dotenvPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(dotenvPath)) {
    const env = dotenv.config({ path: dotenvPath }).parsed;

    // Ensuring that the necessary environment variables are available
    if (env.HOST && env.PORT) {
      devServerConfig = {
        ...devServerConfig,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
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
  entry: "./src/index",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
    publicPath: "/",
  },
  devServer: devServerConfig,
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
            presets: ["@babel/preset-react", "@babel/preset-env"]
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
      name: "host",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {},
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
    new ModuleFederationPlugin(mfOptions),
    new StatsPlugin(mfOptions, {
      pluginVersion: require('./package.json').version,
      bundler: 'rspack',
    }),
  ],
};
