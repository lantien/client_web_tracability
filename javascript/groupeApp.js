var NbByPage = 10;

$( document ).ready(function() {

  var id = getUrlParameter("id_groupe");

  console.log(id);

  getGroupeName();
  function getGroupeName() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/groupe/" + id,
      'GET',
      {},
      displayGroupeName,
      errorAjaxRequest
    );
  }

  function displayGroupeName(data) {
    $("#title").text(data.nom);
  }

  getAppareils();
  function getAppareils() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/appareilsByGrp/" + id,
      'GET',
      {},
      displayAllApp,
      errorAjaxRequest
    );
  }

  function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
      console.log("grpApp request error");
      console.log(xhr);
  }

  function displayAllApp(data) {
    data = data.reverse();

    var currentID;
    var strTab = "";

    strTab += "<thead><tr>";
      strTab += "<th>ID</th>";
      strTab += "<th>Nom</th>";
      strTab += "<th></th>";
      strTab += "<th></th>";
    strTab += "</tr></thead>";

    for(var i in data) {
      strTab += '<tr>';
          strTab += '<td>' + data[i]._id + '</td>';
          strTab += '<td>' + data[i].nom + '</td>';
      strTab += '<td>  <button class="suivie_app btn btn-square btn-block btn-success" id="app_' +data[i]._id+ '" type="button">Voir suivi</button> </td>';
      strTab += '<td>  <button class="exclure_app btn btn-square btn-block btn-danger" id="' +data[i]._id+ '" type="button">Exclure</button> </td>';

      strTab += '</tr>';

    }

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable();
  }

  $(".data_container").on( "click", ".suivie_app", function() {
    var idApp = $(this).attr('id').substring(4);
    redirectTo("./get_track.html?id=" + idApp);
  });

  $(".data_container").on( "click", ".exclure_app", function() {
    var idApp = $(this).attr('id');
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),}
      ,webserver_url + "/api/appareils/remove",
      'POST',
      {
        appId: idApp,
        groupeId: id
      },
      getAppareils,
      errorAjaxRequest
              );
  });

  $('#appareil_list').on('change', function(e) {
      console.log($("#appareil_list").val());

      makeRequest(
        {'x-access-token':localStorage.getItem("token"),}
        ,webserver_url + "/api/appareils/add",
        'POST',
        {
          appId: $("#appareil_list").val(),
          groupeId: id
        },
        getAppareils,
        errorAjaxRequest
                );
  });


  getAllAppareil();
  function getAllAppareil() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/appareils",
      'GET',
      {},
      displayListApp,
      errorAjaxRequest
    );
  }

  function displayListApp(data) {
    console.log(data);

    var strOpt = '<option></option>';

    for(var i in data) {
      strOpt += '<option value="'+ data[i]._id +'">'+ data[i].nom +'</option>';
    }
    $("#appareil_list").html(strOpt);
    $("#appareil_list").chosen({width : 100});
  }

});
