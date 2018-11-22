<eat>
  <balance></balance>
  <div if={meals.length > 0}>
    <p>
      List of upcoming meals. Click on a meal to make a reservation.
    </p>
    <meals_list meals={meals} onselectmeal={onSelectMeal}></meals_list>
  </div>
  <div if={!meals.length}>
    <p>
      There are no upcoming meals.
    </p>
  </div>

  <script>
    this.mixin("cache_mixin");
    var that = this;

    this.meals = [];

    this.on("route", function () {
      getMeals();
    })

    this.cacheOn("meals", function (meals) {
      this.meals = meals;
    })

    this.cacheOn("currency", function (currency) {
      this.currency = currency;
    })

    onSelectMeal(id) {
      route('meal/' + id);
    }
  </script>
</eat>