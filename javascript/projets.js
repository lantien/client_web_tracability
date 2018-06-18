var templatePrjJson = '{\n"nom" :""\n}';
var NbByPage = 10;

$( document ).ready(function() {

  var lastIdMod = "";

  setTemplatePrjJson();
  function setTemplatePrjJson() {

    var jsonForm = JSON.parse(templatePrjJson);
    $("#obj").text(JSON.stringify(jsonForm, null, '\t'));
  }

  refreshPrj();
  function refreshPrj() {
    getAllPrj(displayPrj, errorAjaxRequest);

  }

  function displayPrj(data) {
    data = data.reverse();

    var currentID;
    var strTab = "";

    strTab += "<thead><tr>";
      strTab += "<th>ID</th>";
      strTab += "<th>Nom</th>";
      strTab += "<th>Derniere mis à jour</th>";
      strTab += "<th></th>";
      strTab += "<th></th>";
      strTab += "<th></th>";
    strTab += "</tr></thead>";

    console.log(data);

    var nbLigne = 0;
    var nbPage = 1;

    for(var i in data) {
      strTab += '<tr>';

      currentID = data[i]._id;

      strTab += '<td>'+ currentID +'</td>';
      strTab += '<td>'+ data[i].nom +'</td>';

      var date = moment.utc(data.updatedAt).local().format('YYYY-MM-DD HH:mm:ss');
      strTab += '<td>'+ date.toString() +'</td>';


      strTab += '<td>  <button class="join_prj btn btn-square btn-block btn-success" id="join_' +currentID+ '" type="button">Join</button> </td>';
      strTab += '<td>  <button class="mod_prj btn btn-square btn-block btn-warning" id="mod_' +currentID+ '" type="button">Modifier</button> </td>';
      strTab += '<td>  <button class="delete_prj btn btn-square btn-block btn-danger" id="' +currentID+ '" type="button">Delete</button> </td>';

      strTab += '</tr>';

    }

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');
    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable({
      "order": [[ 2, "desc" ]]
    });

  }



  function getUserDataForProjetList(projID, userID, success, fail) {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/users/" + localStorage.getItem("userID"),
      'GET',
      {},
      function(data) {
        data = data.projets;
        for(var i in data) {
          if(data[i] == projID) {
            alert("Vous etes deja dans ce projet !");
            return ;
          }
        }
        joinPrj(projID, localStorage.getItem("userID"), function (data) {
          console.log(data);
        }, errorAjaxRequest);
      },
      errorAjaxRequest
              );
  }


  function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
      console.log("prj request error");
  }

  $("#add_prj").submit(function( event ) {
    event.preventDefault();
    var objToAdd = JSON.parse($("#obj").val());
    console.log(objToAdd);

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/projets",
      'POST',
      objToAdd,
      refreshPrj,
      errorAjaxRequest
              );
  });

  $(".data_container").on( "click", ".delete_prj", function() {
      var id = $(this).attr("id");
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/projets/" + id,
        'DELETE',
        {},
        refreshPrj,
        errorAjaxRequest
                );
  });



  $(".data_container").on( "click", ".join_prj", function() {
      var id = $(this).attr("id").substring(5);
      getUserDataForProjetList(id, localStorage.getItem("userID"), function (data) {
        console.log(data);
      }, errorAjaxRequest);
  });

  $(".data_container").on( "click", ".mod_prj", function() {
    $('#myModal').modal('toggle');
    var id = $(this).attr("id").substring(4);
    lastIdMod = id;
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/projets/" + id,
      'GET',
      {},
      displayJson,
      errorAjaxRequest
              );

  });

  function displayJson(data) {

    var jsonForm = JSON.parse(templatePrjJson);
    jsonForm.nom = data.nom;
    $("#objMod").text(JSON.stringify(jsonForm, null, '\t'));
  }

  $(".modal-footer").on( "click", "#valid_modification", function() {

      var objToMod =  JSON.parse($("#objMod").val());
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/projets/" + lastIdMod,
        'PUT',
        objToMod,
        function (data) {
          $('#myModal').modal('toggle');
          refreshPrj();
        },
        errorAjaxRequest
                );
  });

});
