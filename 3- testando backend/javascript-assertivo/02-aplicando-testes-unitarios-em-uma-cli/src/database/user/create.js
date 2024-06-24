import faker from 'faker';

import ROLES from '../../constants/roles.js';
import { loadDatabase, saveDatabase } from '../file.js';

export const createUser = async ({
  email,
  password,
  userName,
  name,
  lastName,
  role = ROLES.USER,
  ...rest
}) => {
  const users = await loadDatabase();
  const uid = String(Math.random()*Math.random)+String(Math.random()*67);
  const user = { email, password, userName, name, lastName, role, uid, ...rest };

  users.push(user);
  await saveDatabase(users);

  return user;
}

