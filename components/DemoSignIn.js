'use client';
export default function DemoSignIn({ onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <button onClick={() => onSelect('usr-renter-1')} className="btn-primary" style={{ background: '#f4f7f4', color: '#1a2e22', border: '1px solid #ccc', textAlign: 'left' }}>
        🔑 Sign In as Renter (Mekdes Tadesse)
      </button>
      <button onClick={() => onSelect('usr-owner-1')} className="btn-primary" style={{ background: '#f4f7f4', color: '#1a2e22', border: '1px solid #ccc', textAlign: 'left' }}>
        🚘 Sign In as Car Owner (Dawit Bekele)
      </button>
      <button onClick={() => onSelect('usr-admin-1')} className="btn-primary" style={{ background: '#fffbeb', color: '#78350f', border: '1px solid #fde68a', textAlign: 'left' }}>
        🛡️ Sign In as Admin (Samuel)
      </button>
    </div>
  );
}