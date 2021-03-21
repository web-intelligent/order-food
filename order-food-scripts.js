jQuery(document).ready(function () {
    var mainColor = $('.widget-order-delivery').attr('data-main-color');
    var discountMoney = Number(jQuery('.discount-start').attr('data-value'));
    var discountFinish = Number(jQuery('.discount-finish').attr('data-value'));
    var pickUpDiscount = Number(jQuery('.discountPickup').attr('data-value'));

    var currentLocation = jQuery(location).attr('href');
    $('.menu li').each(function(){
        var link = $(this).find('a').attr('href');
        if(currentLocation == link) {
            $(this).find('a').css('color', mainColor);;
        }
    })

    var overlay = $('.overlay');
    overlay.hide();
    $('.product img').click(function(e){
        e.preventDefault;
        $(overlay).show();
        $(this).clone().appendTo('.pop-up');
    });
    $('.pop-up i').click(function (e) { 
        e.preventDefault();
        $('.pop-up').find('img').remove();
        overlay.hide();
    });
    

    jQuery('.open-mobile-menu-order-food').click(function () {
        jQuery('.order-food-mobile-menu').toggleClass('order-food-mobile-menu-active');
    });
    
    // var discountMoney = Number(jQuery('.discount-money').text());

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

    var dashOffset = 310;
    function countDiscountCircle() {
        var totalSummary = Number(jQuery('.total-price .summary').text());
        var discountPercent = totalSummary * 100 / discountMoney;
        var circlePercent = (discountPercent * dashOffset / 100);
        var dashOffsetNew = dashOffset - circlePercent;
        

        if (dashOffsetNew <= 0) {
            $('.st1').attr('stroke-dashoffset', 0);
            $('.discount-percent').show();
            $('.discount-percent').html(discountFinish + '%');
        } else {
            $('.st1').attr('stroke-dashoffset', dashOffsetNew);
            $('.discount-percent').hide();
        }



    }

    function setCookie(name, value) {
        document.cookie = name + "=" + value + '; path = /';
    }

    function getCookie(name) {
        var r = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
        if (r) return r[2];
        else return "";
    }

    // function deleteCookie(name) {
    //     var date = new Date(); // Берём текущую дату
    //     date.setTime(date.getTime() - 1); // Возвращаемся в "прошлое"
    //     document.cookie = name += "=; expires=" + date.toGMTString(); // Устанавливаем cookie пустое значение и срок действия до прошедшего уже времени
    // }

    function deleteCookie(name) {
        setCookie(name, "", {
            'max-age': -1
        })
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
    countDiscountCircle();

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
        countDiscountCircle();
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

    // ---------------------------------------- Функция расчёта скидки
    function countTotalDiscount() {
        var discount = 0;

        if (summary >= discountMoney) {
            discount = discountFinish;
            discountSummary = summary * discount / 100;
            summary = summary - discountSummary;

            jQuery('.order-total-table tbody .totalPayRow').remove();

            jQuery('.order-total-table tbody').append(
                '<tr class="totalPayRow">' +
                '<th scope="row">Скидка: </th>' +
                '<td>' + discount + '%</td>' +
                '<td colspan="1"><b>Итого: </b></td>' +
                '<td>' + summary + ' <i class="fas fa-ruble-sign"></i></td>' +
                '</tr>'
            );
        } else {
            discount = 0;
        }

        $('input[value="pickup"]').click(function () {
            summary = getCookie('summary');
            if (summary >= discountMoney && $('input[value="pickup"]').is(':checked')) {
                discount = pickUpDiscount + discountFinish;
                discountSummary = summary * discount / 100;
                summary = summary - discountSummary;
                jQuery('.order-total-table tbody .totalPayRow').remove();

                jQuery('.order-total-table tbody').append(
                    '<tr class="totalPayRow">' +
                    '<th scope="row">Скидка: </th>' +
                    '<td>' + discount + '%</td>' +
                    '<td colspan="1"><b>Итого: </b></td>' +
                    '<td>' + summary + ' <i class="fas fa-ruble-sign"></i></td>' +
                    '</tr>'
                );
            } else if (summary < discountMoney && $('input[value="pickup"]').is(':checked')) {
                summary = getCookie('summary');
                discount = pickUpDiscount;
                discountSummary = summary * discount / 100;
                summary = summary - discountSummary;
                jQuery('.order-total-table tbody .totalPayRow').remove();

                jQuery('.order-total-table tbody').append(
                    '<tr class="totalPayRow">' +
                    '<th scope="row">Скидка: </th>' +
                    '<td>' + discount + '%</td>' +
                    '<td colspan="1"><b>Итого: </b></td>' +
                    '<td>' + summary + ' <i class="fas fa-ruble-sign"></i></td>' +
                    '</tr>'
                );
            } else {
                discount = 0;
                jQuery('.order-total-table tbody .totalPayRow').remove();

                jQuery('.order-total-table tbody').append(
                    '<tr class="totalPayRow">' +
                    '<th scope="row">Скидка: </th>' +
                    '<td>' + discount + '%</td>' +
                    '<td colspan="1"><b>Итого: </b></td>' +
                    '<td>' + summary + ' <i class="fas fa-ruble-sign"></i></td>' +
                    '</tr>'
                );
            }

            $('input[value="delivering"]').click(function () {
                summary = getCookie('summary');
                if (summary >= discountMoney) {
                    discount = discountFinish;
                    discountSummary = summary * discount / 100;
                    summary = summary - discountSummary;

                    jQuery('.order-total-table tbody .totalPayRow').remove();

                    jQuery('.order-total-table tbody').append(
                        '<tr class="totalPayRow">' +
                        '<th scope="row">Скидка: </th>' +
                        '<td>' + discount + '%</td>' +
                        '<td colspan="1"><b>Итого: </b></td>' +
                        '<td>' + summary + ' <i class="fas fa-ruble-sign"></i></td>' +
                        '</tr>'
                    );
                } else {
                    discount = 0;
                    jQuery('.order-total-table tbody .totalPayRow').remove();

                    jQuery('.order-total-table tbody').append(
                        '<tr class="totalPayRow">' +
                        '<th scope="row">Скидка: </th>' +
                        '<td>' + discount + '%</td>' +
                        '<td colspan="1"><b>Итого: </b></td>' +
                        '<td>' + summary + ' <i class="fas fa-ruble-sign"></i></td>' +
                        '</tr>'
                    );
                }
            });

        });
    }
    // ------------------------------------------- Конец функции расчёта ссылки

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

                jQuery('.delivery-methods').append(
                    '<div class="delivering-methods">' +
                    '<h4>Выберите способ доставки</h4>' +
                    '<form>' +
                    '<div class="d-flex flex-column">' +
                    '<label><input class="delivery-method" type="radio" name="delivery-method" value="pickup"> Самовывоз</label>' +
                    '<label><input class="delivery-method" type="radio" name="delivery-method" value="delivering"> Доставка курьером</label>' +
                    '</div>' +
                    '</form>' +
                    '</div>'
                );
                
                countTotalDiscount();
   
                var deliveringInfo =
                    '<div class="deliveryInfo">' +
                    '<div class="form-group">' +
                    '<b>Внимание!</b> Доставка курьером осуществляется с 11:00' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="clientNameLabel">Ваше имя *</label>' +
                    '<input id="clientName" type="text" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="clientPhoneLabel">Номер телефона *</label>' +
                    '<input id="clientPhone" type="tel" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="clientDateTimeLabel">Укажите дату и время, к которому мы должны подготовить Ваш заказ *</label>' +
                        '<input id="clientDate" type="date" class="form-control"><br>' +
                        '<input id="clientTime" type="time" class="form-control">' +
                    '</div>' + 
                    '<div class="form-group">' +
                    '<label class="clientAddressLabel">Адрес доставки заказа *</label>' +
                    '<input id="clientAddress" type="text" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label>Почтовый ящик</label>' +
                    '<input id="clientEmail" type="email" class="form-control">' +
                    '</div>' +
                    '</div>';

                var pickUpInfo = 
                    '<div class="pickUpInfo">' +
                        '<div class="form-group">' +
                            '<label class="clientNameLabel">Ваше имя *</label>' +
                            '<input id="clientName" type="text" class="form-control">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="clientPhoneLabel">Номер телефона *</label>' +
                            '<input id="clientPhone" type="tel" class="form-control">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="clientDateTimeLabel">Укажите дату и время, к которому мы должны подготовить Ваш заказ *</label>' +
                            '<input id="clientDate" type="date" class="form-control"><br>' +
                            '<input id="clientTime" type="time" class="form-control">' +
                        '</div>' + 
                        '<div class="form-group">' +
                            '<p><b><i class="fas fa-building"></i> '+ jQuery('.props').attr('data-company-name') +'</b></p>'+
                            '<p><i class="fas fa-map-marker-alt"></i> '+ jQuery('.props').attr('data-company-address') +'</p>'+
                            '<p><i class="fas fa-phone"></i> '+ jQuery('.props').attr('data-company-phone') +'</p>'+
                        '</div>' + 
                    '</div>';

                $('input[value="delivering"]').click(function () {
                    $('.pickUpInfo').remove();
                    $('.deliveryInfo').remove();
                    $('.props').append($(deliveringInfo));
                });

                $('input[value="pickup"]').click(function () {
                    $('.deliveryInfo').remove();
                    $('.pickUpInfo').remove();
                    $('.props').append($(pickUpInfo));
                }); 
                if($('input[value="pickup"]').is(':checked')) {
                    $('.deliveryInfo').remove();
                    $('.pickUpInfo').remove();
                    $('.props').append($(pickUpInfo)); 
                }
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
                if (summary >= discountMoney) {
                    discount = discountFinish;
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
                    '<label class="clientNameLabel">Ваше имя *</label>' +
                    '<input id="clientName" type="text" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="clientPhoneLabel">Номер телефона *</label>' +
                    '<input id="clientPhone" type="tel" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="clientDateLabel">Дата прибытия в ресторан</label>' +
                    '<input id="clientDate" type="date" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="clientTimeLabel">Время прибытия в ресторан</label>' +
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

    function removeOrderInTable() {
        var deliveryString = getCookie('delivery');
        var orderString = getCookie('order');
        summary = getCookie('summary');

        if (orderString) {
            var order = JSON.parse(orderString);
            if (order.productId.length > 0) {
                jQuery('.order-table tbody tr').remove();
                jQuery('.order-total-table tbody tr').remove();
                jQuery('.props .form-group').remove();
            }
        }

        if (deliveryString) {
            var delivery = JSON.parse(deliveryString);
            if (delivery.productId.length > 0) {
                jQuery('.order-table tbody tr').remove();
                jQuery('.order-total-table tbody tr').remove();
                jQuery('.props .form-group').remove();
                jQuery('.delivery-methods .delivering-methods').remove();
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
            countDiscountCircle();
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
            countDiscountCircle();
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
        countDiscountCircle();
    });

    jQuery('.confirm-order-btn').click(function(){
        loadOrderInTable();
        jQuery('.confirm-order-table').show();
    });
    jQuery('#back-to-shop').click(function(){
        removeOrderInTable();
        jQuery('.confirm-order-table').hide();
    })

    jQuery('.alert').hide();

    function sendOrder() {
        console.log('test');
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
                    if (!$('input[name="delivery-method"]').is(':checked')) {
                        jQuery('.alert').show();
                        jQuery('.alert .error_message').html('Выберите способ доставки');
                    } else {
                        jQuery('.alert').hide();

                        if (!clientName && $('input[value="delivering"]').is(':checked')) {
                            jQuery('.alert').show();
                            jQuery('.alert .error_message').html('Вы забыли написать своё имя');
                            jQuery('.clientNameLabel').css('color', 'red');
                        } else if (!clientName && $('input[value="pickup"]').is(':checked')) {
                            jQuery('.alert').show();
                            jQuery('.alert .error_message').html('Вы забыли написать своё имя');
                            jQuery('.clientNameLabel').css('color', 'red');
                        } else if (!clientPhone && $('input[value="delivering"]').is(':checked')) {
                            jQuery('.alert').show();
                            jQuery('.alert .error_message').html('Вы забыли указать номер телефона');
                            jQuery('.clientPhoneLabel').css('color', 'red');
                        } else if (!clientPhone && $('input[value="pickup"]').is(':checked')) {
                            jQuery('.alert').show();
                            jQuery('.alert .error_message').html('Вы забыли указать номер телефона');
                            jQuery('.clientPhoneLabel').css('color', 'red');
                        } else if (!clientDate && $('input[value="pickup"]') || !clientTime && $('input[value="pickup"]').is(':checked')) {
                            jQuery('.alert').show();
                            jQuery('.alert .error_message').html('Укажите дату и время');
                            jQuery('.clientDateTimeLabel').css('color', 'red');
                        } else if (!clientAddress && $('input[value="delivering"]').is(':checked')) {
                            jQuery('.alert').show();
                            jQuery('.alert .error_message').html('Вы не указали адрес доставки');
                            jQuery('.clientAddressLabel').css('color', 'red');
                        } else {
                            jQuery('.clientPhoneLabel').css('color', 'green');
                            jQuery('.clientNameLabel').css('color', 'green');
                            jQuery('.clientAddressLabel').css('color', 'green');
                            jQuery('.clientDateTimeLabel').css('color', 'green');
                            jQuery('.alert').hide();

                            var delivery = JSON.parse(deliveryString);
                            if (delivery.productId.length > 0) {
                                if ($('input[value="delivering"]').is(':checked')) {
                                    message = message + 'Заказ на доставку \n'
                                }
                                if ($('input[value="pickup"]').is(':checked')) {
                                    message = message + 'Заказ на самовывоз \n'
                                }
                                for (var i = 0; i < delivery.productId.length; i++) {
                                    message = message + (i + 1) + ' ' + '"' + delivery.productName[i].trim() + '"' + ' ' + delivery.productPrice[i].trim() + ' руб.' + ' x ' + delivery.productQuantity[i].trim() + '\n';
                                };
                                var discount = 0;
                                if (summary >= discountMoney) {
                                    discount = discountFinish;
                                    discountSummary = summary * discount / 100;
                                    summary = summary - discountSummary;

                                } else if ($('input[value="pickup"]').is(':checked') && summary >= discountMoney) {
                                    discount = discountFinish + pickUpDiscount;
                                    discountSummary = summary * discount / 100;
                                    summary = summary - discountSummary;

                                } else if ($('input[value="pickup"]').is(':checked') && summary < discountMoney) {
                                    discount = pickUpDiscount;
                                    discountSummary = summary * discount / 100;
                                    summary = summary - discountSummary;
                                } else  {
                                    discount = 0;
                                    summary = getCookie('summary');
                                }
                                


                                message = message + 'ИТОГО: ' + summary + ' руб. ' + '\n' + 'Со скидкой ' + discount + '%' + '\n';
                                message = message + 'Имя: ' + (clientName == undefined ? '' : (clientName + '\n')) + 'Номер телефона: ' + clientPhone + '\n' + 'Адрес: ' + (clientAddress == undefined ? 'Не указан \n' : (clientAddress) + '\n') + 'Почтовый ящик: ' + (clientEmail == undefined ? 'Не указан' : (clientEmail)) + '\n' + clientName + ' приедет за заказом ' + clientDate + ' в ' + clientTime;

                                jQuery.get('https://api.telegram.org/bot1592268106:AAEZ0OMoRG6LyawtMbq3oLQWBdGmJ1cb2wY/sendMessage', { chat_id: '1336055964', text: message });
                                jQuery.get('https://api.telegram.org/bot1592268106:AAEZ0OMoRG6LyawtMbq3oLQWBdGmJ1cb2wY/sendMessage', {chat_id:'993774641', text:message});

                                deleteCookie('delivery');
                                deleteCookie('order');
                                deleteCookie('summary');
                                $('.message-for-user').show();
                                $('.confirm-message-for-user').click(function(){

                                    location.reload();
                                    jQuery('.confirm-order-table').hide();
                                    $('.message-for-user').hide();
                                    
                                });
                                
                            }
                        }
                    }
                }
            }
       

        if (orderString != '') {
            var order = JSON.parse(orderString);
            if (order.productId.length > 0) {
                console.log('2');
                if(!clientName) {
                    jQuery('.alert').show();
                    jQuery('.alert .error_message').html('Вы забыли написать своё имя');
                    jQuery('.clientNameLabel').css('color', 'red');
                } else if(!clientPhone) {
                    jQuery('.alert').show();
                    jQuery('.alert .error_message').html('Вы забыли указать номер телефона');
                    jQuery('.clientPhoneLabel').css('color', 'red');
                } else if(!clientDate) {
                    jQuery('.alert').show();
                    jQuery('.alert .error_message').html('Вы забыли указать дату прибытия в ресторан');
                    jQuery('.clientDateLabel').css('color', 'red');
                } else if(!clientTime) {
                    jQuery('.alert').show();
                    jQuery('.alert .error_message').html('Вы забыли указать время прибытия в ресторан');
                    jQuery('.clientTimeLabel').css('color', 'red');
                } else {
                    jQuery('.clientNameLabel').css('color', 'green');
                    jQuery('.clientPhoneLabel').css('color', 'green');
                    jQuery('.clientDateLabel').css('color', 'green');
                    jQuery('.clientTimeLabel').css('color', 'green');
                    jQuery('.alert').hide();
                    var order = JSON.parse(orderString);
                    if (order.productId.length > 0) {
                        message = message + 'Предзаказ в ресторане \n';
                        for (var i = 0; i < order.productId.length; i++) {
                            message = message + (i + 1) + ' ' + '"' + order.productName[i].trim() + '"' + ' ' + order.productPrice[i].trim() + ' руб.' + ' x ' + order.productQuantity[i].trim() + '\n';
                        };
                        var discount;
                        if (summary >= discountMoney) {
                            discount = discountFinish;
                            discountSummary = summary * discount / 100;
                            summary = summary - discountSummary;
    
                        } else {
                            discount = 0;
                        }
    
                        message = message + 'ИТОГО: ' + summary + ' руб.' + ' Со скидкой ' + discount + '%' + '\n';
                        message = message + ' ' + 'Имя: ' + clientName + '\n ' + 'Номер телефона: ' + clientPhone + '\n ' + 'Дата прибытия: ' + clientDate + '\n ' + 'Время прибытия: ' + clientTime + '\n' + (clientEmail == undefined ? 'Не указан' : (clientEmail));
    
                        jQuery.get('https://api.telegram.org/bot1592268106:AAEZ0OMoRG6LyawtMbq3oLQWBdGmJ1cb2wY/sendMessage', {chat_id:'1336055964', text:message});
                        jQuery.get('https://api.telegram.org/bot1592268106:AAEZ0OMoRG6LyawtMbq3oLQWBdGmJ1cb2wY/sendMessage', {chat_id:'993774641', text:message});

                        deleteCookie('delivery');
                        deleteCookie('order');
                        deleteCookie('summary');
                        $('.message-for-user').show();
                        $('.confirm-message-for-user').click(function () {

                            location.reload();
                            jQuery('.confirm-order-table').hide();
                            $('.message-for-user').hide();

                        });
                        
                    }
                }
            }
        }

        // jQuery.get('https://api.telegram.org/bot1592268106:AAEZ0OMoRG6LyawtMbq3oLQWBdGmJ1cb2wY/sendMessage', {chat_id:'1336055964', text:message});
        //jQuery.get('https://api.telegram.org/bot1592268106:AAEZ0OMoRG6LyawtMbq3oLQWBdGmJ1cb2wY/sendMessage', {chat_id:'783982762', text:message});

    }

    jQuery('#pay-order').click(function () { 
        sendOrder();
    });
});