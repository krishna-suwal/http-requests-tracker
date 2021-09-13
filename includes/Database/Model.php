<?php
/**
 * Abstract Model class.
 *
 * @since 0.1.0
 *
 * @package HRT\Database
 */

namespace HRT\Database;

defined( 'ABSPATH' ) || exit;

abstract class Model {
	protected $id = 0;

	/**
	 * Core data for this object. Name value pairs.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $data = array();

	/**
	 * Primary key column name.
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	protected $primary_key = 'id';

	/**
	 * Default data for this model. Name value pairs.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $default_data = array();

	/**
	 * Core data changes for this object.
	 *
	 * @since 0.1.0
	 * @var array
	 */
	protected $changes = array();

	/**
	 * This is false until the object is read from the DB.
	 *
	 * @since 0.1.0
	 * @var bool
	 */
	protected $object_read = false;

	/**
	 * This is the name of this object type.
	 *
	 * @since 0.1.0
	 * @var string
	 */
	protected $object_type = 'data';

	/**
	 * Keys of data. In the format of model_access_key => db_key.
	 * Example: 'is_public' => '_is_public'
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $data_keys = array();

	/**
	 * Keys of data that are stored in meta table. In the format of model_access_key => db_key.
	 * Example: 'is_public' => '_is_public'
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $meta_keys = array();

	/**
	 * Stores meta in cache for future reads.
	 * A group must be set to to enable caching.
	 *
	 * @since 0.1.0
	 * @var string
	 */
	protected $cache_group = '';

	protected $table_name = '';

	protected $relations = array();

	public $relations_loaded = array();

	protected $main_table_constraints = array();

	/**
	 * Default constructor
	 *
	 * @param integer $read
	 */
	public function __construct( $data = array() ) {
		$this->set( 'id', 0 );
		$this->data = wp_parse_args( $data, $this->default_data );
	}

	/**
	 * Set all props to default values.
	 *
	 * @since 0.1.0
	 */
	public function reset() {
		$this->data    = $this->default_data;
		$this->changes = array();
		$this->set_object_read( false );
	}

	public function has_prop( $prop ) {
		return array_key_exists( $prop, $this->default_data ) || array_key_exists( $prop, $this->meta_keys );
	}

	/**
	 * Merge changes with data and clear the tracked changes.
	 *
	 * @since 0.1.0
	 */
	public function apply_changes() {
		$this->data    = array_replace_recursive( $this->data, $this->changes );
		$this->changes = array();
	}

	public static function get_instance( ...$args ) {
		return new static( ...$args );
	}

	public static function prepare_sql_wheres( $wheres = array() ) {
		if ( empty( $wheres ) ) {
			return '';
		}
		$sql = 'WHERE 1 = 1';

		foreach ( $wheres as $key => $value ) {
			$sql .= ' ';

			if ( is_array( $value ) ) {
				$values = implode(
					', ',
					array_map(
						function( $str ) {
							return '"' . $str . '"';
						},
						$value
					)
				);
				$sql   .= "AND {$key} in ({$values})";
			} elseif ( is_string( $value ) ) {
				$sql .= "AND {$key}=\"{$value}\"";
			} elseif ( is_numeric( $value ) ) {
				$sql .= "AND {$key}={$value}";
			}
		}
		return $sql;
	}

