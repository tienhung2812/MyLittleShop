var total="total",sale="sale",stock="stock",record="record";
var role=localStorage.getItem("role");
var shop_id = localStorage.getItem("shop_id");
var usr = localStorage.getItem("username");
var pass = localStorage.getItem("password");


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
        leftSidebar(role,currentPage);
        //Add content by page
        pageWrapper(role,currentPage);
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
//------------------------------------------------------------------------------------------------------------------
// Add employee

  function import_user(){
    var username= document.getElementById('username').value;
    var password= document.getElementById('password').value;
    var role = 1;
    if(document.getElementById('roleSelect').value == "Employee"){
        role = 2;
    }
    var shopId;
    if(role == 1){
        shopId = document.getElementById('shopNo').value;  
    } else {
        shopId = shop_id;
    }

    var hash= CryptoJS.SHA3(password);
	  
    var i = 0;

    var data = {
      password: hash,
      role: role,
      shop_id: shopId
    }
     
    var updates = {};
    var userExist = false;
    var shopExist = true;

    var databaseRef1 = firebase.database().ref('shop/'+ shop_id);
    var databaseRef = firebase.database().ref('employee/'+username);
    databaseRef1.once('value').then(function(snapshot){
        if(!snapshot.exists()){
            shopExist = false;
        }
    });
    databaseRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            userExist = true;
        }

        if(userExist){
            notify("danger",'Username exist!');
        }else if(!shopExist){
            notify("danger",'ShopId not exist!');
        }else{
            updates['/employee/' + username] = data;
            firebase.database().ref().update(updates);
            notify("success",'The user is created successfully!');
            reload_page();
        }      
    });
  }


//Example For Shop Manager Dashboard
// updateDashboardData(total,3);
// updateDashboardData(sale,13);
// updateDashboardData(stock,33);
// insertRecordData(2,64645,"Jan 11",51);
function loadRecord(){
    if(role==0){
        var databaseRef = firebase.database().ref('stat');
        shopNumRef = databaseRef.child('/shop/num');
        // shopRef = databaseRef.parent.child('shop');
        shopRef = databaseRef.parent.child("shop");
        shopNumRef.on('value',function(shopNum){
            var i=1;
            for(i;i<=shopNum.val();i++){
                addShopDashboard(i);
                console.log("Add shop "+i);
            }
        })

        
        shopRef.on('value',function(shopID){
            shopID.forEach(function(shopSnap){
                shopSnap.ref.child('record').on('value',function(snapshot){
                    console.log("Update shop "+shopSnap.key);
                    $('#record-val tr').remove();
                    var rowIndex = 1;
                    snapshot.forEach(function(dateSnapshot){
                        var date = dateSnapshot.key;
        
                        dateSnapshot.forEach(function(productSnapshot){
                            var code = productSnapshot.key;
                            var price = productSnapshot.val().price;
                            var qty = productSnapshot.val().qty;
                            insertRecordShopData(rowIndex,code,date,qty,price,shopSnap.key);
                            rowIndex++;
                        });
                    });
                });

                shopSnap.ref.child('revenue').on('value',function(snapshot){
                    updateDashboardShopData("total",snapshot.val(),shopSnap.key);
                })

                shopSnap.ref.child('sale').on('value',function(snapshot){
                    updateDashboardShopData("sale",snapshot.val(),shopSnap.key);
                })
            })
        })
    }else
    if(role == 1){
        var databaseRef = firebase.database().ref('shop/'+shop_id);
        recordRef = databaseRef.child('record');
        recordRef.on('value',function(snapshot){
            $('#record-val tr').remove();
            var rowIndex = 1;
            snapshot.forEach(function(dateSnapshot){
                var date = dateSnapshot.key;

                dateSnapshot.forEach(function(productSnapshot){
                    var code = productSnapshot.key;
                    var price = productSnapshot.val().price;
                    var qty = productSnapshot.val().qty;
                    insertRecordData(rowIndex,code,date,qty,price);
                    rowIndex++;
                });
            });
        });

        totalRef = databaseRef.child('revenue');
        totalRef.on('value',function(snapshot){
            updateDashboardData("total",snapshot.val());
        })

        saleRef = databaseRef.child('sale');
        saleRef.on('value',function(snapshot){
            updateDashboardData("sale",snapshot.val());
        })
    }
}

