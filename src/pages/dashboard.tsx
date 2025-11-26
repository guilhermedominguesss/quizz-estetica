import { useState } from 'react';
import { Layout, Card } from '@/components/ui/layout';
import { useQuizStore } from '@/lib/quiz-store';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Users, MousePointer, MessageSquare, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  // Real data from store
  const leads = useQuizStore(s => s.leads);
  const resetAdminStats = useQuizStore(s => s.resetAdminStats);

  // Derived Metrics
  const totalLeads = leads.length;
  const completedQuiz = leads.filter(l => l.status === 'quiz_completed' || l.status === 'radar_viewed' || l.status === 'clicked_whatsapp').length;
  const reachedRadar = leads.filter(l => l.status === 'radar_viewed' || l.status === 'clicked_whatsapp').length;
  const clickedWhatsapp = leads.filter(l => l.status === 'clicked_whatsapp').length;

  const completionRate = totalLeads > 0 ? Math.round((completedQuiz / totalLeads) * 100) : 0;
  const radarConversion = totalLeads > 0 ? Math.round((reachedRadar / totalLeads) * 100) : 0;
  const whatsappConversion = reachedRadar > 0 ? Math.round((clickedWhatsapp / reachedRadar) * 100) : 0;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja zerar todos os dados? Isso não pode ser desfeito.')) {
      resetAdminStats();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-primary">Área Restrita</h1>
            <p className="text-sm text-muted-foreground">Acesso administrativo</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="password" 
              placeholder="Senha de acesso" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Entrar</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Dashboard de Performance</h1>
            <p className="text-muted-foreground">Acompanhamento em tempo real do funil</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="text-destructive border-destructive/20 hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Zerar Dados
            </Button>
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>Sair</Button>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="w-4 h-4" /> Leads Totais
            </div>
            <p className="text-3xl font-bold text-foreground">{totalLeads}</p>
            <span className="text-xs text-muted-foreground font-medium">Iniciaram o fluxo</span>
          </Card>
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MousePointer className="w-4 h-4" /> Taxa de Finalização
            </div>
            <p className="text-3xl font-bold text-foreground">{completionRate}%</p>
            <span className="text-xs text-muted-foreground">{completedQuiz} finalizaram o quiz</span>
          </Card>
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <BarChart className="w-4 h-4" /> Chegaram no Radar
            </div>
            <p className="text-3xl font-bold text-foreground">{reachedRadar}</p>
            <span className="text-xs text-green-600 font-medium">{radarConversion}% do total</span>
          </Card>
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MessageSquare className="w-4 h-4" /> Cliques no WhatsApp
            </div>
            <p className="text-3xl font-bold text-primary">{clickedWhatsapp}</p>
            <span className="text-xs text-primary/80 font-medium">{whatsappConversion}% dos que viram radar</span>
          </Card>
        </div>

        {/* Leads Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-serif font-bold text-xl">Últimos Leads</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Negócio</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhum dado capturado. Zere o dashboard e inicie um teste.
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.slice().reverse().map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{lead.userData.name}</TableCell>
                      <TableCell>{lead.userData.businessName}</TableCell>
                      <TableCell>{lead.userData.whatsapp}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-bold",
                          lead.status === 'clicked_whatsapp' ? "bg-green-100 text-green-700" :
                          lead.status === 'radar_viewed' ? "bg-blue-100 text-blue-700" :
                          lead.status === 'quiz_completed' ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        )}>
                          {lead.status === 'clicked_whatsapp' ? 'Clicou no WhatsApp' :
                           lead.status === 'radar_viewed' ? 'Viu Radar' :
                           lead.status === 'quiz_completed' ? 'Respondeu Quiz' :
                           'Iniciou'}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(lead.createdAt), "dd/MM HH:mm", { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
