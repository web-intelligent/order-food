<?php 

/*
 * Template name: Заказ еды
 * Template post type: page
 */

get_header();
?>
<script src="https://kit.fontawesome.com/1a3f8aa39e.js" crossorigin="anonymous"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
<div class="container">
    <div class="row">
        <div class="col-12">
            <ul class="menu">
                <?php 
                    $terms = get_terms( 'order_food_category' );
                    if( $terms && ! is_wp_error($terms) ){
                        foreach( $terms as $term ){
                            echo '<li><a href="' . get_term_link( $term ) . '">'. $term->name .'</a></li>'; 
                        }
                    }
                ?>    
            </ul>
        </div>
    </div>
</div>
<div class="container mt-5">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-9">
                    <div class="row">
                        <?php 
                            $order_food = new WP_Query( array(
                                'post_type' => 'order_food',
                                    // 'tax_query' => array(
                                    //     array(
                                    //         'taxonomy' => 'order_food_category',
                                    //         'field' => 'slug',
                                    //         'terms' => 'cat1'
                                    //     )
                                    // )
                                ));
                        ?>
                        <?php 
                            if($order_food->have_posts()) {
                                while($order_food->have_posts()) {
                                    $order_food->the_post();
                        ?>
                        <div class="col-sm-12 col-md-6 col-lg-4">
                            <div class="product">
                                <?php the_post_thumbnail('full', 'class=product-img-in-loop')?>
                                <div class="product-header">
                                    <h2><?php the_title();?></h2>
                                    <div class="price">
                                        <?php get_post_meta();?> <i class="fas fa-ruble-sign"></i>
                                    </div>
                                </div>
                                <div class="product-des">
                                    <?php the_excerpt();?>
                                    <div class="weight">250 гр.</div>
                                </div>
                                <div class="buttons">
                                    <a href="#" class="order">Предзаказ</a>
                                    <a href="#" class="delivery">Доставка</a>
                                </div>
                            </div>
                        </div>
                        <?php 
                                }
                            }
                        ?>

                    </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-3">
                    <aside class="order-sidebar">
                        <h5 class="sidebar-heading">Ваш заказ</h5>
                        <div class="widget">
                           <div v-show="isShowAdressInput" class="entering-adress-field">
                                <input placeholder="Ввдиите адрес доставки" class="entering_adress" v-model="adress" type="text" name="" id=""> 
                                <button class="entering-adress-field-button" href="#" v-on:click="enterAdress">Ок</button>
                           </div>
                            <div v-show="isHiddenAdress">
                                <h6 class="widget-title">
                                    Адрес доставки:
                                </h6>
                                <div class="d-flex justify-content-between">
                                    <p>{{adress}}</p>
                                    <button class="entering-adress-field-button" href="#" v-on:click="changeAdress">Изменить</button>
                                </div>
                            </div>
                        </div>
                        <div class="widget-order-delivery">
                            <h6 class="widget-title">
                                Заказ на доставку
                            </h6>
                            <div class="products-in-cart">
                                <div class="product-in-cart">
                                    <img class="produc-in-cart-img" src="images/louis-hansel-shotsoflouis-dsT5LGzEuzE-unsplash.jpg" alt="">
                                    <div class="product-name-quantity">
                                        <h6>Овощное ассорти</h6>
                                        <input class="quantity" type="number">
                                    </div>
                                    <div class="price">
                                        210 <i class="fas fa-ruble-sign"></i>
                                    </div>
                                </div>
                                <div class="product-in-cart">
                                    <img class="produc-in-cart-img" src="images/louis-hansel-shotsoflouis-dsT5LGzEuzE-unsplash.jpg" alt="">
                                    <div class="product-name-quantity">
                                        <h6>Овощное ассорти</h6>
                                        <input class="quantity" type="number">
                                    </div>
                                    <div class="price">
                                        210 <i class="fas fa-ruble-sign"></i>
                                    </div>
                                </div>
                                <div class="product-in-cart">
                                    <img class="produc-in-cart-img" src="images/louis-hansel-shotsoflouis-dsT5LGzEuzE-unsplash.jpg" alt="">
                                    <div class="product-name-quantity">
                                        <h6>Овощное ассорти</h6>
                                        <input class="quantity" type="number">
                                    </div>
                                    <div class="price">
                                        210 <i class="fas fa-ruble-sign"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                    </aside>
                </div>
            </div>
        </div>
    <?php get_footer();?>

