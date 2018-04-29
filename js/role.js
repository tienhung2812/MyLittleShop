function leftSidebar(role,currentPage){
    //Add left-sidebar category
    $(".left-sidebar").load('content/sidebar/left-sidebar.html');

    //Add content by role
    $.getScript('content/sidebar/variable.js',function(){
        //Manager
        if(role ==0 ){
            //Dashboard
            $(dashboardManager).insertAfter("#sidebar-home");
            //User
            $(modifyUser).insertAfter("#sidebar-user");
            $(addUser).insertAfter("#sidebar-user");
            //Product
            $(checkOut).insertAfter("#sidebar-product");
            $(modifyProduct).insertAfter("#sidebar-product");
            $(addProduct).insertAfter("#sidebar-product");
        } else if (role==1){
            //Dashboard
            $(dashboard).insertAfter("#sidebar-home");
            //User
            $(modifyUser).insertAfter("#sidebar-user");
            $(addUser).insertAfter("#sidebar-user");
            //Product
            $(checkOut).insertAfter("#sidebar-product");
            $(modifyProduct).insertAfter("#sidebar-product");
            $(addProduct).insertAfter("#sidebar-product");
        } else if(role==2){
            $(checkOut).insertAfter("#sidebar-product");
            $("#sidebar-home").remove();
            $("#sidebar-user").remove();
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
    }

    //Shop manager
    else if(role==1){
        $.getScript('content/page-wrapper/dashboard-card.js',function(){
            $("#content").append(shopTotal);
            $("#content").append(shopSale);
            $("#content").append(shopStock);
            $("#content").append(shopRecord);
        })
    }
}
    //User Add
    else if(page == "user-add"){
        console.log("Loading "+page);
        $("#content").load('content/page-wrapper/user-add.html',function(){
            alert("loaded");
        });
        $.getScript('content/page-wrapper/user-add.js',function(){
            //Manager
            if(role==0){
                $("#roleSelect").append('<option>Shop Manager</option><option>Employee</option>');
            }
            // Shop Manager
            else if(role == 1){
                $("#roleSelect").append('<option>Employee</option>');
                
            }
        })
    }

    //User modify
    else if(page =="user-manage"){
        console.log("Loading "+page);
            $.getScript('content/page-wrapper/user-manage.js',function(){
                if(role == 0){
                    $("#content").html('<div class="col-lg-6" id="shopManagerDiv"></div><div class="col-lg-6" id="employeeDiv"></div>');
                    $("#shopManagerDiv").html(shopManager);
                    $("#employeeDiv").html(employee);
                } else if (role==1){
                    $("#content").html('<div class="col-lg-12" id="employeeDiv"></div>');
                    $("#employeeDiv").html(employee);
                }
            });
        
    }

    //Add product
    else if(page =="manage-product-add"){
        $.getScript('content/page-wrapper/manage-product-add.js',function(){
            $("#content").append(content);
        })
    }

    //Modify product
    else if(page == "manage-product"){
        $.getScript('content/page-wrapper/manage-product.js',function(){
            $("#content").append(content);
        //     var tblProducts = document.getElementById('tbl_products_list');
        //     var databaseRef = firebase.database().ref('product/');
        //     var rowIndex = 1;

        //     databaseRef.once('value', function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {

        //         var childKey = childSnapshot.key;
        //         var childData = childSnapshot.val();
        
        //         var row = tblProducts.insertRow(rowIndex);
        //         var cellSpace = row.insertCell(0);
        //         var cellId = row.insertCell(1);
        //         var cellCode = row.insertCell(2);
        //         var cellPrice = row.insertCell(3);
        //         var cellStock = row.insertCell(4);

        //         cellId.appendChild(document.createTextNode(rowIndex));
        //         cellCode.appendChild(document.createTextNode(childKey));
        //         cellPrice.appendChild(document.createTextNode(childData.product_price));
        //         cellStock.appendChild(document.createTextNode(childData.stock));
        //         rowIndex = rowIndex + 1;
        //     });
        // });
        })
    }
};

