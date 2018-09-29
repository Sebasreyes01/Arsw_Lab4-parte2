var orders;
var OrdersControllerModule = (function () {
    /**
     * generates a table of all the orders.
     * @private
     */
    var _generateTables = function () {
        let main = document.getElementsByTagName("main")[0];
        for (let o = 0; o < orders.length; o++) {
            _createTable(orders[o]);
            let space = document.createElement("br");
            main.appendChild(space);
        }
    };

    /**
     * Creates a table of the given order.
     * @param o is the given order.
     * @private
     */
    var _createTable = function (o) {
        let order = o;
        let main = document.getElementsByTagName("main")[0];
        let tableNum = document.createElement("h5");
        let tableNumText = document.createTextNode("Table " + order.tableNumber);
        tableNum.appendChild(tableNumText);
        main.appendChild(tableNum);
        let table = document.createElement("table");
        let tableBody = document.createElement("tbody");
        let titleRow = document.createElement("tr");
        let titleCell = document.createElement("td");
        let titleCellText = document.createTextNode("Item");
        titleCell.appendChild(titleCellText);
        titleRow.appendChild(titleCell);
        let titleCell1 = document.createElement("td");
        let titleCellText1 = document.createTextNode("Quantity");
        titleCell1.appendChild(titleCellText1);
        titleRow.appendChild(titleCell1);
        tableBody.appendChild(titleRow);
        for (let i = 0; i < Object.keys(order.orderAmountsMap).length; i++) {
            let row = document.createElement("tr");
            let cell1 = document.createElement("td");
            let cellText1 = document.createTextNode(Object.keys(order.orderAmountsMap)[i]);
            cell1.appendChild(cellText1);
            row.appendChild(cell1);
            let cell2 = document.createElement("td");
            let cellText2 = document.createTextNode(Object.values(order.orderAmountsMap)[i]);
            cell2.appendChild(cellText2);
            row.appendChild(cell2);
            tableBody.appendChild(row);
        }
        table.appendChild(tableBody);
        main.appendChild(table);
        table.setAttribute("border", "2");
    };

    /**
     * Shows all the orders.
     */
    var showOrdersByTable = function () {

        var callback = {
            onSuccess: function (ordersList) {
                orders = ordersList;
                _generateTables();
            },
            onFailed: function (exception) {
                console.log(exception);
                let main = document.getElementsByTagName("main")[0];
                let paragraph = document.createElement("p");
                let paragraphText = document.createTextNode("There is a problem with our servers. We apologize for the inconvenience, please try again later");
                paragraph.appendChild(paragraphText);
                main.appendChild(paragraph);
            }
        };
        RestControllerModule.getOrders(callback);
    };

    var updateOrder = function () {
        // todo implement
    };

    var deleteOrderItem = function (itemName) {
        // todo implement
    };

    var addItemToOrder = function (orderId, item) {
        // todo implement
    };

    return {
        showOrdersByTable: showOrdersByTable,
        updateOrder: updateOrder,
        deleteOrderItem: deleteOrderItem,
        addItemToOrder: addItemToOrder
    };

})();