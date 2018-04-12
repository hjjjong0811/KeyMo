const path = require("path");

module.exports = {
    target: "electron-main",
    entry: {
      "main/index": "./src/main/index.js",
      "renderer/app": "./src/renderer/app.jsx"
    },
    output: {
        filename: "[name].js"
    },
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: ["style-loader", "css-loader?modules"]
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,  
                use: [{
                    loader: 'url-loader',
                    options: { 
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    } 
                }]
            }]
    },
    devtool : "source-map"
};