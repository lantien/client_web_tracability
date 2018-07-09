$( document ).ready(function() {

  console.log("User JS");

  $("#menu_user").addClass('active');

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

  function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
      console.log("grp request error", xhr);
  }

  function displayAllUsers(data) {

    console.log(data);

    var strTab = "";

    strTab += "<thead><tr>";
      strTab += "<th>ID</th>";
      strTab += "<th>Login</th>";
      strTab += "<th>Nom</th>";
      strTab += "<th>Prenom</th>";
      strTab += "<th>Email</th>";
      strTab += "<th>Telephone</th>";
      strTab += "<th>Role</th>";
    strTab += "</tr></thead>";

    for(var i in data) {
      strTab += '<tr>';
        strTab += "<td>"+ data[i]._id +"</td>";
        strTab += "<td>"+ data[i].login +"</td>";
        strTab += "<td>"+ data[i].nom +"</td>";
        strTab += "<td>"+ data[i].prenom +"</td>";
        strTab += "<td>"+ data[i].mail +"</td>";
        strTab += "<td>"+ data[i].telephone +"</td>";

        strTab += "<td>";

          strTab += '<select class="admin_select" id ='+ data[i]._id +'>';
            if(data[i].admin) {
              strTab += '<option value="true" Selected>Admin</option>';
              strTab += '<option value="false">Membre</option>';
            } else {
              strTab += '<option value="true" >Admin</option>';
              strTab += '<option value="false" Selected>Membre</option>';
            }
          strTab += '</select>';

        strTab += "</td>";

      strTab += '</tr>';
    }

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable({
      "order": [[ 3, "desc" ]]
    });
  }

  $("#center_content").on('change', '.admin_select',function(e) {

    var id = $(this).attr('id');

    var boolDroit = $(this).val();

    var obj = {
      "admin": boolDroit
    };

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/admin/makeAdminUser/" + id,
      'PUT',
      obj,
      getAllUsers,
      errorAjaxRequest
    );
  });

});
