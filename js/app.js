var total="total",sale="sale",stock="stock",record="record";
var role=localStorage.getItem("role");
var shop_id = localStorage.getItem("shop_id");
var usr = localStorage.getItem("username");
var pass = localStorage.getItem("password");
var project_code = "my-little-shop-final";
var shopNum = localStorage.getItem("shopNum");

var currentPage=location.pathname.split("/").slice(-1)[0].split(".").slice(0)[0];

if (role==null&&currentPage!="login"){
    window.location.href = "login.html";
}

if(role==2){
    $(".navbar-brand").attr("href","manage-product-check.html");
}

var shop_id = localStorage.getItem("shop_id");

if(screen.width<767){
        Sidebar();
};

function installContent(callback){
        //Add Left sidebar
        if(currentPage!='login'){
            leftSidebar(role,currentPage);
            pageWrapper(role,currentPage);
        }
        
        //Add content by page
        
        callback();
}

function checkPageNeedLoadData(){
    var pageHaveToLoadData = ["index","user-manage","product-manage"];
    for(i in pageHaveToLoadData){
        if(currentPage==pageHaveToLoadData[i]){
            return true;
        }
    }
    return false;
}

//-----------------------------INDEX--------------------------------------------------

function loadRecord(){
    var importData = [];
    var exportData = [];
    var total,i=0,j=0;
    var products = [];
    var shop = [];
    for(i=0;i<shopByID.length;i++){
        shop[shopByID[i]] = products;
    }
    var productRef = firebase.database().ref('products');
    productRef.on('value',function(productID){
        productID.forEach(function(p){
            
            products.push({
                code:p.key,
                price: p.val().price,
                import :0,
                export :0               
            })
        })
    });
    var databaseRef = firebase.database().ref('transaction');
    if(role==0){
        total = [];       
        databaseRef.on('value',function(transRef){
            transRef.forEach(function(trans){
                data = trans.val();
                if(data.type=="import"){
                    importData.push({
                        shopID: data.shopID,
                        code: data.code,
                        qty: data.qty,
                        time: data.time
                    })
                }
                if(data.type=="export"){
                    exportData.push({
                        shopID: data.shopID,
                        code: data.code,
                        qty: data.qty,
                        time: data.time
                    })
                }
            })
            for(i;i<shopByID.length;i++){
                total[shopByID[i]]=0;
            }
            
            for(i=0;i<shopByID.length;i++){
                shop.push({
                    products:products,
                    total:0
                })
            }
            
            console.log("Export data length: "+exportData.length);
            for(i=0;i<shopByID.length;i++){
                for(j=0;j<exportData.length;j++){
                    if(exportData[j].shopID == shopByID[i]){
                        var k=0;
                        for(k;k<shop[i].products.length;k++){
                            if(exportData[j].code==shop[i].products[k].code){
                                insertRecordShopData(exportData[j].code,exportData[j].time,exportData[j].qty,exportData[j].qty*shop[i].products[k].price,exportData[j].shopID);
                                shop[i].total += exportData[j].qty*shop[i].products[k].price,exportData[j];
                                shop[i].products[k].export += 1;
                            }
                        }
                    }
                }
            }

            console.log("import data length: "+importData.length);
            for(i=0;i<shopByID.length;i++){
                for(j=0;j<importData.length;j++){
                    if(importData[j].shopID == shopByID[i]){
                        var k=0;
                        for(k;k<shop[i].products.length;k++){
                            if(importData[j].code==shop[i].products[k].code){
                                //insertRecordShopData(importData[j].code,importData[j].time,importData[j].qty,importData[j].qty*shop[i].products[k].price,importData[j].shopID);
                                //shop[i].total += importData[j].qty*shop[i].products[k].price,importData[j];
                                shop[i].products[k].import += 1;
                            }
                        }
                    }
                }
            }
            
            //Product Data
            // console.log("import data length: "+importData.length);
            // for(i=0;i<importData.length;i++){
            //     for(j=0;j<products.length;j++){
            //         if(importData[i].code==products[j].code){
                        
            //             products[j].import += importData[i].qty;
            //             break;
            //         }
            //     }
            //     //console.log(importData[i].code +'-'+importData[i].time+'-'+importData[i].qty+'-'+importData[i].price+'-'+importData[i].shopID)
            //     // insertShopStocks(importData[i].code,importData[i].time,importData[i].qty,importData[i].price,importData[i].shopID);
            // }
            // for(j=0;j<products.length;j++){
            //     insertShopStocks(products[j].code,products[j].import,products[j].import-products[j].export,importData[i].price,importData[i].shopID);
            // }
            for(i=1;i<=total.length;i++){
                updateDashboardShopData("total",total[i],i);
            }
            

        });
        
        
    }else if(role == 1){
        databaseRef.on('value',function(transRef){
            transRef.forEach(function(trans){
                data = trans.val();
                if(data.shopID==shop_id){
                    if(data.type=="import"){
                        importData.push({
                            shopID: data.shopID,
                            code: data.code,
                            price: data.price,
                            qty: data.qty,
                            time: data.time
                        })
                    }
                    if(data.type=="export"){
                        exportData.push({
                            shopID: data.shopID,
                            code: data.code,
                            price: data.price,
                            qty: data.qty,
                            time: data.time
                        })
                    }
                }
                
            });
            total = 0;
            var remainTotal=0;
            var i =0;
            //Export
            for(i=0;i<exportData.length;i++){
                insertRecordData(exportData[i].code,exportData[i].time, exportData[i].qty, exportData[i].price);
                total+=exportData[i].price;
            }
            //IMport
            for(i=0;i<importData.length;i++){
                insertShopStock(importData[i].code,importData[i].time, importData[i].qty, importData[i].price);
                remainTotal += importData[i].price;
            }
            updateDashboardData("total",total);
            updateDashboardData("sale",remainTotal);
            for(i=0;i<importData.length;i++){
                insertShopStock(importData[i].code,importData[i].time, importData[i].qty, importData[i].price);
                //remainTotal += importData[i].price;
            }
        });

    }
}

