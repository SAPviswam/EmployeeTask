sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
     "sap/m/MessageToast"
  ], (Controller, Filter, FilterOperator, MessageToast) => {
    "use strict";
  
    return Controller.extend("com.app.employeetask.controller.Manager", {
        onInit() {
        },
        onSelectEmployee: function (oEvent) {
            // Get the selected user context
            var oTable = this.getView().byId("idTableUSers_MNG");
            var aSelectedContexts = oTable.getSelectedContexts();
      
            if (aSelectedContexts.length > 0) {
              // Get the selected userID
              var oSelectedUser = aSelectedContexts[0].getObject();
              var sUserId = oSelectedUser.userID;
      
              // Get the Tasks table
              var oTasksTable = this.getView().byId("idTableTasks_MNG");
              var oTasksInfoHeading = this.getView().byId("idTaskInfoHeading_MNG");
      
              // Create filter for tasks assigned to the selected user
              var oFilter = new Filter("assignto_userID", FilterOperator.EQ, sUserId);
      
              // Apply the filter to the tasks table binding
              var oBinding = oTasksTable.getBinding("items");
              if (oBinding) {
                oBinding.filter([oFilter]);
                // Wait for the binding to update, then check if there are any items
              oBinding.attachEventOnce("dataReceived", function() {
                var iCount = oTasksTable.getItems().length;
                if (iCount > 0) {
                  oTasksTable.setVisible(true);
                  oTasksInfoHeading.setVisible(true);
                } else {
                  oTasksTable.setVisible(false);
                  oTasksInfoHeading.setVisible(false);
                  MessageToast.show("No tasks available for the selected user.");
                }
              });
              }
            }
          }
    });
  });