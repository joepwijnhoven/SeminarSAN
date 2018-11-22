<mybutton>
  <button type="button" class="btn btn-primary"><yield /></button>
  <style>
  :scope.stretch button {
    width:100%;
  }
  </style>
</mybutton>

<cancelbutton onclick={onClick}>
  <button type="button" class="btn btn-light">Cancel</button>
  <script>
    onClick() {
      window.history.back();
    }
  </script>
</cancelbutton>

<balance>
  <div class="mb-3">
    <b>Your balance:</b> <span>{balance} {currency}</span>
    <mybutton if={showAddBalance} class="ml-5" onclick={onAddBalance}>Add balance</mybutton>
  </div>

  <script>
    this.mixin("cache_mixin");
    var that = this;

    this.balance = 0;

    this.cacheOn(["balance", "currency"], function (balance, currency) {
      this.balance = balance;
      this.currency = currency;
    })

    this.cacheOn("showAddBalance", function (show) {
      this.showAddBalance = show;
    })

    onAddBalance() {
      addBalance();
    }
  </script>
</balance>

<meals_list>
  <listing_header class="d-none d-sm-block"></listing_header>
  <listing_item each={meal in opts.meals} meal={meal} onselectmeal={parent.opts.onselectmeal}></listing_item>
</meals_list>

<listing_header>
  <div class="row">
    <div class="col-sm vcenter"><b>What</b></div>
    <div class="col-sm vcenter"><b>When</b></div>
    <div class="col-sm vcenter"><b>Where</b></div>
    <div class="col-sm-2 vcenter"><b>Price</b></div>
  </div>
</listing_header>

<listing_item>
  <hr>
  <div class="row" onclick={onClick}>
    <div class="col-sm vcenter">
      <a href=""><b>{opts.meal.title}</b></a>
    </div>
    <div class="col-sm vcenter">
      {moment(opts.meal.time).format('DD/MM/YYYY HH:mm')}
    </div>
    <div class="col-sm vcenter">
      {opts.meal.place}
    </div>
    <div class="col-sm-2 vcenter">
      {web3.fromWei(opts.meal.price, 'ether')} {currency}
    </div>
  </div>

  <style>
    :scope {
      display: block;
    }
    .vcenter {
      display: flex;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .stretch {
      flex-grow: 1;
    }
  </style>

  <script>
    this.mixin("cache_mixin");

    this.cacheOn("currency", function (currency) {
      this.currency = currency;
    })

    onClick() {
      this.opts.onselectmeal(this.opts.meal.id);
    }
  </script>
</listing_item>