function loadStock(){

    if(role == 0){
        var databaseRef = firebase.database().ref('shop/');
        databaseRef.on('value', function(snapshot) {
            var i = 1;
            $("#stock-val-"+i+" tr").remove();
            snapshot.forEach(function(shopSnapshot){
                var rowIndex = 1;
                var shopId = shopSnapshot.key;
                databaseRef.child(shopId+'/products').on('value',function(productSnapshot){
                    productSnapshot.forEach(function(childSnapshot) {
                        var childKey = childSnapshot.key;
                        var childData = childSnapshot.val();
                        insertShopStocks(rowIndex,childKey,childData.price,childData.stock,shopId);
                        rowIndex ++;
                    });
                });
            });
        });
    }else{
        var databaseRef = firebase.database().ref('shop/'+shop_id+'/products');
    
        databaseRef.on('value', function(snapshot) {
            $("#stock-val tr").remove();
            var rowIndex = 1;
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                insertShopStock(rowIndex,childKey,childData.price,childData.stock);
                rowIndex ++;
            });
        });
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------
//Example For Shop Manager Dashboard
// updateDashboardData(total,3);
// updateDashboardData(sale,13);
// updateDashboardData(stock,33);
// insertRecordData(2,64645,"Jan 11",51);
// function loadRecord(){
// 	var shopRecords = [];
//     if(role==0){
        
//         for(var i = 0; i < shopNum; i++){
        
//         	addShopDashboard(i+1);
//         	console.log("Add shop " + (i+1));
        	
//         	var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/loadRecord/'+(i+1);

//         	let request = new XMLHttpRequest();
//         	request.open("GET",url,false);
//        		request.onreadystatechange = function() {
//         		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
//         			var shopId = 1;
//             		var data = JSON.parse(request.responseText);
//             		shopRecords.push(data);  	
//         		}
//    			}
//    			request.send();
//         }

