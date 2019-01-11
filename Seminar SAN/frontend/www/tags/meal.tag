<meal>
  <div if={!opts.edit}>
    <h1>{meal.title}</h1>
    <p>{meal.description}</p>
    <p><b>Time: </b>{meal.time}</p>
    <p><b>Place: </b>{meal.place}</p>
    <p><b>Number of reservations: </b>{(meal.reservations || []).length + (meal.usedSecrets || []).length} / {meal.capacity}</p>
    <p><b>Price: </b>{meal.price} {currency}</p>
    <div class="col-md-6 removepadding" if={(meal.codes || []).length > 0}><b>Reservation codes: </b>
      <ul style="list-style: none">
        <li class="col-md-12 removepadding" style="margin-bottom: 20px;" each={code in meal.codes}>
          {code.reservationcode} <button class="btn btn-primary" style="float:right;" onclick={onCancel}>Cancel reservation</button>
        </li>
      </ul>
    </div>
    <p><button class="btn btn-primary" onclick={onJoin}>{(meal.codes || []).length > 0 ? "Add reservation" : "Reserve"}</button></p>
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

    <div if={id != "_"}>
    <h1>Reservations</h1>
      <ul class="list-group">
        <li class="row">
          <div class="col-sm">Eater address</div>
          <div class="col-sm"></div>
        </li>
        <li class="form-group row" each="{eater in meal.uniqueReservations}">
          <label class="col-sm-3 col-form-label">{eater}</label>
          <div class="col-sm-3">
            <input type="text" id="{eater}" class="form-control" placeholder="Reservation Code">
          </div>
          <button class="btn btn-primary" onclick={unlockReservation}>Confirm Reservation</button>
        </li>
      </ul>
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
        meal.codes = JSON.parse(localStorage.getItem(meal.id));
        // remove codes that are already used
        meal.codes = meal.codes.filter(c => !meal.usedSecrets.includes(c.reservationcode));

        localStorage.setItem(meal.id, JSON.stringify(meal.codes));

        // remove codes that are not for this user
        meal.codes = meal.codes.filter(c => web3.eth.accounts[0] == c.user);
      } else {
        meal.codes = [];
      }
      meal.uniqueReservations = meal.reservations.filter((k,i) => meal.reservations.indexOf(k) == i);
      this.meal = meal;
      console.log(meal);
      /* not necessary; removing join button when meal reservation code is present
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
      }*/
    })

    this.cacheOn("currency", function (currency) {
      this.currency = currency;
    })

    onJoin() {
      reserve(this.id, function(e, r) {
        if (e) {
          showErrorDialog(e.message);
        } else {
          showInformationDialog("The reservation request is received succesfully! On the meal information page you can find your reservation code. Show this code to the cook to receive your meal. Without the code, you can not receive your meal, so keep it safe!");
        }
      });
    }

    onCancel(e) {
      var secret = e.item.code.reservationcode;
      cancelReservation(this.id, secret, function(e, r) {
        if (e) {
          showErrorDialog(e.message);
        } else {
          showInformationDialog("The cancellation request is received succesfully! It might take a while for your cancellation to be processed entirely");
        }
      });
    }

    /* only for QR-codes
    showCode() {
      if (!this.qrcode) {
        this.qrcode = new QRCode("qrcode");
        this.qrcode.makeCode(generateQRCodeString(this.meal.id, web3.eth.accounts[0], this.meal.code));
      }
    }
    */

    onSave() {
      var data = {};
      var values = Object.keys(this.refs).forEach(function (key) {
        data[key] = that.refs[key].value;
      });
      data.time = moment(data.time, "DD/MM/YYYY HH:mm").valueOf();
      data.price = web3.toWei(data.price, "ether");
      
      if (this.id == "_") {
        createMeal(data, function(e, r) {
          if (e) {
            showErrorDialog(e.message);
          } else {
            showInformationDialog("The meal creation request is received succesfully! It might take a while for your meal to be processed entirely");
            window.history.back();
          }
        });
      } else {
        changeMeal(this.id, data, function(e, r) {
          if (e) {
            showErrorDialog(e.message);
          } else {
            showInformationDialog("The meal change request is received succesfully! It might take a while for your changes to be processed entirely");
            window.history.back();
          }
        });
      }
    }

    unlockReservation(e) {
      var secret = $('#'+e.item.eater).val();
      confirmReservation(this.id, e.item.eater, secret, function(e, r) {
        if (e) {
          showErrorDialog(e.message);
        } else {
          showInformationDialog("The request was processed properly! It might take a while before the request is processed entirely");
        }
      });
    }
  </script>
</meal>