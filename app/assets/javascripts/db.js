(function() {

    var my_date_format = function(input){
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var date = input.getDate() + " " + month[input.getMonth()] + ", " + input.getFullYear();
        var time = input.toLocaleTimeString().toLowerCase().replace(/([\d]+:[\d]+):[\d]+(\s\w+)/g, "$1$2");
        return (date + " at " + time);
    };

    var db = {
        loadData: function(filter) {
          headers = null
          $.ajax({
              type: "GET",
              url: "/headers/show",
              async: false,
              success: function(results) {
                results.forEach(function(header){
                  header.created_formatted = my_date_format(new Date(header.created_at))
                  header.updated_formatted = my_date_format(new Date(header.updated_at))
                })
                headers = results
              }
          });
          return $.grep(headers, function(header) {
              return (!filter.name || header.name.indexOf(filter.name) > -1)
                  && (!filter.description || header.description.indexOf(filter.description) > -1)
                  && (!filter.created_formatted || header.created_formatted.indexOf(filter.created_formatted) > -1)
                  && (!filter.updated_formatted || header.updated_formatted.indexOf(filter.updated_formatted) > -1)
          });
        },

        insertItem: function(insertingHeader) {
          this.clients.push(insertingHeader);
        },

        updateItem: function(updatingHeader) {
          var updatedItem = null
          var data = {
            'id'    : updatingHeader.id,
            'header': updatingHeader
          }
          $.ajax({
            type: "PUT",
            url: "/headers/update",
            data: data,
            async: false,
            success: function(results) {
              results.created_formatted = my_date_format(new Date(results.created_at))
              results.updated_formatted = my_date_format(new Date(results.updated_at))
              updatedItem = results
            }
          })
          return updatedItem
        },

        deleteItem: function(deletingHeader) {
          $.ajax({
            type: "DELETE",
            url: "/headers/destroy",
            data: {"id": deletingHeader.id}
          });
        }
    };

    window.db = db;


}());