//        	for(var i = 0; i < shopRecords.length;i++){
//       		var rowIndex = 1;
//        		var records = shopRecords[i].records;
//        		var revenue = shopRecords[i].revenue;
//             var sale = shopRecords[i].sale;

//             updateDashboardShopData("total",revenue,(i+1));
//             updateDashboardShopData("sale",sale,(i+1));

//             for(var j = 0; j < records.length ; j++){
//             	var date = records[j].date;
//             	var products = records[j].products;
            	
//             	for (var k = 0; k < products.length; k++){
            		
//             		var product_code = products[k].product_code;
//             		var price = products[k].price;
//             		var qty = products[k].qty;
//             		insertRecordShopData(rowIndex,product_code,date,qty,price,(i+1));
//             		rowIndex++;
//             	}
//             }   		
//        	}    
//     } else {
//     	var rowIndex = 1;
//     	var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/loadRecord/'+shop_id;
//     	var xhr = createCORSRequest('GET', url);

//       	if (!xhr) {
//         	alert('CORS not supported');
//         	return;
//       	}

//       	// Response handlers.
//       	xhr.onload = function() {
//         	var data = JSON.parse(xhr.responseText);

//         	var records = data.records;
//        		var revenue = data.revenue;
//             var sale = data.sale;

//             updateDashboardData("total",revenue);
//             updateDashboardData("sale",sale);

//             for(var j = 0; j < records.length ; j++){
//             	var date = records[j].date;
//             	var products = records[j].products;
            	
//             	for (var k = 0; k < products.length; k++){
            		
//             		var product_code = products[k].product_code;
//             		var price = products[k].price;
//             		var qty = products[k].qty;
//             		insertRecordData(rowIndex,product_code,date,qty,price);
//             		rowIndex++;
//             	}
//             }
//      	};

//       	xhr.onerror = function() {
//         	//notify('danger', 'Username not exist!');
//         	alert('Something went wrong!');
//       	};

//       	xhr.send();
//     }
//     return false;
 
// }
//------------------------------------------------------------------------------------------------------------------
// Add employee

function import_user(){

    var username= document.getElementById('username').value;
    var password= document.getElementById('password').value;
    var input_role = -1;

    if(document.getElementById('roleSelect').value == "Employee"){
        input_role = 2;
    } else if(document.getElementById('roleSelect').value == "Shop Manager"){
        input_role = 1;
    }
    var shopId;

    if(role == 0){
        shopId = document.getElementById('shopNo').value;  
    } else {
        shopId = shop_id;
    }


    // var hash= CryptoJS.SHA3(password);
    // alert(hash);
    // var hash = saltHashPassword(password);
    // alert(hash);

    var data = {
        username: username,
        password: password,
        role: input_role,
        shop_id: shopId
    }

    var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/addEmployee/'+JSON.stringify(data);
    var xhr = createCORSRequest('GET', url);

    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var result = JSON.parse(xhr.responseText);
        var userExist = result.userExist;
       
        if(userExist){
            notify('danger','Username existed!');
        } else {
            var shopExist = result.shopExist;

            if(!shopExist){
               notify('danger','Shop does not exist!');
            }else{
               notify('success','User is added successfully!');
            }
        }
    };

    xhr.onerror = function() {
       //notify('danger', 'Username not exist!');
        notify('danger','Something went wrong!');
    };

    xhr.send(); 

}



