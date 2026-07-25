export interface UserProfile {
  name: string;
  email: string;
  tag: string;
  account: string;
  bank: string;
  ref?: string;
}

export const currentUser: UserProfile = {
  name: "John Paul Cruz",
  email: "alexis.cruz@example.com",
  tag: "@alexis.cruz",
  account: "••4271",
  bank: "Top Bank",
  ref: "TB-AXC-2026",
};
