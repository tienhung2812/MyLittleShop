function leftSidebar(role,currentPage){
    //Add left-sidebar category
    $(".left-sidebar").load('content/sidebar/left-sidebar.html',function(){
        //Add content by role
        //Manager
        if(role ==0 ){
            //Dashboard
            $(dashboardManager).insertAfter("#sidebar-home");         
            //User
            $(changeUserPassword).insertAfter("#sidebar-user");
            $(modifyUser).insertAfter("#sidebar-user");
            $(addUser).insertAfter("#sidebar-user");
            //Product
          
            $(importProduct).insertAfter("#sidebar-product");
            $(modifyProduct).insertAfter("#sidebar-product");
            $(addProduct).insertAfter("#sidebar-product");
            //Shop
            $(addShopSidebar).insertAfter("#sidebar-shop");
        } else if (role==1){
            //Dashboard
            $(dashboard).insertAfter("#sidebar-home");
            //User
            $(changeUserPassword).insertAfter("#sidebar-user");
            $(modifyUser).insertAfter("#sidebar-user");
            $(addUser).insertAfter("#sidebar-user");
            
            //Product
            $(checkOut).insertAfter("#sidebar-product");
            $(importProduct).insertAfter("#sidebar-product");

            $("#sidebar-shop").remove();
        } else if(role==2){
            $(changeUserPassword).insertAfter("#sidebar-user");
            $(checkOut).insertAfter("#sidebar-product");
            $("#sidebar-home").remove();
            $("#sidebar-shop").remove();
            
        }

        $('a[href="'+currentPage+'.html"]').addClass("active");
    });

    
    
}
function pageWrapper(role,page){

    //Dashboard
    if(page == "index"){
    //Add content by role
        console.log("Loading "+page);
        //Manager
        if (role==0){
            loadShopDashboard();
        }

        //Shop manager
        else if(role==1){          
            $("#content").append(shopTotal);
            $("#content").append(shopSale);
            // $("#content").append(shopStock);
            $("#content").append(shopRecord);
            //$("#content").append(shopStockRecord);
        }
    }
    //User Add
    else if(page == "user-add"){
        console.log("Loading "+page);
            
        //Manager
        if(role==0){
            $("#roleSelect").append('<option>Shop Manager</option><option>Employee</option>');
        }
        // Shop Manager
        else if(role == 1){
            $("#roleSelect").append('<option>Employee</option>');
            $("#shop-no").remove();
            
        }
        
     
        
    }

    //User modify
    else if(page =="user-manage"){
        console.log("Loading "+page);
        if(role == 0){
            importShopByID();
            loadShopEmployee();
        } else if (role==1){
            $("#content").html('<div class="col-lg-12" id="employeeDiv"></div>');
            $("#employeeDiv").html(employee);
            
        }
    }

    //Add product
    else if(page=="manage-product-add"){
        console.log("Loading "+page);
        if(role==0){
            importShopByID();
        }
    }

    //Import product
    else if(page=="manage-product-import"){
        console.log("Loading "+page);
        if(role==0){
            
            $(importProductShopID).insertBefore("#add-product-button");
            loadShopImportProduct();
            
        }
    }

};

var total = "total";
var sale = "sale";
var stock = "stock";
var record = "record";



function highlightSidebar(currentPage) {
    $('a[href="'+currentPage+'.html"]').addClass("active");
}

//Update data function for dashboard
//Shop manager
//Card Data
function updateDashboardData(type,value) {
    $("#"+type+"-var").text(value);
    console.log("Updated "+type+" value: "+ value);
}

//Example For Shop Manager Dashboard
// updateDashboardData(total,3);
// updateDashboardData(sale,13);
// updateDashboardData(stock,33);
// insertRecordData("record",2,64645,"Jan 11",51);

//Manager
//Add shop
function addShopDashboard(id) {
    $("#content").append(composeShop(id));

}

//Modify card Data
function updateDashboardShopData(type,value,shop) {
    $("#"+type+"-var-"+shop).text(value);
    console.log("Updated "+type+" value at shop "+shop);
}

//insert Record Data
function insertRecordShopData(date,code,price,IN,OUT,balance,income,shop){
    var id = $('#record-val-'+shop+' tr').length+1;
    var insert = '<tr id="'+shop+'-'+id+'"><th scope="row">'+id+'</th><td class="date">'+date+'</td><td class="code">'+code+'</td><td>$ '+price+'</td><td>'+IN+'</td><td>'+OUT+'</td><td>'+balance+'</td><td>'+income+'</td></tr>';
    $("#record-val-"+shop).append(insert);
    console.log("Updated record value at shop"+shop +" date "+date+" code "+code);
};
//Example
// addShop(1);
// updateDashboardData(total,3240,1);
// insertRecordData(1,323,2323,123123,1)

