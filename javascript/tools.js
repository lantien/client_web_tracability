console.log("TOOLS LOADED");

var webserver_url = 'http://134.214.236.17:80/node';

function redirectTo(url) {

  window.location.href = url;
}

function makeRequest(myHeader, myUrl, method, myData, successFunc, failFunc) {
  $.ajax({
      headers: myHeader,
      url: myUrl,
      type: method,
      data: myData,
      success: successFunc,
      error: failFunc
  });
}

function setQRcode(id, data) {
  jQuery(id).qrcode(data);
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function getAllLabo(success, fail) {
  makeRequest(
    {'x-access-token':localStorage.getItem("token"),},
    webserver_url + "/laboratoires",
    'GET',
    {},
    success,
    fail
            );
}

function getAllPrj(success, fail) {
  makeRequest(
    {'x-access-token':localStorage.getItem("token"),},
    webserver_url + "/api/projets",
    'GET',
    {},
    success,
    fail
            );
}

function joinPrj(projID, userID, success, fail) {
  makeRequest(
    {'x-access-token':localStorage.getItem("token"),},
    webserver_url + "/api/users/add",
    'POST',
    {
      projetId: projID,
      userId: userID
    },
    success,
    fail
            );
}

function getGrp(id, success, fail) {
  makeRequest(
    {'x-access-token':localStorage.getItem("token"),},
    webserver_url + "/api/groupe/" + id,
    'GET',
    {},
    success,
    fail
            );
}

function leavePrj(projID, userID, success, fail) {
  makeRequest(
    {'x-access-token':localStorage.getItem("token"),},
    webserver_url + "/api/users/remove",
    'POST',
    {
      projetId: projID,
      userId: userID
    },
    success,
    fail
            );
}

function deleteAllProjetRef(id, success, fail) {

  makeRequest(
    {'x-access-token':localStorage.getItem("token"),},
    webserver_url + "/api/users/projets/" + id,
    'DELETE',
    {},
    success,
    fail
            );
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userID");
  localStorage.removeItem("admin");
  redirectTo("./index.html");
}
