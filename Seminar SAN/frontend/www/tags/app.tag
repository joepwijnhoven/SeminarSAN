<app>
  <nav class="navbar navbar-light bg-light">
    <div class="container">
        <div class="navbar-brand">{appName}</div>
     
        <div class="nav">
          <a class="nav-item nav-link active" href="/eat">Eat</a>
          <a class="nav-item nav-link" href="/cook">Cook</a>
        </div>
    </div>
  </div>
  </nav>
  <div class="container">
  <router>
    <route path="/"><eat></eat></route>
    <route path="/eat"><eat></eat></route>
    <route path="/cook"><cook></cook></route>
    <route path="/meal/*"><meal></meal></route>
    <route path="/meal/*/edit"><meal edit={true}></meal></route>
  </router>
  </div>

  <style>
  nav {
    margin-bottom: 20px;
  }
  </style>

  <script>
    this.mixin("cache_mixin");

    var subRoute = route.create();
    subRoute(function () {
        window.scroll(0, 0);
    });

    this.on("mount", function () {
      init();
    })

    this.cacheOn("appName", function (appName) {
      this.appName = appName;
    })

  </script>
</app>