
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{
      marginTop: '2rem',
      padding: '1rem',
      backgroundColor: '#f0f0f0',
      textAlign: 'center',
      color: '#333',
      borderTop: '1px solid #e0e0e0'
    }}>
      <p>&copy; {currentYear} Research Genie. All rights reserved.</p>
      <p>Built with ❤️ by Your Team.</p>
    </footer>
  );
};

export default Footer;

