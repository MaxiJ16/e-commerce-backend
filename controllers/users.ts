import { User } from "models/user";

export async function getUserById(id: string): Promise<any> {
  const user = new User(id);
  await user.pull();
  return user.data;
}

export async function modifiedUser(id: string, newData): Promise<any> {
  const user = new User(id);
  user.data = newData;
  await user.push();
  return { Modificado: true };
}

export async function modifiedAddress(id: string, address): Promise<any> {
  const user = new User(id);
  await user.pull();
  user.data.address = address;
  await user.push();
  return { éxito: "Address modificado", user: user.data };
}
