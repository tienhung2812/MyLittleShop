//Sidebar
var dashboard = '<li><a class="has-no-arrow" href="index.html" aria-expanded="false"><i class="fa fa-tachometer"></i><span class="hide-menu">Dashboard</span></a></li>';
var dashboardManager = '<li><a class="has-no-arrow " href="index.html" aria-expanded="false"><i class="fa fa-tachometer"></i><span class="hide-menu">Dashboard Manager</span></a></li>';
var addShopSidebar = '<li><a class="has-no-arrow  " href="shop-add.html" aria-expanded="false"><i class="fa fa-plus-circle"></i><span class="hide-menu">Add shop</span></a></li>';
var addUser = '<li><a class="has-no-arrow  " href="user-add.html" aria-expanded="false"><i class="fa fa-user-plus"></i><span class="hide-menu">Add User</span></a></li>';
var modifyUser = '<li><a class="has-no-arrow  " href="user-manage.html" aria-expanded="false"><i class="fa fa-user"></i><span class="hide-menu">Modify User</span></a></li>' ;
var changeUserPassword = '<li><a class="has-no-arrow  " href="user-password.html" aria-expanded="false"><i class="fa fa-key"></i><span class="hide-menu">Change Password</span></a></li>' ;
var addProduct = '<li><a class="has-no-arrow  " href="manage-product-add.html" aria-expanded="false"><i class="fa fa-plus"></i><span class="hide-menu">Add Product</span></a></li>';
var modifyProduct = '<li><a class="has-no-arrow  " href="manage-product.html" aria-expanded="false"><i class="fa fa-houzz"></i><span class="hide-menu">Modify Product</span></a></li>';
var checkOut = '<li><a class="has-no-arrow  " href="manage-product-check.html" aria-expanded="false"><i class="fa fa-qrcode"></i><span class="hide-menu">Check Out</span></a></li>';

//For DashBoard Shop Manager
var shopTotal = '<div class="col-md-6"><div class="card p-30"><div class="media"><div class="media-left media media-middle"><span><i class="fa fa-usd f-s-40 text-success"></i></span></div><div class="media-body media-text-right" ><h2 id="total-var">0</h2><p class="m-b-0">Total Revenue</p></div></div></div></div>';
var shopSale = '<div class="col-md-6"><div class="card p-30"><div class="media"><div class="media-left media media-middle"><span><i class="fa fa-shopping-cart f-s-40 text-warning"></i></span></div><div class="media-body media-text-right"><h2 id="sale-var">0</h2><p class="m-b-0">Sale</p></div></div></div></div>';
//var shopStock = '<div class="col-md-4"><div class="card p-30"><div class="media"><div class="media-left media media-middle"><span><i class="fa fa-archive f-s-40 text-primary"></i></span></div><div class="media-body media-text-right"><h2 id="stock-var">0</h2><p class="m-b-0">Stock</p></div></div></div></div></div>';
var shopRecord = '<div class="col-md-12"><div class="card"><div class="card-table"><div class="card-title"><h4>Record</h4></div><div class="card-body"><div class="table-responsive"><table class="table"><thead><tr><th>#</th><th>Product Code</th><th>Date</th><th>Quantity</th><th>Total</th></tr></thead><tbody id="record-val"></tbody></table></div></div></div></div></div>';

//Dashboard Manager
function composeShop(id){
    var result = '<div class="col-lg-12"><div class="card"><div class="shop-record"><div class="card-title"><h4>SHOP '
                + id +'</h4></div><hr><div class="card-body"><div class="col-lg-4 card-body-section"><div class="media "><div class="media-left media media-middle"><span><i class="fa fa-usd f-s-40 text-success"></i></span></div><div class="media-body media-text-right"><h2 id="total-var-'
                + id +'">1500</h2><p class="m-b-0">Total Revenue</p></div></div><div class="media"><div class="media-left media media-middle"><span><i class="fa fa-archive f-s-40 text-warning"></i></span></div><div class="media-body media-text-right"><h2 id="sale-var-'
                + id +'">1178</h2><p class="m-b-0">Sale</p></div></div></div><div class="col-lg-8 card-body-section"><div class="card-table"><div class="card-title"><h4>Record</h4></div><div class="card-body"><div class="table-responsive"><table class="table"><thead><tr><th>#</th><th>Product Code</th><th>Date</th><th>Price</th></tr></thead><tbody id="record-val-'
                + id +'" class="table-scroll-body"></tbody></table></div></div></div></div></div></div></div></div>';
    return result;
}

//User Manage
var shopManager = '<div class="card"><div class="card-table"><div class="card-title"><h4>Shop Manager </h4></div><div class="card-body"><div class="table-responsive table-hover"><table class="table"><thead><tr><th>#</th><th>Username</th><th>Shop</th></tr></thead><tbody id="shopManagertbody"></tbody></table></div></div></div></div>';
var employee = '<div class="card"><div class="card-table"><div class="card-title"><h4>Employee </h4></div><div class="card-body"><div class="table-responsive table-hover"><table class="table"><thead><tr><th>#</th><th>Username</th><th>Shop</th></tr></thead><tbody id="employeetbody"></tbody></table></div></div></div></div>';

//Product Check
var product=[];
// user modify function
var oldCode;
