<cook>
  <balance></balance>
  <div if={meals && meals.length > 0}>
    <div class="row mb-3">
      <div class="col vcenter">
        Here is a list of the meals you are currently offering. Click on a meal to edit it.
      </div>
    </div>
    <meals_list meals={meals} onselectmeal={onSelectMeal}></meals_list>
  </div>
  <div if={!meals || !meals.length}>
    <p>
      You are not offering any meals at the moment.
    </p>
  </div>
  <div class="row mt-3">
    <div class="col-sm text-center">
      <mybutton onclick={onNewMeal}>Offer a new meal</mybutton>
    </div>
  </div>

  <script>
    this.mixin("cache_mixin");
    var that = this;

    this.on("route", function () {
      getMeals();
    })

    this.cacheOn(["meals", "account"], function (meals, account) {
      meals = meals.filter(function (meal) { return meal.cook == account });

      this.meals = meals;
    })

    onSelectMeal(id) {
      route("meal/" + id + "/edit");
    }

    onNewMeal() {
      route("/meal/_/edit");
    }
  </script>

</cook>