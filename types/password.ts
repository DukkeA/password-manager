export type CreatePasswordInput = {
  title: string;
  username: string;
  url: string;
  notes?: string;
  ciphertext: string;
  iv: string;
  ownerAddress: string;
};

export type QueryPasswordType = {
  id: string;
  title: string;
  username: string;
  url: string;
  notes?: string;
  ciphertext: string;
  iv: string;
  ownerAddress: string;
  createdAt: string;
  updatedAt: string;
};
