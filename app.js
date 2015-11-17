var toDoController = {
  //Controller initialization
  init: function() {
    $.validate();
    toDoController.getData();
    toDoController.wireEvents();
  },
  //Starting event listeners
  wireEvents: function() {
    $(document).on('click', '.delete', function() {
      toDoController.deleteElement(this);
    });
    $(document).on('submit', '#new-item', function(e) {
      toDoController.submitData(e);
    });
  },
  // Controller Main Methods
  deleteElement: function(myThis) {
    var target = $(myThis).closest(".container");
    var id = target.data("id");
    var success = function(data) {
      if (data.status) {
        target.remove();
      } else {
        alert("User already deleted");
      }
    };
    var error = function(jXHR, textStatus, errorThrown) {
      alert(errorThrown);
    }
    toDoController.sendDeleteRequest(id, success, error);
  },
  submitData: function(e) {
    e.preventDefault();
    var myTitle = $('#title').val();
    var success = function(data) {
      var newItem = new Item();
      newItem.fromJSON(JSON.parse(data));
      newItem.date = new Date(newItem.date).formatDate("dd.mm.yyyy");
      var htmlItem = toDoController.createItemTemplate(newItem);
      $('body').append(htmlItem);
    };
    var error = function(jXHR, textStatus, errorThrown) {
      alert(errorThrown);
    };
    toDoController.sendPostRequest(myTitle, success, error)
  },
  getData: function() {
    $.getJSON('\data.json', function(data) {
        toDoController.renderList(data);
      })
      .error(function(jXHR, textStatus, errorThrown) {
        alert(errorThrown);
      });
  },
  //Controller additional methods
  renderList: function(data) {
    $.each(data, function(key, val) {
      val.date = new Date(val.date).formatDate("dd.mm.yyyy");
      $("body").append(toDoController.createItemTemplate(val));
    });
  },
  createItemTemplate: function(val) {
    return ('<div class="container item" data-id="' + val.id + '">' +
      '<div class="block left">' +
      '<label>Title: </label>' +
      '<div>' + val.title + '</div><br>' +
      '<label>Date: </label>' +
      '<div>' + val.date + '</div>' +
      '</div>' +
      '<div class="block right">' +
      '<label>Author: </label>' +
      '<a href="' + val.url + '">' + val.author + '</a><br>' +
      '<button class="delete">Delete</button>' +
      '</div>' +
      '</div>');
  },
  sendDeleteRequest: function(id, success, error) {
    var payload = {
      id: id
    };
    $.ajax({
      type: "POST", //because I have no server it will only work if GET is set here
      url: '\delete.json',
      data: payload,
      dataType: 'json',
      success: success,
      error: error
    });
  },
  sendPostRequest: function(title, success, error) {
    var srtDate = new Date().formatDate("yyyy-mm-dd");
    var item = new Item(title, srtDate);
    $.ajax({
      url: 'save.json',
      type: "POST",
      data: item.toJSON(),
      success: success,
      error: error
    })
  }
}
//Model
function Item(title, date, author, url) {
  this.id;
  this.title = title || "";
  this.date = date || "No date Provided";
  this.author = author || "John Doe";
  this.url = url || "http://www.example.com";

  this.fromJSON = function(object) { //function to fetch data to front-end from back-end
    if (object !== undefined) {
      this.id = object.id;
      this.title = object.title;
      this.date = object.date;
      this.author = object.author;
      this.url = object.url;
    }
  };

  this.toJSON = function() { //reverse function to send data back to back-end
    return {
      id: this.id,
      title: this.title,
      date: this.date,
      author: this.author,
      url: this.url
    };
  };
}
//Date prototype
Date.prototype.formatDate = function(format) {
  if (format == "dd.mm.yyyy") {
    return this.getDate() + '.' + (this.getMonth() + 1) + '.' + this.getFullYear();
  } else if (format == "yyyy-mm-dd") {
    return this.getFullYear() + "-" + (this.getMonth() + 1) + '-' + this.getDate();
  } else {
    return "Wrong format!";
  }
}


$(document).ready(function() {
  // gather params from querystring, server injection, etc
  toDoController.init();
});
