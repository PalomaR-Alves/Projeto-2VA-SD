export function LayoutDefault({ children }) {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f7fff7',
      minHeight: '100vh'
    }}>
      {children}
    </div>
  )
}