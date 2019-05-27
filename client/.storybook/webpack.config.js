module.exports = ({ config }) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
            {
                loader: require.resolve('awesome-typescript-loader'),
                options: {
                    configFileName: './client/tsconfig.json'
                }
            },
        ],
    });
    config.module.rules.push({
        test: /\.module\.(scss|sass)$/,
        loaders: [
            require.resolve('style-loader'),
            {
                loader: require.resolve('css-loader'),
                options: {
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                }
            },
            require.resolve('sass-loader'),
        ]
    })
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
};