// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/Filter",
//     "sap/ui/model/FilterOperator",
//      "sap/m/MessageToast"
//   ], (Controller, Filter, FilterOperator, MessageToast) => {
//     "use strict";

//     return Controller.extend("com.app.employeetask.controller.Manager", {
//         onInit() {
//         },
//         onSelectEmployee: function (oEvent) {
//             // Get the selected user context
//             var oTable = this.getView().byId("idTableUSers_MNG");
//             var aSelectedContexts = oTable.getSelectedContexts();

//             if (aSelectedContexts.length > 0) {
//               // Get the selected userID
//               var oSelectedUser = aSelectedContexts[0].getObject();
//               var sUserId = oSelectedUser.userID;

//               // Get the Tasks table
//               var oTasksTable = this.getView().byId("idTableTasks_MNG");
//               var oTasksInfoHeading = this.getView().byId("idTaskInfoHeading_MNG");

//               // Create filter for tasks assigned to the selected user
//               var oFilter = new Filter("assignto_userID", FilterOperator.EQ, sUserId);

//               // Apply the filter to the tasks table binding
//               var oBinding = oTasksTable.getBinding("items");
//               if (oBinding) {
//                 oBinding.filter([oFilter]);
//                 // Wait for the binding to update, then check if there are any items
//               oBinding.attachEventOnce("dataReceived", function() {
//                 var iCount = oTasksTable.getItems().length;
//                 if (iCount > 0) {
//                   oTasksTable.setVisible(true);
//                   oTasksInfoHeading.setVisible(true);
//                 } else {
//                   oTasksTable.setVisible(false);
//                   oTasksInfoHeading.setVisible(false);
//                   MessageToast.show("No tasks available for the selected user.");
//                 }
//               });
//               }
//             }
//           }
//     });
//   });

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/ui/core/Fragment"
], function (Controller, Filter, FilterOperator, MessageToast, Fragment) {
  "use strict";

  return Controller.extend("com.app.employeetask.controller.Manager", {

    onInit: function () {
      this.getOwnerComponent().getRouter()
        .getRoute("RouteManager")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
      const userId = oEvent.getParameter("arguments").userId;
      this._loadUserDataForAvatar(userId);
    },

    _loadUserDataForAvatar: async function (userId) {
      const oModel = this.getView().getModel(); // OData V4 model
      const sPath = `/Users('${userId}')`;

      try {
        // Create a context binding with $expand via path
        const oBinding = oModel.bindContext(sPath + `?$expand=role`, null, {
          $$updateGroupId: "userGroup"
        });

        // Get the data
        const oData = await oBinding.requestObject();

        // Set to JSON model
        const oUserModel = new sap.ui.model.json.JSONModel(oData);
        this.getView().setModel(oUserModel, "userInfo");

      } catch (err) {
        MessageToast.show("Failed to load user info.");
        console.error("User data fetch failed:", err);
      }
    }
    ,

    onPressAvatar: function (oEvent) {
      const oView = this.getView();

      if (!this._userPopover) {
        Fragment.load({
          name: "com.app.employeetask.fragments.UserInfo", // new fragment name
          controller: this
        }).then(function (oPopover) {
          this._userPopover = oPopover;
          oView.addDependent(oPopover);
          oPopover.setModel(oView.getModel("userInfo"));
          oPopover.openBy(oEvent.getSource()); // anchor to Avatar
        }.bind(this));
      } else {
        this._userPopover.setModel(oView.getModel("userInfo"));
        this._userPopover.openBy(oEvent.getSource());
      }
    },

    onCloseUserDialog: function () {
      if (this._userDialog) {
        this._userDialog.close();
      }
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
          oBinding.attachEventOnce("dataReceived", function () {
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
