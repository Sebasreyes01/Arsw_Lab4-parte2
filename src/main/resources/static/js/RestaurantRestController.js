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

    var updateOrder = function (update, table, callback) {
        instance.put('/orders/'+table, update, {
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

    var addOrderItem = function (order, callback) {
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

    var deleteOrderItem = function (item,table, callback) {
        instance.delete('/orders/'+table+'/'+item)
            .then(function (response) {
                callback.onSuccess();
            })
            .catch(function (error) {
                callback.onFailed();
            });
    };

    var deleteOrder = function (orderId, callback) {
        instance.delete('/orders/'+orderId)
            .then(function (response) {
                callback.onSuccess(response);
            })
            .catch(function (error) {
                callback.onFailed(error);
            });
    };

    return {
        getOrders: getOrders,
        updateOrder: updateOrder,
        addOrderItem:addOrderItem,
        deleteOrder: deleteOrder,
        deleteOrderItem:deleteOrderItem
    };

})();