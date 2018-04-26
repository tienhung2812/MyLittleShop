var total="total",sale="sale",stock="stock",record="record";
var role=1;
var currentPage=location.pathname.split("/").slice(-1)[0].split(".").slice(0)[0];

function installContent(){
    $.getScript("js/role.js",function(){
            //Add Left sidebar
            leftSidebar(role,currentPage);
            //Add content by page
            pageWrapper(role,currentPage);
        
    });
}

$(document).ready ( function(){
    installContent()
 });