function loadEmployee(){
    if(currentPage=="user-manage"){
        
        var databaseRef = firebase.database().ref('employee/');
        databaseRef.on('value', function(snapshot) {
            $("#shopManagertbody tr").remove();
            $("#employeetbody tr").remove();
            var rowManager = 1;
            var rowEmployee = 1;
            snapshot.forEach(function(childSnapshot) {
        
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                if(role == 0) {
                    if(childData.role == 1){
                        insertUserRecordDataManager(childData.role,rowManager,childKey,childData.shop_id);
                        rowManager++;
                    }
                    if (childData.role == 2){
                        insertUserRecordDataManager(childData.role,rowEmployee,childKey,childData.shop_id);
                        rowEmployee++;
                    }
                }else{
                    if(childData.role == 2 && childData.shop_id == shop_id){
                        insertUserRecordData("employee",rowEmployee,childKey,childData.shop_id);
                        rowEmployee++;
                    }
                }
            })
        });
    }
}

// function loadEmployee(){
//         $("#shopManagertbody tr").remove();
//         $("#employeetbody tr").remove();

//         var rowEmployee = 1;
//         var rowManager = 1;

// 		var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/loadEmployee/'+role+'/'+shop_id;
		
//         var xhr = createCORSRequest('GET', url);

//       	if (!xhr) {
//         	alert('CORS not supported');
//         	return;
//       	}

//       	// Response handlers.
//       	xhr.onload = function() {
//         	var data = JSON.parse(xhr.responseText);

//         	var managers = data.managers;
//         	var employees = data.employees;
//         	for (var i = 0; i < employees.length; i++){
//         		insertUserRecordData("employee",rowEmployee,employees[i].username,employees[i].shop_id);
//         		rowEmployee++;
//         	}
//         	for (var i = 0; i < managers.length;i++){
//         		insertUserRecordData("shopmanager",rowManager,managers[i].username,managers[i].shop_id);
//         		rowManager++;
//         	}
//      	};

//       	xhr.onerror = function() {
//         	//notify('danger', 'Username not exist!');
//         	alert('Something went wrong!');
//       	};

//       	xhr.send();
//       	return false;
// }


//Modify user
function update_user(){
 //    var username = document.getElementById('username').value;
 //    var shop_id = document.getElementById('shop').value;
 //    var type = 0;
   
 //   	if(username == oldCode){
	//    	type = 1;
	// } else {
	//    	type = 2;
	// }

	// var data = {
	// 	username: username,
	// 	shop_id: shop_id,
	// 	type: type,
	// 	oldUsername: oldCode
	// }

	// var url =  'https://us-central1-'+project_code+'.cloudfunctions.net/modifyUser/'+JSON.stringify(data);
 //    var xhr = createCORSRequest('GET', url);
	
	// if (!xhr) {
	//     alert('CORS not supported');
	//     return;
 //    }
	//       	// Response handlers.
	// xhr.onload = function() {
	//     var result = (xhr.responseText === "true");
	    
	//     if(result){
	//         notify('success','User modified successfully!');
	//         reload_page();
	//     }else{
	//         notify('danger','Shop not exist!');
	//     }
	// };

	// xhr.onerror = function() {
	//         //notify('danger', 'Username not exist!');
	//     notify('danger','Something went wrong!');
	// };

	// xhr.send();
 //    return false;   

}
  

function delete_user(){
    var username = document.getElementById('username').value;
  
	var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/removeUser/'+username;
		
    var xhr = createCORSRequest('GET', url);

    if (!xhr) {
        alert('CORS not supported');
        return;
    }

      	// Response handlers.
    xhr.onload = function() {
    	var result = (xhr.responseText === true);
    	if(result){
    		notify('success','User is deleted successfully!');
    	}
    };

    xhr.onerror = function() {
        	//notify('danger', 'Username not exist!');
       notify('danger','Something went wrong!');
    };

    xhr.send();
    return false;
}