<style>
    .menu {
    display: flex;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
    padding-bottom: 10px;
    border-bottom: 3px solid #d5d5d5;
}
.menu li {
    list-style-type: none;
}
.menu a {
    text-decoration: none;
    color: #414141;
    font-weight: bold;
    margin-right: 15px;
}
.active_menu_item {
    border-bottom: 3px solid #f27b2c;
    padding-bottom: 12px;
}
.product-img-in-loop {
    width: 100%;
    height: 263px;
    object-fit: cover;
    border-radius: 10px;
    transition: 0.2s ease-in-out;
}
.full-width-product-img {
    position: fixed;
    width:100%;
    height:100%;
    object-fit:contain;
    top:0;
    left:0;
    z-index:1000;
    transition:0.2s ease-in-out;
}
.flex-content {
    display:flex;
    justify-content:center;
    align-items:center;
}
.product {
    position: relative;
    margin-bottom: 30px;
    transition: 0.2s ease-in-out;
    cursor: pointer;
}
.product:hover .product-img-in-loop {
    box-shadow: 0px 0px 12px rgba(0,0,0,0.5);
}
.product-header {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}
.product h2 {
    font-size: 14px;
    font-weight: bold;
}
.product .price {
    font-weight: bold;
}
.product-des {
    color: #727272;
}
.buttons {
    position: absolute;
    display: flex;
    justify-content: space-between;
    width: 100%;
    opacity: 0;
    visibility: hidden;
    top: 222px;
    transition: 0.2s ease-in-out;
}
.product:hover .buttons {
    opacity: 1;
    visibility: visible;
} 
.order, .delivery {
    background: #f27b2c;
    width: 100%;
    display: block;
    text-decoration: none;
    color:#fff;
    text-align: center;
    padding: 10px 0;
    border-radius: 0 0 0 10px;
    font-weight: bold;
    transition: 0.2s ease-in-out;
}
.order:hover, .delivery:hover {
    color: #fff;
    background: #d46b25;
}
.order:active, .delivery:active {
    color: #fff;
    background: #b85a1c;
    position: relative;
    top: -1px;
}
.order {
    border-right: 1px solid #fff;
}
.delivery {
    border-radius: 0 0 10px 0;
    border-left: 1px solid #fff;
}
.product .weight {
    font-weight: bold;
}
/* Sidebar */
.order-sidebar {
    background: #d5d5d5;
    padding: 10px;
}
.sidebar-heading {
    font-weight: bold;
}
.entering_adress {
    border:1px solid #adadad;
    padding: 5px;
    width: 100%;
    border-radius: 3px;
    margin-right: 10px;
}
.entering_adress:focus {
    outline:none;
}
.entering-adress-field {
    display: flex;
}
.entering-adress-field-button {
    background: #f27b2c;
    color: #fff;
    padding:10px;
    text-decoration: none;
    font-weight: bold;
    border-radius: 3px;
    border: transparent
}
.entering-adress-field-button:hover {
    background: #d46b25;
    color: #fff;
}
.entering-adress-field-button:active {
    color: #fff;
    background: #b85a1c;
    position: relative;
    top: -1px;
}
.widget-title {
    font-weight: bold;
    margin-top: 10px;
}
.products-in-cart {
    height: 100px;
    overflow-y: scroll;
}
.product-in-cart {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
.produc-in-cart-img {
    width:50px;
    height: 50px;
    object-fit: cover;
}
.product-name-quantity h6 {
    font-size: 12px;
    font-weight: bold;
}
.quantity {
    width: 40px;
    border: 1px solid #adadad;
    padding-left: 5px;
}
.quantity:focus {
    outline: none;
}
</style>

<script>
    jQuery(document).ready(function () {
    jQuery('.menu a').click(function () { 
        jQuery('.menu a').removeClass('active_menu_item');
        jQuery(this).addClass('active_menu_item');
    });

    let productName = jQuery('.product-header h2');

    console.log(productName);

    jQuery('.product-img-in-loop').click(function(){
        jQuery(this).parent().toggleClass('flex-content');
        jQuery(this).toggleClass('full-width-product-img');
    });
});

let sidebarWidgetAdress = new Vue({
    el: '.widget',
    data: {
        adress: '',
        isHiddenAdress: false,
        isShowAdressInput: true,
    }, 
    methods: {
        enterAdress() {
            this.isHiddenAdress = true;
            this.isShowAdressInput = false;
        },
        changeAdress() {
            this.isHiddenAdress = false;
            this.isShowAdressInput = true;
        }
    }
});
</script>