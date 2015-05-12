'use strict';


angular.module('ngCart', ['ngCart.directives'])

.config([

    function() {

    }
])

.provider('$ngCart', function() {
    this.$get = function() {};
})

.run(['$rootScope', 'ngCart', 'ngCartItem', 'store', '$http', 'CONFIG',

    function($rootScope, ngCart, ngCartItem, store, $http, CONFIG) {

        $rootScope.$on('ngCart:change', function() {
            ngCart.$save();
        });

        if (angular.isObject(store.get('cart'))) {
            ngCart.$restore(store.get('cart'));

        } else {
            ngCart.init();

        }
        $http.get(CONFIG.url + '/me/cart/currency')
            .success(function(data) {

                ngCart.$cart.currencySymbol = data.symbol;
                ngCart.$cart.currency = data.id;
                $http.get(CONFIG.url + '/pricesTable/' + ngCart.$cart.currency)
                    .success(function(data) {
                        ngCart.$cart.convertedPriceTable = [];
                        for (var i = 0; i < data.length; i++) {
                            ngCart.$cart.convertedPriceTable[data[i].MasterPrice] = data[i].price;
                        }
                        ngCart.consolidateWithDB();
                    })

            })




    }
])

.service('ngCart', ['$rootScope', 'ngCartItem', 'store', '$http', '$auth', 'CONFIG',

    function($rootScope, ngCartItem, store, $http, $auth, CONFIG) {

        this.init = function() {

            this.$cart = {
                currency: null,
                currencySymbol: null,
                convertedPriceTable: null,
                shipping: null,
                taxRate: null,
                tax: null,
                items: []
            };



        };
        // in the database there is a row for each element, even if duplicate. It is later flatter at application level
        // remove an entry from the db.
        this.removeItemAndSaveToDB = function(id, quantity) {
            console.log("ADDED ITEM AND SAVE TO DB ")
            if (id.indexOf('release') > -1) {
                $http.delete(CONFIG.url + '/me/cart/release/' + id.split("-").pop())
                    .success(function(data) {

                    })
            }

            if (id.indexOf('track') > -1) {
                $http.delete(CONFIG.url + '/me/cart/track/' + id.split("-").pop())
                    .success(function(data) {})
            }
            this.removeItemById(id, quantity);
        }

        // in the database there is a row for each element, even if duplicate. It is later flatter at application level
        this.addItemAndSaveToDB = function(id, name, price, quantity, data) {
            console.log("ADDED ITEM AND SAVE TO DB ")
            if (id.indexOf('release') > -1) {
                $http.post(CONFIG.url + '/me/cart/release/' + id.split("-").pop())
                    .success(function(data) {

                    })
            }

            if (id.indexOf('track') > -1) {
                $http.post(CONFIG.url + '/me/cart/track/' + id.split("-").pop())
                    .success(function(data) {})
            }
            this.addItem(id, name, price, quantity, data);
        }
        this.addItem = function(id, name, price, quantity, data) {
            console.log("QUANTITY " + quantity)
            console.log(price)
            var inCart = this.getItemById(id);

            if (typeof inCart === 'object') {
                //Update quantity of an item if it's already in the cart
                inCart.setQuantity(quantity, true);
            } else {
                var newItem = new ngCartItem(id, name, price, quantity, data);
                this.$cart.items.push(newItem);
                $rootScope.$broadcast('ngCart:itemAdded', newItem);
            }

            $rootScope.$broadcast('ngCart:change', {});
        };

        this.getItemById = function(itemId) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function(item) {
                if (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

        this.setShipping = function(shipping) {
            this.$cart.shipping = shipping;
            return this.getShipping();
        };

        this.getShipping = function() {
            if (this.getCart().items.length == 0) return 0;
            return this.getCart().shipping;
        };
        this.getConvertedPrice = function(masterPrice) {
            var price;
            try {
                price = this.getCart().convertedPriceTable[masterPrice];

            } catch (err) {
                price = "Price no available";
            }
            return price;
        };
        this.getCurrencySymbol = function() {
            return this.getCart().currencySymbol;
        };
        this.setTaxRate = function(taxRate) {
            this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
            return this.getTaxRate();
        };

        this.getTaxRate = function() {
            return this.$cart.taxRate
        };

        this.getTax = function() {
            return +parseFloat(((this.getSubTotal() / 100) * this.getCart().taxRate)).toFixed(2);
        };

        this.setCart = function(cart) {
            this.$cart = cart;
            return this.getCart();
        };

        this.getCart = function() {
            return this.$cart;
        };

        this.getItems = function() {
            return this.getCart().items;
        };

        this.getTotalItems = function() {
            var count = 0;
            var items = this.getItems();
            angular.forEach(items, function(item) {
                count += item.getQuantity();
            });
            return count;
        };

        this.getTotalUniqueItems = function() {
            return this.getCart().items.length;
        };

        this.getSubTotal = function() {
            var total = 0;
            angular.forEach(this.getCart().items, function(item) {
                total += item.getTotal();
            });
            return +parseFloat(total).toFixed(2);
        };

        this.totalCost = function() {
            return +parseFloat(this.getSubTotal() + this.getShipping() + this.getTax()).toFixed(2);
        };

        this.removeItem = function(index) {
            console.log("TRYING TO REMOVE AN ITEM")


            this.$cart.items.splice(index, 1);
            $rootScope.$broadcast('ngCart:itemRemoved', {});
            $rootScope.$broadcast('ngCart:change', {});

        };
        // quantity is a positive number
        this.removeItemById = function(id, quantity) {
            console.log("remove by id")

            var cart = this.getCart();
            angular.forEach(cart.items, function(item, index) {
                if (item.getId() === id) {
                    if (!quantity) {
                        // if there is no quantity left, set the quantity to the current quantity
                        // when checking the quantity of the object in order to remove it, it will always return to 0.
                        quantity = cart.items[index].getQuantity()
                    }
                    cart.items[index].setQuantity(-quantity, true)
                    if (cart.items[index].getQuantity() <= 0) {
                        cart.items.splice(index, 1);
                    }
                }
            });
            this.setCart(cart);
            $rootScope.$broadcast('ngCart:itemRemoved', {});
            $rootScope.$broadcast('ngCart:change', {});
        };

        this.empty = function() {

            $rootScope.$broadcast('ngCart:change', {});
            this.$cart.items = [];
            localStorage.removeItem('cart');
        };

        this.toObject = function() {

            if (this.getItems().length === 0) return false;

            var items = [];
            angular.forEach(this.getItems(), function(item) {
                items.push(item.toObject());
            });

            return {
                shipping: this.getShipping(),
                tax: this.getTax(),
                taxRate: this.getTaxRate(),
                subTotal: this.getSubTotal(),
                totalCost: this.totalCost(),
                items: items
            }
        };

        this.consolidateWithDB = function() {
            var _self = this;
            console.log("FETCH THE DATA FROM DB ")
            $http.get(CONFIG.url + '/me/cart/')
                .success(function(data) {


                    // Part 1 ->  ALL THE ELEMENT THAT ARE IN THE DB BUT NOT IN THE LOCAL STORAGE VERSION

                    // remove from the elements fetch from the database, all the elements that are already available in db.
                    for (var j = 0; j < data.length; j++) {

                        data[j].frontEndId = (data[j].TrackId) ? "track-" + data[j].TrackId : "release-" + data[j].ReleaseId;
                        console.log(data[j].frontEndId);
                        var found = false;

                        console.log("local storage cart: " + _self.$cart)
                        console.log(_self.$cart.items);

                        for (var i = 0; i < _self.$cart.items.length && (found == false); i++) {

                            console.log("Compare " + _self.$cart.items[i]._id + " with " + data[j].frontEndId);
                            if (_self.$cart.items[i]._id == data[j].frontEndId) {
                                console.log(" I REMOVE THIS OBJECT FROM THE LOCAL STORAGE, IT COMES FROM THE DB ALREADY")
                                data.splice(j, 1);
                                found = true;
                            }

                        };
                    }
                    // ADD BACK ALL THE ELEMENT IN THE CART 
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].TrackId) {
                            // IS A TRACK 
                            console.log("^^^^^")
                            console.log(data[j]);
                            _self.addItem(data[j].frontEndId, data[j].Track.title + "(" + data[j].Track.version + ")", data[j].Track.Price, 1, data[j].Track);

                        } else {
                            // IS A RELEASE
                            _self.addItem(data[j].frontEndId, data[j].Release.title, 123, 1, data[j].Release);
                        }
                    }


                    // PART 2 -> ALL THE ELEMENTS THAT ARE IN THE LOCAL STORAGE BUT NOT IN DB 




                })
            this.$save();

        }
        this.$restore = function(storedCart) {
            var _self = this;
            _self.init();
            _self.$cart.shipping = storedCart.shipping;
            _self.$cart.tax = storedCart.tax;

            /*
            angular.forEach(storedCart.items, function(item) {
        _self.$cart.items.push(new ngCartItem(item._id, item._name,   item._price, item._quantity, item._data));
            });
            */
            //_self.$cart.items = []
            this.$save();


        };

        this.$save = function() {
            return store.set('cart', JSON.stringify(this.getCart()));
        }

    }
])

