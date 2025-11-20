import axios, { type AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_BASE_API_URL;
console.log(baseURL, 'baseURL')
const instance: AxiosInstance = axios.create({ baseURL });


export interface PollingOptions {
  requestsCount?: number;
  delayMs?: number;
}

export default instance;
