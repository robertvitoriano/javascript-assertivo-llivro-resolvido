import faker from 'faker'
import axios from 'axios';
import { createUser as createUserCLI } from '@jsassertivo/cli/commands/user';
import ROLES from '@jsassertivo/cli/src/constants/roles';

export const createReq = (extraProperties) =>{
 const req = {
  body:{},
  ...extraProperties
 }
 return req;
}

export const createRes = (extraProperties) =>{
  const res = {
    json:jest.fn(()=>res),
    cookie:jest.fn(()=> res),
    status: jest.fn(()=>res),
    ...extraProperties
  }
  return res;
}

export const createNext = () => {
  const next = jest.fn();
  return next;
};

export const createAuth = (extraProperties) =>{
  const auth = {
    username:faker.internet.userName(),
    password:faker.internet.password(),
    ...extraProperties
  }
  return auth;
}

export const createUserProperties = (extraProperties) =>{
  const userProperties = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    userName: faker.internet.userName(),
    name: faker.internet.userName(),
    lastName: faker.internet.userName(),
    role: ROLES.USER,
    ...extraProperties
  }

  return userProperties
}

export const createError = (message = 'Ocorreu um erro ao executar operação') => {
  const error = new Error(message);
  return error;
};


export const createUser = createUserCLI;

export const createUserList = (length = 10) => {
  const list = Array.from({ length }, createUser);

  return list;
};

export const createUserListWithAdmin = () => {
  const list = createUserList();
  list[0].role = ROLES.ADMIN;

  return list;
};

const responseHandler = response => response;

export const clientHTTP = {
  createClient: (server) => {
    const client = axios.create({
      baseURL:`http://localhost:${server.address().port}/api`
    })

    client.interceptors.response.use(responseHandler, responseHandler)

    return client
  },
  authenticateClient: (client, user) => {
    const authenticatedClient = client;
    authenticatedClient.defaults.headers.cookie = `uid=${user.uid};`
    return authenticatedClient;
  },
};
