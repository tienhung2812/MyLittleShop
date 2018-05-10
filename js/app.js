var total="total",sale="sale",stock="stock",record="record";
var role=localStorage.getItem("role");
var shop_id = localStorage.getItem("shop_id");
var usr = localStorage.getItem("username");
var pass = localStorage.getItem("password");
var project_code = "my-little-shop-final";
var shopNum = localStorage.getItem("shopNum");



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


//-----------------------------INDEX-------------------------------------------------
function loadRecord(){
    var importData = [];
    var exportData = [];
    var total,i=0,j=0;
    var dateData = [];
    var dateInfo = [];
    var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/loadProduct/';

    let request = new XMLHttpRequest();
    request.open("GET",url);
    request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE && (request.status == 200 || request.status == 304)) {
            var products = JSON.parse(request.responseText);
            var databaseRef = firebase.database().ref('transaction');              
            if(role==0){
                
                
                databaseRef.on('value',function(transRef){ 
                    
                    for(i=0;i<shopByID.length;i++){
                        shopData.push({
                            products:JSON.parse(JSON.stringify(products)),
                            total :0
                        });
                        $("#record-val-"+(i+1)+" tr").remove();
                        $('input[name="daterange-'+(i+1)+'"]').daterangepicker({
                            opens: 'left'
                          }, function(start, end, label) {
                            console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                        });
                        $('#filter-'+(i+1)).on('change keyup paste', function() {
                            dateFilter($(this).val(),$(this).attr('id').substring(7,$(this).attr('id').length))
                        });
                        for(p in products){
                            $('#productfilter-'+(i+1)).append('<option>'+products[p].code+'</option>')
                        }
                        $('#productfilter-'+(i+1)).on('change keyup paste', function() {
                            productFilter($(this).val(),$(this).attr('id').substring(14,$(this).attr('id').length))
                        });

                        
                        dateInfo.push([]);
                        
                    }
                    
                    
                    //console.log(dateInfo);
                    transRef.forEach(function(trans){
                        data = trans.val();
                        var newDate = true;
                        //var dataDate = d.getDate()+'-'+Number(d.getMonth()+1)+'-'+d.getFullYear();
                        var dataDate = convertTime(data.time);
                        data.qty = Number(data.qty);
                        data.shopID = Number(data.shopID);
                        console.log(convertTime(data.time));
                        console.log(data);
                        //Find data code ID
                        var codeID;
                        for(p in products){
                            //console.log("Compare: "+products[p].code+" and "+data.code);
                            if(data.code==products[p].code){
                                codeID=p;
                                break;
                            }
                        }
                        console.log("Product: "+codeID);
                        console.log(shopData);
                        if(shopData[data.shopID-1].products[codeID].transaction.length==0){
                            shopData[data.shopID-1].products[codeID].transaction.push({
                                date: dataDate,
                                import:0,
                                export:0,
                                balance: shopData[data.shopID-1].products[codeID].balance
                            });
                            if(data.type=="import"){
                                shopData[data.shopID-1].products[codeID].transaction[0].import+=data.qty;
                                shopData[data.shopID-1].products[codeID].transaction[0].balance+=data.qty;
                                shopData[data.shopID-1].products[codeID].balance +=data.qty;
                                
                            }else{
                                shopData[data.shopID-1].products[codeID].transaction[0].export+=data.qty;
                                shopData[data.shopID-1].products[codeID].transaction[0].balance-=data.qty;
                                shopData[data.shopID-1].products[codeID].balance -=data.qty;
                                shopData[data.shopID-1].total += products[codeID].price*data.qty;
                            }
                        }else{
                            var sameDay = false;
                            for (date in shopData[data.shopID-1].products[codeID].transaction){
                                if(dataDate==shopData[data.shopID-1].products[codeID].transaction[date].date){
                                    sameDay = true;
                                    if(data.type=="import"){
                                        shopData[data.shopID-1].products[codeID].transaction[date].import+=data.qty;
                                        shopData[data.shopID-1].products[codeID].transaction[date].balance+=data.qty;
                                        shopData[data.shopID-1].products[codeID].balance +=data.qty;
                                        
                                    }else{
                                        shopData[data.shopID-1].products[codeID].transaction[date].export+=data.qty;
                                        shopData[data.shopID-1].products[codeID].transaction[date].balance-=data.qty;
                                        shopData[data.shopID-1].products[codeID].balance -=data.qty;
                                        shopData[data.shopID-1].total += products[codeID].price*data.qty;
                                    }
                                }
                            }
                            if(!sameDay){
                                shopData[data.shopID-1].products[codeID].transaction.push({
                                    date: dataDate,
                                    import:0,
                                    export:0,
                                    balance: shopData[data.shopID-1].products[codeID].balance
                                });
                                var date = shopData[data.shopID-1].products[codeID].transaction.length-1;
                                if(data.type=="import"){
                                    shopData[data.shopID-1].products[codeID].transaction[date].import+=data.qty;
                                    shopData[data.shopID-1].products[codeID].transaction[date].balance+=data.qty;
                                    shopData[data.shopID-1].products[codeID].balance +=data.qty;
                                    
                                }else{
                                    shopData[data.shopID-1].products[codeID].transaction[date].export+=data.qty;
                                    shopData[data.shopID-1].products[codeID].transaction[date].balance-=data.qty;
                                    shopData[data.shopID-1].products[codeID].balance -=data.qty;
                                    shopData[data.shopID-1].total += products[codeID].price*data.qty;
                                }
                            }
                        }                        
                    })

                    for(id in shopData){
                        //console.log(id);
                        for(var pID=0; pID < products.length;pID ++){
                            console.log(shopData[id].products[pID].transaction.length);
                            for(var date=0;date< shopData[id].products[pID].transaction.length ; date++){
                                console.log("Import: "+id+" product "+ pID +" date "+date)
                                insertRecordShopData(
                                    shopData[id].products[pID].transaction[date].date,
                                    products[pID].code,
                                    products[pID].price,
                                    shopData[id].products[pID].transaction[date].import,
                                    shopData[id].products[pID].transaction[date].export,
                                    shopData[id].products[pID].transaction[date].balance,
                                    shopData[id].products[pID].transaction[date].export*products[pID].price,
                                    Number(id)+1
                                )
                                sortByDate(Number(id)+1,0);     
                            }
                        }
                        trackingSortID(id);
                    }                    
                    console.log(dateInfo);
                    console.log(shopData);
                    // for(id in shopData){
                    //     for(p in products)
                    // }
                    
        
                });
            }else if(role == 1){
                $('input[name="daterange"]').daterangepicker({
                    opens: 'left'
                  }, function(start, end, label) {
                    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                });
                $('#filter').on('change keyup paste', function() {
                    dateFilter($(this).val(),0)
                });
                for(p in products){
                    $('#productfilter').append('<option>'+products[p].code+'</option>')
                }
                $('#productfilter').on('change keyup paste', function() {
                    productFilter($(this).val(),0)
                });
                databaseRef.on('value',function(transRef){ 
                    $('#record-val tr').remove();
                    total = 0;
                    var sale = 0;           
                    //console.log(dateInfo);
                    transRef.forEach(function(trans){
                        data = trans.val();
                        if(data.shopID==shop_id){
                            var newDate = true;
                            //var dataDate = d.getDate()+'-'+Number(d.getMonth()+1)+'-'+d.getFullYear();
                            var dataDate = convertTime(data.time);
                            data.qty = Number(data.qty);
                            var codeID;
                            
                            for(p in products){
                                //console.log("Compare: "+products[p].code+" and "+data.code);
                                if(data.code==products[p].code){
                                    codeID=p;
                                    break;
                                }
                            }

                            if(products[codeID].transaction.length==0){
                                products[codeID].transaction.push({
                                    date: dataDate,
                                    import:0,
                                    export:0,
                                    balance: 0
                                })
                                if(data.type=="import"){
                                    products[codeID].transaction[0].import+=data.qty;
                                    products[codeID].transaction[0].balance+=data.qty;
                                    products[codeID].balance +=data.qty;
                                    
                                }else{
                                    products[codeID].transaction[0].export+=data.qty;
                                    products[codeID].transaction[0].balance-=data.qty;
                                    products[codeID].balance -=data.qty;
                                    total += products[codeID].price*data.qty;
                                    
                                    sale += data.qty;
                                    
                                }

                            }else{
                                var sameDay = false;
                                for (date in products[codeID].transaction){
                                    if(dataDate==products[codeID].transaction[date].date){
                                        sameDay = true;
                                        if(data.type=="import"){
                                            products[codeID].transaction[date].import+=data.qty;
                                            products[codeID].transaction[date].balance+=data.qty;
                                            products[codeID].balance +=data.qty;
                                            
                                        }else{
                                            products[codeID].transaction[date].export+=data.qty;
                                            products[codeID].transaction[date].balance-=data.qty;
                                            products[codeID].balance -=data.qty;
                                            total += products[codeID].price*data.qty;
                                            sale += data.qty;
                                            
                                        }
                                    }
                                    
                                }
                                if(!sameDay){
                                    products[codeID].transaction.push({
                                        date: dataDate,
                                        import:0,
                                        export:0,
                                        balance: products[codeID].balance
                                    });
                                    var date = products[codeID].transaction.length-1;
                                    if(data.type=="import"){
                                        products[codeID].transaction[date].import+=data.qty;
                                        products[codeID].transaction[date].balance+=data.qty;
                                        products[codeID].balance +=data.qty;
                                        
                                    }else{
                                        products[codeID].transaction[date].export+=data.qty;
                                        products[codeID].transaction[date].balance-=data.qty;
                                        products[codeID].balance -=data.qty;
                                        total += products[codeID].price*data.qty;
                                        sale += data.qty;
                                        
                                    }
                                }
                            }
                        }
                                             
                    })
                    
                    updateDashboardData("total",total);
                    updateDashboardData("sale",sale);
                    //console.log(id);
                    for(var pID=0; pID < products.length;pID ++){
                        console.log(products[pID].transaction.length);
                        for(var date=0;date< products[pID].transaction.length ; date++){
                            //console.log("Import: "+id+" product "+ pID +" date "+date)
                            insertRecordData(
                                products[pID].transaction[date].date,
                                products[pID].code,
                                products[pID].price,
                                products[pID].transaction[date].import,
                                products[pID].transaction[date].export,
                                products[pID].transaction[date].balance,
                                products[pID].transaction[date].export*products[pID].price
                            )
                            sortByDate(0,1);  
                        }
                        
                    }
                    trackingSortID(0);
                                      
                    console.log(dateInfo);
                    console.log(shopData);
                    // for(id in shopData){
                    //     for(p in products)
                    // }
                    
        
                });
            }          
        }else if(!(request.status == 200 || request.status == 304)){
            notify('danger','Can not load product!'); 
        }
    }
    request.send();

}

