$(document).ready(function() {

  $('body').on('click', '.delete', function() {
    alert("Huy");
});

  $.getJSON('\data.json', function(data) {
    var items = [];

    $.each(data, function(key, val) {
      date = formatDate(val.date);
      items.push(
        '<div class="container item">' +
          '<div class="block left">' +
            '<label>Title: </label>' +
            '<div>' + val.title + '</div><br>' +
            '<label>Date: </label>' +
            '<div>' + date + '</div>'+
          '</div>' +
          '<div class="block right">' +
            '<label>Author: </label>' +
            '<a href="' + val.url + '">' + val.author + '</a><br>' +
            '<button class="delete">Delete</button>' +
          '</div>' +
        '</div>'
      );
    });
    $(items.join('')
  ).appendTo('body');
  });

  function test() {
    alert("Delete");
  };

  function formatDate(date) {
    var myDate = new Date(date);
    return myDate.getDate() + '.' + (myDate.getMonth()+1) + '.' + myDate.getFullYear();
  }


});
