function composeShop(id){
    var result = '<div class="col-lg-12"><div class="card"><div class="shop-record"><div class="card-title"><h4>SHOP '
                + id +'</h4></div><hr><div class="card-body"><div class="col-lg-4 card-body-section"><div class="media "><div class="media-left media media-middle"><span><i class="fa fa-usd f-s-40 text-success"></i></span></div><div class="media-body media-text-right"><h2 id="total-var-'
                + id +'">1500</h2><p class="m-b-0">Total Revenue</p></div></div><div class="media"><div class="media-left media media-middle"><span><i class="fa fa-archive f-s-40 text-warning"></i></span></div><div class="media-body media-text-right"><h2 id="sale-var-'
                + id +'">1178</h2><p class="m-b-0">Sale</p></div></div><div class="media "><div class="media-left media media-middle"><span><i class="fa fa-archive f-s-40 text-primary"></i></span></div><div class="media-body media-text-right"><h2 id="stock-var-'
                + id +'">0</h2><p class="m-b-0">Stock</p></div></div></div><div class="col-lg-8 card-body-section"><div class="card-table"><div class="card-title"><h4>Record</h4></div><div class="card-body"><div class="table-responsive"><table class="table"><thead><tr><th>#</th><th>Product Code</th><th>Date</th><th>Price</th></tr></thead><tbody id="record-val-'
                + id +'" class="table-scroll-body"></tbody></table></div></div></div></div></div></div></div></div>';
    return result;
}