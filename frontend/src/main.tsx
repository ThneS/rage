import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 开发环境检查
if (import.meta.env.DEV) {
  console.log('React Developer Tools 已启用')
  // 确保 React 开发工具可用
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('React Developer Tools 已连接')
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
