
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
      self.scans.unshift({ date: +(Date.now()), content: content });
      var databaseRef = firebase.database().ref('product/'+ content);

      databaseRef.once('value').then(function(snapshot){
          if(snapshot.exists()){
            document.getElementById("result").innerHTML = content;
            document.getElementById("result_price").innerHTML = snapshot.val().product_price;
            document.getElementById("result_stock").innerHTML = snapshot.val().stock;
          }else{
            document.getElementById("result").innerHTML = "Product Not Found!";
            document.getElementById("result_price").innerHTML = "";
            document.getElementById("result_stock").innerHTML = "";
          }
      });
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
