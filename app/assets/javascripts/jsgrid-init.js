! function(document, window, $) {
    "use strict";
    var Site = window.Site;
    $(document).ready(function($) {

        }), jsGrid.setDefaults({
            tableClass: "jsgrid-table table table-striped table-hover"
        }), jsGrid.setDefaults("text", {
            _createTextBox: function() {
                return $("<input>").attr("type", "text").attr("class", "form-control input-sm")
            }
        }), jsGrid.setDefaults("number", {
            _createTextBox: function() {
                return $("<input>").attr("type", "number").attr("class", "form-control input-sm")
            }
        }), jsGrid.setDefaults("textarea", {
            _createTextBox: function() {
                return $("<input>").attr("type", "textarea").attr("class", "form-control")
            }
        }), jsGrid.setDefaults("control", {
            _createGridButton: function(cls, tooltip, clickHandler) {
                var grid = this._grid;
                return $("<button>").addClass(this.buttonClass).addClass(cls).attr({
                    type: "button",
                    title: tooltip
                }).on("click", function(e) {
                    clickHandler(grid, e)
                })
            }
        }), jsGrid.setDefaults("select", {
            _createSelect: function() {
                var $result = $("<select>").attr("class", "form-control input-sm"),
                    valueField = this.valueField,
                    textField = this.textField,
                    selectedIndex = this.selectedIndex;
                return $.each(this.items, function(index, item) {
                    var value = valueField ? item[valueField] : index,
                        text = textField ? item[textField] : item,
                        $option = $("<option>").attr("value", value).text(text).appendTo($result);
                    $option.prop("selected", selectedIndex === index)
                }), $result
            }
        }),
        function() {
            $("#basicgrid").jsGrid({
                height: "500px",
                width: "100%",
                filtering: !0,
                editing: !0,
                sorting: !0,
                paging: !0,
                autoload: !0,
                pageSize: 15,
                pageButtonCount: 5,
                deleteConfirm: "Do you really want to delete the header?",
                controller: db,
                css: "",
                rowClick: function (args) {
                  sessionStorage.setItem('header', JSON.stringify(args.item));
                  location.replace("/analyser")
                },
                fields: [{
                    name: "name",
                    title: "Name",
                    type: "text",
                    width: 150
                }, {
                    name: "description",
                    title: "Description",
                    type: "text",
                    width: 150
                }, {
                    name: "created_formatted",
                    title: "Created at",
                    editing: false,
                    type: "text",
                    width: 100
                }, {
                    name: "updated_formatted",
                    title: "Last updated",
                    editing: false,
                    type: "text",
                    width: 100
                }, {
                    type: "control"
                }]
            })
        }(),
        $("#basicgrid").jsGrid("sort", { field: "created_formatted", order: "desc" });
}(document, window, jQuery);