//Insert result record data
function insertResultData(code,price){
    var haveProduct = false;
    var quantity;
    if (product.length>0){
        console.log("Product already ?");
        //Find have product or not
        var i;
        for(i =0;i<product.length;i++){
            if(product[i][0].toString()==code.toString()){
                console.log("Found same product");                
                quantity = product[i][1] + 1;
                product[i][1]=quantity;
                var id = i+1;
                console.log(quantity +" - "+id);
                $("#"+id+"-quantity").text(quantity);
                haveProduct=true;
                break;
            }
        }
        // If not
        if(!haveProduct){
            var id = product.length+1;
            quantity=1;
            product[product.length] = [code,quantity,price];
            var insert = '<tr><th scope="row">'+id+'</th><td>'+code+'</td><td id="'+id+'-quantity">'+quantity+'</td><td>$'+price+'</td></tr>';
            $("#producttbody").append(insert);
        }
        
    }
    else{
        //First quantity
        var id = product.length+1;
        console.log("First product");
        quantity=1;
        product[0] = [code,quantity,price];
        var insert = '<tr><th scope="row">'+id+'</th><td>'+code+'</td><td id="'+id+'-quantity">'+quantity+'</td><td>$'+price+'</td></tr>';
        $("#producttbody").append(insert);

    }
    var i;
    total = 0;
    for(i=0;i<product.length;i++){
        total += product[i][2]*product[i][1];
    }
    console.log(total);
    $(".result-total h4").html(total); 
}

//Product-----------------------------------------------
function insertProductManagerStock(code,date,qty,price,shop){
    var id = $('#stock-val-'+shop+'tr').length+1;
    var result = '<tr><th scope="row">' 
                + id + '</th><td>' + code + '</td><td>'+date+'</td><td>'+qty+'</td><td>'+price+'</td></tr>';


    $("#stock-val-"+shop).append(result);
};
//Stock-----------------------------------------------------
function insertShopStocks(code,stock,left,price,shop){
    var id = $('#stock-val-'+shop+' tr').length+1;
    // console.log(id);
    var result = '<tr><th scope="row">' 
                + id + '</th><td>' + code + '</td><td>'+stock+'</td><td>'+left+'</td><td>'+price+'</td></tr>';

    
    $("#stock-val-"+shop).append(result);
};

function insertShopStock(code,date,qty,price){
    var id = $('#stock-val tr').length+1;
    var result = '<tr><th scope="row">' 
                + id + '</th><td>' + code + '</td><td>'+date+'</td><td>'+qty+'</td><td>'+price+'</td></tr>';
    $("#stock-val").append(result);
    console.log("Update stock value" + result);
};

//insert Record Data
function insertRecordData(date,code,price,IN,OUT,balance,income){
    var id = $('#record-val tr').length+1;
    var shop = 0;
    var insert = '<tr id="'+shop+'-'+id+'"><th scope="row">'+id+'</th><td class="date">'+date+'</td><td class="code">'+code+'</td><td>$ '+price+'</td><td>'+IN+'</td><td>'+OUT+'</td><td>'+balance+'</td><td>'+income+'</td></tr>';
    $("#record-val").append(insert);
    //console.log("Updated record value at shop"+shop +" date "+date+" code "+code);
};

//-------------------------------------------------

//Example for User
//Employee Record
function insertUserRecordData(type,id,name,shop){
    var role;
    role = 2;
    var result = '<tr onclick="userModifyModal('+id+','+role+')" id="type-'+type+'-shop-'+shop+'-id-'+id+'"><th scope="row">' 
                + id + '</th><td id="user-'+id+'-'+role+'-name">' + name + '</td><td id="user-'+id+'-'+role+'-shop">'+shop+'</td></tr>';

  if (type == "employee"){
            $("#employeetbody").append(result);
            console.log("Updated employee record value");
        }else {
            console.log("Wrong type input");
        }
    
};

function insertUserRecordDataManager(type,id,name,shop){
    
    var role = type;
    if(role ==1){
        id = $("#shopManagertbody-"+shop+' tr').length +1;
    }else {
        id = $("#employeetbody-"+shop+' tr').length+1;
    }
    console.log(type+' id '+id+' name '+name + ' shop ' + shop);
    var result = '<tr onclick="userModifyModal('+id+','+role+')" id="type-'+type+'-shop-'+shop+'-id-'+id+'"><th scope="row">' 
                + id + '</th><td id="user-'+id+'-'+role+'-name">' + name + '</td><td id="user-'+id+'-'+role+'-shop">'+shop+'</td></tr>';

    if(role==1){
        $("#shopManagertbody-"+shop).append(result);
        console.log("Updated shopmanager record value in #shopManagertbody-"+shop);
    }else if (role==2){
        $("#employeetbody-"+shop).append(result);
        console.log("Updated employee record value #employeetbody-"+shop);
    }else{
        console.log("Wrong type input aa");
    }
    

};