function password_update(){
    var oldPass = document.getElementById("old_pass").value;
    var newPass = document.getElementById("new_pass").value;
    var rePass = document.getElementById("re_pass").value;

    if(oldPass == pass){
        if(newPass == rePass){
            var data = {
            	username: usr,
                password : newPass,
                role : role,
                shop_id : shop_id
            }

            var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/updatePass/'+JSON.stringify(data);
          
		
		    var xhr = createCORSRequest('GET', url);

		    if (!xhr) {	
		        alert('CORS not supported');
		        return;
		    }

		      	// Response handlers.
		    xhr.onload = function() {
		    	var result = (xhr.responseText === "true");
		    	if(result){
		    		notify('success','Password is updated successfully!');
		    		localStorage.setItem('password',newPass);
		    		reload_page();
		    	}
		    };

		    xhr.onerror = function() {
		        	//notify('danger', 'Username not exist!');
		       notify('danger','Something went wrong!');
		    };

    		xhr.send();
        }else{
            notify("danger","Re-enter password does not match!");
        }
    }else{
        notify("danger","Old Password is not correct!");
    }
 
    return false;
}

//-----------------------------------------------------------------------------------------------------------------------
//Product record 
//Example for product record
// insertProductRecordData(2,342,141,342); 
// function LoadData(){
//         $("#tbl_products_list tbody tr").remove();
//         var rowIndex = 1;
// 		var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/loadProduct/'+shop_id;
	
//         var xhr = createCORSRequest('GET', url);

//       	if (!xhr) {
//         	alert('CORS not supported');
//         	return;
//       	}

//       	// Response handlers.
//       	xhr.onload = function() {
//         	var data = JSON.parse(xhr.responseText);
//         	for(var i = 0; i < data.length; i++){
//         		var price = data[i].price;
//         		var stock = data[i].stock;
//         		var product_code = data[i].product_code;
//         		insertProductRecordData(rowIndex,product_code,price,stock);
//         		rowIndex +=1;
//         	}
//      	};

//       	xhr.onerror = function() {
//         	//notify('danger', 'Username not exist!');
//         	alert('Something went wrong!');
//       	};

//       	xhr.send();
//       	return false;
// }
function LoadData(){
 
    if(role == 0){
        console.log("Import data role 0")
        var databaseRef = firebase.database().ref('products');
        databaseRef.on('value', function(snapshot) {
        //   $("#tbl_products_list tbody tr").remove();
        //  var rowIndex = 1;
          snapshot.forEach(function(shopSnapshot){
              console.log(shopSnapshot.key)
            insertProductRecordDataManager(shopSnapshot.key,shopSnapshot.val().price);
            
          });
        });
      }else{
        var databaseRef = firebase.database().ref('shop/'+shop_id+'/products');
    
        databaseRef.on('value', function(snapshot) {
            $("#tbl_products_list tbody tr").remove();
            var rowIndex = 1;
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                insertProductRecordData(rowIndex,childKey,childData.price,childData.stock);
                rowIndex ++;
            });
        });
    }   
}

	// Add Product
function add_product(){
	var code= document.getElementById('pCode').value;
	var price= document.getElementById('pPrice').value;
    
    //Check is a number
    if(isNaN(price)){
        notify("danger","Invalid price");
        return false;
    }else{
        price = Number(price);
    }


    
    var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/addProduct/'+code+'/'+price;
    
    var xhr = createCORSRequest('GET', url);

    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var result = (xhr.responseText === "true");
    
        if(result){
            notify('success','Product is added successfully!');
            
            $('#pPrice').val('');
            $('#pCode').val('');
            
        }else{
            notify('danger','Product has already existed!');
        }    	
    };

    xhr.onerror = function() {
        //notify('danger', 'Username not exist!');
        alert('Something went wrong!');
    };

    xhr.send();
    return false;
    
}

