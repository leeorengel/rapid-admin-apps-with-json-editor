// client-side js
// run by the browser each time your view template is loaded

$(function() {
  
  var editorContainer = $('#editor_container');

  var clientSelect = $('#clients');

  var editorSchema = {
    "type": "object",
    "title": "SaaS TODO App Settings Editor",
    "description": "Settings for TODO SaaS Inc.",
    "properties": {
      "defaultViewType": {
        "type": "string",
        "title": "Default View Type",
        "description": "The default type of view to present to the user",
        "enum": ["", "detail", "brief"],
        "options": {
          "enum_titles": ["Select a default..", "Detailed View", "Brief View"]
        },
        "minLength": 1,
        "default": ""
      },
  
      "syncEnabled": {
        "type": "boolean",
        "format": "checkbox",
        "title": "Enable Sync",
        "description": "Enable TODO item sync with cloud server. Additional add-on module.",
        "default": false
      },
  
      "voiceEnabled": {
        "type": "boolean",
        "format": "checkbox",
        "title": "Enable Voice Dictation",
        "description": "Enable Voice recognition-based TODO item dictation. Additional add-on module.",
        "default": false
      },
  
      "defaultPageSize": {
        "type": "integer",
        "title": "Default Page Size",
        "enum": [10, 20, 50, 100],
        "description": "The default page size",
        "minLength": 1,
        "default": 10
      },
  
      "categories": {
        "type": "array",
        "format": "table",
        "title": "Categories",
        "description": "A list of default categories a user can choose for todo items.",
        "uniqueItems": true,
        "minItems": 1,
        "items": {
          "type": "string",
          "title": "Category",
          "minLength": 1
        }
      }
    }
  };
  
  var editor = {};
  
  var editorOptions = {
    "theme": 'bootstrap3',
    "iconLib": 'bootstrap3',
    "no_additional_properties": true,
    "disable_edit_json": true,
    "disable_properties": true,
    "required_by_default": true,
    "disable_collapse": true,
    "schema": editorSchema
  };
  
  JSONEditor.defaults.options.iconlib = "bootstrap3";
  
  fetchClients = function() {
    $.get('/clients', function(clients) {
      var options = '<option value="">Select a client..</option>';
      
      clients.forEach(function(client) {
        options += '<option value="' + client.id + '">' + client.name + '</option>';
      });
      
      clientSelect.html(options);
      clientSelect.selectpicker('refresh');
    });
  };

  clientSelect.change(function(event) {
    event.preventDefault();
    
    var client = $(this).val();
    
    if(!client) {
      editorContainer.empty();
      return false;
    }
    
    $.get('/settings?client=' + client, function(settings) {
      // transform to our schema representation
      settings.categories = settings.categories.split(",");
      editorOptions.startval = settings;
      editorContainer.empty();
      editor = new JSONEditor(editorContainer.get(0), editorOptions);
    });
  });

  $('#submit').click(function(event) {
    event.preventDefault();
    
    var client = clientSelect.val();
    
    if(!client) {
      alert("You must select a client!");
      return false;
    }
    
    var errors = editor.validate();
    
    if(errors.length > 0) {
      var lastError = errors[errors.length - 1];
      alert("One or more errors found. Message: " + lastError.message + " Field: " + lastError.path);
      return false;
    }
    
    var updatedSettings = $.extend({}, editor.getValue());
    
    // Convert array of categories to server-side representation
    updatedSettings.categories = updatedSettings.categories.join(",");
    
    $.ajax({
      type: "POST",
      url: '/settings',
      data: { "client": client, "settings": JSON.stringify(updatedSettings)},
      success: function(response) {
        alert(response);
      }
    });
  });
  
  fetchClients();

});
