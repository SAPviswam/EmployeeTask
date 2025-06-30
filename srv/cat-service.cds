using emptask as task from '../db/dataModels';

@path: '/TaskSRV'
service CatalogService {
    entity Role   as projection on task.Role;
    entity Domain as projection on task.Domain;
    entity Users  as projection on task.Users;
    action login(userID: String, password: String) returns UserProfile;
    entity Task   as projection on task.Task;
}
type UserProfile {
  userID   : String;
  name : String;
}

