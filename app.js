$(document).ready(function() {

  $('body').on('click', '.delete', function() {
    var target = $(this).closest(".container");
    var id = target.data("id");

    $.ajax({
      type: "DELETE", //because I have no server it will only work if GET is set here
      url: '\delete.json',
      data: id,
      dataType: 'json',
      success: function(data) {
        if (data.status) {
          target.remove();
        } else {
          alert("User already deleted");
        }
      },
      error: function(jXHR, textStatus, errorThrown) {
        alert(errorThrown);
      }
    });

  });

  $("form").on('submit', function(e) {
    e.preventDefault();
    var myTitle = $('#title').val();
    var myDate = new Date();
    var srtDate = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + '-' + myDate.getDate();
    var item = {
      title: myTitle,
      date: srtDate,
      author: "John Doe",
      url: "http://www.example.com"
    };
    $.ajax({
      url: 'save.json',
      type: "POST",
      data: item,
      success: function(data) {
        var parsedData = JSON.parse(data);
        date = formatDate(parsedData.date);
        var htmlItem = (
          '<div class="container item" data-id="' + parsedData.id + '">' +
          '<div class="block left">' +
          '<label>Title: </label>' +
          '<div>' + parsedData.title + '</div><br>' +
          '<label>Date: </label>' +
          '<div>' + date + '</div>' +
          '</div>' +
          '<div class="block right">' +
          '<label>Author: </label>' +
          '<a href="' + parsedData.url + '">' + parsedData.author + '</a><br>' +
          '<button class="delete">Delete</button>' +
          '</div>' +
          '</div>'
        );
        $('body').append(htmlItem);

      },
      error: function(jXHR, textStatus, errorThrown) {
        alert(errorThrown);
      }
    });
  });

  $.getJSON('\data.json', function(data) {
      var items = [];
      $.each(data, function(key, val) {
        date = formatDate(val.date);
        items.push(
          '<div class="container item" data-id="' + val.id + '">' +
          '<div class="block left">' +
          '<label>Title: </label>' +
          '<div>' + val.title + '</div><br>' +
          '<label>Date: </label>' +
          '<div>' + date + '</div>' +
          '</div>' +
          '<div class="block right">' +
          '<label>Author: </label>' +
          '<a href="' + val.url + '">' + val.author + '</a><br>' +
          '<button class="delete">Delete</button>' +
          '</div>' +
          '</div>'
        );
      });
      $(items.join('')).appendTo('body');
    })
    .error(function(jXHR, textStatus, errorThrown) {
      alert(errorThrown);
    });

  function formatDate(date) {
    var myDate = new Date(date);
    return myDate.getDate() + '.' + (myDate.getMonth() + 1) + '.' + myDate.getFullYear();
  }

});