.factory('ngCartItem', ['$rootScope', '$auth', '$http', '$log', 'CONFIG',
    function($rootScope, $auth, $http, $log, CONFIG) {

        var item = function(id, name, price, quantity, data) {
            this.setId(id);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setData(data);
        };



        item.prototype.setId = function(id) {
            if (id) this._id = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.getId = function() {
            return this._id;
        };


        item.prototype.setName = function(name) {
            if (name) this._name = name;
            else {
                $log.error('A name must be provided');
            }
        };
        item.prototype.getName = function() {
            return this._name;
        };




        item.prototype.setPrice = function(price) {
            console.log(price)
            var priceFloat = parseFloat(price);

            if (priceFloat < 0) {
                $log.error('A price must be over 0');
            } else {
                this._price = (priceFloat);
            }

        };
        item.prototype.getPrice = function() {
            return this._price;
        };


        item.prototype.setQuantity = function(quantity, relative) {

            console.log("CHANGE QUANTITY")
            var quantityInt = parseInt(quantity);
            if (quantityInt % 1 === 0) {
                if (relative === true) {
                    this._quantity += quantityInt;
                } else {
                    this._quantity = quantityInt;
                }


            } else {
                this._quantity = 1;
                $log.info('Quantity must be an integer and was defaulted to 1');
            }


            /*
            if (quantity < 0) {
                console.log("REMOVE AN ITEM")
                if (this.getId().indexOf('release') > -1) {
                    $http.delete(CONFIG.url + '/me/cart/release/' + this.getId().split("-").pop())
                        .success(function(data) {
                            console.log(data)
                            console.log("DATA RECEIVED")
                        })
                }

                if (this.getId().indexOf('track') > -1) {
                    $http.delete(CONFIG.url + '/me/cart/track/' + this.getId().split("-").pop())
                        .success(function(data) {
                            console.log(data)
                            console.log("DATA RECEIVED")
                        })
                }
            } else {
                console.log(this)
                if (this.getId().indexOf('release') > -1) {
                    $http.post(CONFIG.url + '/me/cart/release/' + this.getId().split("-").pop())
                        .success(function(data) {
                            console.log(data)
                            console.log("DATA RECEIVED")
                        })
                }

                if (this.getId().indexOf('track') > -1) {
                    $http.post(CONFIG.url + '/me/cart/track/' + this.getId().split("-").pop())
                        .success(function(data) {
                            console.log(data)
                            console.log("DATA RECEIVED")
                        })
                }

            }

*/

            $rootScope.$broadcast('ngCart:change', {});

        };

        item.prototype.getQuantity = function() {
            return this._quantity;
        };

        item.prototype.setData = function(data) {
            if (data) this._data = data;
        };

        item.prototype.getData = function() {
            if (this._data) return this._data;
            else $log.info('This item has no data');
        };


        item.prototype.getTotal = function() {

            console.log("ROOOT SCOPE ")
            console.log(this)
            return parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
        };

        item.prototype.toObject = function() {
            return {
                id: this.getId(),
                name: this.getName(),
                price: this.getPrice(),
                quantity: this.getQuantity(),
                data: this.getData(),
                total: this.getTotal()
            }
        };

        return item;

    }
])

.service('store', ['$window',
    function($window) {

        return {

            get: function(key) {
                if ($window.localStorage[key]) {
                    var cart = angular.fromJson($window.localStorage[key]);
                    return JSON.parse(cart);
                }
                return false;

            },


            set: function(key, val) {

                if (val === undefined) {
                    $window.localStorage.removeItem(key);
                } else {
                    $window.localStorage[key] = angular.toJson(val);
                }
                return $window.localStorage[key];
            }
        }
    }
])

.controller('CartController', ['$scope', 'ngCart',
    function($scope, ngCart) {
        $scope.ngCart = ngCart;

    }
])

.value('version', '0.0.3-rc.1');;
'use strict';


angular.module('ngCart.directives', ['ngCart.fulfilment'])

.controller('CartController', ['$scope', 'ngCart',
    function($scope, ngCart) {
        $scope.ngCart = ngCart;
    }
])

.directive('ngcartAddtocart', ['ngCart',
    function(ngCart) {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {
                id: '@',
                name: '@',
                quantity: '@',
                quantityMax: '@',
                price: '@',
                data: '='
            },
            transclude: true,
            templateUrl: 'tpl/cart/addtocart.html',
            link: function(scope, element, attrs) {
                scope.attrs = attrs;
                scope.inCart = function() {
                    return ngCart.getItemById(attrs.id);
                };

                if (scope.inCart()) {
                    scope.q = ngCart.getItemById(attrs.id).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }



                scope.qtyOpt = [];
                for (var i = 1; i <= scope.quantityMax; i++) {
                    scope.qtyOpt.push(i);
                }


            }

        };
    }
])
    .directive('ngcartIsincart', ['ngCart',
        function(ngCart) {
            return {
                restrict: 'E',
                controller: 'CartController',
                scope: {
                    id: '@'
                },
                transclude: true,
                templateUrl: 'tpl/cart/isincart.html',
                link: function(scope, element, attrs) {
                    scope.attrs = attrs;
                    scope.inCart = function() {
                        return ngCart.getItemById(attrs.id);
                    };
                }

            };
        }
    ])

