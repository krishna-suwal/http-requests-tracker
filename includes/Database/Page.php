<?php
/**
 * Page class.
 *
 * @since 0.1.0
 *
 * @package HRT\Database
 */

namespace HRT\Database;

defined( 'ABSPATH' ) || exit;

class Page extends Post {

	/**
	 * This is the name of this object type.
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	protected $object_type = 'page';

	protected $main_table_constraints = array(
		'where' => array(
			'post_type' => 'page',
		),
	);
}
