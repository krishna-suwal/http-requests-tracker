<?php
/**
 * User class.
 *
 * @since 0.1.0
 *
 * @package HRT\Database
 */

namespace HRT\Database;

defined( 'ABSPATH' ) || exit;

// Example usage:
// $posts = Post::query_collection();
// $users = User::query_collection(
// 	array(
// 		'where' => array(
// 			'username' => array( 'admin', 'student' ),
// 		),
// 	),
// 	array(
// 		'posts' => array(
// 			'args'      => array(
// 				'where' => array(
// 					'post_status' => array( 'publish', 'draft', 'trash', 'inherit' ),
// 				),
// 			),
// 			'relations' => array(
// 				'author' => array(),
// 			),
// 		),
// 	)
// );
// $pages = Page::query_collection(
// 	array(),
// 	array(
// 		'author' => array(),
// 	)
// );

class User extends Model {

	/**
	 * Primary key column name.
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	protected $primary_key = 'ID';

	/**
	 * Default data for this model. Name value pairs.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $default_data = array(
		'username'       => '',
		'password'       => '',
		'nicename'       => '',
		'email'          => '',
		'url'            => '',
		'date_created'   => '',
		'activation_key' => '',
		'status'         => '',
		'display_name'   => '',
	);

	/**
	 * This is the name of this object type.
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	protected $object_type = 'user';

	/**
	 * Keys of data. In the format of model_access_key => db_key.
	 * Example: 'is_public' => '_is_public'
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $data_keys = array(
		'username'       => 'user_login',
		'password'       => 'user_pass',
		'nicename'       => 'user_nicename',
		'email'          => 'user_email',
		'url'            => 'user_url',
		'date_created'   => 'user_registered',
		'activation_key' => 'user_activation_key',
		'status'         => 'user_status',
		'display_name'   => 'display_name',
	);

	/**
	 * Keys of data that are stored in meta table. In the format of model_access_key => db_key.
	 * Example: 'is_public' => '_is_public'
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $meta_keys = array();

	protected $table_name = 'wp_users';

	protected $relations = array(
		'posts' => array(
			'type'        => 'one-to-many',
			'model'       => Post::class,
			'local_key'   => 'ID',
			'foreign_key' => 'post_author',
		),
	);
}
