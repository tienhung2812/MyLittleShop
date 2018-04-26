var total = "total";
var sale = "sale";
var stock = "stock";
var record = "record";

//Role: 0-Manager, 1-Shop Manager, 2-Employee
var role = 1;
var currentPage = location.pathname.split('/').slice(-1)[0].split('.').slice(0)[0];

function highlightSidebar(currentPage) {
    $('a[href="'+currentPage+'.html"]').addClass("active");
}

//Update data function for dashboard
//Shop manager
//Card Data
function updateDashboardData(type,value) {
    $("#"+type+"-var").text(value);
    console.log("Updated "+type+" value");
}
//Record Data
function insertRecordData(type,id,code,date,price){
    var insert = '<tr><th scope="row">'+id+'</th><td>'+code+'</td><td>'+date+'</td><td>$'+price+'</td></tr>';
    setTimeout($("#"+type+"-val").append(insert),40)   
    console.log("Updated record value");
};
//Example For Shop Manager Dashboard
// updateDashboardData(total,3);
// updateDashboardData(sale,13);
// updateDashboardData(stock,33);
// insertRecordData("record",2,64645,"Jan 11",51);

//Manager
//Add shop
function addShop(id) {
    $.getScript('content/page-wrapper/dashboard-manager-card.js',function(){
        $("#content").append(composeShop(id));
    })
}

//Modify card Data
function updateDashboardShopData(type,value,shop) {
    $("#"+type+"-var-"+shop).text(value);
    console.log("Updated "+type+" value at shop "+shop);
}

//insert Record Data
function insertRecordShopData(id,code,date,price,shop){
    var insert = '<tr><th scope="row">'+id+'</th><td>'+code+'</td><td>'+date+'</td><td>$'+price+'</td></tr>';
    $("#record-val-"+shop).append(insert);
    console.log("Updated record value at shop"+shop);
};
//Example
// addShop(1);
// updateDashboardData(total,3240,1);
// insertRecordData(1,323,2323,123123,1)


//Example for User
//Employee Record
function insertUserRecordData(type,id,name,shop){
    var result = '<tr><td><input type="checkbox" id="manager-1"></td><th scope="row">' 
                + id + '</th><td>' + name + '</td><td>'+shop+'</td></tr>';

    if(type == "shopmanager"){
        $("#shopManagertbody").append(result);
        console.log("Updated shopmanager record value");
    }else if (type == "employee"){
        $("#employeetbody").append(result);
        console.log("Updated employee record value");
    }else {
        console.log("Wrong type input");
    }
    
};

//Example for insert User record Data
// insertUserRecordData("employee",1,"aa",2);


//Product record 
function insertProductRecordData(id,code,price,stock){

    var result = '<tr><td><input type="checkbox" id="manager-1"></td><th scope="row">' 
                + id + '</th><td>' + code + '</td><td>'+price+'</td><td>'+stock+'</td></tr>';


    $("#producttbody").append(result);
};
//Example for product record
// insertProductRecordData(2,342,141,342); 