function productFilter(value,shop){
    console.log(value +"-"+shop)
    if (shop==0){
        var length = $("#record-val tr").length;
    }else{
        var length = $("#record-val-"+shop+" tr").length;
    }
    
    for(var i=0;i<length; i++){
        $("#"+shop+"-"+(i+1)).css("display","");
    }
    if(value != "All"){
        for(var i=0;i<length; i++){
            if( $("#"+shop+"-"+(i+1)+" .code").html()!=value){
                console.log(value + " & "+$("#"+shop+"-"+(i+1)+" .code").html())
                $("#"+shop+"-"+(i+1)).css("display","none");
            }
                
        }
    }
    
}
function stringToDate(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}


function trackingSortID(shop){
    var i=0;
    if(shop==0){
        $("#record-val tr").find("th").each(function(){
            i++;
            $(this).html(i);
        })
    }else{
        $("#record-val-"+shop+" tr").find("th").each(function(){
            i++;
            $(this).html(i);
        })
    }
    
    
    
}

function dateFilter(data,shop){
    var start = data.substring(0,10);
    var end = data.substring(13,data.length);
    var startDate = stringToDate(start,"mm/dd/yyyy","/");
    var endDate = stringToDate(end,"mm/dd/yyyy","/");
    console.log(startDate);
    console.log(end);
    if(shop==0){
        var length = $("#record-val tr").length;
    }else{
        var length = $("#record-val-"+shop+" tr").length;
    }
    
    for(var i=0;i<length; i++){
        $("#"+shop+"-"+(i+1)).css("display","");
    }
    for(var i=0;i<length; i++){
        var date = stringToDate($("#"+shop+"-"+(i+1)+" .date").html(),"mm/dd/yyyy","/");
        if(date<startDate){
            $("#"+shop+"-"+(i+1)).css("display","none");
        }
        if(date>endDate){
            $("#"+shop+"-"+(i+1)).css("display","none");
        }
        
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
        var i = 1;
        var databaseRef = firebase.database().ref('employee/');
        databaseRef.on('value', function(snapshot) {
            for(var j = 1; j <= i; j++){
                $("#employeetbody-"+j+" tr").remove();
                $("#shopManagertbody-"+j+" tr").remove();
            }
            $("#employeetbody tr").remove();
            i = 1;
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
                    i++;
                }else{
                    if(childData.role == 2 && childData.shop_id == shop_id){
                        insertUserRecordData("employee",rowEmployee,childKey,childData.shop_id);
                        rowEmployee++;
                    }
                }
            });
        });
    }
}

