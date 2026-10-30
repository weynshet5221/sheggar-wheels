export default function EmptyState({ message = 'No records found.' }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
      <p style={{ color: '#666', fontWeight: 500, margin: 0 }}>{message}</p>
    </div>
  );
}