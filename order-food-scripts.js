jQuery(document).ready(function () {

    jQuery('.menu a').click(function () {
        jQuery('.menu a').removeClass('active_menu_item');
        jQuery(this).addClass('active_menu_item');
    });

    jQuery('.product-img-in-loop').click(function () {
        jQuery(this).parent().toggleClass('flex-content');
        jQuery(this).toggleClass('full-width-product-img');
        jQuery('body,html').toggleClass('black-body');
    });

    jQuery('.open-mobile-menu-order-food').click(function () {
        jQuery('.order-food-mobile-menu').toggleClass('order-food-mobile-menu-active');
    });

    function setCookie(name, value) {
        document.cookie = name + "=" + value + '; path = /';
    }

    function getCookie(name) {
        var r = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
        if (r) return r[2];
        else return "";
    }

    function deleteCookie(name) {
        var date = new Date(); // Берём текущую дату
        date.setTime(date.getTime() - 1); // Возвращаемся в "прошлое"
        document.cookie = name += "=; expires=" + date.toGMTString(); // Устанавливаем cookie пустое значение и срок действия до прошедшего уже времени
    }


    function saveOrderCart() {
        var delivery = {
            productImg: [],
            productName: [],
            productPrice: [],
            productId: [],
            productQuantity: []
        }
        var order = {
            productImg: [],
            productName: [],
            productPrice: [],
            productId: [],
            productQuantity: []
        }
        jQuery('.products-in-cart-delivery .product-in-cart').each(function () {
            delivery.productImg.push(jQuery(this).find('.product-in-cart-img').attr('src'));
            delivery.productName.push(jQuery(this).find('.product-name-quantity h6').text());
            delivery.productPrice.push(jQuery(this).find('.price').text());
            delivery.productId.push(jQuery(this).attr('data-id'));
            delivery.productQuantity.push(jQuery(this).find('.quantity').val());
        });

        jQuery('.products-in-cart-order .product-in-cart').each(function () {
            order.productImg.push(jQuery(this).find('.product-in-cart-img').attr('src'));
            order.productName.push(jQuery(this).find('.product-name-quantity h6').text());
            order.productPrice.push(jQuery(this).find('.price').text());
            order.productId.push(jQuery(this).attr('data-id'));
            order.productQuantity.push(jQuery(this).find('.quantity').val());
        })

        setCookie('delivery', JSON.stringify(delivery));
        setCookie('order', JSON.stringify(order));
        setCookie('summary', jQuery('.total-price .summary').text());
    }

    function loadOrderCart() {
        var deliveryString = getCookie('delivery');
        var orderString = getCookie('order');
        summary = getCookie('summary');

        if (summary == '') {
            summary = 0;
        }

        if (deliveryString != '') {
            var delivery = JSON.parse(deliveryString);
            if (delivery.productId.length > 0) {
                jQuery('.empty-basket').hide();
                jQuery('.delivery-title').show();
                jQuery('.products-in-cart-delivery').show();

                for (var i = 0; i < delivery.productId.length; i++) {
                    jQuery('.products-in-cart-delivery').append('<div data-id="' + delivery.productId[i] + '" class="product-in-cart"> ' +
                        ' <img class="product-in-cart-img" src="' + delivery.productImg[i] + '" alt=""> ' +
                        '<div class="product-name-quantity"> ' +
                        '<h6>' + delivery.productName[i] + '</h6>' +
                        '<input min="1" value="' + delivery.productQuantity[i] + '" data-value="' + delivery.productQuantity[i] + '" class="quantity" type="number">' +
                        '<div class="remove-product"><i class="fas fa-times"></i></div>' +
                        '</div> ' +
                        '<div class="price"> ' +
                        delivery.productPrice[i] + ' <i class="fas fa-ruble-sign"></i> ' +
                        ' </div> ' +
                        ' </div>');
                };
            }

        }

        if (orderString != '') {
            var order = JSON.parse(orderString);
            if (order.productId.length > 0) {
                jQuery('.empty-basket').hide();
                jQuery('.order-title').show();
                jQuery('.products-in-cart-order').show();

                for (var i = 0; i < order.productId.length; i++) {
                    jQuery('.products-in-cart-order').append('<div data-id="' + order.productId[i] + '" class="product-in-cart"> ' +
                        ' <img class="product-in-cart-img" src="' + order.productImg[i] + '" alt=""> ' +
                        '<div class="product-name-quantity"> ' +
                        '<h6>' + order.productName[i] + '</h6>' +
                        '<input min="1" value="' + order.productQuantity[i] + '" data-value="' + order.productQuantity[i] + '" class="quantity" type="number">' +
                        '<div class="remove-product"><i class="fas fa-times"></i></div>' +
                        '</div> ' +
                        '<div class="price"> ' +
                        order.productPrice[i] + ' <i class="fas fa-ruble-sign"></i> ' +
                        ' </div> ' +
                        ' </div>');
                };
            }

        }

        jQuery('.summary').html(summary + '<i class="fas fa-ruble-sign"></i>');
    };

    loadOrderCart();

    function changeQuantity(param) {
        var quantityCurrent = Number(jQuery(param).attr('data-value'));
        var quatityUpdate = Number(jQuery(param).val());
        var quatityResult = quatityUpdate - quantityCurrent;

        var price = jQuery(param).parent().parent().find('.price').text();
        var summary = Number(jQuery('.total-price .summary').text());
        jQuery(param).attr('data-value', quatityUpdate);
        summary = summary + price * quatityResult;
        jQuery('.summary').html(summary + ' <i class="fas fa-ruble-sign"></i>');
        saveOrderCart();
    }

    function deleteOrder() {
        var removeProductOrderBtn = jQuery('.products-in-cart').find('.remove-product i');
        jQuery(removeProductOrderBtn).click(function (e) {
            e.preventDefault();
            jQuery(this).parent().parent().parent().find('.quantity').attr('min', 0);
            jQuery(this).parent().parent().parent().find('.quantity').val(0);
            changeQuantity(jQuery(jQuery(this).parent().parent().parent().find('.quantity')));
            jQuery(this).parent().parent().parent().remove();
            saveOrderCart();

            if (jQuery('.products-in-cart-order').length == 1) {
                jQuery('.order-title').hide();
                jQuery('.empty-basket').show();
            } 
            if(jQuery('.products-in-cart-delivery').length == 1) {
                jQuery('.delivery-title').hide();
                jQuery('.empty-basket').show();
            }
        });
    }
    deleteOrder();

    // доставка
    jQuery('.delivery').click(function (e) {
        e.preventDefault;
        var summary = Number(jQuery('.total-price .summary').text());
        var product = jQuery(this).parent().parent();
        var productImg = jQuery(product).find('img').attr('src');
        var productName = jQuery(product).find('.product-header h2').text();
        var productPrice = jQuery(product).find('.price').text();
        var productId = jQuery(product).data('id');

        jQuery('.empty-basket').hide();
        jQuery('.delivery-title').show();
        jQuery('.products-in-cart-delivery').show();

        if (jQuery('.products-in-cart-delivery').find('[data-id = "' + productId + '"]').length > 0) {
            var productQuantity = jQuery('.products-in-cart-delivery').find('[data-id = "' + productId + '"]').find('.quantity').val();
            jQuery('.products-in-cart-delivery').find('[data-id = "' + productId + '"]').find('.quantity').val(Number(productQuantity) + 1);
            jQuery('.products-in-cart-delivery').find('[data-id = "' + productId + '"]').find('.quantity').attr('data-value', Number(productQuantity) + 1);
        } else {
            jQuery('.products-in-cart-delivery').append('<div data-id="' + productId + '" class="product-in-cart"> ' +
                ' <img class="product-in-cart-img" src="' + productImg + '" alt=""> ' +
                '<div class="product-name-quantity"> ' +
                '<h6>' + productName + '</h6>' +
                '<input min="1" value="1" data-value="1" class="quantity" type="number">' + 
                '<div class="remove-product"><i class="fas fa-times"></i></div>' +
                '</div> ' +
                '<div class="price"> ' +
                productPrice + ' <i class="fas fa-ruble-sign"></i> ' +
                ' </div> ' +
                ' </div>');
        }

        summary = summary + Number(productPrice);
        jQuery('.summary').html(summary + '<i class="fas fa-ruble-sign"></i>');

        jQuery('.quantity').on('change', function () {
            changeQuantity(jQuery(this));
        });

        saveOrderCart();
        deleteOrder();

    });

    // Предзаказ

    jQuery('.order').click(function (e) {
        e.preventDefault;
        var summary = Number(jQuery('.total-price .summary').text());
        var product = jQuery(this).parent().parent();
        var productImg = jQuery(product).find('img').attr('src');
        var productName = jQuery(product).find('.product-header h2').text();
        var productPrice = jQuery(product).find('.price').text();
        var productId = jQuery(product).data('id');

        jQuery('.empty-basket').hide();
        jQuery('.order-title').show();
        jQuery('.products-in-cart-order').show();

        if (jQuery('.products-in-cart-order').find('[data-id = "' + productId + '"]').length > 0) {
            var productQuantity = jQuery('.products-in-cart-order').find('[data-id = "' + productId + '"]').find('.quantity').val();
            jQuery('.products-in-cart-order').find('[data-id = "' + productId + '"]').find('.quantity').val(Number(productQuantity) + 1);
            jQuery('.products-in-cart-order').find('[data-id = "' + productId + '"]').find('.quantity').attr('data-value', Number(productQuantity) + 1);
        } else {
            jQuery('.products-in-cart-order').append('<div data-id="' + productId + '" class="product-in-cart"> ' +
                '<img class="product-in-cart-img" src="' + productImg + '" alt=""> ' +
                '<div class="product-name-quantity"> ' +
                '<h6>' + productName + '</h6>' +
                '<input min="1" value="1" data-value="1" class="quantity" type="number">' +
                '<div class="remove-product"><i class="fas fa-times"></i></div>' +
                '</div> ' +
                '<div class="price"> ' +
                productPrice + ' <i class="fas fa-ruble-sign"></i> ' +
                ' </div> ' +
                ' </div>');
        }

        summary = summary + Number(productPrice);
        jQuery('.summary').html(summary + '<i class="fas fa-ruble-sign"></i>');

        console.log(jQuery('.quantity').val());

        jQuery('.quantity').on('change', function () {
            changeQuantity(jQuery(this));
        });

        saveOrderCart();
        deleteOrder();

    });

    jQuery('.quantity').on('change', function () {
        changeQuantity(jQuery(this));
    });

});