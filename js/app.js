var total = "total";
var sale = "sale";
var stock = "stock";
var record = "record";

//Role: 0-Manager, 1-Shop Manager, 2-Employee
var role = 1;
var currentPage = location.pathname.split('/').slice(-1)[0].split('.').slice(0)[0];

//Add HTML
$.getScript("js/role.js",function(){
    //Add Left sidebar
    leftSidebar(role);
    //Add content by page
    pageWrapper(role,currentPage);
    
    
});
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function highlightSidebar() {
    await sleep(30);
    $('a[href="'+currentPage+'.html"]').addClass("active");
}

highlightSidebar();

//Update data function for dashboard
//Shop manager
//Card Data
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function updateDashboardData(type,value) {
    await sleep(30);
    $("#"+type+"-var").text(value);
    console.log("Updated "+type+" value");
}
//Record Data
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function insertRecordData(type,id,code,date,price){
    await sleep(30);
    
    var insert = '<tr><th scope="row">'+id+'</th><td>'+code+'</td><td>'+date+'</td><td>$'+price+'</td></tr>';
    $("#"+type+"-val").append(insert);
    console.log("Updated record value");
};
//Example For Shop Manager Dashboard
// updateDashboardData(total,3);
// updateDashboardData(sale,13);
// updateDashboardData(stock,33);
// insertRecordData("record",2,64645,"Jan 11",51);

//Manager
//Add shop
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function addShop(id) {
    await sleep(20);
    
    $.getScript('content/page-wrapper/dashboard-manager-card.js',function(){
        $("#content").append(composeShop(id));
    })
    await sleep(30);
}

//Modify card Data
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function updateDashboardData(type,value,shop) {
    await sleep(60);
    $("#"+type+"-var-"+shop).text(value);
    console.log("Updated "+type+" value at shop "+shop);
}

//insert Record Data
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function insertRecordData(id,code,date,price,shop){
    await sleep(60);
    
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function insertUserRecordData(type,id,name,shop){
    await sleep(30);

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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function insertProductRecordData(id,code,price,stock){
    await sleep(30);

    var result = '<tr><td><input type="checkbox" id="manager-1"></td><th scope="row">' 
                + id + '</th><td>' + code + '</td><td>'+price+'</td><td>'+stock+'</td></tr>';


    $("#producttbody").append(result);
};
//Example for product record
// insertProductRecordData(2,342,141,342); 