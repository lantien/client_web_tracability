var NbByPage = 10;

$( document ).ready(function() {

  var idGrp = getUrlParameter("id_groupe");

  var objToAdd;

  var strTab = "";

  getGroupeName();
  function getGroupeName() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/groupe/" + idGrp,
      'GET',
      {},
      displayGroupeName,
      errorAjaxRequest
    );
  }

  function displayGroupeName(data) {
    $("#title").text(data.nom);
  }

  getAllUsers();
  function getAllUsers() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/users",
      'GET',
      {},
      displayAllUsers,
      errorAjaxRequest
              );
  }

  function displayAllUsers(data) {
    var strOpt = '<option></option>';

    for(var i in data) {
      strOpt += '<option value="'+ data[i]._id +'">'+ data[i].nom+ " "+ data[i].prenom +'</option>';
    }
    $("#user_list").html(strOpt);
    $("#user_list").chosen({width: "100%"});

  }

  getGroupe();
  function getGroupe() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/groupe/" + idGrp,
      'GET',
      {},
      displayGrp,
      errorAjaxRequest
              );
  }

  function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
      console.log("grp request error");
  }

  function displayGrp(data) {
    data = data.groupeList;

    // nbLigne = 0;
    // nbPage = 1;
    //
    // strTab = pageStarter();

      strTab = "<thead><tr>";
        strTab += "<th>ID</th>";
        strTab += "<th>Nom</th>";
        strTab += "<th></th>";
      strTab += "</tr></thead>";

    //$("#tableau_groupe").html(strTab);
      if(data.length == 0) {
        $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

        $(".dataTables_wrapper").html(strTab);
        $('.dataTables_wrapper').DataTable();
      }
      for(var i in data) {
        makeRequest(
          {'x-access-token':localStorage.getItem("token"),},
          webserver_url + "/api/users/" + data[i],
          'GET',
          {},
          displayUserGrp,
          errorAjaxRequest
                  );
      }

  }

  function displayUserGrp(data) {

    strTab += "<tr>";
      strTab += "<td>"+ data._id  +"</td>";
      strTab += "<td>"+ data.nom + " " + data.prenom +"</td>";
      strTab += "<td><button class='kick_groupe btn btn-square btn-block btn-danger' type='button' id='"+ data._id +"'>Exclure</button></td>";
    strTab += "</tr>";

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable();

  }

  $(".data_container").on( "click", ".kick_groupe", function() {
      var id = $(this).attr("id");

      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/groupe/remove",
        'POST',
        {
          groupeId: idGrp,
          userId: id
        },
        getGroupe,
        errorAjaxRequest
                );
  });

  $('#user_list').on('change', function(e) {
      console.log($("#user_list").val());

      makeRequest(
            {'x-access-token':localStorage.getItem("token"),},
            webserver_url + "/api/groupe/add",
            'POST',
            {
              groupeId: idGrp,
              userId: $("#user_list").val()
            },
            getGroupe,
            errorAjaxRequest
                    );
  });



});
