<?php

namespace Obscura;

const SCRIPT_ID = 'obscura-ui';
const STYLE_ID = 'obscura-ui';

function bootstrap() {
	add_action( 'admin_menu', __NAMESPACE__ . '\\register_menu_page' );
	add_action( 'admin_head', function () {
		echo '<script>jQuery.migrateMute = true;</script>';
	} );
}

function register_menu_page() {
	$hook = add_menu_page( 'Obscura', 'Obscura', 'manage_options', 'obscura', __NAMESPACE__ . '\\render_page', 'dashicons-camera', 10 );
	add_action( 'load-' . $hook, __NAMESPACE__ . '\\load_page' );
}

function load_page() {
	$script_url = plugins_url( 'build/index.js', dirname( __FILE__ ) );
	$style_url = plugins_url( 'build/index.css', dirname( __FILE__ ) );
	$manifest = require_once dirname( __DIR__ ) . '/build/index.asset.php';

	wp_enqueue_script( SCRIPT_ID, $script_url, $manifest['dependencies'], $manifest['version'], true );
	wp_localize_script( SCRIPT_ID, 'ObscuraVars', [
		'api' => rest_url(),
		'nonce' => wp_create_nonce( 'wp_rest' ),
		'data' => [
			'sizes' => get_registered_sizes(),
		],
	] );

	$style_deps = [
		'wp-components',
	];
	wp_enqueue_style( STYLE_ID, $style_url ?? 'about:blank', $style_deps );
}

function render_page() {
	echo '<div id="obscura-root"></div>';
}

/**
 * Gets all image sizes as keyed array with width, height and crop values.
 *
 * @return array
 */
function get_registered_sizes() {
	global $_wp_additional_image_sizes;

	$sizes = \get_intermediate_image_sizes();

	$labels = apply_filters( 'image_size_names_choose', [
		'thumbnail' => __( 'Thumbnail' ),
		'medium' => __( 'Medium' ),
		'medium_large' => __( 'Medium-Large' ),
		'large' => __( 'Large' ),
		'full' => __( 'Full Size' ),
	] );

	// Extract dimensions and crop setting.
	$data = [];
	$data['full'] = [
		'label' => $labels['full'],
		'width' => null,
		'height' => null,
		'crop' => false,
		'orientation' => null,
	];
	foreach ( $sizes as $size ) {
		if ( isset( $_wp_additional_image_sizes[ $size ] ) ) {
			$width = intval( $_wp_additional_image_sizes[ $size ]['width'] );
			$height = intval( $_wp_additional_image_sizes[ $size ]['height'] );
			$crop = (bool) $_wp_additional_image_sizes[ $size ]['crop'];
		} else {
			$width = intval( get_option( "{$size}_size_w" ) );
			$height = intval( get_option( "{$size}_size_h" ) );
			$crop = (bool) get_option( "{$size}_crop" );
		}

		$data[ $size ] = [
			'label' => $labels[ $size ] ?? $size,
			'width' => $width,
			'height' => $height,
			'crop' => $crop,
			'orientation' => $width >= $height ? 'landscape' : 'portrait',
		];
	}

	return $data;
}
