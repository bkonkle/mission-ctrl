import webpack from 'webpack'

export default {
  devtool: 'source-map',
  entry: './src/index',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['babel'],
    }],
  },
  output: {
    path: 'dist',
    filename: 'ship-yard.min.js',
    library: 'ship-yard',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false, screw_ie8: true},
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
}
