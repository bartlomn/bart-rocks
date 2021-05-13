const { setWebpackOptimizationSplitChunks, override } = require("customize-cra");
module.exports = override(setWebpackOptimizationSplitChunks({
    "chunks": "async"
  }));