var templatePrjJson = '{\n"nom" :""\n}';
var templateUserJson = '{\n"nom" :"",\n"prenom" :"",\n"login" :"",\n"email" :"",\n"telephone" :""}';
var NbByPage = 10;

$( document ).ready(function() {

  var lastIdMod = "";

  var strPrj = "";
  var isSet = true;

  setTemplatePrjJson();
  function setTemplatePrjJson() {

    $("#obj").text(templatePrjJson);
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

    var prjIDs = new Array();

    var laboID;

      prjIDs.push(data.projets);

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

      getPrj(prjIDs);
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

  function getPrj(arrayIds) {
    arrayIds = arrayIds[0];

      strPrj = "<thead><tr>";
        strPrj += "<th>ID</th>";
        strPrj += "<th>Nom</th>";
        strPrj += "<th>Derniere mis à jour</th>";
        strPrj += "<th></th>";
        strPrj += "<th></th>";
        strPrj += "<th></th>";
        strPrj += "<th></th>";
      strPrj += "</tr></thead>";

      var max = arrayIds.length;

      if(max == 0) {
        $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

        $(".dataTables_wrapper").html(strPrj);
        $('.dataTables_wrapper').DataTable();
      }
      for(var i in arrayIds) {

        makeRequest(
          {'x-access-token':localStorage.getItem("token"),},
          webserver_url + "/api/projets/" + arrayIds[i],
          'GET',
          {},
          displayPrj,
          errorAjaxRequest
                  );

      }
  }

  function displayPrj(data) {

      strPrj += '<tr>';
          strPrj += '<td>' + data._id + '</td>';
          strPrj += '<td>' + data.nom + '</td>';

          var date = moment.utc(data.updatedAt).local().format('YYYY-MM-DD HH:mm:ss');

          strPrj += '<td>' + date.toString() + '</td>';
          strPrj += '<td>';
          strPrj += '<select class="user_list" id="'+ data._id +'"  onchange="addProjet(this.value, this.id)" data-placeholder="Select Your Options"></select>';
          strPrj += '</td>';

          strPrj += '<td><a style="text-decoration:none;" href=./projet_member.html?prjID=' + data._id + ' role="button">';
          strPrj += '<button class="voir_prj btn btn-square btn-block btn-primary" id="dvoir_' +data._id+ '" type="button">Voir les membres</button>';
          strPrj += '</a></td>';

          strPrj += '<td>';
          strPrj += '<button class="quitter_prj btn btn-square btn-block btn-warning" id="quitter_' +data._id+ '" type="button">Quitter</button>';
          strPrj += '</td>';

          strPrj += '<td>';
          strPrj += '<button class="delete_prj btn btn-square btn-block btn-danger" id="delete_' +data._id+ '" type="button">Delete</button>';
          strPrj += '</td>';

      strPrj += '</tr>';

      setListUser();

      $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

      $(".dataTables_wrapper").html(strPrj);
      $('.dataTables_wrapper').DataTable({
        "order": [[ 2, "desc" ]]
      });
  }

  function setListUser() {
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
    $(".user_list").html(strOpt);
    $(".user_list").chosen({width : "100%"});
  }

  $("#add_prj").submit(function( event ) {
    event.preventDefault();
    var objToAdd = JSON.parse($("#obj").val());
    console.log(objToAdd);

    //crée le projet
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/projets",
      'POST',
      objToAdd,
      getDataToJoin,
      errorAjaxRequest
              );
  });

  function getDataToJoin(data) {
    console.log("prj id : " + data._id + " " + localStorage.getItem("userID"));
    joinPrj(data._id, localStorage.getItem("userID"), getMe, errorAjaxRequest);
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
      console.log(id);
      leavePrj(id, localStorage.getItem("userID"), getMe, errorAjaxRequest);
  });

  $(".data_container").on('click', ".delete_prj", function() {
      var id = $(this).attr("id").substring(7);
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/projets/" + id,
        'DELETE',
        {},
        function(data) {
          console.log("prj delete resp : " + data);
          getMe(data);
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

function addProjet(userID, grpID) {

  makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/users/add",
        'POST',
        {
          projetId: grpID,
          userId: userID
        },
        function(data) {alert("Ajouter avec success");},
        function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
            console.log(xhr);
        }
                );
}
