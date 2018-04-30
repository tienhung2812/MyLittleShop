var total="total",sale="sale",stock="stock",record="record";
var role=localStorage.getItem("role");
var shop_id = localStorage.getItem("shop_id");
var currentPage=location.pathname.split("/").slice(-1)[0].split(".").slice(0)[0];

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
    var exist = false;

    databaseRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        if(username == childKey){
          exist = true;
        }
      });

      if(exist){
        alert('Username exist!');
      }else{
        updates['/employee/' + username] = data;
        firebase.database().ref().update(updates);
        alert('The user is created successfully!');
        reload_page();
      }      
    });
  }

  //Modify Employee

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
        var Table = document.getElementById("tbl_employees_list");
        alert(Table);

        var databaseRef = firebase.database().ref('employee/');
        databaseRef.on('value', function(snapshot) {
            $("#tbl_employees_list tbody tr").remove();
            
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



//Product record 
//Example for product record
// insertProductRecordData(2,342,141,342); 
function LoadData(){
    var Table = document.getElementById("tbl_products_list");
    alert(Table);
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
        LoadData();
        loadEmployee();
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
        alert('Product code exist!');
      }else{
        updates['/product/' + code] = data;
        firebase.database().ref().update(updates);
        alert('The product is created successfully!');
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
   
    alert('The product is updated successfully!');
}
  
function delete_product(){
      var product_code = document.getElementById('pCode').value;
  
   firebase.database().ref().child('/product/' + product_code).remove();
   alert('The product is deleted successfully!');
}

function reload_page(){
    window.location.reload();
}

//Database 
