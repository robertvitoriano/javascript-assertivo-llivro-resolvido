import logger from '@jsassertivo/cli/src/utils/logger.js';

// Services
import findUser from '../services/user/find.js'
let i = 0
export const authenticate = async (req, res) => {
  try {
    const { uid, ...data } = await findUser.usernameAndPassword(req.body.username, req.body.password);
    i +=1
    console.log(`authenticate ${i}`)
    res.cookie('uid', uid);
    console.log("")
    return res.json({ ...data, uid });
  } catch(err) {
    logger.error('Ocorreu um erro ao autenticar usuários', err);
    return res.status(404).json({ message: 'Usuário não existente' });
  }
}
