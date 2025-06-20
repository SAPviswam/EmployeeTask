using emptask from './dataModels';

entity UsersWithTaskCount as projection on emptask.Users {
  key userID,
      name,
      mail,
      password,
      role,
      domain,
      taskCount : Integer;
}
