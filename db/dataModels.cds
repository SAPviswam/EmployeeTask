namespace emptask;

entity Role {
  key ID   : String;
      role : String @title: 'Role'  //Admin, Manager, Lead, Member
}
entity Domain {
  key ID     : String;
      domain : String @title: 'Domain'; //All, BTP, EWM, MM, HR
      // Composition: Users are children of Domain.
      users  : Composition of Users
                 on users.domain = $self
}
entity Users {
  key userID        : String;
      password      : String                @title: 'Password';
      name          : String                @title: 'Name';
      mail          : String                @title: 'E-mail';
      role          : Association to Role   @title: 'Role';
      domain        : Association to Domain @title: 'Domain'
}
entity Task {
 key ID          : String;
  type        : String               @title: 'Task Type';
  priority    : String               @title: 'Priority';
  assignat    : DateTime             @title: 'Assigned at';
  assignby    : Association to Users @title: 'Assigned by';
  assignto    : Association to Users @title: 'Assigned to';
  acccompdate : Date                 @title: 'Actual Complete Date';
  compdate    : DateTime             @title: 'Completed Date';
  comment     : String               @title: 'Comments'
}


