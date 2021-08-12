<?php
/**
 * Main class.
 *
 * @package HRT
 *
 * @since 0.1.0
 */

namespace HRT;

defined('ABSPATH') || exit;

/**
 * Main class.
 * 
 * @since 0.1.0
 */
class HTTPRequestsTracker
{
    /**
     * Constructor.
     *
     * @since 0.1.0
     */
    public function __construct()
    {
        $this->init();
    }

    /**
     * Get applicaiton version.
     *
     * @since 0.1.0
     *
     * @return string
     */
    public function version()
    {
        return HRT_VERSION;
    }

    /**
     * Initialize the applicaiton.
     *
     * @since 0.1.0
     */
    protected function init()
    {
        // Initilize the hooks.
        $this->init_hooks();
    }

    /**
     * Initialize hooks.
     *
     * @since 0.1.0
     */
    protected function init_hooks()
    {
        add_action('init', array( $this, 'wp_init' ), 0);

        add_filter('plugin_row_meta', array( $this, 'add_plugin_links' ), 10, 2);
        add_filter('plugin_action_links_' . Constants::get('HRT_PLUGIN_BASENAME'), array( $this, 'add_plugin_action_links' ));
    }

    /**
     * Initialization after WordPress is initialized.
     *
     * @since 0.1.0
     */
    public function wp_init()
    {
        $this->load_text_domain();
    }

    /**
     * Load plugin textdomain.
     *
     * @since 0.1.0
     */
    public function load_text_domain()
    {
        load_plugin_textdomain(
            'hrt',
            false,
            dirname(plugin_basename(Constants::get('HRT_PLUGIN_FILE'))) . '/' . Constants::get('HRT_PLUGIN_REL_LANGUAGES_PATH')
        );
    }

    /**
     * Add plugin links on the plugins screen.
     *
     * @since 0.1.0
     *
     * @param mixed $links Plugin Row Meta.
     * @param mixed $file  Plugin Base file.
     *
     * @return array
     */
    public static function add_plugin_links( $links, $file )
    {
        if (Constants::get('HRT_PLUGIN_BASENAME') !== $file ) {
            return $links;
        }

        $hrt_links = array(
        'docs'    => array(
        'url'        => apply_filters('hrt_docs_url', '#'),
        'label'      => __('Docs', 'hrt'),
        'aria-label' => __('View hrt documentation', 'hrt'),
        ),
        'apidocs' => array(
        'url'        => apply_filters('hrt_apidocs_url', '#'),
        'label'      => __('API docs', 'hrt'),
        'aria-label' => __('View hrt API docs', 'hrt'),
        ),
        'support' => array(
        'url'        => apply_filters('hrt_community_support_url', 'https://wordpress.org/support/plugin/hrt/'),
        'label'      => __('Community Support', 'hrt'),
        'aria-label' => __('Visit community forums', 'hrt'),
        ),
        );

        foreach ( $hrt_links as $key => $link ) {
            $links[ $key ] = sprintf(
                '<a href="%s" aria-label="%s">%s</a>',
                esc_url($link['url']),
                esc_attr($link['aria-label']),
                esc_html($link['label'])
            );
        }

        return $links;
    }

    /**
     * Add action links on the plugins screen.
     *
     * @since 0.1.0
     *
     * @param mixed $links Plugin Action links.
     *
     * @return array
     */
    public static function add_plugin_action_links( $links )
    {
        $action_links      = array(
        'settings' => array(
        'url'        => admin_url('admin.php?page=hrt#/settings'),
        'label'      => __('Settings', 'hrt'),
        'aria-label' => __('View hrt settings', 'hrt'),
        ),
        );
        $action_link_htmls = array();

        foreach ( $action_links as $key => $link ) {
            $action_link_htmls[ $key ] = sprintf(
                '<a href="%s" aria-label="%s">%s</a>',
                esc_url($link['url']),
                esc_attr($link['aria-label']),
                esc_html($link['label'])
            );
        }

        return array_merge($action_link_htmls, $links);
    }
}
