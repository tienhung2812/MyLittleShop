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

exports.addProduct = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const product_code = params[1];

        var updates = {};
        var result = true;

        var data = {
          price : params[2]
        }

        admin.database().ref('products').once('value',(snapshot)=>{
            snapshot.forEach(function(productID){
                if(productID.key==product_code){
                    result = false;
                    res.send(result);
                    return ;
                }
            })
            
            updates['/products/'+product_code] = data;
            admin.database().ref().update(updates);
            res.send(result);
            
        });
    });
});

exports.importProduct = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const product = JSON.parse(decodeURI(params[1]));
      

        var updates = {};

        var shop_id = product.shopID;
        var time = product.time;
        var code = product.product_code; 
        var qty = product.qty;
       
        var type = 'import';
        var data;

        data = {
            shopID : shop_id,
            code: code,
            qty : qty,
            time: time,
            type: type
        }


        var databaseRef = admin.database().ref('transaction');
        var newTransactionKey = databaseRef.push().key;
        console.log('Add transaction: '+newTransactionKey);
        updates['/transaction/'+newTransactionKey] = data;
        admin.database().ref().update(updates); 
        res.send(true);        
    });
});


exports.modifyProduct = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const product = JSON.parse(decodeURI(params[1]));

        var product_code = product.code;
        var old_product_code = product.oldCode;
        var price = product.price;
        var data;
        var result;
        var updates = {};
        var productExist = false;

        admin.database().ref('/products/'+product_code).once('value',(snapshot)=>{
            if(snapshot.exists()){
                productExist = true;
                data = {
                    price: price

                }
                updates['/products/'+product_code] = data;
                admin.database().ref().update(updates);
                    
                
            } else{
                admin.database().ref('/products/'+old_product_code).once('value',(productSnapshot)=>{

                    data = {
                        price: price

                    }
                    
                    updates['/products/'+product_code] = data;
                    admin.database().ref().update(updates);
                    admin.database().ref().child('/products/'+ old_product_code).remove();
                });
            }
            result = {
                productExist: productExist,
                shopExist: shopExist
            }
            res.send(result);
        });

        
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
        const product = JSON.parse(decodeURI(params[1]));
      

        var updates = {};

        var shop_id = product.shopID;
        var time = product.time;
        var code = product.product_code;
        var qty = product.qty;
        
        var type = 'export';
        var data;

        data = {
            shopID : shop_id,
            code: code,
            qty : qty,
            time: time,
            type: type
        }


        var databaseRef = admin.database().ref('transaction');
        var newTransactionKey = databaseRef.push().key;
        console.log('Add transaction: '+newTransactionKey);
        updates['/transaction/'+newTransactionKey] = data;
        admin.database().ref().update(updates); 
        res.send(true);                
    });
});

exports.checkProduct = functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const product_code = params[1];

        var isFound = false;

        var data = {
            result: isFound
        }

        admin.database().ref('products').once('value',(snapshot)=>{
            snapshot.forEach(function(productID){
                if(productID.key==product_code){
                    console.log('Existed');
                    isFound = true;
                    data = {
                        product_code: product_code,
                        price: productID.val().price,
                        result: isFound
                    } 
                    res.send(data);
                    return;
                }
            })
            res.send(data);
        });
    });
});


//----------------------------------------------------


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

exports.modifyUser= functions.https.onRequest((req,res)=>{
    cors(req,res,() =>{
        const params = req.url.split("/");
        const employee = JSON.parse(decodeURI(params[1]));

        var updates = {};
        var username = employee.username;
        var shop_id = employee.shop_id;
        var oldUsername = employee.oldUsername;
        var oldShop = employee.oldShop;
        var type = employee.type;

        var data;
        var result;
        var updates = {};
        var userExist = false;
        var shopExist = true;
            

        if(type == 1){  // update current user
            result = {
                userExist: userExist,
                shopExist: shopExist
            }
            res.send(result);
        } else if(type == 2) { // same username , different shop
            admin.database().ref('shop/'+shop_id).once('value',(snapshot)=>{
                if(snapshot.exists()){
                    admin.database().ref('employee/'+username).once('value',(employeeSnapshot)=>{
                        var role = employeeSnapshot.val().role;
                        var password = employeeSnapshot.val().password;
                        data = {
                            password: password,
                            role: role,
                            shop_id: shop_id
                        }
                        admin.database().ref().child('employee/'+username).remove();
                        updates['/employee/'+username] = data;
                        admin.database().ref().update(updates);
                    });
                }else{
                    shopExist = false;
                }
                result = {
                    userExist: userExist,
                    shopExist: shopExist
                }
                res.send(result);
            });
        } else if(type == 3){ // different username, same shop
            admin.database().ref('employee/'+username).once('value',(snapshot)=>{
                if(snapshot.exists()){
                    userExist = true;
                } else{
                    admin.database().ref('employee/'+oldUsername).once('value',(employeeSnapshot)=>{
                        var role = employeeSnapshot.val().role;
                        var password = employeeSnapshot.val().password;
                        data = {
                            password: password,
                            role: role,
                            shop_id: shop_id
                        }
                        admin.database().ref().child('employee/'+oldUsername).remove();
                        updates['/employee/'+username] = data;
                        admin.database().ref().update(updates);
                    });
                }
                result = {
                    userExist: userExist,
                    shopExist: shopExist
                }
                res.send(result);
            });
        } else { // different username, different shop
            admin.database().ref('shop/'+shop_id).once('value',(snapshot)=>{
                if(snapshot.exists()){
                    admin.database().ref('employee/'+username).once('value',(employeeSnapshot)=>{
                        if(employeeSnapshot.exists()){
                            userExist = true;
                            result = {
                                userExist: userExist,
                                shopExist: shopExist
                            }
                            res.send(result);      
                        } else{
                            admin.database().ref('employee/'+oldUsername).once('value',(snapshot2)=>{
                                 var role = snapshot2.val().role;
                                var password = snapshot2.val().password;
                                data = {
                                    password: password,
                                    role: role,
                                    shop_id: shop_id
                                }
                                admin.database().ref().child('employee/'+oldUsername).remove();
                                updates['/employee/'+username] = data;
                                admin.database().ref().update(updates);
                            });
                            result = {
                                userExist: userExist,
                                shopExist: shopExist
                            }
                            res.send(result);           
                        }
                    });
                }else{
                    shopExist = false;
                    result = {
                        userExist: userExist,
                        shopExist: shopExist
                    }
                    res.send(result);
                }
            });
        }
    });
});

