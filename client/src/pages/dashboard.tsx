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
import { BarChart, Users, MousePointer, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  // Mock Data derived from store for demo purposes
  // In a real app, this would come from a backend API
  const userData = useQuizStore(s => s.userData);
  const metrics = useQuizStore(s => s.metrics);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
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
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Dashboard de Performance</h1>
            <p className="text-muted-foreground">Acompanhamento em tempo real do funil</p>
          </div>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)}>Sair</Button>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="w-4 h-4" /> Leads Totais
            </div>
            <p className="text-3xl font-bold text-foreground">124</p>
            <span className="text-xs text-green-600 font-medium">+12% hoje</span>
          </Card>
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MousePointer className="w-4 h-4" /> Taxa de Finalização
            </div>
            <p className="text-3xl font-bold text-foreground">68%</p>
            <span className="text-xs text-muted-foreground">Média da semana</span>
          </Card>
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <BarChart className="w-4 h-4" /> Chegaram no Radar
            </div>
            <p className="text-3xl font-bold text-foreground">85</p>
            <span className="text-xs text-green-600 font-medium">Alta conversão</span>
          </Card>
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MessageSquare className="w-4 h-4" /> Cliques no WhatsApp
            </div>
            <p className="text-3xl font-bold text-primary">42</p>
            <span className="text-xs text-primary/80 font-medium">33% de conversão final</span>
          </Card>
        </div>

        {/* Leads Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-serif font-bold text-xl">Últimos Leads</h3>
          </div>
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
              {userData.name ? (
                <TableRow>
                  <TableCell className="font-medium">{userData.name}</TableCell>
                  <TableCell>{userData.businessName}</TableCell>
                  <TableCell>{userData.whatsapp}</TableCell>
                  <TableCell><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Finalizado</span></TableCell>
                  <TableCell>Hoje, 10:42</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Nenhum dado recente capturado nesta sessão.
                  </TableCell>
                </TableRow>
              )}
              {/* Mock Rows */}
              <TableRow className="opacity-60">
                <TableCell className="font-medium">Fernanda Silva</TableCell>
                <TableCell>Studio Beauty</TableCell>
                <TableCell>(11) 99999-8888</TableCell>
                <TableCell><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Em andamento</span></TableCell>
                <TableCell>Hoje, 09:15</TableCell>
              </TableRow>
              <TableRow className="opacity-60">
                <TableCell className="font-medium">Juliana Costa</TableCell>
                <TableCell>Ju Costa Lashes</TableCell>
                <TableCell>(21) 98888-7777</TableCell>
                <TableCell><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Finalizado</span></TableCell>
                <TableCell>Ontem, 18:30</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
