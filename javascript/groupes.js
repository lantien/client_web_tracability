var NbByPage = 10;

$( document ).ready(function() {

  $("#menu_grp").addClass('active');

  var userID = localStorage.getItem("userID");

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
    var groupeInfo = data;
    console.log(groupeInfo[userID]);

    var myRole;

    if(isAdmin == "true") {
      myRole = "admin";
    } else {
      myRole = groupeInfo[userID];
    }

    data = data.groupeList;


      strTab = "<thead><tr>";
        strTab += "<th>ID</th>";
        strTab += "<th>Nom</th>";
        strTab += "<th>Role</th>";
        strTab += "<th></th>";
      strTab += "</tr></thead>";

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
          function (data) {

              if(groupeInfo.creator == data._id) {
                displayUserGrp(data, "creator", myRole);
              } else {
                let id = data._id;
                displayUserGrp(data, groupeInfo[id], myRole);
              }

          },
          errorAjaxRequest
                  );
      }

  }

  function displayUserGrp(data, role, myRole) {

    strTab += "<tr>";
      strTab += "<td>"+ data._id  +"</td>";
      strTab += "<td>"+ data.nom + " " + data.prenom +"</td>";

      if(role == "creator") {
        strTab += "<td>Createur</td>";
        strTab += "<td></td>";
      } else if(myRole == "membre" || myRole == undefined) {
        if(role == undefined) {
          role = "membre";
        }
        strTab += "<td>"+ role +"</td>";
        strTab += "<td></td>";
      } else if(myRole == "gestionnaire") {
        if(role == undefined) {
          role = "membre";
        }
        strTab += "<td>"+ role +"</td>";
        strTab += "<td><button class='kick_groupe btn btn-square btn-block btn-danger' type='button' id='"+ data._id +"'>Exclure</button></td>";
      } else if(myRole == "admin") {

        if(role == 'admin'){

          strTab += '<td><select class="role_select" id=role_'+ data._id +'>';
            strTab += '<option value="admin" Selected>Admin</option>';
            strTab += '<option value="gestionnaire">Gestionnaire</option>';
            strTab += '<option value="membre">Membre</option>';
          strTab += "</select></td>";

          strTab += "<td><button class='kick_groupe btn btn-square btn-block btn-danger' type='button' id='"+ data._id +"'>Exclure</button></td>";
        } else if(role == 'gestionnaire'){

          strTab += '<td><select class="role_select" id=role_'+ data._id +'>';
            strTab += '<option value="admin" >Admin</option>';
            strTab += '<option value="gestionnaire" Selected>Gestionnaire</option>';
            strTab += '<option value="membre">Membre</option>';
          strTab += "</select></td>";

          strTab += "<td><button class='kick_groupe btn btn-square btn-block btn-danger' type='button' id='"+ data._id +"'>Exclure</button></td>";
        }  else {

          strTab += '<td><select class="role_select" id=role_'+ data._id +'>';
            strTab += '<option value="admin" >Admin</option>';
            strTab += '<option value="gestionnaire" >Gestionnaire</option>';
            strTab += '<option value="membre" Selected>Membre</option>';
          strTab += "</select></td>";

          strTab += "<td><button class='kick_groupe btn btn-square btn-block btn-danger' type='button' id='"+ data._id +"'>Exclure</button></td>";
        }
      }


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

  $(".data_container").on('change', '.role_select',function(e) {
      console.log($(this).attr('id').substring(5));

      var id = $(this).attr('id').substring(5);

      var obj = {
        "groupeId": idGrp,
        "userId": id,
        "role":$("#role_" + id).val()
      };

      console.log(obj);

      makeRequest(
            {'x-access-token':localStorage.getItem("token"),},
            webserver_url + "/api/groupe/droit",
            'POST',
            obj,
            function(data) {
              console.log(data);
              getGroupe(data);
            },
            errorAjaxRequest
                    );
  });



});
