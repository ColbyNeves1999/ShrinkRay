type DatabaseConstraintError = {
  type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
  columnName?: string;
  message?: string;
};

type incomingUser = {
  username: string;
  password: string;
}

type loggedUser = {
  userId: string;
}

type linkURL = {
  originalUrl: string;
}

type linkId = {
  targetLinkId: string;
}

type returnedUser = {
  targetUserId: string;
}

type linkIdSearch = {
  targetUserId: string;
  targetLinkId: string;
}