function import_product(){
	var code= document.getElementById('pCode').value;
	var qty= document.getElementById('pQty').value;
    var shopID;
    var date = Math.floor(Date.now() / 1000);
    var haveShopID = true;
    if(role==0){
        shopID = $('#pID option:selected').val();
    } else{
        shopID = shop_id;
    }
    //Check is a number

    if(isNaN(qty)){
        notify("danger","Invalid quantity number");
        return false;
    } else if(!Number.isInteger(Number(qty))){
        notify("danger","Quantity must be an interger");
        return false;
    }else if(qty<0){
        notify("danger","Quantity must larger than 0");
        return false;
    }

   
    if(haveShopID){
        var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/checkProduct/'+code;
      
      var xhr = createCORSRequest('GET', url);


      if (!xhr) {
        alert('CORS not supported');
          return;
      }

      // Response handlers.
      xhr.onload = function() {
        var data = JSON.parse(xhr.responseText);
        if(data.result){
            var price = data.price*qty;
            if(role!=0){
                var data = {
                    shopID:shop_id,
                    time:date,
                    product_code:code,
                    qty: qty,
                    price:price
                }
            }else{
                var data = {
                    shopID:shopID,
                    time:date,
                    product_code:code,
                    qty: qty,
                    price:price
                }
            }
            
            var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/importProduct/'+JSON.stringify(data);
        
            var xhr1 = createCORSRequest('GET', url);

            if (!xhr1) {
                alert('CORS not supported');
                return;
            }

            // Response handlers.
            xhr1.onload = function() {
                var result = (xhr1.responseText === "true");
            
                if(result){
                    notify('success','Product is added successfully!');
                    $('#pCode').val('');
                    $('#pQty').val('');
                    if(role==0){
                        $('#pID').val('');
                    }
                }else{
                    notify('danger','Product has already existed!');
                }    	
            };

            xhr1.onerror = function() {
                //notify('danger', 'Username not exist!');
                alert('Something went wrong!');
            };

            xhr1.send();
            return false;
          
        } else {
          notify("danger","Product not found");
        }
        
      };

      xhr.onerror = function() {
        //notify('danger', 'Username not exist!');
        notify('danger','Something went wrong!');
      };

      xhr.send();
        
    }else{
        notify("danger","Shop does not exist");
    }
}


// function update_product(){
//         var code = document.getElementById('pCode').value;
//         var price = document.getElementById('pPrice').value;
//         var stock = document.getElementById('pStock').value;
//         var type = 0;
//         if(code == oldCode){
//             type = 1;
//         } else {
//             type = 2;
//         }

//         var url =  'https://us-central1-'+project_code+'.cloudfunctions.net/modifyProduct/'+code+'/'+price+'/'+stock+'/'+shop_id+'/'+oldCode+'/'+type;
//         var xhr = createCORSRequest('GET', url);

//         if (!xhr) {
//             alert('CORS not supported');
//             return;
//         }
//             // Response handlers.
//         xhr.onload = function() {
//             var result = (xhr.responseText === "true");
        
//             if(result){
//                 alert('Product is modified successfully!');
//                 reload_page();
//             }else{
//                 alert('Modified product code is exist!');
//             }
//         };

//         xhr.onerror = function() {
//             //notify('danger', 'Username not exist!');
//             alert('Something went wrong!');
//         };

//         xhr.send();
//         return false;   
//     }


	  //Modify Product
