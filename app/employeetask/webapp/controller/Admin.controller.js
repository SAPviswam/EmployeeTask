sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
   "sap/m/MessageToast",
  "sap/ui/core/Fragment"
], function(Controller, Filter, FilterOperator, MessageToast, Fragment) {
  "use strict";

  return Controller.extend("com.app.employeetask.controller.Admin", {

    onInit: function () {
      this.getOwnerComponent().getRouter()
        .getRoute("RouteAdmin")
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
    }
    ,

    onCloseUserDialog: function () {
      if (this._userDialog) {
        this._userDialog.close();
      }
    },
    onOpenCreateUserDialog: function () {
      const oView = this.getView();
    
      if (!this._pCreateUserDialog) {
        Fragment.load({
          name: "com.app.employeetask.fragments.CreateUser",
          controller: this
        }).then(function (oDialog) {
          this._pCreateUserDialog = oDialog;
          oView.addDependent(oDialog);
          oDialog.open();
        }.bind(this));
      } else {
        this._pCreateUserDialog.open();
      }
    },
    
    onCancelCreateUser: function () {
      this._pCreateUserDialog.close();
    },
    
    onSaveNewUser: async function () {
      const oView = this.getView();
      const oModel = oView.getModel(); // OData V4 model
    
      // Get input values from the dialog
      const sName = sap.ui.getCore().byId("idInputName").getValue().trim();
      const sMail = sap.ui.getCore().byId("idInputEmail").getValue().trim();
      const sRoleID = sap.ui.getCore().byId("idSelectRole").getSelectedKey();
      const sDomainID = sap.ui.getCore().byId("idSelectDomain").getSelectedKey();
    
      // Get reference to email input field to show error
      const oEmailInput = sap.ui.getCore().byId("idInputEmail");
    
      // Basic validation
      if (!sName || !sMail || !sRoleID || !sDomainID) {
        MessageToast.show("All fields are required.");
        return;
      }
    
      try {
        // Bind list to fetch existing users
        const oListBinding = oModel.bindList("/Users");
        const aUsers = await oListBinding.requestContexts();
    
        let maxNum = 0;
        let emailExists = false;
    
        aUsers.forEach(ctx => {
          const oUser = ctx.getObject();
          const existingEmail = oUser.mail?.trim().toLowerCase();
    
          // Check for duplicate email
          if (existingEmail === sMail.toLowerCase()) {
            emailExists = true;
          }
    
          const id = oUser.userID;
          const num = parseInt(id.replace("User", ""));
          if (!isNaN(num)) {
            maxNum = Math.max(maxNum, num);
          }
        });
    
        if (emailExists) {
          oEmailInput.setValueState("Error");
          oEmailInput.setValueStateText("This e-mail is already registered.");
          return;
        } else {
          oEmailInput.setValueState("None");
        }
    
        // Generate next UserID
        const newUserID = "User" + String(maxNum + 1).padStart(3, "0");
    
        // Create user using OData V4 listBinding.create()
        await oListBinding.create({
          userID: newUserID,
          name: sName,
          mail: sMail,
          password: "12345", // default password or ask for input
          role_ID: sRoleID,
          domain_ID: sDomainID
        });
    
        MessageToast.show("User created successfully.");
        this._pCreateUserDialog.close();
    
        // Refresh the Users table
        this.byId("idTableUSers_AD").getBinding("items").refresh();
    
      } catch (err) {
        MessageToast.show("Error creating user.");
        console.error(err);
      }
    },    

    onSelectEmployee: function (oEvent) {
      // Get the selected user context
      var oTable = this.getView().byId("idTableUSers_AD");
      var aSelectedContexts = oTable.getSelectedContexts();

      if (aSelectedContexts.length > 0) {
        // Get the selected userID
        var oSelectedUser = aSelectedContexts[0].getObject();
        var sUserId = oSelectedUser.userID;

        // Get the Tasks table
        var oTasksTable = this.getView().byId("idTableTasks_AD");
        var oTasksInfoHeading = this.getView().byId("idTaskInfoHeading_AD");

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
