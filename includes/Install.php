<?php
/**
 * Install
 *
 * @since 0.1.0
 */

namespace HRT;

class Install {

	/**
	 * Initialization.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	public static function init() {
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		self::install();
		self::init_db();
	}

	/**
	 * Update hrt information.
	 *
	 * @since 0.1.0
	 */
	public static function install() {
		update_option( 'hrt_plugin_version', HRT_VERSION, true );

		// Save the install date.
		if ( false === get_option( 'hrt_install_date' ) ) {
			update_option( 'hrt_install_date', current_time( 'mysql', true ), true );
		}

		flush_rewrite_rules();
	}

	/**
	 * Initialize database.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	private static function init_db() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();
		$base_prefix     = $wpdb->base_prefix;

		dbDelta( self::get_logs_table_schema( $charset_collate, $base_prefix ) );
	}

	/**
	 * Get logs table schema.
	 *
	 * @since 0.1.0
	 *
	 * @param string $charset_collate   Database charset collate.
	 * @param string $base_prefix       Table prefix.
	 *
	 * @return string
	 */
	private static function get_logs_table_schema( $charset_collate, $base_prefix ) {
		$sql = "CREATE TABLE `{$base_prefix}hrt_logs` (
			id BIGINT UNSIGNED AUTO_INCREMENT,
			title LONGTEXT,
			description LONGTEXT,
			type VARCHAR(255) NOT NULL,
			user_id BIGINT UNSIGNED,
			data LONGTEXT,
			created_at datetime DEFAULT '0000-00-00 00:00:00',
			PRIMARY KEY (id),
			KEY type (type),
			KEY user_id (user_id)
		) $charset_collate;";

		return $sql;
	}

	/**
	 * Return the list of tables.
	 *
	 * @since 0.1.0
	 *
	 * @return array
	 */
	public static function get_tables() {
		global $wpdb;

		return array(
			"{$wpdb->prefix}hrt_logs",
		);
	}

	/**
	 * Drop tables.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	public static function drop_tables() {
		global $wpdb;

		$tables = self::get_tables();

		foreach ( $tables as $table ) {
			$wpdb->query( 'DROP TABLE IF EXISTS ' . esc_sql( $table ) );
		}
	}
}
