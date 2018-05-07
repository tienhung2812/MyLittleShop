// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase);


// Track on totalUser
exports.countTotalUser = functions.database.ref('/employee/{userid}').onWrite(
    (change) => {
        console.log('Count user function');
      const collectionRef = change.after.ref.parent;
      const countRef = collectionRef.parent.child('stat/user/total');

      let increment;
      if (change.after.exists() && !change.before.exists()) {
        increment = 1;
      } else if (!change.after.exists() && change.before.exists()) {
        increment = -1;
      } else {
        return null;
      }
      return countRef.transaction((current) => {
        return (current || 0) + increment;
      }).then(() => {
        return console.log('Counter updated.');
      });
    });

// Track on totalUser
exports.countCreateRoleUser = functions.database.ref('/employee/{userid}').onCreate(
    (change) => {
        console.log('Count Manager function');
      const collectionRef = change.ref.parent;
      const countManagerRef = collectionRef.parent.child('stat/user/manager');
      const countEmployeeRef = collectionRef.parent.child('stat/user/employee');
      let increment;
      console.log("Current role: "+ change.val().role);
      if(change.val().role==1){
        return countManagerRef.once('value').then(function(snapshot){
            countManagerRef.set(snapshot.val()+1);
        })
      }else if(change.val().role==2){
        return countEmployeeRef.once('value').then(function(snapshot){
            countEmployeeRef.set(snapshot.val()+1);
        })
      }else {
          return null;
      }
      
    });

exports.countDeleteRoleUser = functions.database.ref('/employee/{userid}').onDelete(
    (change) => {
        console.log('Count Manager function');
        const collectionRef = change.ref.parent;
        const countManagerRef = collectionRef.parent.child('stat/user/manager');
        const countEmployeeRef = collectionRef.parent.child('stat/user/employee');
        let increment;
        console.log("Current role: "+ change.val().role);
        if(change.val().role==1){
        return countManagerRef.once('value').then(function(snapshot){
            countManagerRef.set(snapshot.val()-1);
        })
        }else if(change.val().role==2){
        return countEmployeeRef.once('value').then(function(snapshot){
            countEmployeeRef.set(snapshot.val()-1);
        })
        }else {
            return null;
        }
        
    });

exports.shopTotalRevenue = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count shop total revenue');
        const collectionRef = change.after.ref.parent;
        const recordRef = collectionRef.parent;
        const countRef = collectionRef.parent.parent.child('revenue');
        var total=0;
        return recordRef.on('value',function(date){
            date.forEach(function(dateRecord){
                dateRecord.ref.on('value',function(record){
                    record.forEach(function(snapshot){
                        total += snapshot.val().price;
                    })
                })
            })
            console.log("Total: "+ total);
                countRef.set(total);
        })
        
    });

exports.shopTotalSale = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count shop total Sale');
        const collectionRef = change.after.ref.parent;
        const recordRef = collectionRef.parent;
        const countRef = collectionRef.parent.parent.child('sale');
        var total=0;
        return recordRef.on('value',function(date){
            date.forEach(function(dateRecord){
                dateRecord.ref.on('value',function(record){
                    record.forEach(function(snapshot){
                        total += snapshot.val().qty;
                    })
                })
            })
            console.log("Sale: "+ total);
                countRef.set(total);
        })
        
    });

exports.TotalRevenue = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count total revenue');
        const collectionRef = change.after.ref.parent;
        const shopRef = collectionRef.parent.parent.parent;
        const countRef = collectionRef.parent.parent.parent.parent.child('stat/shop/revenue');
        var total=0;
        return shopRef.on('value',function(shopID){
            shopID.forEach(function(record){
                record.ref.child('record').on('value',function(date){
                    date.forEach(function(dateRecord){
                        dateRecord.ref.on('value',function(record){
                            record.forEach(function(snapshot){
                                total += snapshot.val().price;
                            })
                        })
                    })
                })
            })
            console.log("Total: "+ total);
                    countRef.set(total);
        })     
        
    });

