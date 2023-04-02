import axios from 'axios';

export const peersRestClient = axios.create({ baseURL: 'http://localhost:3001/peers' });
