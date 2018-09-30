var instance = axios.create({
    baseURL: 'http://localhost:8080'
});

var RestControllerModule = (function () {

    var getOrders = function (callback) {
        instance.get('/orders')
            .then(function (response) {
                callback.onSuccess(response.data);
            })
            .catch(function (error) {
                callback.onFailed(error);
            })
    };

    var updateOrder = function (order, callback) {
        instance.put('/orders', order, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                callback.onSuccess(response);
            })
            .catch(function (error) {
                callback.onFailed(error);
            });
    };

    var deleteOrder = function (orderId, callback) {
        // todo implement
    };

    var createOrder = function (order, callback) {
        // todo implement
    };

    return {
        getOrders: getOrders,
        updateOrder: updateOrder,
        deleteOrder: deleteOrder,
        createOrder: createOrder
    };

})();