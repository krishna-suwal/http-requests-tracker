<?php
/**
 * hrt formatting functions.
 *
 * @since 0.1.0
 */

use HRT\DateTime;

/**
 * Converts a string (e.g. 'yes' or 'no') to a bool.
 *
 * @since 0.1.0
 * @param string|bool $string String to convert. If a bool is passed it will be returned as-is.
 * @return bool
 */
function hrt_string_to_bool( $string ) {
	if ( is_bool( $string ) ) {
		return $string;
	}

	$string = strtolower( $string );

	return ( 'yes' === $string || 1 === $string || 'true' === $string || '1' === $string );
}

/**
 * Converts a bool to a 'yes' or 'no'.
 *
 * @since 0.1.0
 * @param bool|string $bool Bool to convert. If a string is passed it will first be converted to a bool.
 * @return string
 */
function hrt_bool_to_string( $bool ) {
	if ( ! is_bool( $bool ) ) {
		$bool = hrt_string_to_bool( $bool );
	}
	return true === $bool ? 'yes' : 'no';
}

/**
 * Convert a date string to a DateTime.
 *
 * @since  0.1.0
 * @param  string $time_string Time string.
 * @return HRT\DateTime
 */
function hrt_string_to_datetime( $time_string ) {
	// Strings are defined in local WP timezone. Convert to UTC.
	if ( 1 === preg_match( '/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|((-|\+)\d{2}:\d{2}))$/', $time_string, $date_bits ) ) {
		$offset    = ! empty( $date_bits[7] ) ? iso8601_timezone_to_offset( $date_bits[7] ) : hrt_timezone_offset();
		$timestamp = gmmktime( $date_bits[4], $date_bits[5], $date_bits[6], $date_bits[2], $date_bits[3], $date_bits[1] ) - $offset;
	} else {
		$timestamp = hrt_string_to_timestamp( get_gmt_from_date( gmdate( 'Y-m-d H:i:s', hrt_string_to_timestamp( $time_string ) ) ) );
	}
	$datetime = new DateTime( "@{$timestamp}", new DateTimeZone( 'UTC' ) );

	// Set local timezone or offset.
	if ( get_option( 'timezone_string' ) ) {
		$datetime->setTimezone( new DateTimeZone( hrt_timezone_string() ) );
	} else {
		$datetime->set_utc_offset( hrt_timezone_offset() );
	}

	return $datetime;
}

/**
 * Get timezone offset in seconds.
 *
 * @since  0.1.0
 * @return float
 */
function hrt_timezone_offset() {
	$timezone = get_option( 'timezone_string' );

	if ( $timezone ) {
		$timezone_object = new DateTimeZone( $timezone );
		return $timezone_object->getOffset( new DateTime( 'now' ) );
	} else {
		return floatval( get_option( 'gmt_offset', 0 ) ) * HOUR_IN_SECONDS;
	}
}

/**
 * Convert mysql datetime to PHP timestamp, forcing UTC. Wrapper for strtotime.
 *
 * Based on hrts_strtotime_dark_knight() from hrt Subscriptions by Prospress.
 *
 * @since  0.1.0
 * @param  string   $time_string    Time string.
 * @param  int|null $from_timestamp Timestamp to convert from.
 * @return int
 */
function hrt_string_to_timestamp( $time_string, $from_timestamp = null ) {
	$original_timezone = date_default_timezone_get();

	// phpcs:disable
	date_default_timezone_set( 'UTC' );

	if ( null === $from_timestamp ) {
		$next_timestamp = strtotime( $time_string );
	} else {
		$next_timestamp = strtotime( $time_string, $from_timestamp );
	}

	date_default_timezone_set( $original_timezone );
	// phpcs:enable

	return $next_timestamp;
}


/**
 * hrt Timezone - helper to retrieve the timezone string for a site until.
 * a WP core method exists (see https://core.trac.wordpress.org/ticket/24730).
 *
 * Adapted from https://secure.php.net/manual/en/function.timezone-name-from-abbr.php#89155.
 *
 * @since 0.1.0
 * @return string PHP timezone string for the site
 */
