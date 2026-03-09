// app/demo/page.js
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Demo() {
  const [navCount, setNavCount] = useState(0)
  
  useEffect(() => {
    // 监听页面切换
    const handleRouteChange = () => {
      setNavCount(c => c + 1)
    }
    
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])
  
  return (
    <div style={{ padding: '40px' }}>
      <h1>导航演示</h1>
      <p>页面切换次数: {navCount}</p>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div>
          <h3>❌ 普通a标签</h3>
          <a href="/blog" style={{ color: 'red' }}>
            博客列表（会刷新页面）
          </a>
        </div>
        
        <div>
          <h3>✅ Link组件</h3>
          <Link href="/blog" style={{ color: 'green' }}>
            博客列表（无刷新）
          </Link>
        </div>
      </div>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h3>Link组件的其他功能</h3>
        
        {/* 替换历史记录 */}
        <p>
          <Link href="/blog" replace>
            替换当前历史记录
          </Link>
        </p>
        
        {/* 带查询参数 */}
        <p>
          <Link href="/blog?page=1">
            博客第一页
          </Link>
        </p>
        
        {/* 滚动到特定位置 */}
        <p>
          <Link href="/blog#comments">
            跳转到评论区
          </Link>
        </p>
      </div>
    </div>
  )
}