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
    
    var discountMoney = Number(jQuery('.discount-money').text());

    function countDiscount() {
        var totalSummary = Number(jQuery('.total-price .summary').text());
        var discountResidue = discountMoney - totalSummary;
        var discountPercent = totalSummary * 100 / discountMoney;

        if(discountResidue <= 0) {
            jQuery('.discount-finish').show();
            jQuery('.discount-start').hide();
            jQuery('.discount-bg').css('width', '100%');
        } else {
            jQuery('.discount-start').show();
            jQuery('.discount-finish').hide();
            jQuery('.discount-money').html(discountResidue);
            jQuery('.discount-bg').css('width', discountPercent + '%');
        }

    };

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
    countDiscount();

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
        countDiscount();
    }

    function hideEmptyCart() {
        if (jQuery('.products-in-cart-order .product-in-cart').length == 0) {
            jQuery('.order-title').hide();  
        } 
        if(jQuery('.products-in-cart-delivery .product-in-cart').length == 0) {
            jQuery('.delivery-title').hide();
        }
        if(jQuery('.products-in-cart-order .product-in-cart').length == 0 && jQuery('.products-in-cart-delivery .product-in-cart').length == 0) {
            jQuery('.empty-basket').show();
        }
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
            hideEmptyCart();
        });
    }
    deleteOrder();

    function loadOrderInTable() {
        var deliveryString = getCookie('delivery');
        var orderString = getCookie('order');
        summary = getCookie('summary');

        if (deliveryString != '') {
            var delivery = JSON.parse(deliveryString);
            if (delivery.productId.length > 0) {
                for (var i = 0; i < delivery.productId.length; i++) {
                    var productNumber = i + 1
                    jQuery('.order-table tbody').append('<tr>' +
                        '<th scope="row">' + productNumber + '</th>' +
                        '<td>' + delivery.productName[i] + '</td>' +
                        '<td>' + delivery.productPrice[i] + '</td>' +
                        '<td>' + delivery.productQuantity[i] + '</td>' +
                        '</tr>');
                };
                var discount;
                if (summary >= 3000) {
                    discount = 10;
                    discountSummary = summary * discount / 100;
                    summary = summary - discountSummary;

                } else {
                    discount = 0;
                }
                jQuery('.order-total-table tbody').append(
                    '<tr>' +
                    '<th scope="row">Скидка: </th>' +
                    '<td>' + discount + '%</td>' +
                    '<td colspan="1"><b>Итого: </b></td>' +
                    '<td>' + summary + ' <i class="fas fa-ruble-sign"></i></td>' +
                    '</tr>'
                );
                jQuery('.props').append(
                    '<div class="form-group">' +
                    '<label>Ваше имя *</label>' +
                    '<input id="clientName" type="text" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label>Номер телефона *</label>' +
                    '<input id="clientPhone" type="phone" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label>Адрес доставки заказа</label>' +
                    '<input id="clientAddress" type="text" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label>Почтовый ящик</label>' +
                    '<input id="clientEmail" type="email" class="form-control">' +
                    '</div>'
                );
            }

        }

        if (orderString != '') {
            var order = JSON.parse(orderString);
            if (order.productId.length > 0) {
                for (var i = 0; i < order.productId.length; i++) {
                    var productNumber = i + 1
                    jQuery('.order-table tbody').append('<tr>' +
                        '<th scope="row">' + productNumber + '</th>' +
                        '<td>' + order.productName[i] + '</td>' +
                        '<td>' + order.productPrice[i] + '</td>' +
                        '<td>' + order.productQuantity[i] + '</td>' +
                        '</tr>');
                };
                var discount;
                if (summary >= 3000) {
                    discount = 10;
                    discountSummary = summary * discount / 100;
                    summary = summary - discountSummary;

                } else {
                    discount = 0;
                }
                jQuery('.order-total-table tbody').append(
                    '<tr>' +
                    '<th scope="row">Скидка: </th>' +
                    '<td>' + discount + '%</td>' +
                    '<td colspan="1"><b>Итого: </b></td>' +
                    '<td>' + summary + ' <i class="fas fa-ruble-sign"></i></td>' +
                    '</tr>'
                );

                jQuery('.props').append(
                    '<div class="form-group">' +
                    '<label>Ваше имя *</label>' +
                    '<input id="clientName" type="text" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label>Номер телефона *</label>' +
                    '<input id="clientPhone" type="phone" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label>Дата прибытия в ресторан</label>' +
                    '<input id="clientDate" type="date" class="form-control">' +
                    '</div>' +
                    '<label>Время прибытия в ресторан</label>' +
                    '<input id="clientTime" type="time" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label>Почтовый ящик</label>' +
                    '<input id="clientEmail" type="email" class="form-control">' +
                    '</div>'
                );
            }

        }
    }

    // доставка
    jQuery('.delivery').click(function (e) {
        e.preventDefault;

        if (jQuery('.order-sidebar').find('.order-title').is(':visible')) {
            jQuery('.confirm-window').show();
            jQuery('.order-confirm').show();
        } else {
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
            countDiscount();
        }

    });

    // Предзаказ

    jQuery('.order').click(function (e) {
        e.preventDefault;

        if (jQuery('.order-sidebar').find('.delivery-title').is(':visible')) {
            jQuery('.confirm-window').show();
            jQuery('.delivery-confirm').show();
        } else {
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
            countDiscount();
        }

    });

    function deleteDeliveryOrder() {
        var allProductsDelivery = jQuery('.product-in-cart');
        for (let i = 0; i < allProductsDelivery.length; i++) {
            jQuery(allProductsDelivery[i]).remove();
        }
        
    }

    jQuery('.quantity').on('change', function () {
        changeQuantity(jQuery(this));
    });

    jQuery('.negative-confirm').click(function(){
        jQuery('.confirm-window').hide();
        jQuery('.order-confirm').hide();
        jQuery('.delivery-confirm').hide();
    });

    jQuery('.positive-confirm').click(function () {
        deleteDeliveryOrder();
        jQuery('.summary').html(0 + '<i class="fas fa-ruble-sign"></i>');
        jQuery('.confirm-window').hide();
        jQuery('.order-confirm').hide();
        jQuery('.delivery-confirm').hide();
        saveOrderCart();
        hideEmptyCart();
        countDiscount();
    });

    jQuery('.confirm-order').click(function(){
        loadOrderInTable();
        jQuery('.confirm-order-table').show();
    });

    function sendOrder() {
        var deliveryString = getCookie('delivery');
        var orderString = getCookie('order');
        summary = getCookie('summary');
        var message = '';
        var clientName = jQuery('#clientName').val();
        var clientPhone = jQuery('#clientPhone').val();
        var clientAddress = jQuery('#clientAddress').val();
        var clientEmail = jQuery('#clientEmail').val();
        var clientDate = jQuery('#clientDate').val();
        var clientTime = jQuery('#clientTime').val();
        

        if (deliveryString != '') {
            
            var delivery = JSON.parse(deliveryString);
            if (delivery.productId.length > 0) {
                message = message + 'Заказ на доставку \n';
                for (var i = 0; i < delivery.productId.length; i++) {
                    message = message + (i + 1) + ' ' + delivery.productName[i].trim() + ' ' + delivery.productPrice[i].trim() + ' x ' + delivery.productQuantity[i].trim() + '\n';
                };
                var discount;
                if (summary >= 3000) {
                    discount = 10;
                    discountSummary = summary * discount / 100;
                    summary = summary - discountSummary;

                } else {
                    discount = 0;
                }

                message = message + 'ИТОГО: ' + summary + ' Со скидкой ' + discount + '%' + '\n';
                message = message + ' ' + clientName + ' ' + clientPhone + ' ' + clientAddress + ' ' + clientEmail ;
            }

        }

        if (orderString != '') {
            var order = JSON.parse(orderString);
            if (order.productId.length > 0) {
                message = message + 'Предзаказ в ресторане \n';
                for (var i = 0; i < order.productId.length; i++) {
                    message = message + (i + 1) + ' ' + order.productName[i].trim() + ' ' + order.productPrice[i].trim() + ' x ' + order.productQuantity[i].trim() + '\n';
                };
                var discount;
                if (summary >= 3000) {
                    discount = 10;
                    discountSummary = summary * discount / 100;
                    summary = summary - discountSummary;

                } else {
                    discount = 0;
                }

                message = message + 'ИТОГО: ' + summary + ' Со скидкой ' + discount + '%' + '\n';
                message = message + ' ' + clientName + ' ' + clientPhone + ' ' + clientDate + ' ' + clientTime + ' ' + clientEmail ;
            }
        }
        console.log(message);
        jQuery.get('https://api.telegram.org/bot1592268106:AAEZ0OMoRG6LyawtMbq3oLQWBdGmJ1cb2wY/sendMessage', {chat_id:'1336055964', text:message});
        jQuery.get('https://api.telegram.org/bot1592268106:AAEZ0OMoRG6LyawtMbq3oLQWBdGmJ1cb2wY/sendMessage', {chat_id:'783982762', text:message});
    }

    jQuery('#pay-order').click(function () { 
        sendOrder();
        
    });
});