//Manager
// addShopDashboard(1);
// updateDashboardData(total,3240,1);
// insertRecordData(1,323,2323,123123,1)

//Example for insert User record Data
// insertUserRecordData("employee",1,"aa",2);
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
                        insertUserRecordData("shopmanager",rowManager,childKey,childData.shop_id);
                        rowManager++;
                    }
                    if (childData.role == 2){
                        insertUserRecordData("employee",rowEmployee,childKey,childData.shop_id);
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


//Modify user
function update_user(){
    var username = document.getElementById('username').value;
    var shop_id = document.getElementById('shop').value;

   
    var updates = {};
    updates['/employee/' + username] = data;
    firebase.database().ref().update(updates);
    notify("success",'The user is <strong>updated</strong> successfully!');
    var databaseRef = firebase.database().ref('employee/'+ oldCode);

    databaseRef.once('value').then(function(snapshot){
        var data = {
            password : snapshot.val().password,
            role: snapshot.val().role,
            shop_id : shop_id,
        }

        if(username != oldCode) {
            firebase.database().ref().child('/employee/' + oldCode).remove();
        }

        var updates = {};
        updates['/employee/' + username] = data;
        firebase.database().ref().update(updates);
       
        alert('The user is updated successfully!');
    });
}
  
function delete_user(){
    var username = document.getElementById('username').value;
  
   firebase.database().ref().child('/employee/' + username).remove();
   notify("success",'The user is <strong>deleted</strong> successfully!');
}

function password_update(){
    var oldPass = document.getElementById("old_pass").value;
    var newPass = document.getElementById("new_pass").value;
    var rePass = document.getElementById("re_pass").value;

    if(oldPass == pass){
        if(newPass == rePass){
            var data = {
                password : newPass,
                role : role,
                shop_id : shop_id
            }

            var updates = {};
            updates['/employee/' + usr] = data;
            firebase.database().ref().update(updates);
            notify("success",'The user <strong>password is updated</strong> successfully!');
        }else{
            notify("danger","Re-enter password not match!");
        }
    }else{
        notify("danger","Old Password not correct!");
    }
}

//-----------------------------------------------------------------------------------------------------------------------
//Product record 
//Example for product record
// insertProductRecordData(2,342,141,342); 
function LoadData(){
        $("#tbl_products_list tbody tr").remove();
        var rowIndex = 1;
		var url = 'https://us-central1-my-little-shop-41012.cloudfunctions.net/loadProduct/'+shop_id;
	
        var xhr = createCORSRequest('GET', url);

      	if (!xhr) {
        	alert('CORS not supported');
        	return;
      	}

      	// Response handlers.
      	xhr.onload = function() {
        	var data = JSON.parse(xhr.responseText);
        	for(var i = 0; i < data.length; i++){
        		var price = data[i].price;
        		var stock = data[i].stock;
        		var product_code = data[i].product_code;
        		insertProductRecordData(rowIndex,product_code,price,stock);
        		rowIndex +=1;
        	}
     	};

      	xhr.onerror = function() {
        	//notify('danger', 'Username not exist!');
        	alert('Something went wrong!');
      	};

      	xhr.send();
      	return false;
}


// Add Product
function import_product(){
	    var code= document.getElementById('result').innerHTML;
	    var price= document.getElementById('pPrice').value;
	    var stock= document.getElementById('pStock').value;
        alert("Import: "+code + " "+ price + " " + stock);
        
		var url = 'https://us-central1-my-little-shop-41012.cloudfunctions.net/addProduct/'+code+'/'+price+'/'+stock+'/'+shop_id;
	
        var xhr = createCORSRequest('GET', url);

      	if (!xhr) {
        	alert('CORS not supported');
        	return;
      	}

      	// Response handlers.
      	xhr.onload = function() {
        	var result = (xhr.responseText === "true");
    
        	if(result){
                alert('Product is add successfully!');
                var code= document.getElementById('result').innerHTML = "";
                var price= document.getElementById('pPrice').value = "";
                var stock= document.getElementById('pStock').value = "";
        	}else{
        		alert('Product is already exist!');
        	}
        	
     	};

      	xhr.onerror = function() {
        	//notify('danger', 'Username not exist!');
        	alert('Something went wrong!');
      	};

      	xhr.send();
          return false;
}


	  //Modify Product
	function update_product(){
	   	var code = document.getElementById('pCode').value;
	   	var price = document.getElementById('pPrice').value;
	   	var stock = document.getElementById('pStock').value;
	   	var type = 0;
	   	if(code == oldCode){
	   		type = 1;
	   	} else {
	   		type = 2;
	   	}

	   	var url =  'https://us-central1-my-little-shop-41012.cloudfunctions.net/modifyProduct/'+code+'/'+price+'/'+stock+'/'+shop_id+'/'+oldCode+'/'+type;
        var xhr = createCORSRequest('GET', url);

		if (!xhr) {
	       	alert('CORS not supported');
	       	return;
    	}
	      	// Response handlers.
	    xhr.onload = function() {
	       	var result = (xhr.responseText === "true");
	    
	        if(result){
	        	alert('Product is modified successfully!');
	        	reload_page();
	        }else{
	        	alert('Modified product code is exist!');
	        }
	    };

	    xhr.onerror = function() {
	        //notify('danger', 'Username not exist!');
	        alert('Something went wrong!');
	    };

	    xhr.send();
      	return false;   
	}
  
	function delete_product(){
	    var product_code = document.getElementById('pCode').value;
	  
	    var url = 'https://us-central1-my-little-shop-41012.cloudfunctions.net/removeProduct/'+product_code;
		
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
        		reload_page();
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

    var data = {
        name: shopName
    }
     
    var updates = {};
    var databaseRef = firebase.database().ref('shop/'+ shopId);
    var exist = false;

    databaseRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            exist = true;
        } 

        if(exist){
            notify("danger",'Shop Id exist!');
        }else{
            updates['/shop/' + shopId] = data;
            firebase.database().ref().update(updates);
            notify("success",'The shop is created successfully!');
            reload_page();
        }      
    });
}