function loadShopEmployee(){
    var shopRef = firebase.database().ref('shop');
    shopRef.on('value',function(shopID){
        shopID.forEach(function(shop){
            $("#content").append(composeUserManage(shop.key));
        })
    });
    
}

function importShopByID(){
    var shopRef = firebase.database().ref('shop');
    shopRef.on('value',function(shopID){
        shopID.forEach(function(shop){
            
            shopByID.push(shop.key);
            console.log("Have shop:"+shop.key);
            
        })
    });
}

function importShopByIDReturn(callback){
    var shopRef = firebase.database().ref('shop');
    shopRef.once('value',function(shopID){
        return shopID.numChildren();
    });
    callback();
}

function loadShopDashboard(){
    var shopRef = firebase.database().ref('shop');
    shopRef.on('value',function(shopID){
        shopID.forEach(function(shop){
            shopByID.push(shop.key);
            $("#content").append(composeShop(shop.key));
            
        })
    });
}

function loadShopImportProduct(){
    var shopRef = firebase.database().ref('shop');
    shopRef.on('value',function(shopID){
        shopID.forEach(function(shop){
            $('#pID').append('<option>'+shop.key+'</option>');
            shopByID.push(shop.key);
            
        })
    });
}

function checkHaveShopID(id){
    if(shopByID.length==0){
        importShopByID();
    }
    var i=0;
    for(i;i<shopByID.length;i++){
        if(id==shopByID[i]){
            return true;
        }
    }
    return false;
}
//Example for insert User record Data
// insertUserRecordData("employee",1,"aa",2);


//Product record 
function insertProductRecordData(id,code,price,stock){

    var result = '<tr onclick="productModifyModal('+id+')" id="product-'+id+'"><th scope="row">' 
                + id + '</th><td id="product-'+id+'-code">' + code + '</td><td id="product-'+id+'-price">'+price+'</td><td id="product-'+id+'-stock">'+stock+'</td></tr>';


    $("#producttbody").append(result);
};
function insertProductRecordDataManager(code,price){
    var id = $('#producttbody tr').length+1;
    var result = '<tr onclick="productModifyModal('+id+')" id="product-'+id+'"><th scope="row">' 
                + id + '</th><td id="product-'+id+'-code">' + code + '</td><td id="product-'+id+'-price">'+price+'</td></tr>';


    $("#producttbody").append(result);
};

//Example for product record
// insertProductRecordData(2,342,141,342); 

//Import UserModal
function userModifyModal(id,role){
    var name = $('#user-'+id+'-'+role+'-name').text();
    var shop = $('#user-'+id+'-'+role+'-shop').text();
    var html = '<div class="basic-form">'+
    '                          <form>'+
    '                            <div class="form-group col-lg-12">'+
    '                              <p class="text-muted m-b-15 f-s-12">Name</p>'+
    '                              <input type="text" class="form-control input-default" id="username" value="'+name+'">'+
    '                              </div>'+
    '                              <div class="form-group col-lg-12">'+
    '                                <p class="text-muted m-b-15 f-s-12">Shop</p>'+
    '                                <input type="text" class="form-control input-default " id="shop" value="'+shop+'">'+
    '                                </div>'+                                                             
    '                                </form>'+
    '                              </div>'+
    '                            </div>'+
    '                          </div>';
        
    $(".modal-body").html(html);
    $("#userModifyModal").modal();
    oldCode=name;
}

//Import Product Modal
function productModifyModal(id){

    var code = $("#product-"+id+"-code").text();
    var price = $("#product-"+id+"-price").text();
    var stock = $("#product-"+id+"-stock").text();
    var html = '<div class="basic-form">'+
    '                          <form>'+
    '                            <div class="form-group col-lg-12">'+
    '                              <p class="text-muted m-b-15 f-s-12">Product Code</p>'+
    '                              <input type="text" class="form-control input-default" id="pCode" value="'+code+'">'+
    '                              </div>'+
    '                              <div class="form-group col-lg-12">'+
    '                                <p class="text-muted m-b-15 f-s-12">Price</p>'+
    '                                <input type="text" class="form-control input-default " id="pPrice" value="'+price+'">'+
    '                                </div>'+
    '                                </form>'+
    '                              </div>'+
    '                            </div>'+
    '                          </div>';
    $(".modal-body").html(html);
    $("#productModifyModal").modal();
    oldCode=code;
    oldShop = shop;
}

//Sidebar function
function Sidebar(){
    if($(".left-sidebar").hasClass("close")){
        $(".left-sidebar").removeClass("close");
        if(screen.width>480){
            $(".page-wrapper").css("margin-left","240px");
        }
    }else{
        $(".left-sidebar").addClass("close");
        if(screen.width>480){
            $(".page-wrapper").css("margin-left","0");
        }
    }
}

//Notification
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



//Signout 
function signOut(){
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

