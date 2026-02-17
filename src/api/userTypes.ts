export type User = {
  id: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  secretWord: string;
  createdAt: string;
  updatedAt: string;
};

export type UserModifyPayload = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  secretWord: string;
};
