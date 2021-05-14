/* eslint-disable @typescript-eslint/no-var-requires */
const { setWebpackOptimizationSplitChunks, override, addWebpackModuleRule } = require('customize-cra');
module.exports = override(
    addWebpackModuleRule({
        test: /\.(vert|frag)$/i,
        use: 'raw-loader',
    }),
    setWebpackOptimizationSplitChunks({
        chunks: 'async',
    }),
);
