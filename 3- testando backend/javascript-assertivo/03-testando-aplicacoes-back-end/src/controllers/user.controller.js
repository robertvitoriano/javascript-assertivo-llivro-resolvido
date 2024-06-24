import logger from '@jsassertivo/cli/src/utils/logger.js';

// Services
import findUser, { basedOnQuery } from '../services/user/find.js';
import { createUser } from '../services/user/create.js'
import { removeUser } from '../services/user/remove.js'
import { updateUserByUid } from '../services/user/update.js'

export const list = async (req, res) => {
  try {
    const { by, param } = basedOnQuery(req.query);
    const data = await findUser[by](param);
    return res.status(200).json(data);
  } catch(err) {
    logger.error('Ocorreu um erro ao listar usuários', err);
    return res.status(500).json({ message: err.message });
  }
}

export const create = async (req, res) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    logger.error('Ocorreu um erro ao criar usuário', err);
    return res.status(500).json({ message: err.message });
  }
}

export const update = async (req, res) => {
  try {
    const [uid, ...fields] = Object.keys(req.body)
    if(fields.length === 0 ){
      return res.status(400).json({ message: "Informe um campo para atualizar usuário" })
    }
    const user = await updateUserByUid(req.body);
    return res.status(202).json(user);
  } catch (err) {
    logger.error('Ocorreu um erro ao atualizar usuário', err);
    return res.status(500).json({ message: err.message });
  }
}

export const remove = async (req, res) => {
  try {
    const user = await removeUser(req.params.uid);

    return res.status(202).json(user)
  } catch (err) {
    logger.error('Ocorreu um erro ao remover usuário', err);
    return res.status(500).json({ message: err.message });
  }
}
