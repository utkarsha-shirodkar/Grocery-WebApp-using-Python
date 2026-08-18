var productModal = $("#productModal");
var uomModal = $("#uomModal");
var selectedProductUomId = null;

function loadUomOptions(selectedUomId) {
    $.get(uomListApiUrl, function (response) {
        if(response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function(index, uom) {
                options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
            });
            $("#uoms").empty().html(options);

            if (selectedUomId !== null && selectedUomId !== undefined) {
                $("#uoms").val(selectedUomId);
            }
        }
    });
}

    $(function () {

        //JSON data by API call
        $.get(productListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, product) {
                    table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.uom_id +'" data-price="'+ product.price_per_unit +'">' +
                        '<td>'+ product.name +'</td>'+
                        '<td>'+ product.uom_name +'</td>'+
                        '<td>'+ product.price_per_unit +'</td>'+
                        '<td><span class="btn btn-xs btn-primary edit-product mr-2">Edit</span>'+
                        '<span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';
                });
                $("table").find('tbody').empty().html(table);
            }
        });
    });

    $("#saveUOM").on("click", function () {
        var uomName = $.trim($("#uomName").val());

        if (uomName === "") {
            alert("Please enter a valid UOM name.");
            return;
        }

        $.ajax({
            method: "POST",
            url: uomSaveApiUrl,
            data: {
                'data': JSON.stringify({
                    uom_name: uomName
                })
            }
        }).done(function (response) {
            $("#uomName").val('');
            uomModal.modal('hide');
            loadUomOptions(response && response.uom_id ? response.uom_id : null);
        }).fail(function (xhr) {
            var message = "UOM already exists.";
            try {
                var errorResponse = JSON.parse(xhr.responseText);
                if (errorResponse && errorResponse.error) {
                    message = errorResponse.error;
                }
            } catch (e) {
                // Ignore parsing errors and use the default message.
            }
            alert(message);
        });
    });

    // Save Product
    $("#saveProduct").on("click", function () {
        // If we found id value in form then update product detail
        var data = $("#productForm").serializeArray();
        var requestPayload = {
            product_name: null,
            uom_id: null,
            price_per_unit: null
        };
        for (var i=0;i<data.length;++i) {
            var element = data[i];
            switch(element.name) {
                case 'name':
                    requestPayload.product_name = element.value;
                    break;
                case 'uoms':
                    requestPayload.uom_id = element.value;
                    break;
                case 'price':
                    requestPayload.price_per_unit = element.value;
                    break;
            }
        }

        var productId = parseInt($("#id").val());
        if (!isNaN(productId) && productId > 0) {
            requestPayload.product_id = productId;
        }

        var apiUrl = (requestPayload.product_id) ? productUpdateApiUrl : productSaveApiUrl;
        $.ajax({
            method: "POST",
            url: apiUrl,
            data: {
                'data': JSON.stringify(requestPayload)
            }
        }).done(function () {
            window.location.reload();
        }).fail(function (xhr) {
            var message = "Product already exists.";
            try {
                var errorResponse = JSON.parse(xhr.responseText);
                if (errorResponse && errorResponse.error) {
                    message = errorResponse.error;
                }
            } catch (e) {
                // Ignore parsing errors and use the default message.
            }
            alert(message);
        });
    });

    $(document).on("click", ".delete-product", function (){
        var tr = $(this).closest('tr');
        var data = {
            product_id : tr.data('id')
        };
        var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" item?");
        if (isDelete) {
            callApi("POST", productDeleteApiUrl, data);
        }
    });

    $(document).on("click", ".edit-product", function (){
        var tr = $(this).closest('tr');
        var productId = tr.data('id');
        selectedProductUomId = null;
        productModal.find('.modal-title').text('Edit Product');
        $("#id").val(productId);

        $.get(productDetailsApiUrl, { product_id: productId }, function (response) {
            if (response) {
                $("#name").val(response.name || '');
                $("#price").val(response.price_per_unit || '');
                selectedProductUomId = response.uom_id;
                productModal.modal('show');
            }
        });
    });

    productModal.on('hide.bs.modal', function(){
        $("#id").val('0');
        $("#name, #unit, #price, #uoms").val('');
        selectedProductUomId = null;
        productModal.find('.modal-title').text('Add New Product');
    });

    productModal.on('show.bs.modal', function(){
        loadUomOptions(selectedProductUomId);
    });

    uomModal.on('hide.bs.modal', function(){
        $("#id").val('0');
        $("#uomName").val('');
        uomModal.find('.modal-title').text('Add New UOM');
    });