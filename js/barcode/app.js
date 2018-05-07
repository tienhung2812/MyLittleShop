
var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: []
  },
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
    self.scanner.addListener('scan', function (content, image) {
      self.scans.unshift({ date: +(Date.now()), content: content});
      notify("info","Scanning product");
      if(currentPage == 'manage-product-check'){

      var url = 'https://us-central1-'+project_code+'.cloudfunctions.net/checkProduct/'+content+'/'+shop_id;
      
      var xhr = createCORSRequest('GET', url);


      if (!xhr) {
        alert('CORS not supported');
          return;
      }

      // Response handlers.
      xhr.onload = function() {
        var data = JSON.parse(xhr.responseText);
        if(data.result){
          var price = data.price;
          insertResultData(content,price);
          notify("success","Product found");
        } else {
          notify("danger","Product not found");
        }
        
      };

      xhr.onerror = function() {
        //notify('danger', 'Username not exist!');
        notify('danger','Something went wrong!');
      };

      xhr.send();
    }else {
      document.getElementById("result").innerHTML = content;
    }
    });


    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    }
  }
});

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