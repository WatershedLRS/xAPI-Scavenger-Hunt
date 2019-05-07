$(function() {
  setUp();
  var interval = null;
});


function setUp(){
  $('body').html('<div class="container"></div>');

  var welcome = $('<p>Welcome ' + cfg.employeeList[getUrlParameter('email')] + '!</p>'); 
  $('.container').append(welcome);
  $('.container').append('<p>Please tap the name of the conference attendee you are speaking to.</p>');

  $.each(cfg.attendeeList, function( index, attendeeName ) {
    var attendeeButton = $('<p><button type="button" class="btn btn-primary btn-lg">' + attendeeName + '</button></p>'); 
    attendeeButton.click(function(){
      sendStatement(attendeeName);
    });
    $('.container').append(attendeeButton);
  });
}

function displayReport(attendeeName, employeeName){
  $('body').html('<div class="container"></div>');

  $('.container').append('<div class="alert alert-success" role="alert">Contact recorded between '+attendeeName+' and '+employeeName+'.</div>');

  $('.container').append('<p>So far, '+attendeeName+' has spoken to these Watershed employees:</p>');

  var filter = {
    'equals': [{
      'fieldName': 'actor.account.name',
      'values': {
        'ids': [
          attendeeName
        ]
      }
    }]
  };
  var embedURL = cfg.shareUrl + '?view=card&filter=' + encodeURIComponent(JSON.stringify(filter));
  $('.container').append('<iframe id="embeddedReport" src="'+embedURL+'" width="100%" height="445" frameborder="0"></iframe>');

  $('.container').append('<div class="alert alert-info" role="alert">This report will refresh in <span id="countdown">10</span> seconds.</div>');
  interval = setInterval(countdown, 1000);

  var resetButton = $('<button type="button" class="btn btn-primary">Add more contacts</button>'); 
  resetButton.click(function(){
    clearInterval(interval);
    setUp();
  });
  $('.container').append(resetButton);
}

function countdown(){
  var number = parseInt($('#countdown').text());
  number--;
  if (number == 0){
    number = 10;
    document.getElementById('embeddedReport').src += '';
  }
  $('#countdown').text(number);
}

function sendStatement(attendeeName){
  var employeeEmail = getUrlParameter('email');
  var employeeName = cfg.employeeList[employeeEmail];
  var statement = new TinCan.Statement(
    {
      actor: {
        name: attendeeName,
        account: {
          name: attendeeName,
          homePage: 'https://watershedlrs.com/wis19/attendee'
        }
      },
      verb: {
        id: 'https://watershedlrs.com/wis19/verbs/met',
        display: {
          en: 'met'
        }
      },
      object: {
        objectType: "Agent",
        name: employeeName,
        mbox: 'mailto' + employeeEmail
      },
      context: {
        contextActivities: {
          category: [{
            "id": "https://watershedlrs.com/wis19/source/scavenger",
              "definition": {
                "name": {"en": "WIS19 Scavenger Hunt"},
                "type": "http://id.tincanapi.com/activitytype/source"
              }
          }]
        }
      }
    }
  );
  lrs.saveStatement(
    statement,
    {
      callback: function (err, xhr) {
        if (err !== null) {
          if (xhr !== null) {
            console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
            // TODO: do something with error, didn't save statement
            return;
          }

          console.log("Failed to save statement: " + err);
          // TODO: do something with error, didn't save statement
          return;
        }

        console.log("Statement saved");
        displayReport(attendeeName, employeeName);
        // TOOO: do something with success (possibly ignore)
      }
    }
  );
}


// UTILS
// =====
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};