//---------------------------------------------------------------------
function saveRecord(){
    var updates = {};

    for(var i = 0; i < product.length;i++){
        var code = product[i][0];
        var databaseRef = firebase.database().ref('shop/'+ shop_id+'/record/'+ getDate()+'/'+code);
        var qty = product[i][1];
        var price = product[i][2] * product[i][1];

        databaseRef.once('value',function(snapshot){
            var data;
            if(snapshot.exists()){
                data = {
                    qty: snapshot.val().qty + qty,
                    price: snapshot.val().price + price
                }              
            }else {
                data = {
                    qty: qty,
                    price: price
                }
            }
            updates['/shop/'+shop_id+'/record/'+getDate()+'/'+code] = data;
            firebase.database().ref().update(updates);
        });
    }
    $('.new-button').removeClass('disabled');
    $('.complete-button').addClass('disabled');
    notify('success','The record is saved successfully!');

    
}

function newRecord(){
    product = [];
    $("#producttbody").html("");
    $("#total").html("");
    $('.new-button').addClass('disabled');
    $('.complete-button').removeClass('disabled');
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
     	// This is a sample server that supports CORS.
     	var usr = document.forms["loginForm"]["username"].value;
     	var password = document.forms["loginForm"]["psw"].value;

     	var url = 'https://us-central1-my-little-shop-41012.cloudfunctions.net/checkLogin/'+usr+'/'+password ;
    	
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
        		alert('Wrong password!');
        	}
     	};

      	xhr.onerror = function() {
        	//notify('danger', 'Username not exist!');
        	alert('Username not exist!');
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

$("#add-product-button").bind("click", function(){
    import_product();
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
    }else if(currentPage == "manage-product-check"){
        $(".new-button").addClass("disabled");
        $(".complete-button").addClass("disabled");
    }
});
