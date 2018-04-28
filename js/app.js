var total="total",sale="sale",stock="stock",record="record";
var role=1;
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
//Example For Shop Manager Dashboard
// updateDashboardData(type,value)
// updateDashboardData(total,3);
// updateDashboardData(sale,13);
// updateDashboardData(stock,33);
// insertRecordData("record",id,code,date,price);
// insertRecordData("record",2,64645,"Jan 11",51);

//Manager
// addShop(1);
// updateDashboardShopData(type,value,shop);
// insertRecordShopData(id,code,date,price,shop)

//Example for insert User record Data
// insertUserRecordData(type,id,name,shop)
// insertUserRecordData("employee",1,"aa",2);
// insertUserRecordData("shopmanager",1,"aa",2);

//Product record 
//Example for product record
// insertProductRecordData(2,342,141,342); 
function LoadData(){
    if(currentPage=="product-manage")
    var tblProducts = document.getElementById('tbl_products_list');
    var databaseRef = firebase.database().ref('product/');
    var rowIndex = 1;
    
    databaseRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
    
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        
        insertProductRecordData(rowIndex,childKey,childData.product_price,childData.stock);
        // var row = tblProducts.insertRow(rowIndex);
        // var cellSpace = row.insertCell(0);
        // var cellId = row.insertCell(1);
        // var cellCode = row.insertCell(2);
        // var cellPrice = row.insertCell(3);
        // var cellStock = row.insertCell(4);
    
        // cellId.appendChild(document.createTextNode(rowIndex));
        // cellCode.appendChild(document.createTextNode(childKey));
        // cellPrice.appendChild(document.createTextNode(childData.product_price));
        // cellStock.appendChild(document.createTextNode(childData.stock));
        rowIndex = rowIndex + 1;
    })});
}


$(document).ready ( function(){
    installContent(function(){
        console.log("Page loaded");
    });
    if(checkPageNeedLoadData){
        LoadData();
    }

    // insertUserRecordData("employee",1,"aa",2);
});

//Database 