exports.TotalSale = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count total sale');
        const collectionRef = change.after.ref.parent;
        const shopRef = collectionRef.parent.parent.parent;
        const countRef = collectionRef.parent.parent.parent.parent.child('stat/shop/sale');
        var total=0;
        return shopRef.on('value',function(shopID){
            shopID.forEach(function(record){
                record.ref.child('record').on('value',function(date){
                    date.forEach(function(dateRecord){
                        dateRecord.ref.on('value',function(record){
                            record.forEach(function(snapshot){
                                total += snapshot.val().qty;
                            })
                        })
                    })
                })
            })
            console.log("Sale: "+ total);
                    countRef.set(total);
        })     
        
    });

exports.countShopNumber = functions.database.ref('/shop/{userid}').onWrite(
    (change) => {
        console.log('Count shop number function');
        const collectionRef = change.after.ref.parent;
        const countRef = collectionRef.parent.child('stat/shop/num');

        let increment;
        if (change.after.exists() && !change.before.exists()) {
        increment = 1;
        } else if (!change.after.exists() && change.before.exists()) {
        increment = -1;
        } else {
        return null;
        }// Track on totalUser
exports.countTotalUser = functions.database.ref('/employee/{userid}').onWrite(
    (change) => {
        console.log('Count user function');
      const collectionRef = change.after.ref.parent;
      const countRef = collectionRef.parent.child('stat/user/total');

      let increment;
      if (change.after.exists() && !change.before.exists()) {
        increment = 1;
      } else if (!change.after.exists() && change.before.exists()) {
        increment = -1;
      } else {
        return null;
      }
      return countRef.transaction((current) => {
        return (current || 0) + increment;
      }).then(() => {
        return console.log('Counter updated.');
      });
    });

// Track on totalUser
exports.countCreateRoleUser = functions.database.ref('/employee/{userid}').onCreate(
    (change) => {
        console.log('Count Manager function');
      const collectionRef = change.ref.parent;
      const countManagerRef = collectionRef.parent.child('stat/user/manager');
      const countEmployeeRef = collectionRef.parent.child('stat/user/employee');
      let increment;
      console.log("Current role: "+ change.val().role);
      if(change.val().role==1){
        return countManagerRef.once('value').then(function(snapshot){
            countManagerRef.set(snapshot.val()+1);
        })
      }else if(change.val().role==2){
        return countEmployeeRef.once('value').then(function(snapshot){
            countEmployeeRef.set(snapshot.val()+1);
        })
      }else {
          return null;
      }
      
    });

exports.countDeleteRoleUser = functions.database.ref('/employee/{userid}').onDelete(
    (change) => {
        console.log('Count Manager function');
        const collectionRef = change.ref.parent;
        const countManagerRef = collectionRef.parent.child('stat/user/manager');
        const countEmployeeRef = collectionRef.parent.child('stat/user/employee');
        let increment;
        console.log("Current role: "+ change.val().role);
        if(change.val().role==1){
        return countManagerRef.once('value').then(function(snapshot){
            countManagerRef.set(snapshot.val()-1);
        })
        }else if(change.val().role==2){
        return countEmployeeRef.once('value').then(function(snapshot){
            countEmployeeRef.set(snapshot.val()-1);
        })
        }else {
            return null;
        }
        
    });

exports.shopTotalRevenue = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count shop total revenue');
        const collectionRef = change.after.ref.parent;
        const recordRef = collectionRef.parent;
        const countRef = collectionRef.parent.parent.child('revenue');
        var total=0;
        return recordRef.on('value',function(date){
            date.forEach(function(dateRecord){
                dateRecord.ref.on('value',function(record){
                    record.forEach(function(snapshot){
                        total += snapshot.val().price;
                    })
                })
            })
            console.log("Total: "+ total);
                countRef.set(total);
        })
        
    });

