const { helpers, externals, presets } = require( '@humanmade/webpack-helpers' );
const { choosePort, filePath } = helpers;

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
	} )
) );
