<?php
/*
* Plugin Name: Order Food
* Description: После активации плагина необходимо создать страницу, которая будет отвечать за вывод всего меню. Внимание! При смене темы сайта необходимо деактивировать плагин и снова активировать его. 
*/

add_action('init', 'order_food');
function order_food(){
	register_post_type('order_food', array(
		'public' => true,
		'supports' => array('title', 'thumbnail', 'editor', 'excerpt', 'page-attributes', 'post-formats', 'revisions', 'trackbacks','custom-fields'),
		'labels' => array(
			'name' => 'Заказ еды',
			'all_items' => 'Все блюда',
			'add_new' => 'Добавить новое',
			'add_new_item' => 'Добавление блюда',
			'edit_item' => 'Редактировать',
			'view_item' => 'Посмотреть',
			''
        ),
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => true,
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => true,
		'menu_icon'          => 'dashicons-media-document'
	));
};

add_action('init', 'create_taxonomy_for_order_food');
function create_taxonomy_for_order_food() {
    register_taxonomy( 'order_food_category', [ 'order_food' ], [ 
		'label'                 => '', // определяется параметром $labels->name
		'labels'                => [
			'name'              => 'Категории',
			'singular_name'     => 'Категория',
			'search_items'      => 'Поиск категорий',
			'all_items'         => 'Все категории',
			'view_item '        => 'Посмотреть категорию',
			'parent_item'       => 'Родительская категория',
			'parent_item_colon' => 'Родительская категория:',
			'edit_item'         => 'Редактировать категорию',
			'update_item'       => 'Обновить категорию',
			'add_new_item'      => 'Добавить новую категорию',
			'new_item_name'     => 'Имя новой категории',
			'menu_name'         => 'Категории',
		],
		'description'           => '', // описание таксономии
		'public'                => true,
		'publicly_queryable'    => null, // равен аргументу public
		'show_in_nav_menus'     => true, // равен аргументу public
		'show_ui'               => true, // равен аргументу public
		'show_in_menu'          => true, // равен аргументу show_ui
		'show_tagcloud'         => true, // равен аргументу show_ui
		'show_in_quick_edit'    => null, // равен аргументу show_ui
		'hierarchical'          => false,

		'rewrite'               => true,
	    'query_var'             => $taxonomy, // название параметра запроса
		'capabilities'          => array(),
		'meta_box_cb'           => null, // html метабокса. callback: `post_categories_meta_box` или `post_tags_meta_box`. false — метабокс отключен.
		'show_admin_column'     => false, // авто-создание колонки таксы в таблице ассоциированного типа записи. (с версии 3.5)
		'show_in_rest'          => null, // добавить в REST API
		'rest_base'             => null, // $taxonomy
		// '_builtin'              => false,
		//'update_count_callback' => '_update_post_term_count',
	] );
}



register_activation_hook(__FILE__, 'activation_order_food_plugin');

function activation_order_food_plugin() {
    if(!file_exists(get_theme_file_path('order-food-template.php'))) {
		$template_content = file_get_contents(plugin_dir_url( __FILE__ ) . 'order-food-template.txt');
		file_put_contents(get_theme_file_path('order-food-template.php'), $template_content);
	}

	if(!file_exists(get_theme_file_path('taxonomy-order_food_category.php'))) {
		$taxonomy_template_content = file_get_contents(plugin_dir_url( __FILE__ ) . 'taxonomy-order_food_category.txt');
    	file_put_contents(get_theme_file_path('taxonomy-order_food_category.php'), $taxonomy_template_content);
	}

	if(!file_exists(get_theme_file_path('order-food-basket.php'))) {
		$template_content = file_get_contents(plugin_dir_url( __FILE__ ) . 'order-food-basket.txt');
		file_put_contents(get_theme_file_path('order-food-basket.php'), $template_content);
	}

	if(!file_exists(get_theme_file_path( 'order-food-assets' ))) {
		mkdir(get_theme_file_path( 'order-food-assets' ));
	}
	
	if(!file_exists(get_theme_file_path( 'order-food-assets/order-food-scripts.js' ))) {
		$script_content = file_get_contents(plugin_dir_url( __FILE__ ) . 'order-food-scripts.js');
		file_put_contents(get_theme_file_path('order-food-assets/order-food-scripts.js'), $script_content);
	}

	if(!file_exists(get_theme_file_path( 'order-food-assets/order-food-style.css' ))) {
		$style_content = file_get_contents(plugin_dir_url( __FILE__ ) . 'order-food-style.css');
		file_put_contents(get_theme_file_path('order-food-assets/order-food-style.css'), $style_content);
	}

	add_filter( 'get_the_archive_title', function( $title ){
		return preg_replace('~^[^:]+: ~', '', $title );
	});
};

register_deactivation_hook(__FILE__, 'deactivation_order_food_plugin');

function deactivation_order_food_plugin() {
	if(file_exists(get_theme_file_path('order-food-template.php'))) {
		unlink(get_theme_file_path('order-food-template.php'));
	}

	if(file_exists(get_theme_file_path('taxonomy-order_food_category.php'))) {
		unlink(get_theme_file_path('taxonomy-order_food_category.php'));
	}

	if(file_exists(get_theme_file_path('order-food-basket.php'))) {
		unlink(get_theme_file_path('order-food-basket.php'));
	}

	if(file_exists(get_theme_file_path('order-food-assets/order-food-scripts.js'))) {
		unlink(get_theme_file_path('order-food-assets/order-food-scripts.js'));
	}

	if(file_exists(get_theme_file_path('order-food-assets/order-food-style.css'))) {
		unlink(get_theme_file_path('order-food-assets/order-food-style.css'));
	}

	if(file_exists(get_theme_file_path('order-food-assets'))) {
		rmdir(get_theme_file_path('order-food-assets'));
	}
}