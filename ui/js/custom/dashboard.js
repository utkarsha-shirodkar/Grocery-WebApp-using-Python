var allOrders = [];

$(function () {
    //Json data by api call for order table
    $.get(orderListApiUrl, function (response) {
        if(response) {
            allOrders = response;
            allOrders.sort(function (a, b) {
                return b.order_id - a.order_id;
            });

            var table = '';
            var totalCost = 0;
            $.each(allOrders, function(index, order) {
                totalCost += parseFloat(order.total);
                table += '<tr>' +
                    '<td>'+ order.datetime +'</td>'+
                    '<td>'+ order.order_id +'</td>'+
                    '<td>'+ order.customer_name +'</td>'+
                    '<td>Rs. '+ Number(order.total || 0).toFixed(2) +'</td>'+
                    '<td><span class="btn btn-xs btn-primary view-order" data-order-id="'+ order.order_id +'">View</span></td></tr>';
            });
            table += '<tr><td colspan="3" style="text-align: end"><b>Total</b></td><td><b>Rs. '+ totalCost.toFixed(2) +'</b></td><td></td></tr>';
            $("table").find('tbody').empty().html(table);
        }
    });
});

$(document).on('click', '.view-order', function () {
    var orderId = $(this).data('order-id');
    var order = allOrders.find(function(item) {
        return item.order_id == orderId;
    });

    if (!order) {
        return;
    }

    var detailRows = '';
    if (order.order_details && order.order_details.length > 0) {
        $.each(order.order_details, function(index, item) {
            detailRows += '<tr>' +
                '<td>'+ (index + 1) +'</td>'+
                '<td>'+ (item.product_name || '-') +'</td>'+
                '<td>'+ Number(item.quantity || 0).toFixed(2) +'</td>'+
                '<td>Rs. '+ Number(item.price_per_unit || 0).toFixed(2) +'</td>'+
                '<td>Rs. '+ Number(item.total_price || 0).toFixed(2) +'</td>'+
            '</tr>';
        });
    } else {
        detailRows = '<tr><td colspan="5">No products found for this order.</td></tr>';
    }

    var html = '<div class="row">' +
        '<div class="col-sm-6"><b>Order ID:</b> ' + order.order_id + '</div>' +
        '<div class="col-sm-6 text-right"><b>Customer:</b> ' + (order.customer_name || '-') + '</div>' +
        '</div>' +
        '<div class="row" style="margin-top: 10px;">' +
        '<div class="col-sm-12"><b>Date:</b> ' + (order.datetime || '-') + '</div>' +
        '</div>' +
        '<div class="row" style="margin-top: 15px;">' +
        '<div class="col-sm-12">' +
        '<table class="table table-bordered">' +
        '<thead><tr><th>#</th><th>Product</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr></thead>' +
        '<tbody>' + detailRows + '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-sm-12 text-right"><b>Grand Total: </b>Rs. ' + Number(order.total || 0).toFixed(2) + '</div>' +
        '</div>';

    $('#orderDetailsContent').html(html);
    $('#orderDetailsModal').modal('show');
});