exports.shopTotalSale = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count shop total Sale');
        const collectionRef = change.after.ref.parent;
        const recordRef = collectionRef.parent;
        const countRef = collectionRef.parent.parent.child('sale');
        var total=0;
        return recordRef.on('value',function(date){
            date.forEach(function(dateRecord){
                dateRecord.ref.on('value',function(record){
                    record.forEach(function(snapshot){
                        total += snapshot.val().qty;
                    })
                })
            })
            console.log("Sale: "+ total);
                countRef.set(total);
        })
        
    });

exports.TotalRevenue = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count total revenue');
        const collectionRef = change.after.ref.parent;
        const shopRef = collectionRef.parent.parent.parent;
        const countRef = collectionRef.parent.parent.parent.parent.child('stat/shop/revenue');
        var total=0;
        return shopRef.on('value',function(shopID){
            shopID.forEach(function(record){
                record.ref.child('record').on('value',function(date){
                    date.forEach(function(dateRecord){
                        dateRecord.ref.on('value',function(record){
                            record.forEach(function(snapshot){
                                total += snapshot.val().price;
                            })
                        })
                    })
                })
            })
            console.log("Total: "+ total);
                    countRef.set(total);
        })     
        
    });

exports.TotalSale = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count total sale');
        const collectionRef = change.after.ref.parent;
        const shopRef = collectionRef.parent.parent.parent;
        const countRef = collectionRef.parent.parent.parent.parent.child('stat/shop/sale');
        var total=0;
        return shopRef.on('value',function(shopID){
            shopID.forEach(function(record){
                record.ref.child('record').on('value',function(date){
                    date.forEach(function(dateRecord){
                        dateRecord.ref.on('value',function(record){
                            record.forEach(function(snapshot){
                                total += snapshot.val().qty;
                            })
                        })
                    })
                })
            })
            console.log("Sale: "+ total);
                    countRef.set(total);
        })     
        
    });

exports.countShopNumber = functions.database.ref('/shop/{userid}').onWrite(
    (change) => {
        console.log('Count shop number function');
        const collectionRef = change.after.ref.parent;
        const countRef = collectionRef.parent.child('stat/shop/num');

        let increment;
        if (change.after.exists() && !change.before.exists()) {
        increment = 1;
        } else if (!change.after.exists() && change.before.exists()) {
        increment = -1;
        } else {
        return null;
        }
        return countRef.transaction((current) => {
        return (current || 0) + increment;
        }).then(() => {
        return console.log('Counter updated.');
        });
    });
    
        return countRef.transaction((current) => {
        return (current || 0) + increment;
        }).then(() => {
        return console.log('Counter updated.');
        });
    });
    //--------------------------------------------------------------------------------------------
exports.checkLogin = functions.https.onRequest((req,res)=>{
    cors(req, res, () => {
        const params = req.url.split("/");
        const usrId = params[1];
        const password = params[2];
        return admin.database().ref('employee/'+usrId).once('value',(userSnapshot)=>{

            var usr = userSnapshot.val();
            var pass = usr.password;
            var role = -1; // default
            var shop_id = -1; // default
            var isMatched = false;

            if(password == pass){
                isMatched = true;
                role = usr.role;
                shop_id = usr.shop_id;
            }

            var data = {
                usr: usrId,
                pass: password,
                role : role,
                shop_id : shop_id,
                result: isMatched
            }
            
            res.send(data);
        });
    });
});


exports.loadProduct = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const shop_id = params[1];
        return admin.database().ref('product/').once('value',(snapshot)=>{
            var products = [];
            snapshot.forEach(function(productSnapshot) {
                var product = productSnapshot.val();
                if(shop_id == product.store_id || shop_id == 0){
                    var data = {
                        product_code : productSnapshot.key,
                        price : product.product_price,
                        stock : product.stock
                    }
                    products.push(data);
                }
            });
            res.send(products);
        });
    });
});

exports.addProduct = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const product_code = params[1];

        var updates = {};
        var result = true;
        var shop_id =  params[4];

        var data = {
          price : params[2],
          stock: params[3]
        }

        return admin.database().ref('shop/'+shop_id+'/products/'+product_code).once('value',(snapshot)=>{
            if(snapshot.exists()){
                result = false;
            } else {
                updates['/shop/'+shop_id+'/products/'+product_code] = data;
                admin.database().ref().update(updates);
            }
            res.send(result);
        });
    });
});