function hrt_timezone_string() {
	// Added in WordPress 5.3 Ref https://developer.wordpress.org/reference/functions/wp_timezone_string/.
	if ( function_exists( 'wp_timezone_string' ) ) {
		return wp_timezone_string();
	}

	// If site timezone string exists, return it.
	$timezone = get_option( 'timezone_string' );
	if ( $timezone ) {
		return $timezone;
	}

	// Get UTC offset, if it isn't set then return UTC.
	$utc_offset = floatval( get_option( 'gmt_offset', 0 ) );
	if ( ! is_numeric( $utc_offset ) || 0.0 === $utc_offset ) {
		return 'UTC';
	}

	// Adjust UTC offset from hours to seconds.
	$utc_offset = (int) ( $utc_offset * 3600 );

	// Attempt to guess the timezone string from the UTC offset.
	$timezone = timezone_name_from_abbr( '', $utc_offset );
	if ( $timezone ) {
		return $timezone;
	}

	// Last try, guess timezone string manually.
	foreach ( timezone_abbreviations_list() as $abbr ) {
		foreach ( $abbr as $city ) {
			// WordPress restrict the use of date(), since it's affected by timezone settings, but in this case is just what we need to guess the correct timezone.
			if ( (bool) date( 'I' ) === (bool) $city['dst'] && $city['timezone_id'] && intval( $city['offset'] ) === $utc_offset ) { // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date
				return $city['timezone_id'];
			}
		}
	}

	// Fallback to UTC.
	return 'UTC';
}

/**
 * Trim trailing zeros off prices.
 *
 * @since 0.1.0
 *
 * @param string|float|int $price Price.
 * @return string
 */
function hrt_trim_zeros( $price ) {
	return preg_replace( '/' . preg_quote( hrt_get_price_decimal_separator(), '/' ) . '0++$/', '', $price );
}

/**
 * Clean variables using sanitize_text_field. Arrays are cleaned recursively.
 * Non-scalar values are ignored.
 *
 * @since 0.1.0
 *
 * @param string|array $var Data to sanitize.
 * @return string|array
 */
function hrt_clean( $var ) {
	if ( is_array( $var ) ) {
		return array_map( 'hrt_clean', $var );
	} else {
		return is_scalar( $var ) ? sanitize_text_field( $var ) : $var;
	}
}


/**
 * hrt Date Format - Allows to change date format for everything hrt.
 *
 * @since 0.1.0
 *
 * @return string
 */
function hrt_date_format() {
	$date_format = get_option( 'date_format' );

	if ( empty( $date_format ) ) {
		// Return default date format if the option is empty.
		$date_format = 'F j, Y';
	}
	return apply_filters( 'hrt_date_format', $date_format );
}

/**
 * hrt Time Format - Allows to change time format for everything hrt.
 *
 * @since 0.1.0
 *
 * @return string
 */
function hrt_time_format() {
	$time_format = get_option( 'time_format' );
	if ( empty( $time_format ) ) {
		// Return default time format if the option is empty.
		$time_format = 'g:i a';
	}
	return apply_filters( 'hrt_time_format', $time_format );
}

/**
 * Sanitize permalink values before insertion into DB.
 *
 * Cannot use hrt_clean because it sometimes strips % chars and breaks the user's setting.
 *
 * @since  0.1.0
 * @param  string $value Permalink.
 * @return string
 */
function hrt_sanitize_permalink( $value ) {
	global $wpdb;

	$value = $wpdb->strip_invalid_text_for_column( $wpdb->options, 'option_value', $value );

	if ( is_wp_error( $value ) ) {
		$value = '';
	}

	$value = esc_url_raw( trim( $value ) );
	$value = str_replace( 'http://', '', $value );
	return untrailingslashit( $value );
}

/**
 * Make a string lowercase.
 * Try to use mb_strtolower() when available.
 *
 * @since  0.1.0
 *
 * @param  string $string String to format.
 *
 * @return string
 */
function hrt_strtolower( $string ) {
	return function_exists( 'mb_strtolower' ) ? mb_strtolower( $string ) : strtolower( $string );
}

/**
 * Wrapper for mb_strtoupper which see's if supported first.
 *
 * @since  0.1.0
 * @param  string $string String to format.
 * @return string
 */
function hrt_strtoupper( $string ) {
	return function_exists( 'mb_strtoupper' ) ? mb_strtoupper( $string ) : strtoupper( $string );
}