.directive('ngcartCart', [

    function() {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {},
            templateUrl: 'tpl/cart/cart.html'
        };
    }
])
    .directive('ngcartCounter', [

        function() {
            return {
                restrict: 'E',
                controller: 'CartController',
                scope: {},
                transclude: true,
                templateUrl: 'tpl/cart/counter.html'
            };
        }
    ])

.directive('ngcartSummary', [

    function() {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {},
            transclude: true,
            templateUrl: 'tpl/cart/summary.html'
        };
    }
])

.directive('ngcartCheckout', [

    function() {
        return {
            restrict: 'E',
            controller: ('CartController', ['$scope', 'ngCart', 'fulfilmentProvider',
                function($scope, ngCart, fulfilmentProvider) {
                    $scope.ngCart = ngCart;

                    $scope.checkout = function() {
                        fulfilmentProvider.setService($scope.service);
                        fulfilmentProvider.setSettings($scope.settings);
                        var promise = fulfilmentProvider.checkout();
                        console.log(promise);
                    }
                }
            ]),
            scope: {
                service: '@',
                settings: '='
            },
            transclude: true,
            templateUrl: 'tpl/cart/checkout.html'
        };
    }
]);;
angular.module('ngCart.fulfilment', [])
    .service('fulfilmentProvider', ['$injector',
        function($injector) {

            this._obj = {
                service: undefined,
                settings: undefined
            };

            this.setService = function(service) {
                this._obj.service = service;
            };

            this.setSettings = function(settings) {
                this._obj.settings = settings;
            };

            this.checkout = function() {
                var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
                return provider.checkout(this._obj.settings);

            }

        }
    ])


.service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart',
    function($q, $log, ngCart) {

        this.checkout = function() {

            var deferred = $q.defer();

            $log.info(ngCart.toObject());
            deferred.resolve({
                cart: ngCart.toObject()
            });

            return deferred.promise;

        }

    }
])

.service('ngCart.fulfilment.http', ['$http', 'ngCart',
    function($http, ngCart) {

        this.checkout = function(settings) {
            return $http.post(settings.url, {
                data: ngCart.toObject()
            })
        }
    }
])


.service('ngCart.fulfilment.paypal', ['$http', 'ngCart',
    function($http, ngCart) {


    }
]);