// change Product code still not work
// type 1 work
exports.modifyProduct = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const product = JSON.parse(decodeURI(params[1]));

        var product_code = product.code;
        var old_product_code = product.oldCode;
        var store_id = product.shop_id;
        var type = product.type;
        var price = product.price;
        var qty = product.stock;
        var role = product.role;
        var old_shop_id = product.oldShop;
        var data;
        var result;
        var updates = {};
        var productExist = false;
        var shopExist = true;

        if(type == 1){  // update current product
            admin.database().ref('shop/'+store_id+'/products/'+product_code).once('value',(snapshot)=>{
                if(role == 0){
                    var stock = snapshot.val().stock;
                    data = {
                        price: price,
                        stock: stock
                    }
                } else {
                    data = {
                        price: price,
                        stock: qty
                    }
                }
                updates['/shop/'+store_id+'/products/'+product_code] = data;
                admin.database().ref().update(updates);
                result = {
                    productExist: productExist,
                    shopExist: shopExist
                }
                res.send(result);
            });
        } else if(type == 2) { // same product , different shop
            admin.database().ref('shop/'+store_id).once('value',(snapshot)=>{
                if(snapshot.exists()){
                    admin.database().ref('shop/'+old_shop_id+'/products/'+product_code).once('value',(productSapshot)=>{
                        if(role == 0){
                            var stock = productSapshot.val().stock;
                            data = {
                                price: price,
                                stock: stock
                            }
                        } else {
                            data = {
                                price: price,
                                stock: qty
                            }
                        }
                        updates['/shop/'+store_id+'/products/'+product_code] = data;
                        admin.database().ref().update(updates);
                        admin.database().ref().child('shop/'+old_shop_id+'/products/'+ product_code).remove();
                    });
                }else{
                    shopExist = false;
                }
                result = {
                    productExist: productExist,
                    shopExist: shopExist
                }
                res.send(result);
            });
        } else if(type == 3){ // different product, same shop
            admin.database().ref('shop/'+store_id+'/products/'+product_code).once('value',(snapshot)=>{
                if(snapshot.exists()){
                    productExist = true;
                } else{
                    admin.database().ref('shop/'+store_id+'/products/'+old_product_code).once('value',(productSnapshot)=>{
                        if(role == 0){
                            var stock = productSnapshot.val().stock;
                            data = {
                                price: price,
                                stock: stock
                            }
                        } else {
                            data = {
                                price: price,
                                stock: qty
                            }
                        }
                        updates['/shop/'+store_id+'/products/'+product_code] = data;
                        admin.database().ref().update(updates);
                        admin.database().ref().child('shop/'+store_id+'/products/'+ old_product_code).remove();
                    });
                }
                result = {
                    productExist: productExist,
                    shopExist: shopExist
                }
                res.send(result);
            });
        } else { // different product, different shop
            admin.database().ref('shop/'+store_id).once('value',(snapshot)=>{
                if(snapshot.exists()){
                    admin.database().ref('shop/'+store_id+'/products/'+product_code).once('value',(productSnapshot)=>{
                        if(productSnapshot.exists()){
                            productExist = true;
                            result = {
                                productExist: productExist,
                                shopExist: shopExist
                            }
                            res.send(result);      
                        } else{
                            admin.database().ref('shop/'+old_shop_id+'/products/'+old_product_code).once('value',(snapshot2)=>{
                                if(role == 0){
                                    var stock = snapshot2.val().stock;
                                    data = {
                                        price: price,
                                        stock: stock
                                    }
                                } else {
                                    data = {
                                        price: price,
                                        stock: qty
                                    }
                                }
                                updates['/shop/'+store_id+'/products/'+product_code] = data;
                                admin.database().ref().update(updates);
                                admin.database().ref().child('shop/'+old_shop_id+'/products/'+ old_product_code).remove();
                            });
                            result = {
                                productExist: productExist,
                                shopExist: shopExist
                            }
                            res.send(result);           
                        }
                    });
                }else{
                    shopExist = false;
                    result = {
                        productExist: productExist,
                        shopExist: shopExist
                    }
                    res.send(result);
                }
            });
        }
    });
});

