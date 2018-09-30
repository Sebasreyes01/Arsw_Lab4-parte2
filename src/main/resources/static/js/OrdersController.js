var OrdersControllerModule = (function () {
    var orders;
    var itemsDetails;
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
     * Shows the different elements to update an order.
     * @private
     */
    var _showUpdateOrdersUI = function () {
        let select = document.getElementById("select");
        if(select.length != orders.length) {
            while(select.childNodes.length > 0) {
                select.removeChild(select.firstChild);
            }
            for(var i = 0; i < orders.length; i++) {
                let order = orders[i];
                _addSelectOption(order);
            }
        }
        let container = document.getElementById("container");
        while(container.childNodes.length > 0) {
            container.removeChild(container.firstChild);
        }
        let itemTitle = document.createElement("h3");
        let itemTitleText = document.createTextNode("Item");
        itemTitle.classList.add("grid-item");
        itemTitle.appendChild(itemTitleText);
        container.appendChild(itemTitle);
        let quantityTitle = document.createElement("h3");
        let quantityTitleText = document.createTextNode("Quantity");
        quantityTitle.classList.add("grid-item");
        quantityTitle.appendChild(quantityTitleText);
        container.appendChild(quantityTitle);
        let blankSpace1 = document.createElement("h3");
        let blankSpace1Text = document.createTextNode(" ");
        blankSpace1.classList.add("grid-item");
        blankSpace1.appendChild(blankSpace1Text);
        container.appendChild(blankSpace1);
        let blankSpace2 = document.createElement("h3");
        let blankSpace2Text = document.createTextNode(" ");
        blankSpace2.classList.add("grid-item");
        blankSpace2.appendChild(blankSpace2Text);
        container.appendChild(blankSpace2);
        let tableSelected = select.value;
        let selectedOrder;
        for(i = 0; i < orders.length;i++){
            if(orders[i].tableNumber == tableSelected) {
                selectedOrder = orders[i];
            }
        }
        console.log(selectedOrder.orderAmountsMap);
        itemsDetails = [];
        for(i = 0; i < Object.keys(selectedOrder.orderAmountsMap).length;i++) {
            _addOrderDetails(Object.keys(selectedOrder.orderAmountsMap)[i],Object.values(selectedOrder.orderAmountsMap)[i],itemsDetails);
        }
        console.log(itemsDetails);
    };

    /**
     * Adds an option to the select tag.
     * @param o is order that is going to be added as an option.
     * @private
     */
    var _addSelectOption = function (o) {
        let order = o;
        let select = document.getElementById("select");
        let option = document.createElement("option");
        let optionText = document.createTextNode("Table" + order.tableNumber);
        option.setAttribute("value",order.tableNumber);
        option.appendChild(optionText);
        select.appendChild(option);
    };

    var _addOrderDetails = function (item,quantity,itemsDetails) {
        let items = [];
        let container = document.getElementById("container");
        let inputItem = document.createElement("label");
        let inputItemText = document.createTextNode(item);
        inputItem.classList.add("grid-item");
        inputItem.appendChild(inputItemText);
        // inputItem.setAttribute("value",item);
        container.appendChild(inputItem);
        items.push(inputItem);
        let inputQuantity = document.createElement("input");
        inputQuantity.classList.add("grid-item");
        inputQuantity.setAttribute("type","number");
        inputQuantity.setAttribute("value",quantity);
        container.appendChild(inputQuantity);
        items.push(inputQuantity);
        let updateButton = document.createElement("button");
        let updateButtonText = document.createTextNode("Update");
        updateButton.classList.add("grid-item");
        updateButton.setAttribute("onclick","OrdersControllerModule.updateOrder(event)");
        updateButton.appendChild(updateButtonText);
        container.appendChild(updateButton);
        items.push(updateButton);
        let deleteButton = document.createElement("button");
        let deleteButtonText = document.createTextNode("Delete");
        deleteButton.classList.add("grid-item");
        deleteButton.setAttribute("onclick","OrdersControllerModule.deleteOrderItem(event)");
        deleteButton.appendChild(deleteButtonText);
        container.appendChild(deleteButton);
        items.push(deleteButton);
        itemsDetails.push(items);
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

    var updateOrder = function (event) {

        var callback1 = {
            onSuccess: function (ordersList) {
                orders = ordersList;
                _showUpdateOrdersUI();
            },
            onFailed: function (exception) {
                console.log(exception);
                let main = document.getElementsByTagName("main")[0];
                while(main.childNodes.length > 0) {
                    main.removeChild(main.firstChild);
                }
                let paragraph = document.createElement("p");
                let paragraphText = document.createTextNode("There is a problem with our servers. We apologize for the inconvenience, please try again later");
                paragraph.appendChild(paragraphText);
                main.appendChild(paragraph);
            }
        };
        RestControllerModule.getOrders(callback1);

        let src = event.srcElement;
        for(let i = 0;i < itemsDetails.length;i++) {
            if(src == itemsDetails[i][2]) {
                var row = itemsDetails[i];
            }
        }
        let item = row[0].textContent;
        let amount = row[1].value.toString();
        let update = [item,amount];
        let table = document.getElementById("select").value;

        var callback2 = {
            onSuccess: function () {
                updateOrder();
            },
            onFailed: function (exception) {
                console.log(exception);
            }
        };
        RestControllerModule.updateOrder(update,table,callback2);
    };

    var deleteOrderItem = function (event) {

        let src = event.srcElement;
        for(let i = 0;i < itemsDetails.length;i++) {
            if(src == itemsDetails[i][3]) {
                var row = itemsDetails[i];
            }
        }
        let item = row[0].textContent;
        let table = document.getElementById("select").value;
        var callback = {
            onSuccess: function (itemName) {
                updateOrder();
            },
            onFailed: function (exception) {
                console.log(exception);
            }
        };
        RestControllerModule.deleteOrderItem(item,table,callback);
    };

    var addItemToOrder = function (it, quant, tableId) {
        var item;
        var quantity;
        var tableID;
        var key;
        var val;
        if(it == null || quant == null || tableId == null) {
            item = document.getElementById("addItem");
            quantity = document.getElementById("addQuantity");
            tableID = document.getElementById("select").value;
            key = item.value;
            val = quantity.value;
        } else {
            item = it;
            quantity = quant;
            tableID = tableId;
            key = item;
            val = quantity;
        }
        let order = {};
        let orderAmountsMap = {};
        orderAmountsMap[key.toUpperCase()] = val;
        order["orderAmountsMap"] = orderAmountsMap;
        order["tableNumber"] = tableID;
        var callback = {
            onSuccess: function (response) {
                document.getElementById("addItem").value = "";
                document.getElementById("addQuantity").value = "";
                updateOrder();
            },
            onFailed(exception) {
                console.log(exception);
            }
        };
        RestControllerModule.addOrderItem(order,callback);
    };

    var deleteOrder = function (event) {

        var callback1 = {
            onSuccess: function (ordersList) {
                orders = ordersList;
                let select = document.getElementById("select");
                if(select.length != orders.length) {
                    while(select.childNodes.length > 0) {
                        select.removeChild(select.firstChild);
                    }
                    for(var i = 0; i < orders.length; i++) {
                        let order = orders[i];
                        _addSelectOption(order);
                    }
                }
            },
            onFailed: function (exception) {
                console.log(exception);
                let main = document.getElementsByTagName("main")[0];
                while(main.childNodes.length > 0) {
                    main.removeChild(main.firstChild);
                }
                let paragraph = document.createElement("p");
                let paragraphText = document.createTextNode("There is a problem with our servers. We apologize for the inconvenience, please try again later");
                paragraph.appendChild(paragraphText);
                main.appendChild(paragraph);
            }
        };
        RestControllerModule.getOrders(callback1);

        if(event.srcElement == document.getElementById("button")){
            var orderId = document.getElementById("select").value;
        }

        var callback2 = {
            onSuccess: function (response) {
                deleteOrder();
            },
            onFailed: function (exception) {
                console.log(exception)
            }
        };
        RestControllerModule.deleteOrder(orderId, callback2);
    };

    return {
        showOrdersByTable: showOrdersByTable,
        updateOrder: updateOrder,
        deleteOrderItem: deleteOrderItem,
        addItemToOrder: addItemToOrder,
        deleteOrder:deleteOrder
    };

})();