import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from './ui/layout';
import { ArrowRight } from 'lucide-react';
import { useQuizStore } from '@/lib/quiz-store';

export const RadarAnimation = () => {
  const [showResults, setShowResults] = useState(false);
  const setStep = useQuizStore((state) => state.setStep);
  const answers = useQuizStore((state) => state.answers);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResults(true);
    }, 1500); // Increased slightly for effect
    return () => clearTimeout(timer);
  }, []);

  // Logic to determine percentages based on answers
  const getAcquisitionScore = () => {
    let score = 30; // Base score

    // Online Presence Impact
    const presence = answers.onlinePresence;
    if (presence?.includes('Forte')) score += 30;
    else if (presence?.includes('Boa')) score += 20;
    else if (presence?.includes('Mediana')) score += 10;
    
    // Paid Traffic Impact
    const traffic = answers.paidTrafficExperience;
    if (traffic?.includes('agência')) score += 25;
    else if (traffic?.includes('anúncios simples')) score += 15;
    else if (traffic?.includes('impulsionei')) score += 10;

    return Math.min(score, 92); // Cap at 92
  };

  const getEfficiencyScore = () => {
    let score = 40;

    // Demand Impact
    const demand = answers.currentDemand;
    if (demand?.includes('Muito alta')) score += 30;
    else if (demand?.includes('Alta')) score += 20;
    else if (demand?.includes('Média')) score += 10;

    // Difficulty Penalty
    const difficulty = answers.mainDifficulty;
    if (difficulty === 'Vender procedimentos de maior valor') score -= 10;
    if (difficulty === 'Profissionalização do negócio') score -= 5;

    return Math.min(Math.max(score, 30), 85);
  };

  const scores = {
    growth: 94, // High potential always
    acquisition: getAcquisitionScore(),
    efficiency: getEfficiencyScore(),
  };

  if (!showResults) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <p className="text-lg text-muted-foreground font-serif animate-pulse">Calculando seu potencial real...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-serif text-primary font-bold">Seu Radar de Crescimento está pronto.</h2>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
          Com base nas suas respostas e em milhares de profissionais avaliadas, identificamos os três pontos centrais que determinam seu crescimento.
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Potencial */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold text-foreground/80">
            <span>Potencial de Crescimento</span>
            <span className="text-primary">{scores.growth}%</span>
          </div>
          <div className="h-3 bg-secondary/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${scores.growth}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Seu potencial é <strong className="text-primary">ALTO</strong>. Você já tem a base — só precisa ajustar seus pontos estratégicos para acelerar.
          </p>
        </div>

        {/* 2. Captação */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold text-foreground/80">
            <span>Captação & Presença Digital</span>
            <span className="text-[#B08D55]">{scores.acquisition}%</span>
          </div>
          <div className="h-3 bg-secondary/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${scores.acquisition}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-[#B08D55] rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {scores.acquisition < 50 
              ? "Sua presença digital ainda não reflete a qualidade do seu trabalho. Com ajustes certos, sua atração de clientes pode triplicar."
              : "Você tem uma base digital, mas ainda não extrai o máximo dela. É possível automatizar e escalar ainda mais."}
          </p>
        </div>

        {/* 3. Eficiência */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold text-foreground/80">
            <span>Eficiência Comercial</span>
            <span className="text-foreground/60">{scores.efficiency}%</span>
          </div>
          <div className="h-3 bg-secondary/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${scores.efficiency}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
              className="h-full bg-foreground/60 rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Grande parte do lucro está escapando no processo comercial. E isso é exatamente o que resolvemos para você.
          </p>
        </div>
      </div>

      <div className="pt-6">
        <Button 
          onClick={() => setStep('lp')}
          className="bg-[#CDA580] hover:bg-[#C0956E] text-[#232326] shadow-xl hover:shadow-2xl transform transition-all hover:-translate-y-1"
        >
          Mostrar pontos que travam meu crescimento <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
