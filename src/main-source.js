/* eslint-disable */
import axios from 'axios';

var apiLink = "https://localhost:7040/api/"
export const HTTP = axios.create({
  baseURL: apiLink,
})
