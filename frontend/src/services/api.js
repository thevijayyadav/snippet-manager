import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Backend base URL
});

// Add a request interceptor to include the JWT token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fallback logic for dummy API calls if backend fails (Optional feature to keep UI testable)
/*
import MockAdapter from "axios-mock-adapter";
const mock = new MockAdapter(api, { delayResponse: 500, onNoMatch: "passthrough" });

// Define Mock Data Persistence
const getLocal = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const saveLocal = (key, val) => localStorage.setItem(key, JSON.stringify(val));

mock.onGet("/snippets").reply(() => [200, getLocal('snippet_manager_snippets')]);
mock.onPost("/snippets").reply((config) => {
  const snippets = getLocal('snippet_manager_snippets');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const newS = { ...JSON.parse(config.data), id: 'sm-' + Date.now(), authorUsername: user.username, createdAt: new Date().toISOString() };
  snippets.unshift(newS);
  saveLocal('snippet_manager_snippets', snippets);
  return [200, newS];
});
mock.onDelete(/\/snippets\/.+/).reply((config) => {
  const id = config.url.split('/').pop();
  let snippets = getLocal('snippet_manager_snippets');
  snippets = snippets.filter(s => s.id !== id);
  saveLocal('snippet_manager_snippets', snippets);
  return [200, { message: 'Deleted' }];
});
mock.onPost("/login").reply((config) => {
  const { username } = JSON.parse(config.data);
  const user = { username, role: username === 'admin' ? 'ADMIN' : 'USER', fullName: username.toUpperCase() };
  return [200, { token: 'mock-jwt', user }];
});
mock.onGet("/notifications/my").reply(200, []);
mock.onGet("/teams/my").reply(200, []);
*/

export default api;
