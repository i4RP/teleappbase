export const runtime = 'edge';

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#f8f9fa',
        color: '#343a40',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          404 | Page Not Found
        </h1>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#6c757d' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <footer style={{ fontSize: '0.75rem', marginTop: 'auto', padding: '1rem', color: '#adb5bd' }}>
          ©︎ sectorseven.world
        </footer>
      </body>
    </html>
  );
}
