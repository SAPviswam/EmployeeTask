sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
   "sap/ui/model/json/JSONModel",
], (Controller, UIComponent, MessageBox, Filter, FilterOperator, JSONModel) => {
  "use strict";

  return Controller.extend("com.app.employeetask.controller.Home", {
    onInit() {

    },
    onPressNxt: function () {
      var oView = this.getView();
     var sUserID = oView.byId("idUserID").getValue();
      var sPassword = oView.byId("idPassword").getValue();

      if (!sUserID || !sPassword) {
        MessageBox.show("please enter valid Credentials");
        return;
      }

      const oModel = this.getView().getModel(); // ODataModel V4
      // const sEmail = this.byId("emailInput").getValue();
      // const sPass  = this.byId("passwordInput").getValue();
    
      const oBinding = oModel.bindContext("/login()", null, {
        $$context: null,                     // ✅ explicitly defer the binding
        $$operationMode: "Direct",          // ✅ no cache
        $$parameter: {
          userID: sUserID,
          password: sPassword
        }
      });
    
      oBinding.execute()
        .then(() => {
          const oResult = oBinding.getBoundContext().getObject();
          sap.m.MessageToast.show("Welcome " + oResult.name);
        })
        .catch((err) => {
          sap.m.MessageBox.error("Login failed: " + err.message);
        });
    }
    

    // controller/Login.controller.js
// onLoginPress: function () {
//   const oModel   = this.getView().getModel();     // OData V2 model
//   const sEmail   = this.byId("inpEmail").getValue();
//   const sPass    = this.byId("inpPass").getValue();

//   const mParams = {
//     method     : "POST",
//     urlParameters : {
//       email    : `'${encodeURIComponent(sEmail)}'`,
//       password : `'${encodeURIComponent(sPass)}'`
//     },
//     success: (oData) => {
//       sap.m.MessageToast.show("Welcome " + oData.name);
//       // Store token or navigate…
//     },
//     error: (oError) => {
//       sap.m.MessageBox.error(oError.responseText);
//     }
//   };

//   oModel.callFunction("/login", mParams);   // ⇠ function import
// }
// ,
//     // // Event handler for "Next" button press
//     onPressNxt: function () {
//       var oView = this.getView();
//       var sUserID = oView.byId("idUserID").getValue();
//       var sPassword = oView.byId("idPassword").getValue();

//       if (!sUserID || !sPassword) {
//         MessageBox.show("please enter valid Credentials");
//         return;
//       }

//       var oModel = this.getOwnerComponent().getModel();
//       //var oBinding = oModel.bindList("/Users");
//       const mParams = {
//         method     : "POST",
//         urlParameters : {
//           userID    : `'${sUserID}'`,
//           password : `'${sPassword}'`
//         },
//         success: (oData) => {
//           sap.m.MessageToast.show("Welcome " + oData.name);
//           // Store token or navigate…
//           console.log(oData)
//         },
//         error: (oError) => {
//           sap.m.MessageBox.error(oError.responseText);
//           console.log(oError)
//         }
//       };
    
//       oModel.callFunction("/login", mParams);   // ⇠ function import
//       // oBinding.filter([
//       //   new Filter("userID", FilterOperator.EQ, sUserID),
//       //   new Filter("password", FilterOperator.EQ, sPassword),
//       // ]);

//       // oBinding
//       //   .requestContexts()
//       //   .then(
//       //     function (aContexts) {
//       //       //requestContexts is called to get the contexts (matching records) from the backend.
//       //       if (aContexts.length > 0) {
//       //         var ID = aContexts[0].getObject().userID;
//       //         var userType = aContexts[0].getObject().role_ID;
//       //         var oRouter = this.getOwnerComponent().getRouter();
//       //         if (userType === "RO01") {
//       //           oRouter.navTo("RouteAdmin", { userId: ID });
//       //         }
//       //         else if (userType === "RO02") {
//       //           oRouter.navTo("RouteManager", { userId: ID });
//       //         }
//       //         else if (userType === "RO03") {
//       //           var leadDomain = aContexts[0].getObject().domain_ID;
//       //           oRouter.navTo("RouteLead", { userId: ID, domainId: leadDomain });
//       //         }
              

//       //         oView.byId("idUserID").setValue("");
//       //         oView.byId("idPassword").setValue("");
//       //       } else {
//       //         MessageBox.show("Invalid username or password.");
//       //       }
//       //     }.bind(this)
//       //   )
//       //   .catch(
//       //   // function () {
//       //   // MessageBox.show("An error occurred during login.");
//       //   //   }
//       // );
//     },


  });
});
