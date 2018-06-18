var NbByPage = 10;

$( document ).ready(function() {

  var lastIdMod = "";

  getAllGroupe();
  function getAllGroupe() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/groupe",
      'GET',
      {},
      displayGrp,
      errorAjaxRequest
              );
  }

  function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
      console.log("grpList request error");
  }

  function displayGrp(data) {
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
      strTab += "<th></th>";
    strTab += "</tr></thead>";

    console.log(data);

    for(var i in data) {
      strTab += '<tr>';
          strTab += '<td>' + data[i]._id + '</td>';
          strTab += '<td>' + data[i].nom + '</td>';

          var date = moment.utc(data[i].updatedAt).local().format('YYYY-MM-DD HH:mm:ss');
          strTab += '<td>'+ date.toString() +'</td>';

      strTab += '<td><a style="text-decoration:none;" href=./groupe_appareil.html?id_groupe=' + data[i]._id + ' role="button">';
        strTab += '<button class="appareil_prj btn btn-square btn-block btn-success" id="app_' +data[i]._id+ '" type="button">Voir appareils</button>';
      strTab += '</a></td>';

      strTab += '<td><a style="text-decoration:none;" href=./groupes.html?id_groupe=' + data[i]._id + ' role="button">';
      strTab += '<button class="user_prj btn btn-square btn-block btn-primary" id="user_' +data[i]._id+ '" type="button">Voir membre</button>';
      strTab += '</a></td>';

      strTab += '<td>  <button class="mod_grp btn btn-square btn-block btn-warning" id="mod_' +data[i]._id+ '" type="button">Modifier</button> </td>';
      strTab += '<td>  <button class="delete_prj btn btn-square btn-block btn-danger" id="' +data[i]._id+ '" type="button">Delete</button> </td>';

      strTab += '</tr>';

    }

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable({
      "order": [[ 2, "desc" ]],
      "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
        }
    });
  }

  $(".data_container").on( "click", ".delete_prj", function() {
      var id = $(this).attr("id");
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/groupe/" + id,
        'DELETE',
        {},
        getAllGroupe,
        errorAjaxRequest
                );
  });

  $("#center_content").on( 'submit', "#add_grp",function( event ) {
    event.preventDefault();
    console.log("create groupe");

        makeRequest(
          {'x-access-token':localStorage.getItem("token"),}
          ,webserver_url + "/api/groupe",
          'POST',
          {
            nom: $("#name_input").val()
          },
          getAllGroupe,
          errorAjaxRequest
                  );
  });


  $(".data_container").on( "click", ".mod_grp", function() {
    $('#myModal').modal('toggle');
    var id = $(this).attr("id").substring(4);
    lastIdMod = id;
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/groupe/" + id,
      'GET',
      {},
      displayJson,
      errorAjaxRequest
              );

  });

  function displayJson(data) {

    var jsonForm = JSON.parse('{"nom": ""}');
    jsonForm.nom = data.nom;
    $("#objMod").text(JSON.stringify(jsonForm, null, '\t'));
  }

  $(".modal-footer").on( "click", "#valid_modification", function() {

      var objToMod =  JSON.parse($("#objMod").val());
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/groupe/" + lastIdMod,
        'PUT',
        objToMod,
        function (data) {
          $('#myModal').modal('toggle');
          getAllGroupe();
        },
        errorAjaxRequest
                );
  });

});
