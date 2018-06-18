var NbByPage = 10;

$( document ).ready(function() {
  var prjID = getUrlParameter("prjID");


  getProjet();
  function getProjet() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/projets/" + prjID,
      'GET',
      {},
      displayProjetName,
      errorAjaxRequest
              );
  }

  function displayProjetName(data) {
    console.log(data);
    $("#title").text(data.nom);
  }

  getMembers();
  function getMembers() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/users/projets/" + prjID,
      'GET',
      {},
      displayMembers,
      errorAjaxRequest
              );
  }

  function displayMembers(data) {

    var strTab = "";

    strTab = "<thead><tr>";
      strTab += "<th>ID</th>";
      strTab += "<th>Nom</th>";
      strTab += "<th>Prenom</th>";
      strTab += "<th></th>";
    strTab += "</tr></thead>";

    for(var i in data) {
      strTab += "<tr>";
        strTab += "<td>"+data[i]._id+"</td>";
        strTab += "<td>"+data[i].nom+"</td>";
        strTab += "<td>"+data[i].prenom+"</td>";

        strTab += '<td class="quitter_prj" id='+ data[i]._id +' >';
        strTab += '<button  type="button" class="btn btn-square btn-block btn-danger">Exclure</button>';
        strTab += '</td>';

      strTab += "</tr>";

    }

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable();
  }


  setListUser();
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
    $("#user_list").html(strOpt);
    $("#user_list").chosen({width : "100%"});
  }

  function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
      console.log("members request error : " + thrownError);
  }

  $(".data_container").on('click', ".quitter_prj", function() {

      leavePrj(prjID, $(this).attr("id"), getMembers, errorAjaxRequest);
  });

  $('#user_list').on('change', function(e) {
      console.log($("#user_list").val());

      makeRequest(
            {'x-access-token':localStorage.getItem("token"),},
            webserver_url + "/api/users/add",
            'POST',
            {
              projetId: prjID,
              userId: $("#user_list").val()
            },
            getMembers,
            errorAjaxRequest
                    );
  });

});
