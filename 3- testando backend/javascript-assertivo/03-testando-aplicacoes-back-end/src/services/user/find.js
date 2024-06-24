import { loadDatabase } from '@jsassertivo/cli/src/database/file.js';

// Usa getUserByUid diretamente da CLI
import { getUserByUid, getUserByUsernameAndPassword } from '@jsassertivo/cli/src/database/user/read.js';

export const getUserByUsername = async (username) => {
  const data = await loadDatabase();
  const user = data.find(usr => usr.userName === username);

  if (!user) {
    throw new Error('Não existe usuário com username informado.');
  }

  return user;
}

export const getUserByEmail = async (email) => {
  const data = await loadDatabase();
  const user = data.find(usr => usr.email === email);

  if (!user) {
    throw new Error('Não existe usuário com email informado.');
  }

  return user;
}

export const basedOnQuery = (query) => {

  const acceptedParams = ['uid', 'email', 'username'];
  const param = acceptedParams.find(priority => !!query[priority]);

  if (!param) throw new Error('Você precisa informar uid, email ou username para fazer uma busca');

  return {
    by: param,
    param: query[param]
  };
}

export default {
  uid: getUserByUid,
  email: getUserByEmail,
  username: getUserByUsername,
  usernameAndPassword: getUserByUsernameAndPassword
}
