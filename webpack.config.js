const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appsDir = path.resolve(__dirname, 'apps');
const appFolders = fs.existsSync(appsDir)
  ? fs
      .readdirSync(appsDir)
      .filter((name) => fs.statSync(path.join(appsDir, name)).isDirectory())
  : [];

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: appFolders.map((folder) => ({
        from: path.resolve(__dirname, 'libs/common/src/grpc/protos/**/*.proto'),
        to: path.resolve(__dirname, `dist/apps/${folder}/[name][ext]`),
        globOptions: {
          onlyFiles: true,
        },
      })),
    }),
  ],
};