//Modify user
function update_user(){
    var username = document.getElementById('username').value;
    var shop_id = document.getElementById('shop').value;
    var type = 0;
   
    if(username == oldCode && shop_id == oldShop){
        type = 1;                 // Update on current product
    } else if(username == oldCode && shop_id != oldShop){
        type = 2;                // Same product move to another Shop
    } else if(username != oldCode && shop_id == oldShop){
        type = 3;
    } else {
        type = 4;
    }


    var data = {
        username: username,
        shop_id: shop_id,
        type: type,
        oldUsername: oldCode,
        oldShopId: oldShop
    }

    var url =  'https://us-central1-'+project_code+'.cloudfunctions.net/modifyUser/'+JSON.stringify(data);

    var xhr = createCORSRequest('GET', url);
    
    if (!xhr) {
        alert('CORS not supported');
        return;
    }
            // Response handlers.
    xhr.onload = function() {
        var result = JSON.parse(xhr.responseText);
        
         if(result.userExist){
            notify('danger','Modified user exists!');
       }else if (!result.shopExist){
            notify('danger','Shop does not exist!');
       } else {
            notify('success','User is modified successfully!');
       }
    };

    xhr.onerror = function() {
            //notify('danger', 'Username not exist!');
        notify('danger','Something went wrong!');
    };

    xhr.send();
    return false;   

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

function LoadData(){
    var i =1;
    if(role == 0){
        console.log("Import data role 0")
        var databaseRef = firebase.database().ref('products');
        databaseRef.on('value', function(snapshot) {
     
            $("#producttbody tr").remove();
         	var rowIndex = 1;
       ;
          	snapshot.forEach(function(shopSnapshot){
             	console.log(shopSnapshot.key)
            insertProductRecordDataManager(shopSnapshot.key,shopSnapshot.val().price);
            i++;
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
    }else if(Number(price)<=0){
        notify("danger","Invalid price");
        return false;
    }
    else{
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
    var date = Date.now();
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
                    qty: qty
                }
            }else{
                var data = {
                    shopID:shopID,
                    time:date,
                    product_code:code,
                    qty: qty
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


	  //Modify Product
function update_product(){
	var code = document.getElementById('pCode').value;
	var price = document.getElementById('pPrice').value;

	var type = 0;

    if(isNaN(price)){
        notify("danger","Invalid price");
        return false;
    }

    if(code == oldCode){
        type = 1;                 // Update on current product
    } else if(code != oldCode ){
        type = 2;                // Same product move to another Shop
    } 

    var data = {
        code: code,
        price: price,
        type: type,
        oldCode:oldCode
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
 
	    var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/removeProduct/'+product_code;
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
        		notify('danger','Shop existed!');
        	}else{
        		notify('success','Create new shop successfully!');
        	}
        	
     	};

      	xhr.onerror = function() {
        	//notify('danger', 'Username not exist!');
        	notify('danger','Something went wrong!');
      	};

      	xhr.send();
      	return false;
	}
//--------------------------------------------------
// DONE
function saveRecord(){
    // Check out of stock for every single product
    // Concept: load all import and export
    // Then compare qty vs (import-export)
    var available = 0;
    
    var j = 0;
    for(var i = 0; i < product.length;i++){
        // oldCode = product[i][0];
        // checkOut_qty = product[i][1];
    
        firebase.database().ref('transaction').once('value',function(snapshot){
            oldCode = product[j][0];
            checkOut_qty = product[j][1];
            var export_qty = 0;
            var import_qty = 0;
            var isOutOfStock = false;
         
            snapshot.forEach(function(transactionSnapshot){
                var transaction = transactionSnapshot.val();
                if(transaction.shopID == shop_id && transaction.code == oldCode){
                    if(transaction.type=="import") {
                        import_qty += transaction.qty;
                    } else {
                        export_qty += transaction.qty;
                    }
                }
            });
            j++;
           
            if(checkOut_qty > (import_qty-export_qty)) {
                alert('Product '+oldCode+' is out of stocK! Just '+(import_qty-export_qty) +' left');
                isOutOfStock = true;
            }else{ 
                available++;
            }
      
            // All Product are available
            if(available == product.length){
                var updates = {};
                console.log("Save record");
                for(var i = 0; i < product.length;i++){

                    var code = product[i][0];
                    var qty = product[i][1];
                    var date = Date.now();

                    var data = {
                        shopID:shop_id,
                        time:date,
                        product_code:code,
                        qty: qty
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
                              notify('danger','The record is not saved successfully!');
                            }
                        }
                    }
                    request.send();
                }   
            }else if(available != product.length && isOutOfStock){
                $('.new-button').removeClass('disabled');
                $('.new-button').removeAttr('disabled');
                $('.complete-button').attr('disabled','');
                $('.complete-button').addClass('disabled');
                notify('danger','Record cannot be executed!');
            }
        });
    }  

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

function convertTime(time){
    var date = new Date(time);
    return date.toLocaleDateString();
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

function convertDate(d) {
    var p = d.split("/");
    return +(p[1]+p[2]+p[0]);
  }

function sortByDate(id,type) {
    trackingSortID(id);
    var tbody;
    if(type == 0){
        tbody = document.querySelector("#record-val-"+id);
    }else{
        tbody = document.querySelector("#record-val");
    }
   
  // get trs as array for ease of use
  var rows = [].slice.call(tbody.querySelectorAll("tr"));
  
  rows.sort(function(a,b) {
    return convertDate(a.cells[1].innerHTML) - convertDate(b.cells[1].innerHTML);
  });
  
  rows.forEach(function(v) {
    tbody.appendChild(v); // note that .appendChild() *moves* elements
  });
}