/**
 * Formats a stock amount by running it through a filter.
 *
 * @since 0.1.0
 *
 * @param  int|float $amount Stock amount.
 * @return int|float
 */
function hrt_stock_amount( $amount ) {
	return apply_filters( 'hrt_stock_amount', $amount );
}

/**
 * Round a number using the built-in `round` function, but unless the value to round is numeric
 * (a number or a string that can be parsed as a number), apply 'floatval' first to it
 * (so it will convert it to 0 in most cases).
 *
 * This is needed because in PHP 7 applying `round` to a non-numeric value returns 0,
 * but in PHP 8 it throws an error. Specifically, in hrt we have a few places where
 * round('') is often executed.
 *
 * @since 0.1.0
 *
 * @param mixed $val The value to round.
 * @param int   $precision The optional number of decimal digits to round to.
 * @param int   $mode A constant to specify the mode in which rounding occurs.
 *
 * @return float The value rounded to the given precision as a float, or the supplied default value.
 */
function hrt_round( $val, $precision = 0, $mode = PHP_ROUND_HALF_UP ) {
	$precision = (int) $precision;
	$mode      = (int) $mode;
	$val       = is_numeric( $val ) ? $val : (float) $val;

	return round( $val, $precision, $mode );
}

/**
 * Trim a string and append a suffix.
 *
 * @since 0.1.0
 *
 * @param  string  $string String to trim.
 * @param  integer $chars  Amount of characters.
 *                         Defaults to 200.
 * @param  string  $suffix Suffix.
 *                         Defaults to '...'.
 * @return string
 */
function hrt_trim_string( $string, $chars = 200, $suffix = '...' ) {
	if ( strlen( $string ) > $chars ) {
		if ( function_exists( 'mb_substr' ) ) {
			$string = mb_substr( $string, 0, ( $chars - mb_strlen( $suffix ) ) ) . $suffix;
		} else {
			$string = substr( $string, 0, ( $chars - strlen( $suffix ) ) ) . $suffix;
		}
	}
	return $string;
}

/**
 * Convert a float to a string without locale formatting which PHP adds when changing floats to strings.
 *
 * @since 0.1.0
 *
 * @param  float $float Float value to format.
 * @return string
 */
function hrt_float_to_string( $float ) {
	if ( ! is_float( $float ) ) {
		return $float;
	}

	$locale = localeconv();
	$string = strval( $float );
	$string = str_replace( $locale['decimal_point'], '.', $string );

	return $string;
}

/**
 * Format a date for output.
 *
 * @since  0.1.0
 * @param  HRT\DateTime $date   Instance of HRT\DateTime.
 * @param  string      $format Data format.
 *                             Defaults to the hrt_date_format function if not set.
 * @return string
 */
function hrt_format_datetime( $date, $format = '' ) {
	if ( empty( $format ) ) {
		$format = hrt_date_format();
	}

	if ( ! is_a( $date, 'HRT\DateTime' ) ) {
		return '';
	}

	return $date->date_i18n( $format );
}

/**
 * Parses and formats a date for ISO8601/RFC3339.
 *
 * Required WP 4.4 or later.
 * See https://developer.wordpress.org/reference/functions/mysql_to_rfc3339/
 *
 * @since  0.1.0
 * @param  string|null|DateTime $date Date.
 * @param  bool                    $utc  Send false to get local/offset time.
 * @return string|null ISO8601/RFC3339 formatted datetime.
 */
function hrt_rest_prepare_date_response( $date, $utc = true ) {
	if ( is_numeric( $date ) ) {
		$date = new DateTime( "@$date", new \DateTimeZone( 'UTC' ) );
		$date->setTimezone( new \DateTimeZone( hrt_timezone_string() ) );
	} elseif ( is_string( $date ) ) {
		$date = new DateTime( $date, new \DateTimeZone( 'UTC' ) );
		$date->setTimezone( new \DateTimeZone( hrt_timezone_string() ) );
	}

	if ( ! is_a( $date, 'HRT\DateTime' ) ) {
		return null;
	}

	// Get timestamp before changing timezone to UTC.
	return gmdate( 'Y-m-d\TH:i:s', $utc ? $date->getTimestamp() : $date->getOffsetTimestamp() );
}
