export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-color)',
            background: page === currentPage ? 'var(--primary)' : 'white',
            color: page === currentPage ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
}