/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 可以在这里添加自定义颜色
      },
    },
  },
  plugins: [],
  // 禁用 preflight 以避免与 Ant Design 冲突
  corePlugins: {
    preflight: false,
  },
  // 确保 Tailwind 的样式优先级
  important: true,
  // 添加 Ant Design 的类名到 safelist
  safelist: [
    {
      pattern: /^(m|p|flex|grid|text|bg|border|rounded|shadow|hover|transition|space|gap|w|h)-.+/,
    },
    'ant-upload',
    'ant-upload-drag',
    'ant-upload-list',
    'ant-upload-list-item',
    'ant-upload-text',
    'ant-upload-hint',
  ],
}