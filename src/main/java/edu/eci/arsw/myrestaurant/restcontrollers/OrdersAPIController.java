/*
 * Copyright (C) 2016 Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package edu.eci.arsw.myrestaurant.restcontrollers;

import edu.eci.arsw.myrestaurant.model.Order;
import edu.eci.arsw.myrestaurant.model.ProductType;
import edu.eci.arsw.myrestaurant.model.RestaurantProduct;
import edu.eci.arsw.myrestaurant.services.RestaurantOrderServices;
import edu.eci.arsw.myrestaurant.services.RestaurantOrderServicesStub;

import java.util.Arrays;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping(value = "/orders")
public class OrdersAPIController {

    @Autowired
    private RestaurantOrderServices ros;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> handlerGetResourceOrders(){
        try {
            return new ResponseEntity<>(ros.getOrders(),HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No order was found",HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{tableID}")
    public ResponseEntity<?> handlerGetResourceTableOrders(@PathVariable int tableID){
        try {
            return new ResponseEntity<>(ros.getTableOrder(tableID),HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No order was found in that table",HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{tableID}/total")
    public ResponseEntity<?> handlerGetResourceOrderTotal(@PathVariable int tableID){
        try {
            return new ResponseEntity<>(ros.calculateTableBill(tableID),HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No order was found in that table",HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> handlerPostResourceNewOrder(@RequestBody Order o){
        try {
            ros.addNewOrderToTable(o);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Can't add that order",HttpStatus.FORBIDDEN);
        }

    }

    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<?> handlerPutResourceNewProduct(@RequestBody Order o) {
        try {
            int table = o.getTableNumber();
            for(String d : o.getOrderedDishes()) {
                ros.getTableOrder(table).addDish(d,o.getDishOrderedAmount(d));
            }
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Can't add that products to the order",HttpStatus.FORBIDDEN);
        }

    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/{tableID}")
    public ResponseEntity<?> handlerDeleteResourceOrder(@PathVariable int tableID) {
        try {
            ros.releaseTable(tableID);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Can't delete the order",HttpStatus.FORBIDDEN);
        }

    }

}
