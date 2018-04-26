function leftSidebar(role,currentPage){
    //Add left-sidebar category
    $.get('content/sidebar/left-sidebar.html', function(data) {
        $(".left-sidebar").append(data);
    }, 'text');

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
    $.get('content/page-wrapper/index.html', function(data) {
        $(".page-wrapper").append(data);
    }, 'text');

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
        $.getScript('content/page-wrapper/user-add.js',function(){
            $("#content").append(userAdd);
            function presleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            async function sleep(ms) {
                await presleep(ms);
            }
            sleep(10);

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
                    $("#content").append('<div class="col-lg-6" id="shopManagerDiv"></div><div class="col-lg-6" id="employeeDiv"></div>');
                    $("#shopManagerDiv").append(shopManager);
                    $("#employeeDiv").append(employee);
                } else if (role==1){
                    $("#content").append('<div class="col-lg-12" id="employeeDiv"></div>');
                    $("#employeeDiv").append(employee);
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
        })
    }
};