//work
exports.removeProduct = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const product_code = params[1];
        const shop_id = params[2];
        admin.database().ref().child('shop/'+shop_id+'/products/'+product_code).remove();
        return res.send(true);
    });
});

//------------------------------------------------------------------------------------------


exports.loadEmployee = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const role_id = params[1];
        const shop_id = params[2];
        return admin.database().ref('employee/').once('value',(snapshot)=>{
           
            var managers = [];
            var employees = [];
            snapshot.forEach(function(employeeSnapshot) {
                var employee = employeeSnapshot.val();
                var data = {
                            username: employeeSnapshot.key,
                            shop_id: employee.shop_id
                        }
                if(role_id == 0){
                    if(employee.role == 1){
                        managers.push(data);
                    }
                    if(employee.role == 2){
                        employees.push(data);
                    }
                } else {
                    if(employee.role == 2 && employee.shop_id == shop_id){
                        employees.push(data);
                    }
                }
            });
            var workers = {
                managers: managers,
                employees: employees
            }
            res.send(workers);
        });
    });
});

//---------------------------------------------------------------------------

exports.addShop = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const shop = JSON.parse(decodeURI(params[1]));
        

        var updates = {};
        var isExist = false;

        var data = {
          shop_name : shop.shop_name
        }

        return admin.database().ref('shop/'+shop.shop_id).once('value',(snapshot)=>{
            if(snapshot.exists()){
                isExist = true;
            } else {
                updates['/shop/' + shop.shop_id] = data;
                admin.database().ref().update(updates);
            }
            res.send(isExist);
        });
    });
});

exports.saveRecord = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const shop_id = params[1];
        const date = params[2];
        const product = JSON.parse(decodeURI(params[3]));
      

        var updates = {};

    
        var price = product.price;
        var qty = product.qty;
        var code = product.product_code;
        var data;

        

        var databaseRef = admin.database().ref('shop/'+shop_id);
        databaseRef.child('products/'+code).once('value',(snapshot)=>{
            var stock = snapshot.val().stock;
            var data;
            if(stock < qty){
                res.send(false);
            }else{
                databaseRef.child('record/'+date+'/'+code).once('value',(recordSnapshot)=>{
                    if(recordSnapshot.exists()){
                         data = {
                            price: recordSnapshot.val().price + price,                       
                            qty: recordSnapshot.val().qty + qty
                        }  
                    } else {
                         data = {
                            price: price,
                            qty: qty
                        }
                    }
                    updates['/shop/'+shop_id+'/record/'+date+'/'+code] = data;
                    admin.database().ref().update(updates);
                });
                updates['/shop/'+shop_id+'/products/'+code+'/stock'] = stock - qty;
                admin.database().ref().update(updates); 
                res.send(true);
            }
        });
    });
});


exports.checkProduct = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const product_code = params[1];
        const shop_id = params[2];

        var isFound = false;

        var data = {
            result: isFound
        }

        admin.database().ref('shop/'+ shop_id + '/products/'+ product_code).once('value',(snapshot)=>{
            if(snapshot.exists){
                isFound = true;
                data = {
                    product_code: product_code,
                    price: snapshot.val().price,
                    result: isFound
                }            
            }
            res.send(data);
        });
    });
});


//----------------------------------------------------



