var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['./firebase', './utils/console'],
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: 'app.bundle.js'
    },
     module: {
         rules: [
         {
          test: require.resolve('./utils/console'),
          use: [{
              loader: 'expose-loader',
              options: 'console'
          }]
        },
        {
         test: require.resolve('./firebase/fbApi'),
         use: [{
             loader: 'expose-loader',
             options: 'fbApi'
         }]
       }
        ]
     },
    target: 'webworker'
};
