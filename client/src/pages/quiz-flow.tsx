import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuizStore } from '@/lib/quiz-store';
import { Layout, Card, Button, Input } from '@/components/ui/layout';
import { RadarAnimation } from '@/components/radar-animation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ChevronRight, MessageCircle, ShieldCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// --- Schemas ---
const captureSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  businessName: z.string().min(2, "Nome do negócio é obrigatório"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
});

// --- Constants ---
const QUESTIONS = [
  {
    id: 'niche',
    question: 'Qual é seu nicho?',
    options: ['Clínica de estética', 'Lash designer', 'Designer de sobrancelhas', 'Massoterapeuta', 'Outro profissional da beleza']
  },
  {
    id: 'weeklyClients',
    question: 'Quantas clientes você atende por semana, em média?',
    options: ['0 a 5', '6 a 10', '11 a 20', '21 a 40', 'Mais de 40']
  },
  {
    id: 'acquisitionChannel',
    question: 'Hoje, como você consegue a maioria das suas clientes?',
    options: ['Indicação', 'Instagram', 'Tráfego pago', 'WhatsApp', 'Promoções e boca a boca']
  },
  {
    id: 'mainDifficulty',
    question: 'Qual é sua maior dificuldade atualmente?',
    options: ['Conseguir mais clientes', 'Manter a agenda cheia', 'Fazer clientes retornarem', 'Vender procedimentos de maior valor', 'Profissionalização do negócio']
  },
  {
    id: 'revenueGoal',
    question: 'Quanto você gostaria de faturar por mês, consistentemente?',
    options: ['R$ 2.000 a R$ 5.000', 'R$ 5.000 a R$ 10.000', 'R$ 10.000 a R$ 20.000', 'Acima de R$ 20.000']
  }
];

// --- Page Components ---

