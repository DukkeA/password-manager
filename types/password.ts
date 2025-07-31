export type CreatePasswordInput = {
  title: string;
  username: string;
  url: string;
  notes?: string;
  ciphertext: string;
  iv: string;
};

export type QueryPasswordType = {
  id: string;
  title: string;
  username: string;
  url: string;
  notes?: string;
  ciphertext: string;
  iv: string;
  createdAt: string;
  updatedAt: string;
};
