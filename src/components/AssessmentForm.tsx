import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';
import AssessmentResult from './AssessmentResult';

interface Question {
  id: number;
  text: string;
  min: string;
  max: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Você dormiu bem nos últimos dias?",
    min: "Muito mal",
    max: "Muito bem"
  },
  {
    id: 2,
    text: "Está se alimentando regularmente?",
    min: "Irregularmente",
    max: "Regularmente"
  },
  {
    id: 3,
    text: "Tem se sentido ansioso?",
    min: "Extremamente",
    max: "Raramente"
  },
  {
    id: 4,
    text: "Tem conseguido se concentrar nas tarefas?",
    min: "Dificuldade extrema",
    max: "Sem dificuldade"
  },
  {
    id: 5,
    text: "Tem se sentido motivado?",
    min: "Desmotivado",
    max: "Muito motivado"
  }
];

const AssessmentForm = () => {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<number, number>>(
    questions.reduce((acc, question) => ({ ...acc, [question.id]: 3 }), {})
  );
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleSliderChange = (questionId: number, value: number[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value[0] }));
  };

  const analyzeAssessment = async () => {
    setLoading(true);

    try {
      // Formatar as respostas para o prompt
      const formattedAnswers = questions
        .map((question) => `${question.text}: ${answers[question.id]}/5`)
        .join("\n");

      const prompt = `
      Sou um sistema de bem-estar. Analise as respostas abaixo e diga em poucas palavras se a pessoa está bem (🟢), se deve ter atenção (🟡) ou se está em risco e precisa procurar ajuda (🔴).
      
      Forneça uma breve análise (3-4 frases) com conselhos personalizados com base nas respostas.
      
      Inclua o emoji correspondente (🟢, 🟡 ou 🔴) no início da sua resposta.
      
      Respostas da autoavaliação (escala de 1-5, onde 1 é pior e 5 é melhor):
      ${formattedAnswers}
    `;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        toast({
          title: "Chave de API não configurada",
          description: "Por favor, configure a variável VITE_GEMINI_API_KEY no arquivo .env.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              topK: 32,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const resultText = data.candidates[0].content.parts[0].text.trim();
        setResult(resultText);
        setShowForm(false);
      } else {
        throw new Error("Resposta inesperada da API");
      }
    } catch (error) {
      console.error("Erro ao analisar respostas:", error);
      toast({
        title: "Erro na análise",
        description:
          "Não foi possível processar suas respostas. Verifique se a chave de API está correta e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAnswers(questions.reduce((acc, question) => ({ ...acc, [question.id]: 3 }), {}));
    setResult(null);
    setShowForm(true);
  };

  return (
    <div className="container max-w-3xl">
      {showForm ? (
        <Card className="p-6 bg-white/80 backdrop-blur-sm animate-fade-in">
          <div className="space-y-8">
            {questions.map((question) => (
              <div key={question.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{question.text}</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {answers[question.id]}/5
                  </span>
                </div>
                <div className="px-2">
                  <Slider
                    defaultValue={[3]}
                    max={5}
                    min={1}
                    step={1}
                    value={[answers[question.id]]}
                    onValueChange={(value) => handleSliderChange(question.id, value)}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{question.min}</span>
                    <span>{question.max}</span>
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={analyzeAssessment}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analisando...
                </span>
              ) : (
                "Avaliar Meu Bem-estar"
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="animate-fade-in">
          {result && <AssessmentResult result={result} onReset={resetForm} />}
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;
