<?php
/**
 * Post class.
 *
 * @since 0.1.0
 *
 * @package HRT\Database
 */

namespace HRT\Database;

defined( 'ABSPATH' ) || exit;

class Post extends Model {

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
		'slug'              => '',
		'title'             => '',
		'content'           => '',
		'filtered_content'  => '',
		'excerpt'           => '',
		'status'            => '',
		'author_id'         => '',
		'date_created'      => '',
		'date_created_gmt'  => '',
		'date_modified'     => '',
		'date_modified_gmt' => '',
		'parent_id'         => '',
		'post_type'         => '',
		'comment_status'    => '',
		'ping_status'       => '',
		'password'          => '',
		'to_ping'           => '',
		'pinged'            => '',
		'guid'              => '',
		'menu_order'        => '',
		'post_mime_type'    => '',
		'comment_count'     => '',
	);

	/**
	 * This is the name of this object type.
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	protected $object_type = 'post';

	/**
	 * Keys of data. In the format of model_access_key => db_key.
	 * Example: 'is_public' => '_is_public'
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $data_keys = array(
		'slug'              => 'post_name',
		'title'             => 'post_title',
		'content'           => 'post_content',
		'filtered_content'  => 'post_content_filtered',
		'excerpt'           => 'post_excerpt',
		'status'            => 'post_status',
		'author_id'         => 'post_author',
		'date_created'      => 'post_date',
		'date_created_gmt'  => 'post_date_gmt',
		'date_modified'     => 'post_modified',
		'date_modified_gmt' => 'post_modified_gmt',
		'parent_id'         => 'post_parent',
		'post_type'         => 'post_type',
		'comment_status'    => 'comment_status',
		'ping_status'       => 'ping_status',
		'password'          => 'post_password',
		'to_ping'           => 'to_ping',
		'pinged'            => 'pinged',
		'guid'              => 'guid',
		'menu_order'        => 'menu_order',
		'post_mime_type'    => 'post_mime_type',
		'comment_count'     => 'comment_count',
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

	protected $table_name = 'wp_posts';

	protected $relations = array(
		'author' => array(
			'type'        => 'one-to-one',
			'model'       => User::class,
			'local_key'   => 'post_author',
			'foreign_key' => 'ID',
		),
	);
}