	public static function query_collection( $args = array(), $relations_query = array() ) {
		$args     = is_array( $args ) ? $args : array();
		$instance = self::get_instance();

		if ( empty( $instance->table_name ) ) {
			return array();
		}

		global $wpdb;

		$wheres_str = '';
		$wheres     = ! empty( $args['where'] ) && is_array( $args['where'] ) ? $args['where'] : array();

		if ( ! empty( $instance->get_main_table_constraints()['where'] ) ) {
			$wheres = array_merge( $wheres, $instance->get_main_table_constraints()['where'] );
		}

		if ( ! empty( $wheres ) ) {
			$keys_map   = $instance->get_data_keys();
			$conditions = array();

			foreach ( $wheres as $key => $value ) {
				if ( ! isset( $keys_map[ $key ] ) ) {
					continue;
				}
				$conditions[ $keys_map[ $key ] ] = $value;
			}
			$wheres_str = self::prepare_sql_wheres( $conditions );
		}

		$sql        = 'SELECT * FROM ' . $instance->table_name . ' ' . $wheres_str;
		$results    = $wpdb->get_results( $sql, ARRAY_A );
		$collection = array();

		foreach ( $results as $item ) {
			$object = self::get_instance();

			$object->hydrate( $item );

			if ( isset( $item[ $instance->primary_key ] ) ) {
				$object->set( 'id', $item[ $instance->primary_key ] );
				$object->set_object_read( true );
			} else {
				$object->set( 'id', 0 );
			}

			$collection[] = $object;
		}

		foreach ( $relations_query as $name => $relation_params ) {
			if ( empty( $instance->relations[ $name ] ) ) {
				continue;
			}

			$relation       = $instance->relations[ $name ];
			$relation_args  = isset( $relation_params['args'] ) ? (array) $relation_params['args'] : array();
			$load_relations = isset( $relation_params['relations'] ) ? (array) $relation_params['relations'] : array();
			$results        = call_user_func_array( array( $relation['model'], 'query_collection' ), array( $relation_args, $load_relations ) );
			$local_key      = $relation['local_key'];
			$foreign_key    = $relation['foreign_key'];
			$dictionary     = array();

			foreach ( $results as $result ) {
				$key = $result->get( $foreign_key );

				if ( ! isset( $dictionary[ $key ] ) ) {
					$dictionary[ $key ] = array();
				}

				$dictionary[ $key ][] = $result;
			}

			if ( 'one-to-one' === $relation['type'] ) {
				foreach ( $collection as $item ) {
					$key = $item->get( $local_key );

					if ( isset( $dictionary[ $key ] ) ) {
						$item->relations_loaded[ $name ] = empty( $dictionary[ $key ] ) ? null : end( $dictionary[ $key ] );
					} else {
						$item->relations_loaded[ $name ] = null;
					}
				}
			}

			if ( 'one-to-many' === $relation['type'] ) {
				foreach ( $collection as $item ) {
					$key = $item->get( $local_key );

					if ( isset( $dictionary[ $key ] ) ) {
						$item->relations_loaded[ $name ] = $dictionary[ $key ];
					} else {
						$item->relations_loaded[ $name ] = array();
					}
				}
			}
		}

		return $collection;
	}

	public function hydrate( $data = array() ) {
		$keys_map = array_flip( $this->get_data_keys() );
		$props    = array();

		foreach ( $data as $key => $value ) {
			if ( ! isset( $keys_map[ $key ] ) ) {
				continue;
			}
			$props[ $keys_map[ $key ] ] = $value;
		}
		$this->set_props( $props );
	}

	/*
	|--------------------------------------------------------------------------
	| Getters
	|--------------------------------------------------------------------------
	*/

	/**
	 * Get ID.
	 *
	 * @since 0.1.0
	 */
	public function get_id() {
		return $this->get( 'id' );
	}

	/**
	 * Get object read property.
	 *
	 * @since  0.1.0
	 * @return boolean
	 */
	public function get_object_read() {
		return (bool) $this->object_read;
	}

	/**
	 * Return data changes only.
	 *
	 * @since 0.1.0
	 * @return array
	 */
	public function get_changes() {
		return $this->changes;
	}

	/**
	 * Prefix for action and filter hooks on data.
	 *
	 * @since  0.1.0
	 *
	 * @return string
	 */
	protected function get_hook_prefix() {
		return 'hrt_' . $this->object_type . '_get_';
	}

	/**
	 * Gets a prop for a getter method.
	 *
	 * Gets the value from either current pending changes, or the data itself.
	 * Context controls what happens to the value before it's returned.
	 *
	 * @since  0.1.0
	 * @param  string $prop Name of prop to get.
	 * @param  string $context What the value is for. Valid values are view and edit.
	 * @return mixed
	 */
	protected function get( $prop, $default = null, $context = 'view' ) {
		$value = $default;

		if ( array_key_exists( $prop, $this->data ) ) {
			$value = array_key_exists( $prop, $this->changes ) ? $this->changes[ $prop ] : $this->data[ $prop ];
		}

		return apply_filters( $this->get_hook_prefix() . $prop, $value, $this, $context );
	}

	/**
	 * Returns all data for this object.
	 *
	 * @since  0.1.0
	 * @return array
	 */
	public function get_data() {
		return $this->data;
	}

	public function get_data_keys() {
		return $this->data_keys;
	}

	public function get_main_table_constraints() {
		return $this->main_table_constraints;
	}

	/**
	 * Get object type.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	public function get_object_type() {
		return $this->object_type;
	}

	/*
	|--------------------------------------------------------------------------
	| Setters
	|--------------------------------------------------------------------------
	*/

