$( document ).ready(function() {

  $("#menu_app").addClass('active');

  var id = getUrlParameter("id");

  getIncident();
  function getIncident() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/incidentApp/" + id,
      'GET',
      {},
      displayIncident,
      errorAjaxRequest
    );
  }

  function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
      console.log("incident request error");
  }

  function displayIncident(data) {
    console.log(data);

    var strTab = "";

    strTab = "<thead><tr>";
      strTab += "<th>Date</th>";
      strTab += "<th>Report</th>";
      strTab += "<th>Etat</th>";
    strTab += "</tr></thead>";

    for(var i in data) {
      strTab += "<tr>";

        var date = moment.utc(data[i].createdAt).local().format('YYYY-MM-DD HH:mm:ss');

        strTab += "<td>"+ date +"</td>";

        strTab += "<td>"+ data[i].report +"</td>";
        strTab += "<td>"+ data[i].state +"</td>";

      strTab += "</tr>";
    }

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable({
      "order": [[ 0, "desc" ]]
    });
  }
});
