const cds = require('@sap/cds');
const bcrypt = require('bcrypt');
 
module.exports = cds.service.impl(function () {
  const { Users } = this.entities;
 
  this.before('CREATE', 'Users', async (req) => {
    console.log(req)
    const plainPassword = req.data.password;
    const saltRounds = 10;
    req.data.password = await bcrypt.hash(plainPassword, saltRounds);
  });



  
});