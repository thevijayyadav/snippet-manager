import api from './api';

// LocalStorage helpers for offline/fallback mode
const LOCAL_KEY = 'snippet_manager_snippets';

function getLocalSnippets() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
  } catch { return []; }
}

function saveLocalSnippets(snippets) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(snippets));
}

const defaultSnippets = [
  { id: 'demo-1', title: 'React useState Hook', code: 'const [count, setCount] = useState(0);\n\nreturn (\n  <div>\n    <p>Count: {count}</p>\n    <button onClick={() => setCount(count + 1)}>+</button>\n  </div>\n);', language: 'javascript', tags: ['react', 'hooks', 'state'], authorUsername: 'admin', description: 'Basic counter using React useState hook', createdAt: new Date().toISOString() },
  { id: 'demo-2', title: 'Spring REST Controller', code: '@RestController\n@RequestMapping("/api")\npublic class HelloController {\n    @GetMapping("/hello")\n    public String hello() {\n        return "Hello World!";\n    }\n}', language: 'java', tags: ['spring', 'api', 'rest'], authorUsername: 'demo', description: 'Simple Spring Boot REST controller example', createdAt: new Date().toISOString() },
  { id: 'demo-3', title: 'Python Flask App', code: 'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef home():\n    return "Hello Flask!"\n\nif __name__ == "__main__":\n    app.run(debug=True)', language: 'python', tags: ['python', 'flask', 'api'], authorUsername: 'admin', description: 'Minimal Flask web application', createdAt: new Date().toISOString() },
];

// Seed defaults if empty
if (getLocalSnippets().length === 0) {
  saveLocalSnippets(defaultSnippets);
}

const snippetService = {
  getAllSnippets: async (search = '', language = '', tag = '') => {
    try {
      const response = await api.get('/snippets', { params: { search, language, tag } });
      return response.data;
    } catch {
      // Fallback: load from localStorage
      let snippets = getLocalSnippets();
      if (search) {
        snippets = snippets.filter(s =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          (s.tags && s.tags.join(' ').toLowerCase().includes(search.toLowerCase()))
        );
      }
      if (language) {
        snippets = snippets.filter(s => s.language === language);
      }
      return snippets;
    }
  },

  getSnippetById: async (id) => {
    try {
      const response = await api.get(`/snippets/${id}`);
      return response.data;
    } catch {
      const snippets = getLocalSnippets();
      const found = snippets.find(s => s.id === id);
      if (found) return found;
      throw new Error('Snippet not found');
    }
  },

  createSnippet: async (snippetData) => {
    try {
      const response = await api.post('/snippets', snippetData);
      return response.data;
    } catch {
      // Fallback: save to localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const newSnippet = {
        ...snippetData,
        id: 'local-' + Date.now(),
        authorUsername: user.username || 'anonymous',
        authorId: user.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const snippets = getLocalSnippets();
      snippets.unshift(newSnippet);
      saveLocalSnippets(snippets);
      return newSnippet;
    }
  },

  updateSnippet: async (id, snippetData) => {
    try {
      return (await api.put(`/snippets/${id}`, snippetData)).data;
    } catch {
      const snippets = getLocalSnippets();
      const idx = snippets.findIndex(s => s.id === id);
      if (idx !== -1) {
        snippets[idx] = { ...snippets[idx], ...snippetData, updatedAt: new Date().toISOString() };
        saveLocalSnippets(snippets);
        return snippets[idx];
      }
      throw new Error('Snippet not found');
    }
  },

  deleteSnippet: async (id) => {
    try {
      return (await api.delete(`/snippets/${id}`)).data;
    } catch {
      let snippets = getLocalSnippets();
      snippets = snippets.filter(s => s.id !== id);
      saveLocalSnippets(snippets);
      return { message: 'Deleted' };
    }
  },

  toggleFavorite: async (id) => {
    return (await api.post(`/snippets/${id}/favorite`)).data;
  },

  copySnippet: async (id) => {
    return (await api.post(`/snippets/${id}/copy`)).data;
  },

  rollbackSnippet: async (id, versionNumber) => {
    return (await api.post(`/snippets/${id}/rollback/${versionNumber}`)).data;
  },

  explainCode: async (code, language) => {
    return (await api.post('/snippets/explain', { code, language })).data;
  },

  checkDuplicate: async (code, language) => {
    return (await api.post('/snippets/check-duplicate', { code, language })).data;
  }
};

export default snippetService;
