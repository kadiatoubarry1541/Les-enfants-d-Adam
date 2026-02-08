// Styles réutilisables pour les formulaires
export const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: '1px solid #cbd5e1',
  borderRadius: '0.75rem',
  backgroundColor: '#f8fafc',
  fontSize: '1rem',
  transition: 'all 0.2s'
} as React.CSSProperties;

export const inputFocusStyle = {
  borderColor: '#4f46e5',
  backgroundColor: 'white',
  boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)'
};

export const inputBlurStyle = {
  borderColor: '#cbd5e1',
  backgroundColor: '#f8fafc',
  boxShadow: 'none'
};

export const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#334155',
  marginBottom: '0.5rem'
} as React.CSSProperties;

export const buttonStyle = (color: string, loading: boolean) => ({
  width: '100%',
  background: loading 
    ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
    : color,
  color: 'white',
  fontWeight: '600',
  padding: '0.75rem 1rem',
  borderRadius: '0.65rem',
  border: 'none',
  fontSize: '1rem',
  cursor: loading ? 'not-allowed' : 'pointer',
  boxShadow: '0 8px 12px -4px rgba(0, 0, 0, 0.25)',
  transition: 'all 0.25s ease',
  marginTop: '1.25rem'
} as React.CSSProperties);

export const getButtonHoverStyle = (color: string) => ({
  transform: 'translateY(-2px)',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
});

export const getButtonLeaveStyle = () => ({
  transform: 'translateY(0)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
});

