import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 确保将应用渲染到 index.html 里的 root 节点
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}