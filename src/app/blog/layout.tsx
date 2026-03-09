

export default function BlogLayout({children}:{
  children:React.ReactNode
}){
return (
  <div>这是Blog的layout
    <section>{children}</section></div>

)
}