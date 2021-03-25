const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );
module.exports = {
   entry: __dirname + "/src/index.js",
   output: {
      path: __dirname + "/",
      filename: 'src/main.js',
      chunkFilename: '[name].js',
      publicPath: '/',
   },
   devServer: {
      contentBase: __dirname + '/src' ,
      historyApiFallback: true
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            use: 'babel-loader',
         },
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
         },
         {
            test: /\.(png|jpg|jpe?g|svg|gif)?$/, 
            use: 'file-loader'
         },
      ]
   },
   plugins: [
      new HtmlWebPackPlugin({
         template: path.resolve( __dirname, 'public/index.html' ),
         filename: 'index.html'
      })
   ]
};