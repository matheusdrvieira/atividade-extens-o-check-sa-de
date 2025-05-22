import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from 'react';

interface AssessmentResultProps {
  result: string;
  onReset: () => void;
}

const AssessmentResult: React.FC<AssessmentResultProps> = ({ result, onReset }) => {
  // Determine status based on emoji in result
  const getStatusStyles = () => {
    if (result.includes('🟢')) {
      return 'bg-wellness-light-green border-wellness-green';
    } else if (result.includes('🟡')) {
      return 'bg-wellness-light-yellow border-wellness-yellow';
    } else if (result.includes('🔴')) {
      return 'bg-wellness-light-red border-wellness-red';
    }
    return 'bg-card';
  };

  return (
    <Card className={`p-8 border-2 animate-fade-in ${getStatusStyles()}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{Array.from(result)[0]} Resultado da Sua Autoavaliação</h2>
        <p className="text-muted-foreground">
          Análise gerada por IA com base nas suas respostas
        </p>
      </div>

      <div className="my-6 text-lg space-y-4">
        {result
          .slice(Array.from(result)[0].length) // remove o emoji inicial
          .trim()
          .split(/\n+/) // divide em parágrafos
          .map((paragraph, index) => (
            <p key={index} className="text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Lembre-se: Esta é apenas uma avaliação automática e não substitui a consulta com um profissional de saúde mental.
          Se você está passando por dificuldades, procure ajuda profissional.
        </p>
        <Button onClick={onReset} className="mt-2">
          Fazer Nova Avaliação
        </Button>
      </div>
    </Card>
  );
};

export default AssessmentResult;
