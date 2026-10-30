export default function AdminDisputesPage() {
  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <h1>Platform Disputes</h1>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginTop: '1.5rem' }}>
        <p>No active disputes pending resolution.</p>
      </div>
    </div>
  );
}