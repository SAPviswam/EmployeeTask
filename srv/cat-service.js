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

  // srv/users-service.js  (same file, further down)
this.on('login', async (req) => {
console.log("Request body Naveen " , req)

  // const { email, password } = req.data               // plain-text password from caller
  // const user = await SELECT.one.from(Users).where({ email })

  // if (!user)  return req.reject(404, 'User not found')

  // const ok = await bcrypt.compare(password, user.password)
  // if (!ok)    return req.reject(401, 'Wrong password')

  // return { ID: user.ID, name: user.name }
})

  
});