$( document ).ready(function() {

  isLogged();
  function isLogged() {

    makeRequest(
      {'x-access-token':localStorage.getItem("token"),},
      webserver_url+"/api/test",
      'POST',
      {},
      redirectIfLog,
      isErrorRequest
    );

  }

  function redirectIfLog(result) {
    if(result.connection == 'true') {
      redirectTo("./me.html");
    }
  }

  getAllLabo(displayLabo, isErrorRequest);

  function displayLabo(data) {

    var strOpt = "";

    strOpt += '<option value=""> </option>';

    for(var i in data) {
      strOpt += '<option value="'+ data[i]._id +'">'+ data[i].nom +'</option>';
    }

    $("#labo-list").html(strOpt);
  }

  function isErrorRequest(xhr, ajaxOptions, thrownError) {
    console.log("erreur login");
    console.log(xhr);
    console.log(ajaxOptions);
    console.log(thrownError);
  }

  function onLogged(result) {
    console.log("logged !" , result);
    // Do something with the result
    var promise1 = new Promise(function(resolve, reject) {
      localStorage.setItem("token", result.tokenJSON);
      localStorage.setItem("userID", result.userID);
      localStorage.setItem("admin", result.admin);
      resolve(true);
    });

    promise1.then(function(value) {
      if(value) {
        isLogged();
      } else {
        alert("loggin error");
      }
    }).catch(function(error) {
      console.log(error);
    });
  }

  function displayWrongAccount(xhr, ajaxOptions, thrownError) {
    console.log("wrong password", xhr.status);

    if(xhr.status == 404) {
      $('.error').text("Invalid Login or password.");
    }
  }



  $("#form-signin").submit(function( event ) {
    event.preventDefault();
    var login_input = $("#username").val();
    var password_input = $("#password").val();

    var obj = {login : login_input , password: password_input};
    makeRequest(
      {},
      webserver_url+"/login",
      'POST',
      obj,
      onLogged,
      displayWrongAccount
    );
  });

  $("#form-create").on('keyup',"#nom" , function() {
    $("#login").val($(this).val());
  });

  $("#form-create").submit(function( event ) {
    event.preventDefault();
    console.log("create account !");

    var logInput = $("#login").val();
    var passInput = $("#password_input").val();
    var nomInput = $("#nom").val();
    var preInput = $("#prenom").val();
    var emailInput = $("#email").val();
    var telInput = $("#tel").val();
    var labo = $("#labo-list").val();


    if($("#password_input").val() == $("#password_confirm").val()) {
      var dataUser = { login: logInput, password: passInput, nom: nomInput,prenom: preInput,email: emailInput,telephone: telInput,laboratoire:labo};

      makeRequest(
        {},
        webserver_url+"/users",
        'POST',
        dataUser,
        function (data) {
          var obj = {login : logInput , password: passInput};
          makeRequest(
            {},
            webserver_url+"/login",
            'POST',
            obj,
            onLogged,
            isErrorRequest
          );
        },
        isErrorRequest
      );
    } else {
      $('.error_create').text("passwords dont match.");
      console.log("passwords dont match");
    }
  });

  function errorCreation(xhr, ajaxOptions, thrownError) {
    $('.error_create').text("Username already taken.");
  }

  function displayLog(data) {
    console.log(data);
  }

  $(".switchForms").click(function() {
    $("#form-signin").toggle();
    $("#form-create").toggle();
  });

});
