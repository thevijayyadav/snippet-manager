import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

// Comprehensive Q&A knowledge base
const knowledgeBase = [
  // Snippet Management
  { keywords: ['save', 'add', 'create', 'new', 'snippet', 'write'], answer: "To save a new snippet:\n1. Click '+ New Snippet' on the dashboard or 'Add Snippet' in the sidebar.\n2. Fill in the Title, select a Language, paste your Code, add Tags (comma separated), and set Privacy.\n3. Click 'Save Snippet' — your code will be saved instantly and appear on the dashboard!" },
  { keywords: ['view', 'see', 'open', 'read', 'look'], answer: "To view a snippet, simply click on any snippet card on the Dashboard. It will open a detailed view showing the full code, description, tags, and author information." },
  { keywords: ['edit', 'update', 'modify', 'change snippet'], answer: "To edit a snippet you own:\n1. Open the snippet by clicking on it.\n2. Click the 'Edit' button.\n3. Modify the title, code, description, tags or privacy.\n4. Click 'Save' to update it!" },
  { keywords: ['delete', 'remove', 'trash'], answer: "To delete a snippet:\n1. Open the snippet you want to remove.\n2. Click the 'Delete' button (trash icon).\n3. Confirm the deletion.\nNote: You can only delete snippets you created yourself." },
  { keywords: ['search', 'find', 'filter', 'look for'], answer: "Use the search bar at the top of the Dashboard! You can search by:\n• Snippet title\n• Tags\n• Programming language\nJust type your keyword and results filter instantly in real-time." },
  { keywords: ['tag', 'label', 'category'], answer: "Tags help organize your snippets. When creating a snippet, type tags separated by commas (e.g., 'react, hooks, api'). You can then search/filter by these tags on the dashboard." },
  { keywords: ['private', 'public', 'privacy', 'visibility'], answer: "Each snippet has a privacy toggle:\n• Public: Visible to all users on the platform.\n• Private: Only visible to you.\nYou can toggle this when creating or editing a snippet." },
  { keywords: ['code', 'programming', 'language', 'supported'], answer: "SnipMaster supports multiple programming languages including: JavaScript, Python, Java, Go, HTML/CSS, SQL, and more! Select the language when creating a snippet for proper syntax display." },
  { keywords: ['copy', 'clipboard', 'paste'], answer: "To copy snippet code:\n1. Open the snippet or hover over a snippet card.\n2. Click the 📋 Copy icon in the top-right of the code block.\n3. The code will be copied to your clipboard instantly!\nYou'll see a 'Copied!' confirmation." },
  { keywords: ['share', 'link', 'send'], answer: "To share a snippet:\n1. Open any snippet.\n2. Click the Share icon.\n3. The snippet URL can be shared with teammates.\nNote: Only public snippets are accessible by others." },
  { keywords: ['explain', 'ai explain', 'understand', 'breakdown'], answer: "SnipMaster has an AI Code Explanation feature!\n1. Open any snippet.\n2. Scroll down to the 'AI Code Explanation' section.\n3. Click 'Explain Code'.\nThe AI will analyze and break down how the code works." },

  // Account & Auth  
  { keywords: ['register', 'signup', 'account', 'join'], answer: "To create an account:\n1. Go to the Register page.\n2. Fill in your Full Name, Username, Email, Password, and Confirm Password.\n3. Click 'Sign Up'.\nYou'll be automatically logged in after registration!" },
  { keywords: ['login', 'signin', 'sign in', 'log in'], answer: "To login:\n1. Go to the Login page.\n2. Enter your Username (or Email) and Password.\n3. Click 'Sign In'.\nYou'll be redirected to the Dashboard immediately.\n\nDemo accounts: 'demo' (user) or 'admin' (admin)." },
  { keywords: ['password', 'forgot', 'reset', 'recover'], answer: "If you forgot your password:\n1. Click 'Forgot Password?' on the Login page.\n2. Enter your email address.\n3. Click 'Send Reset Link'.\nA password recovery email will be sent to your inbox." },
  { keywords: ['logout', 'sign out', 'log out'], answer: "To logout, click the logout icon (arrow pointing right) in the top-right corner of the navigation bar. Your session will be ended securely." },
  { keywords: ['profile', 'my account', 'name', 'email change'], answer: "Your profile info (name, username, role) is displayed in the top-right corner of the navbar. Your avatar shows the first letter of your name." },

  // Admin
  { keywords: ['admin', 'administrator', 'manage', 'panel'], answer: "Admin Panel features:\n• 📊 View total users & snippets count\n• 👥 See all registered users with their details\n• ➕ Add new users directly from the panel\n• 🗑️ Delete non-admin users\n• 👁️ Expand any user row to see ALL snippets they created\n• 📈 Monitor system status\n\nTo access: Login with username 'admin', then click 'Admin Panel' in the sidebar." },
  { keywords: ['add user', 'create user', 'new user'], answer: "Admins can add users directly:\n1. Go to Admin Panel.\n2. Click the '+ Add User' button.\n3. Fill in Full Name, Username, Email, and select Role.\n4. Click the + button to create the user.\nThe new user appears in the table instantly!" },
  { keywords: ['delete user', 'remove user'], answer: "To delete a user (admin only):\n1. Go to Admin Panel.\n2. Find the user in the table.\n3. Click the red trash icon.\n4. Confirm the deletion.\nNote: The admin account cannot be deleted." },
  { keywords: ['user snippet', 'who created', 'which user', 'snippet by'], answer: "To see which user created which snippets:\n1. Go to Admin Panel.\n2. Each user row shows a 'Snippets' count badge.\n3. Click the 👁️ eye icon to expand and see ALL snippets created by that specific user!\nEach snippet shows its title, language, code preview, and tags." },

  // Theme & Language
  { keywords: ['theme', 'dark', 'light', 'color', 'mode'], answer: "SnipMaster offers 4 beautiful themes:\n🌙 Dark — Midnight blue (default)\n☀️ Light — Clean white\n🌊 Ocean — Deep oceanic teal\n🌅 Sunset — Warm red/orange\nClick the theme icon (Sun/Moon/Globe) in the top-right navbar to cycle through them!" },
  { keywords: ['language', 'hindi', 'marathi', 'english', 'translate', 'भाषा', 'हिंदी', 'मराठी'], answer: "The app supports 3 languages:\n🇬🇧 English\n🇮🇳 Hindi (हिंदी)\n🇮🇳 Marathi (मराठी)\nClick the globe icon with the language code (EN/HI/MR) in the top-right navbar and select your preferred language from the dropdown." },

  // Dashboard & Navigation
  { keywords: ['dashboard', 'home', 'main'], answer: "The Dashboard is your main hub! Here you can:\n• See all your saved code snippets as beautiful cards.\n• Search and filter snippets by title or tags.\n• Click '+ New Snippet' to add code.\n• Copy code directly from snippet cards.\n• Access the AI Chatbot (that's me!) for help." },
  { keywords: ['sidebar', 'menu', 'navigate', 'navigation'], answer: "The left sidebar has quick links to:\n• Dashboard — Your snippet hub\n• Add Snippet — Create new code\n• My Library — Your personal collection\n• Settings — App preferences\n• Admin Panel (admins only)" },

  // Technical
  { keywords: ['tech', 'stack', 'built', 'technology', 'framework'], answer: "SnipMaster is built with:\n🎨 Frontend: React.js + Tailwind CSS + Framer Motion\n⚙️ Backend: Java Spring Boot (REST APIs)\n🗄️ Database: MongoDB\n🔒 Auth: JWT (JSON Web Tokens)\n🤖 AI: Built-in Assistant" },
  { keywords: ['api', 'endpoint', 'rest', 'backend'], answer: "The REST API endpoints:\n• POST /api/auth/register — Create account\n• POST /api/auth/login — Login\n• GET /api/snippets — List all snippets\n• POST /api/snippets — Create snippet\n• PUT /api/snippets/:id — Update snippet\n• DELETE /api/snippets/:id — Delete snippet\n• GET /api/users — List users (admin)" },
  { keywords: ['security', 'jwt', 'token', 'authentication'], answer: "SnipMaster uses JWT (JSON Web Tokens) for security:\n🔐 Passwords are hashed with BCrypt\n🎫 JWT tokens are generated on login\n🛡️ All API calls require valid tokens\n👮 Role-based access (USER/ADMIN)\n⏰ Tokens expire for safety" },
  { keywords: ['database', 'mongodb', 'data', 'storage'], answer: "SnipMaster uses MongoDB for data storage:\n📁 Users collection — accounts & roles\n📝 Snippets collection — code snippets\n⭐ Reviews collection — ratings\nThe database runs on localhost:27017." },

  // Fun & General
  { keywords: ['help', 'what can you do', 'features', 'how'], answer: "I can help you with:\n✅ Adding, viewing, editing, and deleting snippets\n✅ Searching and filtering code\n✅ Copying code to clipboard\n✅ Managing your account\n✅ Changing themes (4 options!)\n✅ Switching languages (EN/HI/MR)\n✅ Understanding admin features\n✅ Adding/deleting users (admin)\n✅ Viewing snippets per user\n✅ Technical details & API info\n\nJust ask me anything about SnipMaster!" },
  { keywords: ['hello', 'hi', 'hey', 'good', 'morning', 'evening', 'namaste', 'नमस्ते'], answer: "Hello! 👋 Welcome to SnipMaster AI Assistant! I'm here to help you navigate the platform. What would you like to know?" },
  { keywords: ['thanks', 'thank', 'bye', 'goodbye', 'धन्यवाद'], answer: "You're welcome! Happy coding! 🚀 Feel free to ask me anything anytime." },
  { keywords: ['who', 'what are you', 'bot', 'ai', 'chatbot'], answer: "I'm the SnipMaster AI Assistant! 🤖 I'm built right into your dashboard to help you use the platform efficiently. I can answer questions about snippets, themes, languages, accounts, admin features, and more!" },
  { keywords: ['cool', 'awesome', 'nice', 'great', 'amazing'], answer: "Thank you! 😊 SnipMaster was designed to be the ultimate code snippet manager. Keep exploring and let me know if you need anything!" },
  { keywords: ['error', 'bug', 'problem', 'issue', 'not working', 'broken'], answer: "Having issues? Try these steps:\n1. Refresh the page (Ctrl+R)\n2. Clear browser cache\n3. Check if the backend server is running\n4. Make sure MongoDB is active\n5. Check the browser console for errors (F12)\n\nIf it's still not working, try logging out and back in." },
];

