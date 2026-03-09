import { NextResponse } from "next/server";
import {cookies} from 'next/hearders'

export async function GET(){
    // 1. JSON响应
    return NextResponse.json({name:张三,age:28})

   // 2. 带状态码
  return NextResponse.json(
    { error: '未授权' },
    { status: 401 }
  )

  // 3. 设置headers
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        'X-Custom-Header': 'custom-value',
      }
    }
  )
  
  // 4. 设置cookies
  const cookieStore = await cookies()
  cookieStore.set('token', 'jwt-token', {
    httpOnly: true,
    secure: true,
    maxAge: 3600,
  })
  
  // 5. 重定向
  return NextResponse.redirect(new URL('/login', request.url))
  
  // 6. 返回文件
  const file = await readFile('public/document.pdf')
  return new NextResponse(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=document.pdf',
    },
  })
}