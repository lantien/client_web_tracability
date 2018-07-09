var templateJson = '{\n"nom" :""\n}';
var NbByPage = 10;

$( document ).ready(function() {
  var isAdmin = localStorage.getItem("admin");
  var lastIdMod = "";
  var lastIdRep = "";
  var table;

  $("#menu_app").addClass('active');

  setJsonTemplate();
  function setJsonTemplate() {
    var jsonForm = JSON.parse(templateJson);
    $("#obj").text(JSON.stringify(jsonForm, null, '\t'));
  }

  getAllappareils();
	function getAllappareils() {
    console.log("refresh appareils...");

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/appareils",
      'GET',
      {},
      displayappareils,
      isErrorRequest
    );

    //setTimeout(getAllappareils, 5000);
	}

  function isErrorRequest(xhr, ajaxOptions, thrownError) {
    console.log(xhr);
  }

  function displayappareils(data) {
    var strTab = "";

    var idArray = new Array();
    data = data.reverse();

    var currentID;

    strTab += "<thead><tr>";
      strTab += "<th>QR code</th>";
      strTab += "<th>Nom</th>";
      strTab += "<th>Etat de marche</th>";
      strTab += "<th>Derniere mis à jour</th>";
      strTab += "<th></th>";
      strTab += "<th></th>";
      strTab += "<th></th>";
      if(isAdmin == 'true') {
        strTab += "<th></th>";
        strTab += "<th></th>";
      }
    strTab += "</tr></thead>";

    for(var i in data) {
      strTab += '<tr>';

      currentID = data[i]._id;
      idArray.push(currentID);
      strTab += '<td id=qr_'+ currentID +'></td>';
      strTab += '<td>'+ data[i].nom +'</td>';

      if(data[i].is_hs) {
        strTab += '<td>';
        strTab += ' HS ';
        strTab += '<button class="state_button btn btn-square btn-block btn-warning" id="state_' +currentID+ '" type="button">Voir etat</button>';
        strTab += '</td>';
      } else if (data[i].is_part_hs) {
        strTab += '<td>';
        strTab += ' Partiel ';
        strTab += '<button class="state_button btn btn-square btn-block btn-warning" id="state_' +currentID+ '" type="button">Voir etat</button>';
        strTab += '</td>';
      } else {
        strTab += '<td>';
        strTab += ' Bon ';
        strTab += '<button class="state_button btn btn-square btn-block btn-warning" id="state_' +currentID+ '" type="button">Voir etat</button>';
        strTab += '</td>';
      }


      var date = moment.utc(data[i].updatedAt).local().format('YYYY-MM-DD HH:mm:ss');
      strTab += '<td>'+ date +'</td>';

      strTab += '<td><form class="image_form">';
      strTab += '<img id=display_'+ currentID +' height="90" width="90">';
      if(isAdmin == 'true') {
        strTab += '<input class="fileInput" type="file" accept="image/x-png,image/gif,image/jpeg" id="img_'+ currentID +'" />';
      }
      strTab += '</form></td>';

      strTab += '<td><a style="text-decoration:none;" href="./get_track.html?id=' + currentID + '" class="suivie_button" role="button"><button type="button" class="btn btn-square btn-block btn-info">Voir suivi</button></a></td>';
      strTab += '<td><a style="text-decoration:none;" href="./incident.html?id=' + currentID + '" class="incident_button" role="button"><button type="button" class="btn btn-square btn-block btn-dark">Voir incident</button></a></td>';

      if(isAdmin == 'true') {

        strTab += '<td>  <button class="modify_button btn btn-square btn-block btn-warning" id="mod_' +currentID+ '" type="button">Modifier</button> </td>';
        strTab += '<td>  <button class="delete_button btn btn-square btn-block btn-danger" id="' +currentID+ '" type="button">Delete</button> </td>';
      }
      strTab += '</tr>';

    }

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable({
      "order": [[ 3, "desc" ]]
    });

    for(var i in idArray) {
      setQRcode("#qr_" + idArray[i], {
        text	: idArray[i],
        width: 128,
        height: 128
      });

      getImage(idArray[i]);
    }
  }

  function getImage(id) {
    $("#display_" + id).attr("src", webserver_url + "/appareils_image/" +
    id);
  }



  $(".data_container").on( "click", ".delete_button", function() {
    var idToDelete = $( this ).attr("id");
    console.log("delete : " + idToDelete);

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/admin/appareils/" + idToDelete,
      'DELETE',
      {},
      getAllappareils,
      isErrorRequest
    );

  });


  $("#add_obj").submit(function( event ) {
    event.preventDefault();
    var objToAdd = JSON.parse($("#obj").val());
    console.log(objToAdd);

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/admin/appareils",
      'POST',
      objToAdd,
      getAllappareils,
      isErrorRequest
    );

  });


  $(".data_container").on( "click", ".modify_button", function() {
    $('#myModal').modal('toggle');
    var id = $(this).attr("id").substring(4);
    lastIdMod = id;
    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/appareils/" + id,
      'GET',
      {},
      displayJson,
      isErrorRequest
              );

  });

  function displayJson(data) {

    console.log(data);
    //var jsonForm = JSON.stringify(data);
    data.updatedAt = undefined;
    data.__v = undefined;
    data.createdAt = undefined;
    data.groupes = undefined;
    data._id = undefined;
    data.is_hs = undefined;
    data.is_part_hs = undefined;
    data.report = undefined;

    $("#objMod").text(JSON.stringify(data, null, '\t'));

    // var jsonForm = JSON.parse(templateJson);
    // jsonForm.nom = data.nom;
    // $("#objMod").text(JSON.stringify(jsonForm, null, '\t'));
  }

  $(".modal-footer").on( "click", "#valid_modification", function() {

      var objToMod =  JSON.parse($("#objMod").val());
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/admin/appareils/" + lastIdMod,
        'PUT',
        objToMod,
        function (data) {
          $('#myModal').modal('toggle');
          getAllappareils();
        },
        isErrorRequest
                );
  });

  $(".data_container").on( 'change', ".fileInput", function() {
    var myFile = $(this).prop('files')[0];

    var reader = new FileReader();
    var id = $(this).attr('id').substring(4);

                reader.onload = function (e) {
                    $('#display_' + id)
                        .attr('src', e.target.result)
                        .width(90)
                        .height(90);
                };

                reader.readAsDataURL(myFile);

    var form_data = new FormData();
    form_data.append('file', myFile, $(this).attr('id').substring(4));

    $.ajax({
        headers: {'x-access-token':localStorage.getItem("token"),},
        url:  webserver_url + "/admin/appareils_image",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function(data){
            getAllappareils();
        },
        error: isErrorRequest
     });
  });

  $(".data_container").on( "click", ".state_button", function() {
    $('#modelState').modal('toggle');
    lastIdRep = $(this).attr("id").substring(6);

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/api/appareils/" + lastIdRep,
      'GET',
      {},
      function (data) {
        $("#report").val(data.report);

        if(data.is_hs) {
          $("#stateSelect").val(1);
        } else if(data.is_part_hs) {
          $("#stateSelect").val(2);
        } else {
          $("#stateSelect").val(3);
        }

      },
      isErrorRequest
              );

  });

  $(".modal-footer").on( "click", "#valid_state", function() {


      var newState =  {
                    "report": $("#report").val(),
                    "state" : $("#stateSelect").val(),
                    "appId" : lastIdRep
      }

      console.log(newState);

      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/appareils/etat",
        'POST',
        newState,
        function (data) {
          console.log(data);
          $('#modelState').modal('toggle');
          getAllappareils();
        },
        isErrorRequest
                );
  });


});
