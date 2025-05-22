
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12 mb-8 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>
          Esta é uma ferramenta de autoavaliação e não substitui aconselhamento médico profissional.
        </p>
        <p className="mt-2">
          Em caso de emergência ou crise, entre em contato com o Centro de Valorização da Vida: 
          <a 
            href="https://www.cvv.org.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-primary ml-1 hover:underline"
          >
            CVV - 188
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