const CaptureStep = () => {
  const startNewLead = useQuizStore((s) => s.startNewLead);
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof captureSchema>>({
    resolver: zodResolver(captureSchema)
  });

  const onSubmit = (data: z.infer<typeof captureSchema>) => {
    startNewLead(data);
  };

  return (
    <Card className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-primary">Análise de Negócio</h1>
        <p className="text-muted-foreground text-sm">
          Antes de começarmos sua análise, preencha seus dados para enviarmos tudo automaticamente.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Nome completo</label>
          <Input {...register('name')} placeholder="Seu nome" className={errors.name ? "border-destructive" : ""} />
          {errors.name && <span className="text-xs text-destructive ml-1">{errors.name.message}</span>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Nome do negócio / empresa</label>
          <Input {...register('businessName')} placeholder="Nome do seu espaço" className={errors.businessName ? "border-destructive" : ""} />
          {errors.businessName && <span className="text-xs text-destructive ml-1">{errors.businessName.message}</span>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">WhatsApp</label>
          <Input {...register('whatsapp')} placeholder="(00) 00000-0000" type="tel" className={errors.whatsapp ? "border-destructive" : ""} />
          {errors.whatsapp && <span className="text-xs text-destructive ml-1">{errors.whatsapp.message}</span>}
        </div>

        <Button type="submit" className="w-full mt-4">
          Iniciar minha análise <ArrowRight className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 mt-4">
          <ShieldCheck className="w-3 h-3" /> Dados 100% seguros e criptografados
        </div>
      </form>
    </Card>
  );
};

const QuizStep = () => {
  const { currentQuestionIndex, nextQuestion, setAnswer, completeQuizForCurrentLead, userData, updateCurrentLeadStatus } = useQuizStore();
  const [animating, setAnimating] = useState(false);
  const { toast } = useToast();

  // Update status to 'quiz_in_progress' if not already
  useEffect(() => {
    if (currentQuestionIndex === 0) {
      updateCurrentLeadStatus('quiz_in_progress');
    }
  }, []);

  // Handle the last special step (WhatsApp confirmation) separately or as index 5
  const isLastStep = currentQuestionIndex === QUESTIONS.length;

  const handleOptionSelect = async (option: string) => {
    if (animating) return;
    setAnimating(true);
    
    const currentQ = QUESTIONS[currentQuestionIndex];
    setAnswer(currentQ.id as any, option);

    // Small delay for user to see selection
    await new Promise(r => setTimeout(r, 400));
    
    setAnimating(false);
    nextQuestion();
  };

  // Final step logic
  const [finalWhatsapp, setFinalWhatsapp] = useState(userData.whatsapp || '');
  const [consent, setConsent] = useState(false);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast({ title: "Erro", description: "Você precisa concordar para continuar.", variant: "destructive" });
      return;
    }
    
    completeQuizForCurrentLead({
      finalWhatsapp,
      consent
    });
  };

  if (isLastStep) {
    return (
      <Card className="animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-primary">Último passo</h2>
            <p className="text-muted-foreground">Quer que a análise seja enviada para qual WhatsApp?</p>
          </div>

          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <Input 
              value={finalWhatsapp} 
              onChange={(e) => setFinalWhatsapp(e.target.value)}
              placeholder="(00) 00000-0000"
            />
            
            <label className="flex items-start gap-3 p-4 bg-background/50 rounded-xl border border-border/50 cursor-pointer hover:bg-background/80 transition-colors">
              <input 
                type="checkbox" 
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 accent-primary"
              />
              <span className="text-sm text-muted-foreground">
                Concordo em receber minha análise e orientações estratégicas pelo WhatsApp.
              </span>
            </label>

            <Button type="submit" disabled={!consent}>
              Gerar meu Radar de Crescimento
            </Button>
          </form>
        </div>
      </Card>
    );
  }

  const question = QUESTIONS[currentQuestionIndex];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 flex justify-between items-center px-2">
        <span className="text-xs font-medium text-primary/60 tracking-widest uppercase">Pergunta {currentQuestionIndex + 1} de {QUESTIONS.length + 1}</span>
        <div className="w-24 h-1 bg-secondary/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${((currentQuestionIndex + 1) / (QUESTIONS.length + 1)) * 100}%` }} 
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <h2 className="text-2xl font-serif font-bold text-primary mb-8 leading-snug">
              {question.question}
            </h2>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className="w-full text-left p-5 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group flex items-center justify-between"
                >
                  <span className="font-medium text-foreground/80 group-hover:text-primary transition-colors">{option}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const RadarStep = () => {
  const updateCurrentLeadStatus = useQuizStore(s => s.updateCurrentLeadStatus);
  
  useEffect(() => {
    updateCurrentLeadStatus('radar_viewed');
  }, []);

  return (
    <Card className="border-primary/10 bg-white/90 backdrop-blur-md">
      <RadarAnimation />
    </Card>
  );
};

const LPStep = () => {
  const updateCurrentLeadStatus = useQuizStore(s => s.updateCurrentLeadStatus);
  
  const handleWhatsappClick = () => {
    updateCurrentLeadStatus('clicked_whatsapp');
    window.open('https://wa.me/5511999999999?text=Olá! Acabei de finalizar minha análise e quero entender como crescimento pode acontecer no meu negócio.', '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4 mb-8">
        <span className="inline-block px-3 py-1 bg-[#9D6135]/10 text-[#9D6135] text-xs font-bold rounded-full uppercase tracking-wider mb-2">
          Análise Concluída
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#232326] leading-tight">
          Seu negócio já tem potencial. <br/>
          <span className="text-[#9D6135]">O que falta são os movimentos certos.</span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xs mx-auto leading-relaxed">
          Identificamos os pontos silenciosos que travam seu crescimento — e também as oportunidades mais rápidas para aumentar sua agenda e faturamento.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { title: "Demanda", desc: "Quão procurada você realmente é?", val: "Alta" },
          { title: "Conversão", desc: "Você transforma interesse em faturamento?", val: "Média" },
          { title: "Recompra", desc: "Clientes voltam? Indicariam você?", val: "Baixa" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-primary">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <div className="px-3 py-1 bg-secondary/20 text-primary-foreground text-xs font-bold rounded-full bg-[#232326]">
              {item.val}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#232326] text-[#F8F7F2] p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden group cursor-pointer" onClick={handleWhatsappClick}>
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         
         <h3 className="text-xl font-serif relative z-10">
           Estamos prontos para te mostrar exatamente onde você está perdendo clientes.
         </h3>
         
         <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-lg shadow-[#25D366]/20 relative z-10 group-hover:scale-105 transition-transform">
           <MessageCircle className="w-5 h-5 mr-2" />
           Falar com a equipe agora
         </Button>
         <p className="text-[10px] text-white/40 relative z-10">
           *Vagas limitadas para análise gratuita
         </p>
      </div>
    </div>
  );
};

export default function QuizFlow() {
  const step = useQuizStore((s) => s.step);

  return (
    <Layout>
      {step === 'capture' && <CaptureStep />}
      {step === 'quiz' && <QuizStep />}
      {step === 'radar' && <RadarStep />}
      {step === 'lp' && <LPStep />}
    </Layout>
  );
}
