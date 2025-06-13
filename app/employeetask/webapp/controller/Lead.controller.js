// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/Filter",
//     "sap/ui/model/FilterOperator",
//     "sap/m/MessageBox"
//   ], function(Controller, Filter, FilterOperator, MessageBox) {
//     "use strict";
  
//     return Controller.extend("com.app.employeetask.controller.Lead", {
//       onInit: function() {
        
//       }

//     });
//   });
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
   "sap/m/MessageToast"
], function(Controller, Filter, FilterOperator, MessageToast) {
  "use strict";

  return Controller.extend("com.app.employeetask.controller.Lead", {
    onInit: function() {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("RouteLead").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function(oEvent) {
      var oArgs = oEvent.getParameter("arguments");
      var sDomainId = oArgs.domainId;

      // Add two filters: domain_ID and role_ID = 'RO04'
      var oTable = this.getView().byId("idTableUsers");
      var oBinding = oTable.getBinding("items");
      if (oBinding) {
        oBinding.filter([
          new Filter("domain_ID", FilterOperator.EQ, sDomainId),
          new Filter("role_ID", FilterOperator.EQ, "RO04")
        ]);
      }
    },
    onSelectEmployee: function (oEvent) {
      // Get the selected user context
      var oTable = this.getView().byId("idTableUsers");
      var aSelectedContexts = oTable.getSelectedContexts();

      if (aSelectedContexts.length > 0) {
        // Get the selected userID
        var oSelectedUser = aSelectedContexts[0].getObject();
        var sUserId = oSelectedUser.userID;

        // Get the Tasks table
        var oTasksTable = this.getView().byId("idTableTasks_LEAD");
        var oTasksInfoHeading = this.getView().byId("idTaskInfoHeading_LEAD");

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
