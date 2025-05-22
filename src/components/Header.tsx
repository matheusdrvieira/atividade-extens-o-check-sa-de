
import React from 'react';

const Header = () => {
  return (
    <header className="py-6 md:py-8">
      <div className="container flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-fade-in">
          Autoavaliação de Saúde Mental
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Responda às perguntas abaixo para receber uma análise personalizada do seu bem-estar mental.
          Suas respostas são processadas localmente e não são armazenadas.
        </p>
      </div>
    </header>
  );
};

export default Header;
