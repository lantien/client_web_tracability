$( document ).ready(function() {

  var isAdmin = localStorage.getItem("admin");

  var id = getUrlParameter("id");

  $("#menu_app").addClass('active');

  getDataAppareil();
  function getDataAppareil() {

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/appareils/" + id,
      'GET',
      {},
      setAppareilInfo,
      isErrorRequest
    );
  }

  function setAppareilInfo(data) {
    console.log(data);
    var str = "Nom : " + data.nom;
    $("#appareil_info").text(str);
    $("#displayQr").html("");
    setQRcode("#displayQr", {text	: data._id});

    displayGroupe(data.groupes);

  }


  function displayGroupe(data) {



    var strTab = "";

    if(data.length > 0 ) {

      strTab = '<table class="table" id="tableau_groupe" style="margin:0">';
      strTab += "<tr>";
        strTab += "<th>ID</th>";
        strTab += "<th>Nom</th>";
        strTab += "<th></th>";
        strTab += "<th></th>";
      strTab += "</tr>";

      for(var i in data) {
          strTab += "<tr>";
            strTab += "<td>"+ data[i] +"</td>";
            strTab += "<td id="+ data[i] +"></td>";
            strTab += '<td><a style="text-decoration:none;" href=./groupes.html?id_groupe=' + data[i] + ' role="button">';
            strTab += '<button class="manage_grp btn btn-square btn-block btn-primary" id="grp_' +data[i]+ '" type="button">Manage</button>';
            strTab += '</a></td>';

            strTab += '<td><button class="delete_grp btn btn-square btn-block btn-danger" id="del_' +data[i]+ '" type="button">Delete</button></td>';


          strTab += "</tr>";

          getGrp(data[i], displayGroupeName, isErrorRequest);
      }
          strTab += '</table>';

    }

    if(isAdmin == 'true') {
      strTab += '<form class="form_add_groupe">';
        strTab += '<input type="text" list="users" id="name_input">';
        strTab += '<button class="btn btn-square btn-success" type="submit">Crée groupe</button>';
      strTab += '</form>';
      strTab += ' ou groupe existant <br>';
      strTab += '<select id="groupe_existant" style="height:35px;"> </select>';
      strTab += '<button class="btn btn-square btn-success" id="join_groupe" type="submit">Join</button>';
      createList();
    }

    $("#groupe_info").html(strTab);

  }

  function createList() {
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/groupe",
      'GET',
      {},
      displayGroupeList,
      isErrorRequest
    );
  }

  function displayGroupeList(data) {
    console.log("from display groupe : ");

    var strOpt = "";

    for(var i in data) {
      strOpt += '<option value="'+ data[i]._id +'">'+ data[i].nom +'</option>';
    }

    $("#groupe_existant").html(strOpt);
    $("#groupe_existant").chosen({width: "50%"});
  }


  function displayGroupeName(data) {
    console.log(data);

    $("#"+data._id).html(data.nom);
  }

  getSuivie(id);
  function getSuivie(app_id) {

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),}
      ,webserver_url + "/api/emprunt/suivie/" + app_id,
      'GET',
      {},
      displaySuivie,
      isErrorRequest);

      //setTimeout( function() {getSuivie(id);}, 5000);
  }

  function isErrorRequest(xhr, ajaxOptions, thrownError) {
    console.log("erreur get track");
  }

  function displaySuivie(data) {
    var strTab = "";

    strTab += "<thead><tr>";
      strTab += "<th>Emprunté par</th>";
      strTab += "<th>Position</th>";
      strTab += "<th>Rendu</th>";
      strTab += "<th>Utilisé dans le cadre</th>";
      strTab += "<th>Heure emprunt</th>";
      strTab += "<th>Heure rendu</th>";
      strTab += "<th>Durée</th>";
      strTab += "<th>Incident</th>";
      strTab += "<th>Position rendu</th>";
      strTab += "<th>Rendu par</th>";
    strTab += "</tr></thead>";

    var userArray = new Array();
    var groupeArray = new Array();

    data.sort(function(a, b) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    var currentID;
    for(var i in data) {
      strTab += '<tr>';

      userArray.push(data[i].userID);
      strTab += '<td class="' + data[i].userID + '">' + data[i].userID + '</td>';

      if(data[i].longitude != 181 || data[i].latitude != 181 ) {
        strTab += '<td>(' + data[i].longitude +',' + data[i].latitude +')<br>';
        strTab += '<button type="button" onClick="displayPos('+data[i].latitude+','+ data[i].longitude+');" class="btn btn-square btn-primary glyphicon glyphicon-map-marker"></button>';
      } else {
        strTab += '<td>Pas de données<br>';
      }
      strTab += '</td>';


      strTab += '<td>' + data[i].is_rendu + '</td>';

      groupeArray.push(data[i].projetID);
      userArray.push(data[i].userID_rendu);



        strTab += '<td class="' + data[i].projetID + '">' + data[i].projetID + '</td>';
        var dateCreated = moment.utc(data[i].createdAt).local().format('YYYY-MM-DD HH:mm:ss');
        strTab += '<td>'+ dateCreated +'</td>';

      if(data[i].is_rendu) {


        var date = moment.utc(data[i].updatedAt).local().format('YYYY-MM-DD HH:mm:ss');

        var secs = new Date(data[i].updatedAt) - new Date(data[i].createdAt);

        var diff = moment.utc(secs).format('HH:mm:ss');



        strTab += '<td>'+ date +'</td>';

        strTab += '<td>'+ diff +'</td>'

        strTab += '<td>' + data[i].is_incident + '</td>';

        if(data[i].longitude_rendu != 181 || data[i].latitude_rendu != 181 ) {
          strTab += '<td>(' + data[i].longitude_rendu +',' + data[i].latitude_rendu +')<br>';
          strTab += '<button type="button" onClick="displayPos('+data[i].latitude_rendu+','+ data[i].longitude_rendu+');" class="btn btn-square btn-primary glyphicon glyphicon-map-marker"></button>';
          strTab += '</td>';
        } else {
          strTab += '<td><br>';
          strTab += 'Pas de données';
          strTab += '</td>';
        }


        strTab += '<td class="' + data[i].userID_rendu + '">' + data[i].userID_rendu + '</td>';
      } else {
        strTab += '<td></td>';
        strTab += '<td></td>';
        strTab += '<td></td>';
        strTab += '<td></td>';
        strTab += '<td></td>';
      }

      strTab += '</tr>';
    }

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable({
      "order": [[ 4, "desc" ]]
    });

    //$("#suivie_display").html(strTab);

    for(var i in userArray) {
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),}
        ,webserver_url + "/api/users/" + userArray[i],
        'GET',
        {},
        displayNom,
        isErrorRequest);
    }

    for(var i in groupeArray) {
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),}
        ,webserver_url + "/api/groupe/" + groupeArray[i],
        'GET',
        {},
        displayNom,
        isErrorRequest);
    }
  }

  function displayNom(data) {

    $("."+data._id).text(data.nom);
  }

  $("#groupe_info").on( "click", ".delete_grp", function() {
    var idToLeave = $(this).attr("id").substring(4);

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),}
      ,webserver_url + "/admin/appareils/remove",
      'POST',
      {
        appId: id,
        groupeId: idToLeave
      },
      function(data) {
        getDataAppareil();
      },
      isErrorRequest
              );
  });

  $("#groupe_info").on( "click", "#join_groupe", function() {
      var idToJoin = $("#groupe_existant").val();
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),}
        ,webserver_url + "/admin/appareils/add",
        'POST',
        {
          appId: id,
          groupeId: idToJoin
        },
        function(data) {
          getDataAppareil();
        },
        isErrorRequest
                );
  });

  $("#groupe_info").on( 'submit', ".form_add_groupe",function( event ) {
    event.preventDefault();
    console.log("create groupe");

        makeRequest(
          {'x-access-token':localStorage.getItem("token"),}
          ,webserver_url + "/api/groupe",
          'POST',
          {
            nom: $("#name_input").val()
          },
          addAppToGroupe,
          isErrorRequest
                  );
  });


  function addAppToGroupe(data) {
    console.log(data);

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),}
      ,webserver_url + "/api/appareils/add",
      'POST',
      {
        appId: id,
        groupeId: data._id
      },
      function(data) {
        getDataAppareil();
      },
      isErrorRequest
              );
  }

});

function displayPos(lon, lat) {
  console.log(lon, lat);
  document.getElementById('map').src = "https://maps.google.com/maps?q="+ lon +","+ lat +"&hl=es;z=14&amp&output=embed";
}
