var templateGrpJson = '{\n"nom" :""\n}';
var templateUserJson = '{\n"nom" :"",\n"prenom" :"",\n"login" :"",\n"email" :"",\n"telephone" :""}';
var NbByPage = 10;

$( document ).ready(function() {

  $("#menu_me").addClass('active');

  var userID = localStorage.getItem("userID");

  var lastIdMod = "";

  var isSet = true;

  settemplateGrpJson();
  function settemplateGrpJson() {

    $("#obj").text(templateGrpJson);
  }

  getMe();
  function getMe() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/users/" + localStorage.getItem("userID"),
      'GET',
      {},
      displayMe,
      errorAjaxRequest
              );
  }


  function displayMe(data) {

    console.log(data);

    var strTab = "";

    //var prjIDs = new Array();

    var laboID;

      //prjIDs.push(data.projets);

      strTab += '<tr>';
        strTab += '<td>ID</td>';
        strTab += '<td>' + data._id + '</td>';
      strTab += '</tr>';

      strTab += '<tr>';
        strTab += '<td>Login</td>';
        strTab += '<td>' + data.login + '</td>';
      strTab += '</tr>';

      strTab += '<tr>';
        strTab += '<td>Nom</td>';
        strTab += '<td>' + data.nom + '</td>';
      strTab += '</tr>';

      strTab += '<tr>';
        strTab += '<td>Prenom</td>';
        strTab += '<td>' + data.prenom + '</td>';
      strTab += '</tr>';

      strTab += '<tr>';
        strTab += '<td>Adresse e-mail</td>';
        strTab += '<td>' + data.mail + '</td>';
      strTab += '</tr>';

      strTab += '<tr>';
        strTab += '<td>Telephone</td>';
        strTab += '<td>' + data.telephone + '</td>';
      strTab += '</tr>';

      laboID = data.laboratoire;
      strTab += '<tr>';
      strTab += '<td>Laboratoire</td>';
      strTab += '<td class=labo id="'+ data.laboratoire + '">' + data.laboratoire + '</td>';
      strTab += '</tr>';

      getGrp(data._id);

      if(laboID != "") {
        getLaboNom(laboID);
      }

    $("#tableau").html(strTab);
  }

  function getLaboNom(id) {

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/laboratoires/" + id,
      'GET',
      {},
      displayLabo,
      errorAjaxRequest
              );
  }

  function displayLabo(data) {
    console.log(data);

    $("#"+data._id).html(data.nom);
  }

  function getGrp(userId) {

        makeRequest(
          {'x-access-token':localStorage.getItem("token"),},
          webserver_url + "/api/groupe/get/" + userId,
          'GET',
          {},
          displayGrp,
          errorAjaxRequest
                  );

  }

  function displayGrp(data) {

    var strGrp = "<thead><tr>";
      strGrp += "<th>ID</th>";
      strGrp += "<th>Nom</th>";
      strGrp += "<th>Derniere mis à jour</th>";
      strGrp += "<th></th>";
      strGrp += "<th></th>";
      strGrp += "<th></th>";
      strGrp += "<th></th>";
    strGrp += "</tr></thead>";

    console.log("mes grp", data);

    for(var i in data) {

      strGrp += '<tr>';
          strGrp += '<td>' + data[i]._id + '</td>';
          strGrp += '<td>' + data[i].nom + '</td>';

          var date = moment.utc(data[i].updatedAt).local().format('YYYY-MM-DD HH:mm:ss');

          strGrp += '<td>' + date.toString() + '</td>';
          // strGrp += '<td>';
          // strGrp += '<select class="user_list" id="'+ data[i]._id +'"  onchange="addProjet(this.value, this.id)" data-placeholder="Select Your Options"></select>';
          // strGrp += '</td>';

          strGrp += '<td><a style="text-decoration:none;" href=./groupes.html?id_groupe=' + data[i]._id + ' role="button">';
          strGrp += '<button class="voir_prj btn btn-square btn-block btn-primary" id="dvoir_' +data[i]._id+ '" type="button">Voir les membres</button>';
          strGrp += '</a></td>';

          strGrp += '<td>';
          strGrp += '<button class="quitter_prj btn btn-square btn-block btn-danger" id="quitter_' +data[i]._id+ '" type="button">Quitter</button>';
          strGrp += '</td>';

          if(data[i][userID] == "admin" || data[i].creator == userID) {
            strGrp += '<td>';
            strGrp += '<button class="mod_prj btn btn-square btn-block btn-warning" id="mod_' +data[i]._id+ '" type="button">Modifier</button>';
            strGrp += '</td>';
          } else {
            strGrp += "<td></td>";
          }

          if(data[i][userID] == "admin" || data[i].creator == userID) {
            strGrp += '<td>';
            strGrp += '<button class="delete_prj btn btn-square btn-block btn-secondary" id="delete_' +data[i]._id+ '" type="button">Delete</button>';
            strGrp += '</td>';
          } else {
            strGrp += "<td></td>";
          }

      strGrp += '</tr>';

      //setListUser();
    }

      $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

      $(".dataTables_wrapper").html(strGrp);
      $('.dataTables_wrapper').DataTable({
        "order": [[ 2, "desc" ]]
      });
  }

  $("#add_prj").submit(function( event ) {
    event.preventDefault();
    var objToAdd = JSON.parse($("#obj").val());
    console.log(objToAdd);

    //crée le projet
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/groupe",
      'POST',
      objToAdd,
      getDataToJoin,
      errorAjaxRequest
              );
  });

  function getDataToJoin(data) {
    console.log("prj id : " + data._id + " " + localStorage.getItem("userID"));
    makeRequest(
          {'x-access-token':localStorage.getItem("token"),},
          webserver_url + "/api/groupe/add",
          'POST',
          {
            groupeId: data._id,
            userId: localStorage.getItem("userID")
          },
          getMe,
          errorAjaxRequest
                  );
  }

  function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
      console.log(xhr);
  }

  function displayOptLabo(data) {
    console.log(data);
    var strOpt = "";

    strOpt += '<option value="null"></option>';

    for(var i in data) {
      strOpt += '<option value="'+ data[i]._id +'">'+ data[i].nom +'</option>';
    }

    $("#labo-list").html(strOpt);
    $("#labo-list").chosen({width : "100%"});
  }


  $(".data_container").on('click', ".quitter_prj", function() {

      var id = $(this).attr("id").substring(8);

      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/groupe/remove",
        'POST',
        {
          groupeId: id,
          userId: localStorage.getItem("userID")
        },
        getMe,
        errorAjaxRequest
                );
  });

  $(".data_container").on('click', ".delete_prj", function() {
      var id = $(this).attr("id").substring(7);

      makeRequest(
          {'x-access-token':localStorage.getItem("token"),},
          webserver_url + "/api/groupe/" + id,
          'DELETE',
          {},
          getMe,
          errorAjaxRequest
      );
  });

  $(".data_container").on('click', ".mod_prj", function() {
      var id = $(this).attr("id").substring(4);
      lastIdMod = id;

      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/groupe/" + id,
        'GET',
        {},
        function(data) {
          var jsonGrp = JSON.parse(templateGrpJson);
          jsonGrp.nom = data.nom
          console.log(jsonGrp);
          $("#objPrjMod").val(JSON.stringify(jsonGrp, null, '\t'));
          $('#prjModal').modal('toggle');
        },
        errorAjaxRequest
                );

  });

  $(".modal-footer").on( "click", "#valid_modification_prj", function() {

    var objToMod =  JSON.parse($("#objPrjMod").val());
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/groupe/" + lastIdMod,
      'PUT',
      objToMod,
      function (data) {
        $('#prjModal').modal('toggle');
        getMe();
      },
      errorAjaxRequest
              );

  });


  $("#user").on( "click", "#modify_user", function() {
    $('#myModal').modal('toggle');
    getAllLabo(displayOptLabo, errorAjaxRequest);

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/users/" + localStorage.getItem("userID"),
      'GET',
      {},
      displayJson,
      errorAjaxRequest
              );

  });

  function displayJson(data) {

    var jsonForm = JSON.parse(templateUserJson);
    jsonForm.nom = data.nom;
    jsonForm.prenom = data.prenom;
    jsonForm.login = data.login;
    jsonForm.email = data.mail;
    jsonForm.telephone = data.telephone;
    $("#objMod").text(JSON.stringify(jsonForm, null, '\t'));
  }

  $(".modal-footer").on( "click", "#valid_modification", function() {

      var objToMod =  JSON.parse($("#objMod").val());

      if($("#labo-list").val() != 'null') {
        objToMod.laboratoire = $("#labo-list").val();
      }
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/users/" + localStorage.getItem("userID"),
        'PUT',
        objToMod,
        function (data) {
          $('#myModal').modal('toggle');
          getMe();
        },
        errorAjaxRequest
                );
  });

});
