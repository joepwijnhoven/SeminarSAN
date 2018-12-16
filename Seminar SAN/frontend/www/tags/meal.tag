<meal>
  <div if={!opts.edit}>
    <h1>{meal.title}</h1>
    <p>{meal.description}</p>
    <p><b>Time: </b>{meal.time}</p>
    <p><b>Place: </b>{meal.place}</p>
    <p><b>Number of reservations: </b>{(meal.reservations || []).length} / {meal.capacity}</p>
    <p><b>Price: </b>{meal.price} {currency}</p>
    <p if={meal.code}><mybutton onclick={showCode}>Show Code</mybutton><br /><div id="qrcode"></div></p>
    <p if={meal.code}><mybutton onclick={onCancel}>Leave</mybutton></p>
    <p if={!meal.code}><mybutton onclick={onJoin}>Join</mybutton></p>
  </div>
  <div if={opts.edit}>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Title</label>
      <div class="col-sm">
        <input type="text" class="form-control" ref="title" value={meal.title}>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Description</label>
      <div class="col-sm">
        <textarea class="form-control" ref="description" value={meal.description} rows="3"></textarea>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-2 col-form-label">When</label>
      <div class="col-sm">
        <input type="text" class="form-control" ref="time" id="time" value={meal.time} disabled={id != "_"}>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-2 col-form-label" >Where</label>
      <div class="col-sm">
        <input type="text" class="form-control" ref="place" value={meal.place}>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Capacity</label>
      <div class="col-sm">
        <input type="text" class="form-control" ref="capacity" value={meal.capacity}>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Price per person ({currency})</label>
      <div class="col-sm">
        <input type="text" class="form-control" ref="price" value={meal.price} disabled={id != "_"}>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm text-right">
        <cancelbutton></cancelbutton>       
        <mybutton onclick={onSave}>Save</mybutton>
      </div>
    </div>
  </div>

  <style>
  mybutton button {
    width: 100px;
  }
  </style>

  <script>
    this.mixin("cache_mixin");
    var that = this;
    this.meal = {};

    this.on("route", async function (id) {
      this.id = id;

      if (id == "_") {
        cache.clear("meal");
      } else {
        getMeal(id);
      }
    })

    this.on("mount", function () {
      $('#time').datetimepicker({
        format: "dd/mm/yyyy hh:ii",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        startDate: new Date()
      });
    })

    this.cacheOn(["meal"], function (meal) {
      meal.time = moment(meal.time).format("DD/MM/YYYY HH:mm");
      meal.price = web3.fromWei(meal.price, "ether");
      if (localStorage.getItem(meal.id)) {
        meal.code = localStorage.getItem(meal.id);
      }
      this.meal = meal;
      console.log(meal)
      if(meal.cook == web3.eth.accounts[0]) {
          var buttons = document.getElementsByTagName("Button");
          for(var i = 0; i < buttons.length; i++) {
            if(buttons[i].textContent == "Join") {
              buttons[i].disabled = true;
            }
          }
      }

      for(var i = 0; i < meal.reservations.length; i++) {
        if(meal.reservations[i] == web3.eth.accounts[0]) {
          var buttons = document.getElementsByTagName("Button");
          for(var i = 0; i < buttons.length; i++) {
            if(buttons[i].textContent == "Join") {
              buttons[i].disabled = true;
            }
          }
        }
      }
    })

    this.cacheOn("currency", function (currency) {
      this.currency = currency;
    })

    onJoin() {
      reserve(this.id);
      window.history.back();
    }

    onCancel() {
      cancelReservation(this.id);
      window.history.back();
    }

    showCode() {
      if (!this.qrcode) {
        this.qrcode = new QRCode("qrcode");
        this.qrcode.makeCode(generateQRCodeString(this.meal.id, web3.eth.accounts[0], this.meal.code));
      }
    }

    onSave() {
      var data = {};
      var values = Object.keys(this.refs).forEach(function (key) {
        data[key] = that.refs[key].value;
      });
      data.time = moment(data.time, "DD/MM/YYYY HH:mm").valueOf();
      data.price = web3.toWei(data.price, "ether");
      
      if (this.id == "_") {
        createMeal(data);
      } else {
        changeMeal(this.id, data);
      }
      
      window.history.back();
    }
  </script>
</meal>