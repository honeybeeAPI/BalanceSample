var clientId = "";
var clientSecret = "";

var raboapi_code = {

  authorize: function(options) {

    var deferred = $.Deferred();

    var authUrl = 'https://hackaton.eu-gb.mybluemix.net/dialog/authorize?' + $.param({
      client_id: options.client_id,
      redirect_uri: options.redirect_uri,
      response_type: 'code',
      scope: options.scope
    });

    var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

    $(authWindow).on('loadstart', function(e) {
      var url = e.originalEvent.url;
      var code = /\?code=(.+)$/.exec(url);
      var error = /\?error=(.+)$/.exec(url);
      if (code || error) {
        authWindow.close();
      }
      if (code) {
        $.post('https://hackaton.eu-gb.mybluemix.net/oauth/token', {
          code: code[1],
          client_id: options.client_id,
          client_secret: options.client_secret,
          redirect_uri: options.redirect_uri,
          grant_type: 'authorization_code'
        }).done(function(data) {
          // alert("exchange code for token done");
          deferred.resolve(data);
        }).fail(function(response) {
          // console.log(JSON.stringify(response,null,2));
          // alert("exchange code for token failed");
          deferred.reject(response.responseJSON);
        });
      } else if (error) {
        //The user denied access to the app
        //alert("error received " + error[1]);

        deferred.reject({
          error: error[1]
        });
      }
    });
    return deferred.promise();
  }
};

var setControl = {
  setupControls: function(options) {
    var $loginButton = $('#ibanlogin');
    var $loginStatus = $('#loginStatus p');

    // Rabo oAuth code sample
    $loginButton.on('click', function() {

      // data is a JavaScript object now. Handle it as such
      raboapi_code.authorize({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: 'http://localhost',
        scope: 'test'
      }).done(function(data) {
        var token = data.access_token;
        $loginStatus.html('Access Token: ' + token);
        // call API with access_token
        $.ajax({
          url: "https://hackaton.eu-gb.mybluemix.net/api/balanceview",
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', "Bearer " + token);
            xhr.setRequestHeader('Accept', "application/json");
          }
        }).done(function(data) {
          //console.log(data);
          var overzicht = "";
          $.each(data.ConfiguredAccounts.Account, function(key, value) {
            //console.log(key, value);
            var account = key;
            var balance = value.Balance;
            var accountname = value.ProductName;
            overzicht += balance + " " + accountname + "<br>";
          });
          $loginStatus.html(overzicht);
        }).fail(function(jqXHR, textStatus) {
          alert("tried with token : " + token);
          alert("error: " + jqXHR.responseText);
        });

      }).fail(function(data) {
        $loginStatus.html(data.error);
      });
    });
  }
};
