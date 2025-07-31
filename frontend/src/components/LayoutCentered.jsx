export function LayoutCentered({ children }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '1rem',
      backgroundColor: '#f7fff7'
    }}>
      {children}
    </div>
  )
}