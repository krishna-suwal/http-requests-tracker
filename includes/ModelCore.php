<?php
/**
 * ModelCore class.
 *
 * @since 0.1.0
 *
 * @package HRT
 */

namespace HRT;

defined( 'ABSPATH' ) || exit;

class ModelCore implements \HRT\Contracts\ModelCore {
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
	 * Callbacks for sanitize.
	 *
	 * @since 0.1.0
	 * @var string
	 */
	protected $sanitize_callbacks = array();

	/**
	 * Keys of data that are stored in meta table. In the format of model_access_key => db_key.
	 * Example: 'is_public' => '_is_public'
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $meta_keys = array();

	protected $date_props = array();

	/**
	 * Stores meta in cache for future reads.
	 * A group must be set to to enable caching.
	 *
	 * @since 0.1.0
	 * @var string
	 */
	protected $cache_group = '';

	/**
	 * Default constructor
	 *
	 * @since  0.1.0
	 *
	 * @param integer $read
	 */
	public function __construct( $data = array() ) {
		$this->set( $this->primary_key, 0 );
		$this->data = wp_parse_args( $data, $this->default_data );
		$this->init_sanitize_callbacks();
	}

	/**
	 * Initialize sanitize callbacks.
	 *
	 * @since 0.1.0
	 */
	protected function init_sanitize_callbacks() {}

	/**
	 * Sanitize the settings
	 *
	 * @since 0.1.0
	 *
	 * @param string $prop    Name of prop to set.
	 * @param array|string $callback Sanitize callback.
	 */
	protected function add_sanitize_callback( $prop, $callback ) {
		$this->sanitize_callbacks[ $prop ] = $callback;
	}

	/**
	 * Sanitize the settings
	 *
	 * @since 0.1.0
	 *
	 * @param string $prop    Name of prop to set.
	 * @param mixed  $value   Value of the prop.
	 *
	 * @return mixed
	 */
	protected function sanitize( $prop, $value ) {
		if ( isset( $this->sanitize_callbacks[ $prop ] ) ) {
			$value = call_user_func_array( $this->sanitize_callbacks[ $prop ], array( $value ) );
		}

		return $value;
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
		$this->data    = wp_parse_args( $this->changes, $this->data );
		$this->changes = array();
	}

	/**
	 * Get new instance of the class.
	 *
	 * @since  0.1.0
	 *
	 * @param mixed ...$args
	 *
	 * @return $this
	 */
	public static function get_instance( ...$args ) {
		return new static( ...$args );
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
		return $this->get( $this->primary_key );
	}

	/**
	 * Get object read property.
	 *
	 * @since  0.1.0
	 *
	 * @return boolean
	 */
	public function get_object_read() {
		return (bool) $this->object_read;
	}

	/**
	 * Return data changes only.
	 *
	 * @since 0.1.0
	 *
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
	 *
	 * @param  string $prop Name of prop to get.
	 * @param  string $context What the value is for. Valid values are view and edit.
	 * @return mixed
	 */
	public function get( $prop, $default = null, $context = 'view' ) {
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

	/**
	 * Get data keys map.
	 *
	 * @since  0.1.0
	 *
	 * @return array
	 */
	public function get_data_keys() {
		return $this->data_keys;
	}

	/**
	 * Get object type.
	 *
	 * @since 0.1.0
	 *
	 * @return string
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
	 *
	 * @param int $id ID.
	 */
	public function set_id( $id ) {
		$this->set( $this->primary_key, $id );
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
	public function set_props( $props, $context = 'view' ) {
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
	public function set( $prop, $value ) {
		$value = $this->sanitize( $prop, $value );

		if ( in_array( $prop, $this->date_props, true ) ) {
			$value = $this->prepare_date_prop( $value );
		}
		if ( $this->primary_key === $prop ) {
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
	protected function prepare_date_prop( $value ) {
		try {
			if ( empty( $value ) ) {
				return $value;
			}

			if ( is_a( $value, 'HRT\DateTime' ) ) {
				$datetime = $value;
			} elseif ( is_numeric( $value ) ) {
				// Timestamps are handled as UTC timestamps in all cases.
				$datetime = new \DateTIme( "@{$value}", new \DateTimeZone( 'UTC' ) );
			} else {
				// Strings are defined in local WP timezone. Convert to UTC.
				if ( 1 === preg_match( '/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|((-|\+)\d{2}:\d{2}))$/', $value, $date_bits ) ) {
					$offset    = ! empty( $date_bits[7] ) ? iso8601_timezone_to_offset( $date_bits[7] ) : hrt_timezone_offset();
					$timestamp = gmmktime( $date_bits[4], $date_bits[5], $date_bits[6], $date_bits[2], $date_bits[3], $date_bits[1] ) - $offset;
				} else {
					$timestamp = hrt_string_to_timestamp( get_gmt_from_date( gmdate( 'Y-m-d H:i:s', hrt_string_to_timestamp( $value ) ) ) );
				}
				$datetime = new \DateTime( "@{$timestamp}", new \DateTimeZone( 'UTC' ) );
			}

			// Set local timezone or offset.
			if ( get_option( 'timezone_string' ) ) {
				$datetime->setTimezone( new \DateTimeZone( hrt_timezone_string() ) );
			} else {
				$datetime->set_utc_offset( hrt_timezone_offset() );
			}

			return $datetime;
		} catch ( \Exception $e ) {
			// TODO Log error message.
			$error = $e->getErrorMessage();
		}
		return $value;
	}

	/*
	|--------------------------------------------------------------------------
	| Magic methods.
	|--------------------------------------------------------------------------
	*/

	/**
	 * Store only the data attribute.
	 *
	 * @since  0.1.0
	 *
	 * @return array
	 */
	public function __sleep() {
		return array( 'id', 'data' );
	}

	/**
	 * Re-run the constructor with the object ID.
	 *
	 * If the object no longer exists, remove the ID.
	 *
	 * @since  0.1.0
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
	 *
	 * @return string Data in JSON format.
	 */
	public function __toString() {
		return wp_json_encode( $this->get_data() );
	}
}
