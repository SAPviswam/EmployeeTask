sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], (Controller, UIComponent, MessageBox, Filter, FilterOperator) => {
  "use strict";

  return Controller.extend("com.app.employeetask.controller.Home", {
    onInit() {

    },
    // Event handler for "Next" button press
    onPressNxt: function () {
      var oView = this.getView();
      var sUserID = oView.byId("idUserID").getValue();
      var sPassword = oView.byId("idPassword").getValue();

      if (!sUserID || !sPassword) {
        MessageBox.show("please enter valid Credentials");
        return;
      }

      var oModel = this.getView().getModel();
      var oBinding = oModel.bindList("/Users");

      oBinding.filter([
        new Filter("userID", FilterOperator.EQ, sUserID),
        new Filter("password", FilterOperator.EQ, sPassword),
      ]);

      oBinding
        .requestContexts()
        .then(
          function (aContexts) {
            //requestContexts is called to get the contexts (matching records) from the backend.
            if (aContexts.length > 0) {
              var ID = aContexts[0].getObject().userID;
              var userType = aContexts[0].getObject().role_ID;
              var oRouter = this.getOwnerComponent().getRouter();
              if (userType === "RO01") {
                oRouter.navTo("RouteAdmin", { userId: ID });
              }
              else if (userType === "RO02") {
                oRouter.navTo("RouteManager", { userId: ID });
              }
              else if (userType === "RO03") {
                var leadDomain = aContexts[0].getObject().domain_ID;
                oRouter.navTo("RouteLead", { userId: ID, domainId: leadDomain });
              }
              

              oView.byId("idUserID").setValue("");
              oView.byId("idPassword").setValue("");
            } else {
              MessageBox.show("Invalid username or password.");
            }
          }.bind(this)
        )
        .catch(
        // function () {
        // MessageBox.show("An error occurred during login.");
        //   }
      );
    },
  
  });
});