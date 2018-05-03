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

    var shop_id = document.getElementById('shopNo').value;  
    var i = 0;

    var data = {
      password: password,
      role: role,
      shop_id: shop_id
    }
     
    var updates = {};
    var databaseRef = firebase.database().ref('employee/');
    var userExist = false;
    var shopExist = true;
    databaseRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        if(username == childKey){
          userExist = true;
        }
      });

    var databaseRef1 = firebase.database().ref('shop/'+ shop_id);
    alert('dm');
    databaseRef.once('value').then(function(snapshot){
        if(snapshot.exists()){
            shopExist = false;
        }
    });

    if(userExist){
        notify("danger",'Username exist!');
    }else if (shopExist == false){
        notify("danger","ShopId not exist!");
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
// insertRecordData("record",2,64645,"Jan 11",51);

//Manager
// addShop(1);
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
    if(currentPage=="manage-product"){
        var databaseRef = firebase.database().ref('product/');
    
        databaseRef.on('value', function(snapshot) {
            $("#tbl_products_list tbody tr").remove();
            var rowIndex = 1;
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                if(role == 0){
                    insertProductRecordData(rowIndex,childKey,childData.product_price,childData.stock);
                    rowIndex = rowIndex + 1;
                } else {
                    if(childData.store_id == shop_id){
                        insertProductRecordData(rowIndex,childKey,childData.product_price,childData.stock);
                        rowIndex = rowIndex + 1;
                    }
                }
            })
        });
    }
}


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
});


// Add Product
function import_product(){
    var code= document.getElementById('pCode').value;
    var price= document.getElementById('pPrice').value;
    var stock= document.getElementById('pStock').value;

    if(role == 0){
        shop_id = 1;
    }

    var data = {
      product_price: price,
      stock: stock,
      store_id: shop_id
    }
     
    var updates = {};
    var databaseRef = firebase.database().ref('product/');
    var exist = false;

    databaseRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        if(code == childKey){
          exist = true;
        }
      });

      if(exist){
        notify("danger",'Product code exist!');
      }else{
        updates['/product/' + code] = data;
        firebase.database().ref().update(updates);
        notify('success','The product is created successfully!');
        reload_page();
      }      
    });


  }


  //Modify Product
function update_product(){
   var product_code = document.getElementById('pCode').value;
   var product_price = document.getElementById('pPrice').value;
   var stock = document.getElementById('pStock').value;

   var data = {
        product_price: product_price,
        stock: stock,
        store_id: shop_id
    }

   
    var updates = {};
    updates['/product/' + product_code] = data;
    firebase.database().ref().update(updates);
    notify('success','The product is <strong>updated</strong> successfully!');
    var databaseRef = firebase.database().ref('product/'+ oldCode);

    databaseRef.once('value').then(function(snapshot){
        var data = {
            product_price: product_price,
            stock: stock,
            store_id: shop_id
        }
        if(product_code != oldCode) {
            firebase.database().ref().child('/product/' + oldCode).remove();
        }

        var updates = {};
        updates['/product/' + product_code] = data;
        firebase.database().ref().update(updates);
           
        alert('The product is updated successfully!');
    });   
}
  
function delete_product(){
      var product_code = document.getElementById('pCode').value;
  
   firebase.database().ref().child('/product/' + product_code).remove();
   notify('success','The product is <strong>deleted</strong> successfully!')
}
//--------------------------------------------------------------------
function addShop(){
    var shopId = document.getElementById("shopId");
    var shopName = document.getElementById("shopName");

    var data = {
        name: shopName
    }
     
    var updates = {};
    var databaseRef = firebase.database().ref('shop/');
    var exist = false;

    databaseRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        if(shopId == childKey){
          exist = true;
        }
      });

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

}

function reload_page(){
    window.location.reload();
}


$(".menu-icon").bind("click", function(){
    Sidebar();
}); 

$(".logout-icon").bind("click", function(){
    signOut();
}); 