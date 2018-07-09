var isAdmin = localStorage.getItem("admin");
console.log(isAdmin);
  if(isAdmin == 'true') {

    document.write(
    "<nav class='navbar navbar-default sidebar' role='navigation'><div class='container-fluid'>" +
    "<div class='navbar-header'>" +
    "<button type='button' class='navbar-toggle' data-toggle='collapse' data-target='#bs-sidebar-navbar-collapse-1'>"+
              "<span class='sr-only'>Toggle navigation</span>"+
              "<span class='icon-bar'></span>"+
              "<span class='icon-bar'></span>"+
              "<span class='icon-bar'></span>"+
            "</button>"+
          "</div>"+
          "<div class='collapse navbar-collapse' id='bs-sidebar-navbar-collapse-1'>"+
            "<ul class='nav navbar-nav'>"+
              "<li id='menu_me'><a href='./me.html'>Home<span style='font-size:16px;' class='pull-right hidden-xs showopacity glyphicon glyphicon-home'></span></a></li>"+
              "<li id='menu_app'><a href='./get_all_appareils.html'>Appareils<span style='font-size:16px;' class='pull-right hidden-xs showopacity glyphicon glyphicon-qrcode'></span></a></li>"+
              "<li id='menu_grp'><a href='./groupe_list.html'>Projets<span style='font-size:16px;' class='pull-right hidden-xs showopacity glyphicon glyphicon-list'></span></a></li>"+
              "<li id='menu_user'><a href='./users.html'>Utilisateurs<span style='font-size:16px;' class='pull-right hidden-xs showopacity glyphicon glyphicon-user'></span></a></li>"+
              "<li id='menu_labo'><a href='./labo.html'>Laboratoires<span style='font-size:16px;' class='pull-right hidden-xs showopacity glyphicon glyphicon-briefcase'></span></a></li>"+
              "<li id='menu_dl'><a href='./downloads.html'>Application<span style='font-size:16px;' class='pull-right hidden-xs showopacity  glyphicon glyphicon-download-alt'></span></a></li>"+
              "<li ><a href='#' onClick='logout();'>Se deconnecter<span style='font-size:16px;' class='pull-right hidden-xs showopacity glyphicon glyphicon-remove'></span></a></li>"+
            "</ul>"+
          "</div>"+
        "</div>"+
      "</nav>"
    );
  } else {
    document.write(
    "<nav class='navbar navbar-default sidebar' role='navigation'><div class='container-fluid'>" +
    "<div class='navbar-header'>" +
    "<button type='button' class='navbar-toggle' data-toggle='collapse' data-target='#bs-sidebar-navbar-collapse-1'>"+
              "<span class='sr-only'>Toggle navigation</span>"+
              "<span class='icon-bar'></span>"+
              "<span class='icon-bar'></span>"+
              "<span class='icon-bar'></span>"+
            "</button>"+
          "</div>"+
          "<div class='collapse navbar-collapse' id='bs-sidebar-navbar-collapse-1'>"+
            "<ul class='nav navbar-nav'>"+
              "<li id='menu_me'><a href='./me.html'>Home<span style='font-size:16px;' class='pull-right hidden-xs showopacity glyphicon glyphicon-home'></span></a></li>"+
              "<li id='menu_app'><a href='./get_all_appareils.html'>Appareils<span style='font-size:16px;' class='pull-right hidden-xs showopacity glyphicon glyphicon-qrcode'></span></a></li>"+
              "<li id='menu_dl'><a href='./downloads.html'>Application<span style='font-size:16px;' class='pull-right hidden-xs showopacity  glyphicon glyphicon-download-alt'></span></a></li>"+
              "<li ><a href='#' onClick='logout();'>Se deconnecter<span style='font-size:16px;' class='pull-right hidden-xs showopacity glyphicon glyphicon-remove'></span></a></li>"+
            "</ul>"+
          "</div>"+
        "</div>"+
      "</nav>"
    );
  }
