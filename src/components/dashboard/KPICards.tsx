import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, TrendingUp, DollarSign, Clock, Award, Heart, Building } from "lucide-react";

interface LeadData {
  id: number;
  nome: string | null;
  email: string | null;
  source: string | null;
  campanha: string | null;
  PossuiPlanoDeSaude: string | null;
  PlanoParaVoceFamiliaEmpresa: string | null;
  Idade: string | null;
  Especialista: string | null;
  Resumo: string | null;
  Whatsapp_corretor: string | null;
  created_at: string;
}

interface KPICardsProps {
  leads: LeadData[];
}

export const KPICards = ({ leads }: KPICardsProps) => {
  // Métricas básicas
  const totalLeads = leads.length;
  const leadsComPlano = leads.filter(l => l.PossuiPlanoDeSaude === 'Sim').length;
  const taxaConversao = totalLeads > 0 ? ((leadsComPlano / totalLeads) * 100).toFixed(1) : '0';
  
  // Métricas avançadas
  const campanhasAtivas = new Set(leads.map(l => l.campanha).filter(Boolean)).size;
  const leadsHoje = leads.filter(l => {
    const hoje = new Date().toDateString();
    const leadDate = new Date(l.created_at).toDateString();
    return hoje === leadDate;
  }).length;
  
  const corretoresAtivos = new Set(leads.map(l => l.Whatsapp_corretor).filter(Boolean)).size;
  
  // Lead Score médio (simulado baseado em critérios)
  const leadScoreMedio = leads.reduce((acc, lead) => {
    let score = 0;
    if (lead.PossuiPlanoDeSaude === 'Não') score += 30;
    if (lead.PlanoParaVoceFamiliaEmpresa === 'Empresarial') score += 25;
    if (lead.source === 'Indicação Médica') score += 20;
    if (lead.email) score += 15;
    if (lead.Whatsapp_corretor) score += 10;
    return acc + score;
  }, 0) / totalLeads;

  // Taxa de engajamento (leads com WhatsApp)
  const taxaEngajamento = totalLeads > 0 ? 
    ((leads.filter(l => l.Whatsapp_corretor).length / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-chart-primary bg-gradient-to-r from-chart-primary/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
          <Users className="h-4 w-4" style={{ color: 'hsl(var(--chart-primary))' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-primary">{totalLeads}</div>
          <p className="text-xs text-muted-foreground">
            +{leadsHoje} hoje
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-chart-secondary bg-gradient-to-r from-chart-secondary/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Com Plano de Saúde</CardTitle>
          <Heart className="h-4 w-4" style={{ color: 'hsl(var(--chart-secondary))' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-secondary">{leadsComPlano}</div>
          <p className="text-xs text-muted-foreground">
            {taxaConversao}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-chart-accent bg-gradient-to-r from-chart-accent/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lead Score Médio</CardTitle>
          <Award className="h-4 w-4" style={{ color: 'hsl(var(--chart-accent))' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-accent">{leadScoreMedio.toFixed(0)}</div>
          <div className="text-xs text-muted-foreground">
            <Badge variant={leadScoreMedio > 50 ? "default" : "secondary"}>
              {leadScoreMedio > 50 ? "Alto" : "Médio"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-chart-warning bg-gradient-to-r from-chart-warning/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
          <TrendingUp className="h-4 w-4" style={{ color: 'hsl(var(--chart-warning))' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-warning">{taxaEngajamento}%</div>
          <p className="text-xs text-muted-foreground">
            WhatsApp disponível
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-chart-info bg-gradient-to-r from-chart-info/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
          <DollarSign className="h-4 w-4" style={{ color: 'hsl(var(--chart-info))' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-info">{campanhasAtivas}</div>
          <p className="text-xs text-muted-foreground">
            Canais de aquisição
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-chart-error bg-gradient-to-r from-chart-error/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Corretores</CardTitle>
          <Building className="h-4 w-4" style={{ color: 'hsl(var(--chart-error))' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-error">{corretoresAtivos}</div>
          <p className="text-xs text-muted-foreground">
            Profissionais ativos
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-chart-primary bg-gradient-to-r from-chart-primary/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Leads Hoje</CardTitle>
          <Clock className="h-4 w-4" style={{ color: 'hsl(var(--chart-primary))' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-primary">{leadsHoje}</div>
          <p className="text-xs text-muted-foreground">
            Últimas 24h
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-chart-secondary bg-gradient-to-r from-chart-secondary/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
          <Target className="h-4 w-4" style={{ color: 'hsl(var(--chart-secondary))' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-secondary">{totalLeads - leadsComPlano}</div>
          <p className="text-xs text-muted-foreground">
            Sem plano atual
          </p>
        </CardContent>
      </Card>
    </div>
  );
};