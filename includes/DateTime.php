<?php
/**
 * Wrapper for PHP DateTime which adds support for gmt/utc offset when a
 * timezone is absent
 *
 * @since   0.1.0
 * @package HRT\Classes
 */

namespace HRT;

defined( 'ABSPATH' ) || exit;

/**
 * Datetime class.
 */
class DateTime extends \DateTime {

	/**
	 * UTC Offset, if needed. Only used when a timezone is not set. When
	 * timezones are used this will equal 0.
	 *
	 * @since  0.1.0
	 *
	 * @var integer
	 */
	protected $utc_offset = 0;

	/**
	 * Output an ISO 8601 date string in local (WordPress) timezone.
	 *
	 * @since  0.1.0
	 *
	 * @return string
	 */
	public function __toString() {
		return $this->format( DATE_ATOM );
	}

	/**
	 * Set UTC offset - this is a fixed offset instead of a timezone.
	 *
	 * @since  0.1.0
	 *
	 * @param int $offset Offset.
	 */
	public function set_utc_offset( $offset ) {
		$this->utc_offset = intval( $offset );
	}

	/**
	 * Get UTC offset if set, or default to the DateTime object's offset.
	 */
	public function getOffset() {
		return $this->utc_offset ? $this->utc_offset : parent::getOffset();
	}

	/**
	 * Set timezone.
	 *
	 * @since  0.1.0
	 *
	 * @param DateTimeZone $timezone DateTimeZone instance.
	 *
	 * @return DateTime
	 */
	public function setTimezone( $timezone ) {
		$this->utc_offset = 0;
		return parent::setTimezone( $timezone );
	}

	/**
	 * Missing in PHP 5.2 so just here so it can be supported consistently.
	 *
	 * @since  0.1.0
	 *
	 * @return int
	 */
	public function getTimestamp() {
		return method_exists( 'DateTime', 'getTimestamp' ) ? parent::getTimestamp() : $this->format( 'U' );
	}

	/**
	 * Get the timestamp with the WordPress timezone offset added or subtracted.
	 *
	 * @since  0.1.0
	 *
	 * @return int
	 */
	public function getOffsetTimestamp() {
		return $this->getTimestamp() + $this->getOffset();
	}

	/**
	 * Format a date based on the offset timestamp.
	 *
	 * @since  0.1.0
	 *
	 * @param  string $format Date format.
	 *
	 * @return string
	 */
	public function date( $format ) {
		return gmdate( $format, $this->getOffsetTimestamp() );
	}

	/**
	 * Return a localised date based on offset timestamp. Wrapper for date_i18n function.
	 *
	 * @since  0.1.0
	 *
	 * @param  string $format Date format.
	 *
	 * @return string
	 */
	public function date_i18n( $format = 'Y-m-d' ) {
		return date_i18n( $format, $this->getOffsetTimestamp() );
	}
}
