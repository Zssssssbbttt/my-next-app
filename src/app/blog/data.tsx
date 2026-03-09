// app/blog/data.js
export const blogPosts = [
  {
    id: 1,
    slug: 'nextjs-getting-started',
    title: 'Next.js入门指南',
    date: '2024-01-15',
    author: '张三',
    content: `
      Next.js是一个基于React的生产级框架，它提供了许多开箱即用的功能...
      
      ## 为什么选择Next.js？
      
      1. 文件即路由 - 不需要额外配置路由
      2. 服务端渲染 - 更好的SEO和首屏加载
      3. 图片优化 - 自动优化图片加载
      4. 字体优化 - 自动优化字体加载
      
      ## 快速开始
      
      使用create-next-app创建项目：
      
      npx create-next-app@latest my-app
      
      选择App Router，然后就可以开始开发了！
    `,
    excerpt: '学习Next.js的基础知识和核心特性'
  },
  {
    id: 2,
    slug: 'react-hooks-guide',
    title: 'React Hooks完全指南',
    date: '2024-01-20',
    author: '李四',
    content: `
      React Hooks是React 16.8引入的新特性，让你在不编写类组件的情况下使用状态和其他React特性...
      
      ## 常用Hooks
      
      ### useState
      用于在函数组件中添加状态：
      
      const [count, setCount] = useState(0)
      
      ### useEffect
      用于处理副作用：
      
      useEffect(() => {
        document.title = '页面加载完成'
      }, [])
      
      ### useContext
      用于跨组件传递数据
    `,
    excerpt: '深入理解React Hooks的使用场景和最佳实践'
  },
  {
    id: 3,
    slug: 'css-modules-nextjs',
    title: 'Next.js中的CSS Modules',
    date: '2024-01-25',
    author: '王五',
    content: `
      CSS Modules是Next.js内置的样式解决方案，它能够实现样式的局部作用域...
      
      ## 基本使用
      
      创建styles.module.css文件：
      
      .title {
        color: blue;
        font-size: 24px;
      }
      
      在组件中导入使用：
      
      import styles from './styles.module.css'
      
      export default function Component() {
        return <h1 className={styles.title}>标题</h1>
      }
      
      ## 优势
      - 避免样式冲突
      - 明确的依赖关系
      - 支持组合样式
    `,
    excerpt: '学习使用CSS Modules进行组件级样式管理'
  }
]