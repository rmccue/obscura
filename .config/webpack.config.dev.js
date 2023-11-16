const { helpers, externals, loaders, presets } = require( '@humanmade/webpack-helpers' );
const postcssNesting = require( 'postcss-nesting' );
const { choosePort, filePath } = helpers;

// Mutate the loader defaults.
loaders.ts.defaults.loader = 'babel-loader';
loaders.postcss.defaults.options.postcssOptions.plugins.push( postcssNesting() );

module.exports = choosePort( 3000 ).then( port => (
	presets.development( {
		externals,
		devServer: {
			port,
			https: true,
		},
		entry: {
			index: filePath( 'src/index.js' ),
		},
		output: {
			path: filePath( 'build' ),
			publicPath: `https://localhost:${ port }/`,
		},
		resolve: {
			extensions: [
				'.ts',
				'.tsx',
				'.wasm',
				'.mjs',
				'.js',
				'.json',
			],
		},
	} )
) );
