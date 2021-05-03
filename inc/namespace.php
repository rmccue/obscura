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
	$manifest = file_get_contents( dirname( __DIR__ ) . '/build/asset-manifest.json' );
	if ( ! empty( $manifest ) ) {
		$manifest_data = json_decode( $manifest, true );
		$script_url = $manifest_data['index.js'];
		$style_url = null;
	}

	$deps = [
		// 'moment',
		// 'wp-api-fetch',
		'wp-components',
		'wp-date',
		'wp-element',
		'wp-url',
	];
	wp_enqueue_script( SCRIPT_ID, $script_url, $deps, false, true );
	wp_localize_script( SCRIPT_ID, 'ObscuraVars', [
		'api' => rest_url(),
		'nonce' => wp_create_nonce( 'wp_rest' ),
	] );

	$style_deps = [
		'wp-components',
	];
	wp_enqueue_style( STYLE_ID, $style_url ?? 'about:blank', $style_deps );
}

function render_page() {
	echo '<div id="obscura-root"></div>';
}
