using emptask as task from '../db/dataModels';

@path: '/TaskSRV'
service CatalogService {
    entity Role   as projection on task.Role;
    entity Domain as projection on task.Domain;
    entity Users  as projection on task.Users;
    entity Task   as projection on task.Task;
}