	/**
	 * Set ID.
	 *
	 * @since 0.1.0
	 * @param int $id ID.
	 */
	public function set_id( $id ) {
		$this->set( 'id', $id );
	}

	/**
	 * Set object read property.
	 *
	 * @since 0.1.0
	 * @param boolean $read Should read?.
	 */
	public function set_object_read( $read = true ) {
		$this->object_read = (bool) $read;
	}

	/**
	 * Set a collection of props in one go, collect any errors, and return the result.
	 * Only sets using public methods.
	 *
	 * @since  0.1.0
	 *
	 * @param array  $props Key value pairs to set. Key is the prop and should map to a setter function name.
	 * @param string $context In what context to run this.
	 *
	 * @return bool|WP_Error
	 */
	public function set_props( $props ) {
		foreach ( $props as $prop => $value ) {
			$this->set( $prop, $value );
		}
	}

	/**
	 * Sets a prop for a setter method.
	 *
	 * This stores changes in a special array so we can track what needs saving
	 * the the DB later.
	 *
	 * @since 0.1.0
	 * @param string $prop Name of prop to set.
	 * @param mixed  $value Value of the prop.
	 */
	protected function set( $prop, $value ) {
		if ( 'id' === $prop ) {
			$this->id = $value;
		}
		if ( $this->has_prop( $prop ) ) {
			if ( true === $this->object_read ) {
				if ( $value !== $this->data[ $prop ] || array_key_exists( $prop, $this->changes ) ) {
					$this->changes[ $prop ] = $value;
				}
			} else {
				$this->data[ $prop ] = $value;
			}
		}
	}

	/**
	 * Sets a date prop whilst handling formatting and datetime objects.
	 *
	 * @since 0.1.0
	 * @param string         $prop Name of prop to set.
	 * @param string|integer $value Value of the prop.
	 */
	protected function set_date_prop( $prop, $value ) {
		try {
			if ( empty( $value ) ) {
				$this->set( $prop, null );
				return;
			}

			if ( is_a( $value, 'Masteriyo\DateTime' ) ) {
				$datetime = $value;
			} elseif ( is_numeric( $value ) ) {
				// Timestamps are handled as UTC timestamps in all cases.
				$datetime = new \DateTIme( "@{$value}", new \DateTimeZone( 'UTC' ) );
			} else {
				// Strings are defined in local WP timezone. Convert to UTC.
				if ( 1 === preg_match( '/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|((-|\+)\d{2}:\d{2}))$/', $value, $date_bits ) ) {
					$offset    = ! empty( $date_bits[7] ) ? iso8601_timezone_to_offset( $date_bits[7] ) : masteriyo_timezone_offset();
					$timestamp = gmmktime( $date_bits[4], $date_bits[5], $date_bits[6], $date_bits[2], $date_bits[3], $date_bits[1] ) - $offset;
				} else {
					$timestamp = masteriyo_string_to_timestamp( get_gmt_from_date( gmdate( 'Y-m-d H:i:s', masteriyo_string_to_timestamp( $value ) ) ) );
				}
				$datetime = new \DateTime( "@{$timestamp}", new \DateTimeZone( 'UTC' ) );
			}

			// Set local timezone or offset.
			if ( get_option( 'timezone_string' ) ) {
				$datetime->setTimezone( new \DateTimeZone( masteriyo_timezone_string() ) );
			} else {
				$datetime->set_utc_offset( masteriyo_timezone_offset() );
			}

			$this->set( $prop, $datetime );
		} catch ( \Exception $e ) {
			// TODO Log error message.
			$error = $e->getErrorMessage();
		}
	}

	/*
	|--------------------------------------------------------------------------
	| Magic methods.
	|--------------------------------------------------------------------------
	*/

	/**
	 * Store only the data attribute.
	 *
	 * @return array
	 */
	public function __sleep() {
		return array( 'data' );
	}

	/**
	 * Re-run the constructor with the object ID.
	 *
	 * If the object no longer exists, remove the ID.
	 */
	public function __wakeup() {
		try {
			$this->__construct( $this->data );
		} catch ( \Exception $e ) {
			$this->set( 'id', 0 );
			$this->set_object_read( true );
		}
	}

	/**
	 * Change data to JSON format.
	 *
	 * @since  0.1.0
	 * @return string Data in JSON format.
	 */
	public function __toString() {
		return wp_json_encode( $this->get_data() );
	}
}
