var templateLaboJson = '{\n"nom" :"",\n"adresse":"",\n"referent":""\n}';
var NbByPage = 10;

$( document ).ready(function() {

  $("#menu_labo").addClass('active');

  var lastIdMod = "";

  setTemplateLaboJson();
  function setTemplateLaboJson() {

    var jsonForm = JSON.parse(templateLaboJson);
    $("#obj").text(JSON.stringify(jsonForm, null, '\t'));
  }

  refreshLabo();
  function refreshLabo() {
    getAllLabo(displayLabo, errorAjaxRequest);
    //setTimeout(refreshLabo, 5000);
  }

  function displayLabo(data) {
    data = data.reverse();

    var currentID;
    var strTab = "";

    strTab += "<thead><tr>";
      strTab += "<th>ID</th>";
      strTab += "<th>Nom</th>";
      strTab += "<th>Adresse</th>";
      strTab += "<th>Referent</th>";
      strTab += "<th></th>";
      strTab += "<th></th>";
    strTab += "</tr></thead>";

    for(var i in data) {
      strTab += '<tr>';

      currentID = data[i]._id;
      strTab += '<td>' + currentID + '</td>';
      strTab += '<td>' + data[i].nom + '</td>';
      strTab += '<td>' + data[i].adresse + '</td>';
      strTab += '<td>' + data[i].referent + '</td>';
      strTab += '<td>  <button class="modify_labo btn btn-square btn-block btn-warning" id="mod_' +currentID+ '" type="button">Modifier</button> </td>';
      strTab += '<td>  <button class="delete_labo btn btn-square btn-block btn-danger" id="' +currentID+ '" type="button">Delete</button> </td>';

      strTab += '</tr>';

    }

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable();
  }

  function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
      console.log(xhr);
  }

  $("#add_labo").submit(function( event ) {
    event.preventDefault();
    var objToAdd = JSON.parse($("#obj").val());
    console.log(objToAdd);

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/admin/laboratoires",
      'POST',
      objToAdd,
      refreshLabo,
      errorAjaxRequest
              );
  });

  $(".data_container").on( "click", ".modify_labo", function() {
    $('#myModal').modal('toggle');
    var id = $(this).attr("id").substring(4);
    lastIdMod = id;
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/laboratoires/" + id,
      'GET',
      {},
      displayJson,
      errorAjaxRequest
              );

  });

  function displayJson(data) {

    var jsonForm = JSON.parse(templateLaboJson);
    jsonForm.nom = data.nom;
    jsonForm.adresse = data.adresse;
    jsonForm.referent = data.referent;
    $("#objMod").text(JSON.stringify(jsonForm, null, '\t'));
  }


  $(".data_container").on( "click", ".delete_labo", function() {
      var id = $(this).attr("id");
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/admin/laboratoires/" + id,
        'DELETE',
        {},
        function (data) {
          console.log(data);
          refreshLabo();
        },
        errorAjaxRequest
                );
  });

  $(".modal-footer").on( "click", "#valid_modification", function() {

      var objToMod =  JSON.parse($("#objMod").val());
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/admin/laboratoires/" + lastIdMod,
        'PUT',
        objToMod,
        function (data) {
          $('#myModal').modal('toggle');
          refreshLabo();
        },
        errorAjaxRequest
                );
  });

});