function update_product(){
	var code = document.getElementById('pCode').value;
	var price = document.getElementById('pPrice').value;
    var shopId;
    var stock = 0;
	var type = 0;

    if(isNaN(price)){
        notify("danger","Invalid price");
        return false;
    }

    if(role == 0){
        shopId = document.getElementById('pShop').value;
        if(isNaN(shopId)){
            notify("danger","Invalid shopID");
            return false;
        }
    }else{
        shopId = shop_id;
        stock = document.getElementById('pStock').value;
        if(isNaN(stock)){
            notify("danger","Invalid stock number");
            return false;
        } else if(!Number.isInteger(Number(stock))){
            notify("danger","Stock must be an interger");
            return false;
        }else if(stock<0){
            notify("danger","Stock must larger than 0");
            return false;
        }
    }

    if(code == oldCode && shopId == oldShop){
        type = 1;                 // Update on current product
    } else if(code == oldCode && shopId != oldShop){
        type = 2;                // Same product move to another Shop
    } else if(code != oldCode && shopId == oldShop){
        type = 3;
    } else {
        type = 4;
    }

    var data = {
        code: code,
        price: price,
        type: type,
        oldCode: oldCode,
        shop_id: shopId,
        stock: stock,
        role: role,
        oldShop : oldShop
    }

	var url =  'https://us-central1-'+project_code+'.cloudfunctions.net/modifyProduct/'+JSON.stringify(data);
  
    var xhr = createCORSRequest('GET', url);

	if (!xhr) {
	    alert('CORS not supported');
	    return;
    }
	      	// Response handlers.
	xhr.onload = function() {
	    var result = JSON.parse(xhr.responseText);
	    
	    if(result.productExist){
	        notify('danger','Modified product exists!');
	   }else if (!result.shopExist){
	        notify('danger','Shop does not exist!');
	   } else {
            notify('success','Product is modified successfully!');
       }
	};

	xhr.onerror = function() {
	   //notify('danger', 'Username not exist!');
	   notify('danger','Something went wrong!');
	};

	xhr.send();
    return false;   
}
  
	function delete_product(){
	    var product_code = document.getElementById('pCode').value;
	    var shopId;
      if(role == 0){
        shopId = document.getElementById('pShop').value;
      }else {
        shopId = shop_id;
      }
	    var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/removeProduct/'+product_code+'/'+shopId;
		  alert(url);
	    var xhr = createCORSRequest('GET', url);

      	if (!xhr) {
        	alert('CORS not supported');
        	return;
      	}

      	// Response handlers.
      	xhr.onload = function() {
        	var result = (xhr.responseText === "true");
        	if(result){
        		alert("Delete success!");
        	}
     	};

      	xhr.onerror = function() {
        	//notify('danger', 'Username not exist!');
        	alert('Something went wrong!');
      	};

      	xhr.send();
      	return false;
	}
//--------------------------------------------------------------------

	function addShop(){
    	var shopId = document.getElementById("shopId").value;
    	var shopName = document.getElementById("shopName").value;

    	var shop = {
    		shop_id: shopId,
    		shop_name: shopName
    	}

		var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/addShop/'+JSON.stringify(shop);

        var xhr = createCORSRequest('GET', url);

      	if (!xhr) {
        	alert('CORS not supported');
        	return;
      	}

      	// Response handlers.
      	xhr.onload = function() {
        	var result = (xhr.responseText === "true");
    
        	if(result){
        		alert('Shop existed!');
        	}else{
        		alert('Create new shop successfully!');
        	}
        	
     	};

      	xhr.onerror = function() {
        	//notify('danger', 'Username not exist!');
        	alert('Something went wrong!');
      	};

      	xhr.send();
      	return false;
	}
//--------------------------------------------------

function saveRecord(){
    var updates = {};
    console.log("Save record");
    for(var i = 0; i < product.length;i++){

        var code = product[i][0];
        //var databaseRef = firebase.database().ref('shop/'+ shop_id+'/record/'+ getDate()+'/'+code);
        var qty = product[i][1];
        var price = product[i][2] * product[i][1];
        var date = Math.floor(Date.now() / 1000);

        var data = {
            shopID:shop_id,
            time:date,
        	product_code:code,
        	qty: qty,
        	price: price
        }

        var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/saveRecord/'+JSON.stringify(data);

        let request = new XMLHttpRequest();
        request.open("GET",url);
        request.onreadystatechange = function() {
            if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                var result = (request.responseText === "true");
                if(result){
                    notify('success','The record is saved successfully!');
                    $('.new-button').removeClass('disabled');
                    $('.new-button').removeAttr('disabled');
                    $('.complete-button').attr('disabled','');
                    $('.complete-button').addClass('disabled');
                } else {
                    notify('danger','Product is invalid'); 
                }
            }else{
                notify('danger','Something went wrong!'); 
            }
        }
        request.send();
    }

    
    //notify('success','Save Record sucess!');
    return false;  
}