function getAIResponse(userInput) {
  const input = userInput.toLowerCase();
  
  // Live data queries - pull from localStorage
  if (input.includes('how many user') || input.includes('total user') || input.includes('user count') || input.includes('registered user')) {
    try {
      const users = JSON.parse(localStorage.getItem('snippet_manager_users')) || [];
      const admins = users.filter(u => u.role === 'ADMIN').length;
      const regulars = users.filter(u => u.role === 'USER').length;
      return `📊 Current User Stats:\n• Total Registered Users: ${users.length}\n• Admins: ${admins}\n• Regular Users: ${regulars}\n\nUser list:\n${users.map(u => `• ${u.fullName} (@${u.username}) — ${u.role}`).join('\n')}`;
    } catch { return "Unable to load user data."; }
  }
  
  if (input.includes('how many snippet') || input.includes('total snippet') || input.includes('snippet count') || input.includes('all snippet')) {
    try {
      const snippets = JSON.parse(localStorage.getItem('snippet_manager_snippets')) || [];
      const langs = [...new Set(snippets.map(s => s.language))];
      return `📝 Current Snippet Stats:\n• Total Snippets: ${snippets.length}\n• Languages used: ${langs.join(', ')}\n\nSnippet list:\n${snippets.map(s => `• "${s.title}" (${s.language}) by ${s.authorUsername}`).join('\n')}`;
    } catch { return "Unable to load snippet data."; }
  }

  if (input.includes('my data') || input.includes('my info') || input.includes('my profile') || input.includes('my account')) {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const snippets = JSON.parse(localStorage.getItem('snippet_manager_snippets')) || [];
      const mySnippets = snippets.filter(s => s.authorUsername === user.username);
      return `👤 Your Profile:\n• Name: ${user.fullName || 'N/A'}\n• Username: ${user.username || 'N/A'}\n• Role: ${user.role || 'N/A'}\n• Your Snippets: ${mySnippets.length}\n${mySnippets.length > 0 ? '\nYour snippets:\n' + mySnippets.map(s => `• "${s.title}" (${s.language})`).join('\n') : ''}`;
    } catch { return "Unable to load your data."; }
  }

  // Score each knowledge item
  let bestMatch = null;
  let bestScore = 0;
  
  for (const item of knowledgeBase) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (input.includes(keyword)) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }
  
  if (bestMatch && bestScore > 0) {
    return bestMatch.answer;
  }
  
  return "I'm not sure I understand that question. Try asking about:\n• How to add/save snippets\n• How to search for code\n• How to change themes\n• How to switch languages\n• Account & login help\n• Admin features\n• 'How many users?' — live user stats\n• 'How many snippets?' — live snippet stats\n• 'My data' — your profile info\n\nOr just say 'help' to see everything I can do! 😊";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! 👋 I'm your SnipMaster AI Assistant. Ask me anything about the platform — saving snippets, changing themes, switching languages, and more!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    const newMsgs = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);
    
    // Simulate thinking delay
    setTimeout(() => {
      const reply = getAIResponse(userMsg);
      setMessages([...newMsgs, { role: 'bot', text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Button with Pulse Animation */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-primary-600 to-blue-500 rounded-full text-white shadow-2xl z-50 border-none cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl z-50 border border-primary-500/20 overflow-hidden flex flex-col"
            style={{ height: '450px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600/20 to-blue-600/20 p-4 border-b border-primary-500/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                  <Sparkles className="w-5 h-5 text-primary-400" />
                </motion.div>
                <div>
                  <span className="font-bold text-sm">SnipMaster AI</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-xs opacity-60">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 opacity-60" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-white"/>
                    </div>
                  )}
                  <div className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] whitespace-pre-line leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary-500 text-white rounded-tr-sm' 
                      : 'glass-panel rounded-tl-sm border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white"/>
                  </div>
                  <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1">
                {['How to save snippets?', 'Admin features', 'Change theme', 'Switch language', 'Who created which snippet?', 'Tech stack'].map((q, i) => (
                  <button key={i} onClick={() => { setInput(q); }} className="text-xs px-2 py-1 rounded-full border border-primary-500/30 text-primary-400 hover:bg-primary-500/10 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-gray-500/20">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent border border-gray-500/30 rounded-full py-2.5 pl-4 pr-4 focus:outline-none focus:border-primary-500 text-sm transition-colors"
                />
                <button type="submit" disabled={!input.trim()} className="p-2.5 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-30 border-none cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
