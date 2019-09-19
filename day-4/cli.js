let webpack = require("webpack");
let webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
compiler.run((err, stat) => {
  console.log(
    stat.toJson({
      entries: true,
      chunks: true,
      modules: true,
      assets: true
    })
  );
});
