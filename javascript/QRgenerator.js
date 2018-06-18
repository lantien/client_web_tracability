var templateJson = '{\n"nom" :""\n}';
var NbByPage = 10;

$( document ).ready(function() {

  var lastIdMod = "";
  var table;

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
      strTab += "<th>Derniere mis à jour</th>";
      strTab += "<th></th>";
      strTab += "<th></th>";
      strTab += "<th></th>";
      strTab += "<th></th>";
    strTab += "</tr></thead>";

    for(var i in data) {
      strTab += '<tr>';

      currentID = data[i]._id;
      idArray.push(currentID);
      strTab += '<td id=qr_'+ currentID +'></td>';
      strTab += '<td>'+ data[i].nom +'</td>';
      var date = moment.utc(data.updatedAt).local().format('YYYY-MM-DD HH:mm:ss');
      strTab += '<td>'+ date.toString() +'</td>';

      strTab += '<td><form class="image_form">';
      strTab += '<img id=display_'+ currentID +' height="90" width="90">';
      strTab += '<input class="fileInput" type="file" id="img_'+ currentID +'" />';
      strTab += '</form></td>';

      strTab += '<td><a style="text-decoration:none;" href="./get_track.html?id=' + currentID + '" class="suivie_button" role="button"><button type="button" class="btn btn-square btn-block btn-info">Voir suivi</button></a></td>';
      strTab += '<td>  <button class="modify_button btn btn-square btn-block btn-warning" id="mod_' +currentID+ '" type="button">Modifier</button> </td>';
      strTab += '<td>  <button class="delete_button btn btn-square btn-block btn-danger" id="' +currentID+ '" type="button">Delete</button> </td>';
      strTab += '</tr>';

    }

    $(".dataTables_wrapper").replaceWith('<table class="dataTables_wrapper" style="width:100%; margin: 0px auto;"></table>');

    $(".dataTables_wrapper").html(strTab);
    $('.dataTables_wrapper').DataTable({
      "order": [[ 2, "desc" ]]
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
      webserver_url + "/api/appareils/" + idToDelete,
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
      webserver_url + "/api/appareils",
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

    var jsonForm = JSON.parse(templateJson);
    jsonForm.nom = data.nom;
    $("#objMod").text(JSON.stringify(jsonForm, null, '\t'));
  }

  $(".modal-footer").on( "click", "#valid_modification", function() {

      var objToMod =  JSON.parse($("#objMod").val());
      makeRequest(
        {'x-access-token':localStorage.getItem("token"),},
        webserver_url + "/api/appareils/" + lastIdMod,
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

    console.log("Upload for : " + $(this).attr('id').substring(4));

    var form_data = new FormData();
    form_data.append('file', myFile, $(this).attr('id').substring(4));

    $.ajax({
        headers: {'x-access-token':localStorage.getItem("token"),},
        url:  webserver_url + "/api/appareils_image",
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


});