function newRecord(){
    product = [];
    $("#producttbody").html("");
    $("#total").html("");
    $('.new-button').addClass('disabled');
    $('.new-button').attr('disabled','');
}

function getDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    return dd+'-'+mm+'-'+yyyy;
}

function getTime(){
    var d = new Date(); 
    return d.getHours()+'-'+d.getMinutes();+'-'+d.getSeconds();
}

function reload_page(){
    window.location.reload();
}
//------------------------------------------------------------
// About HTTP request

   // Create the XHR object.
    function createCORSRequest(method, url) {
      	var xhr = new XMLHttpRequest();
      	if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        	xhr.open(method, url, true);
      	} else if (typeof XDomainRequest != "undefined") {
        	// XDomainRequest for IE.
        	xhr = new XDomainRequest();
        	xhr.open(method, url);
      	} else {
        	// CORS not supported.
        	xhr = null;
      	}
      	return xhr;
    }

    // Helper method to parse the title tag from the response.
    function getTitle(text) {
    	return text.match('<title>(.*)?</title>')[1];
    }

    // Make the actual CORS request.
    function login() {
		console.log(project_code);
     	// This is a sample server that supports CORS.
     	var usr = document.forms["loginForm"]["username"].value;
     	var password = document.forms["loginForm"]["psw"].value;
     
     	var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/checkLogin/'+usr+'/'+password ;

      var xhr = createCORSRequest('GET', url);
      if (!xhr) {
        alert('CORS not supported');
        return;
      }

      	// Response handlers.
      xhr.onload = function() {
        var data = JSON.parse(xhr.responseText);
   
        if(data.result){
          localStorage.setItem("role",data.role);

          localStorage.setItem("shop_id",data.shop_id);
          localStorage.setItem("username",data.usr);
          localStorage.setItem("password",data.pass);
          if(data.role==2){
            window.location.href = "manage-product-check.html";
          }
          else {
            window.location.href = "index.html";
          }
        } else {
        		//notify('danger','Wrong password!');
            alert('Wrong password');
        }
     	};

      xhr.onerror = function() {
        //notify('danger', 'Username not exist!');
        alert('User not exist!');
      };

      xhr.send();
      return false;
  }  

    function loadShopId(){
    	var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/loadShopId';
    	var xhr = createCORSRequest('GET', url);
      	if (!xhr) {
        	alert('CORS not supported');
        	return;
      	}

      	// Response handlers.
      	xhr.onload = function() {
        	var data = JSON.parse(xhr.responseText);
        	localStorage.setItem("shopNum",data.shopNum);
     	};

      	xhr.onerror = function() {
        	//notify('danger', 'Username not exist!');
        	alert('Something went wrong!');
      	};

      	xhr.send();
      	return false;
    }

//-------------------------------------------------------------------------------------------------
$(".menu-icon").bind("click", function(){
    Sidebar();
}); 

$(".logout-icon").bind("click", function(){
    signOut();
}); 

$(document).ready ( function(){
    installContent(function(){
        console.log("Page loaded");
    });
    if(checkPageNeedLoadData){
        if(currentPage=="manage-product"){
            LoadData();
        }
        else if (currentPage=="user-manage"){
            loadEmployee();
        }
    }

    if(currentPage == "index"){
        loadRecord();
        loadStock();
    }else if(currentPage == "manage-product-check"){
        $(".new-button").addClass("disabled");
        $(".new-button").attr("disabled",'');
        $(".complete-button").addClass("disabled");
        $(".complete-button").attr("disabled",'');
    }
});

function notify(type,content){
    var alertHTML = '<div class="alert alert-'+type+'" id="alert" role="alert">'
                    +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                    + '<div id="alert-content">'
                    +content
                    +'</div>';           
    $("#alert-div").html(alertHTML);
    //Fade up after 3sec
    $("#alert").fadeTo(3000, 500).fadeOut(500, function(){
        $("#alert").fadeOut(500);
    });
    
}