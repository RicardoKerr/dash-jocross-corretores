import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target } from "lucide-react";

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

interface InsightsPanelProps {
  leads: LeadData[];
}

export const InsightsPanel = ({ leads }: InsightsPanelProps) => {
  // Análise de insights automáticos
  const generateInsights = () => {
    const insights = [];
    
    // Insight sobre melhor campanha
    const campaignStats = leads.reduce((acc, lead) => {
      const campaign = lead.campanha || 'Não informado';
      if (!acc[campaign]) acc[campaign] = { total: 0, converted: 0 };
      acc[campaign].total += 1;
      if (lead.PossuiPlanoDeSaude === 'Sim') acc[campaign].converted += 1;
      return acc;
    }, {} as Record<string, { total: number; converted: number }>);
    
    const bestCampaign = Object.entries(campaignStats)
      .map(([name, data]) => ({
        name,
        rate: data.total > 0 ? (data.converted / data.total) : 0,
        total: data.total
      }))
      .filter(c => c.total >= 5)
      .sort((a, b) => b.rate - a.rate)[0];
    
    if (bestCampaign) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Melhor Performance',
        description: `${bestCampaign.name} tem a melhor taxa de conversão (${(bestCampaign.rate * 100).toFixed(1)}%)`,
        recommendation: 'Considere aumentar o investimento nesta campanha'
      });
    }
    
    // Insight sobre horário
    const hourlyStats = leads.reduce((acc, lead) => {
      const hour = new Date(lead.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const peakHour = Object.entries(hourlyStats)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (peakHour) {
      insights.push({
        type: 'info',
        icon: Target,
        title: 'Horário de Pico',
        description: `${peakHour[0]}h é o horário com mais leads (${peakHour[1]} leads)`,
        recommendation: 'Otimize campanhas para este horário'
      });
    }
    
    // Insight sobre faixa etária
    const ageStats = leads.reduce((acc, lead) => {
      const age = lead.Idade || 'Não informado';
      if (!acc[age]) acc[age] = { total: 0, converted: 0 };
      acc[age].total += 1;
      if (lead.PossuiPlanoDeSaude === 'Sim') acc[age].converted += 1;
      return acc;
    }, {} as Record<string, { total: number; converted: number }>);
    
    const bestAge = Object.entries(ageStats)
      .map(([name, data]) => ({
        name,
        rate: data.total > 0 ? (data.converted / data.total) : 0,
        total: data.total
      }))
      .filter(c => c.total >= 3)
      .sort((a, b) => b.rate - a.rate)[0];
    
    if (bestAge) {
      insights.push({
        type: 'info',
        icon: Lightbulb,
        title: 'Perfil Ideal',
        description: `Faixa etária ${bestAge.name} tem alta conversão (${(bestAge.rate * 100).toFixed(1)}%)`,
        recommendation: 'Crie campanhas específicas para este perfil'
      });
    }
    
    // Alerta sobre leads sem WhatsApp
    const leadsWithoutWhatsApp = leads.filter(l => !l.Whatsapp_corretor).length;
    const percentWithoutWhatsApp = (leadsWithoutWhatsApp / leads.length) * 100;
    
    if (percentWithoutWhatsApp > 20) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Oportunidade Perdida',
        description: `${percentWithoutWhatsApp.toFixed(1)}% dos leads não têm WhatsApp`,
        recommendation: 'Implemente coleta obrigatória de WhatsApp'
      });
    }
    
    // Insight sobre especialistas
    const specialistStats = leads.reduce((acc, lead) => {
      const specialist = lead.Especialista || 'Não atribuído';
      acc[specialist] = (acc[specialist] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topSpecialist = Object.entries(specialistStats)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topSpecialist) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Especialista Destaque',
        description: `${topSpecialist[0]} atendeu ${topSpecialist[1]} leads`,
        recommendation: 'Analise as práticas deste especialista'
      });
    }
    
    return insights;
  };
  
  const insights = generateInsights();
  
  // Recomendações estratégicas
  const strategicRecommendations = [
    {
      title: "Otimização de Campanhas",
      items: [
        "Concentre investimentos nas campanhas com maior ROI",
        "Teste campanhas em horários de menor volume",
        "Implemente remarketing para leads não convertidos"
      ]
    },
    {
      title: "Melhoria de Processos",
      items: [
        "Automatize follow-up via WhatsApp",
        "Crie scripts personalizados por faixa etária",
        "Implemente lead scoring automático"
      ]
    },
    {
      title: "Análise de Dados",
      items: [
        "Configure alertas para quedas de conversão",
        "Monitore sazonalidade dos leads",
        "Analise correlação entre especialista e conversão"
      ]
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Insights Automáticos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Insights Automáticos
          </CardTitle>
          <CardDescription>Análises inteligentes baseadas nos dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <Alert key={index} className="border-l-4 border-l-primary">
              <insight.icon className="h-4 w-4" />
              <div>
                <div className="font-semibold flex items-center gap-2">
                  {insight.title}
                  <Badge variant={insight.type === 'success' ? 'default' : 
                                 insight.type === 'warning' ? 'destructive' : 'secondary'}>
                    {insight.type === 'success' ? 'Positivo' : 
                     insight.type === 'warning' ? 'Atenção' : 'Info'}
                  </Badge>
                </div>
                <AlertDescription className="mt-1">
                  <div>{insight.description}</div>
                  <div className="mt-2 text-sm font-medium text-primary">
                    💡 {insight.recommendation}
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>
      
      {/* Recomendações Estratégicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategicRecommendations.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};