exports.loadRecord = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const shop_id = params[1];

        var totalRevenue = 0;
        var totalSale = 0;
        var statRef = admin.database().ref('stat/shop');

        statRef.once('value',(snapshot)=>{
            totalRevenue = snapshot.val().revenue;
            totalSale = snapshot.val().sale;
        });

        var databaseRef = admin.database().ref('shop/'+shop_id);
        databaseRef.child('record').once('value',(snapshot)=>{
            var records = [];
            snapshot.forEach(function(dateSnapshot) {
                var date = dateSnapshot.key;
                var products = [];
                dateSnapshot.forEach(function(productSnapshot){
                    var product_code = productSnapshot.key;
                    var price = productSnapshot.val().price;
                    var qty = productSnapshot.val().qty;
                    var product = {
                        product_code: product_code,
                        price: price,
                        qty: qty
                    }
                    products.push(product);
                });

                var todayRecord = {
                    date: date,
                    products: products
                }
                records.push(todayRecord);

            });
            databaseRef.once('value',(snapshot)=>{
                var revenue = snapshot.val().revenue;
                var sale = snapshot.val().sale;
                var shopRecord = {
                    records: records,
                    revenue: revenue,
                    sale: sale,
                    totalRevenue: totalRevenue,
                    totalSale: totalSale
                }
                res.send(shopRecord);
            });                
        });
        
    });
});

exports.loadShopId = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        var shopNum = 0;
        var statRef = admin.database().ref('stat/shop');

        statRef.once('value',(snapshot)=>{

            shopNum = snapshot.val().num;
            var data = {
                shopNum: shopNum

            }
            res.send(data);
        });

    });
});


exports.addEmployee = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const employee = JSON.parse(decodeURI(params[1]));
        
        var username = employee.username;
        var password = employee.password;
        var role_id = employee.role;
        var shop_id = employee.shop_id;

        var updates = {};
        var shopExist = true;
        var userExist = false;

        var data = {
          password : password,
          role: role_id,
          shop_id: shop_id
        }

        admin.database().ref('employee/'+username).once('value',(snapshot)=>{
            if(snapshot.exists()){
                userExist = true;
                var result = {
                    userExist: userExist,
                    shopExist: shopExist
                }
                res.send(result);
            } else {
                admin.database().ref('shop/'+shop_id).once('value',(shopSnapshot)=>{
                    if(!shopSnapshot.exists()){
                        shopExist = false;
                    } else {
                        updates['/employee/' + username] = data;
                        admin.database().ref().update(updates);
                    }
                    var result = {
                        userExist: userExist,
                        shopExist: shopExist
                    }
                    res.send(result);
                });
            }
        });
    });
});

exports.removeUser = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const username = params[1];

        admin.database().ref().child('/employee/'+username).remove();
        return res.send(true);
    });
});

exports.updatePass = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const newData = JSON.parse(decodeURI(params[1]));

        var data = {
            password: newData.password,
            role: newData.role,
            shop_id: newData.shop_id
        }

        var updates = {};
        updates['/employee/' + newData.username] = data;
        admin.database().ref().update(updates);
        return res.send(true);
    });
});

// exports.modifyUser= functions.https.onRequest((req,res)=>{
//     cors(req,res,() =>{
//         const params = req.url.split("/");
//         const data = JSON.parse(decodeURI(params[1]));

//         var updates = {};
//         var username = data.username;
//         var shop_id = data.shop_id;
//         var oldUsername = data.oldUsername;
//         var shopExist = true;
            

//         if(type == 1){  // update current product
//             admin.database().ref('employee/'+username).once('value',(snapshot)=>{
//                 admin.database().ref('shop/'+shop_id).once('value',(shopSnapshot)=>{
//                     if(!shopSnapshot.exists()){
//                         shopExist = false;
//                         res.send(shopExist);
//                     }else{
//                         updates['/product/' + username +'/shop_id'] = shop_id;
//                         admin.database().ref().update(updates);
//                         res.send(true);
//                     }
//                 });
//             });
//         } else {
//             var data1;
//             admin.database().ref('employee/'+oldUsername).once('value',(snapshot)=>{
//                 data1 = {
//                     password: snapshot.val().password,
//                     role: snapshot.val().role,
//                     shop_id: snapshot.val().shop_id
//                 }
//                 updates['/employee/' + username] = data1;
//                 admin.database().ref().update(updates);
//             });
//             admin.database().ref().child('/employee/'+oldUsername).remove();
//             res.send(true);
//         }
//     });
// });
