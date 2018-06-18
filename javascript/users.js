var templateUserJson = '{\n"nom" :"",\n"password":"",\n"prenom":"",\n"email":"",\n"telephone":""\n}';

$( document ).ready(function() {

  console.log("user id : " + localStorage.getItem("userID"));

  setJsonUserTemplate();
  function setJsonUserTemplate() {

    $("#obj").text(templateUserJson);
  }

  function errorAjaxRequest(xhr, ajaxOptions, thrownError) {
      console.log("users request error");
  }

  $("#add_user").submit(function( event ) {
    event.preventDefault();
    var objToAdd = JSON.parse($("#obj").val());
    console.log(objToAdd);

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url + "/users",
      'POST',
      objToAdd,
      function(result) {
        console.log(result);
      },
      errorAjaxRequest
              );
  });


});
