<?php
/**
 * Service Providers.
 *
 * @since 0.1.0
 */
return array_unique(
	apply_filters(
		'hrt_service_providers',
		array(
			'HRT\Providers\AppServiceProvider',
			'HRT\Providers\UrlSchemesServiceProvider',
			'HRT\Providers\SettingServiceProvider',
		)
	)
);
