import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from "recharts";

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

interface AdvancedChartsProps {
  leads: LeadData[];
}

export const AdvancedCharts = ({ leads }: AdvancedChartsProps) => {
  const chartConfig = {
    value: {
      label: "Quantidade",
      color: "hsl(var(--primary))",
    },
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  // Análise por hora do dia
  const hourlyData = leads.reduce((acc, lead) => {
    const hour = new Date(lead.created_at).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const hourlyChartData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    value: hourlyData[hour] || 0,
  }));

  // Análise por dia da semana
  const weeklyData = leads.reduce((acc, lead) => {
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const day = dayNames[new Date(lead.created_at).getDay()];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weeklyChartData = Object.entries(weeklyData).map(([name, value]) => ({
    name,
    value,
  }));

  // Análise de tendência temporal (últimos 30 dias)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const trendData = last30Days.map(date => {
    const count = leads.filter(lead => 
      lead.created_at.split('T')[0] === date
    ).length;
    
    return {
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      leads: count,
      conversion: leads.filter(lead => 
        lead.created_at.split('T')[0] === date && lead.PossuiPlanoDeSaude === 'Sim'
      ).length,
    };
  });

  // Ranking de campanhas por performance
  const campaignPerformance = leads.reduce((acc, lead) => {
    const campaign = lead.campanha || 'Não informado';
    if (!acc[campaign]) {
      acc[campaign] = { total: 0, converted: 0 };
    }
    acc[campaign].total += 1;
    if (lead.PossuiPlanoDeSaude === 'Sim') {
      acc[campaign].converted += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; converted: number }>);

  const campaignRanking = Object.entries(campaignPerformance)
    .map(([name, data]) => ({
      name,
      total: data.total,
      converted: data.converted,
      rate: data.total > 0 ? (data.converted / data.total * 100).toFixed(1) : '0',
    }))
    .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
    .slice(0, 8);

  // Distribuição por faixa etária vs conversão
  const ageConversionData = leads.reduce((acc, lead) => {
    const age = lead.Idade || 'Não informado';
    if (!acc[age]) {
      acc[age] = { total: 0, converted: 0 };
    }
    acc[age].total += 1;
    if (lead.PossuiPlanoDeSaude === 'Sim') {
      acc[age].converted += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; converted: number }>);

  const ageChartData = Object.entries(ageConversionData).map(([name, data]) => ({
    name,
    total: data.total,
    converted: data.converted,
    rate: data.total > 0 ? (data.converted / data.total * 100) : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Tendência Temporal */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Leads - Últimos 30 Dias</CardTitle>
          <CardDescription>Evolução diária de leads e conversões</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="conversion" 
                  stackId="2"
                  stroke="hsl(var(--secondary))" 
                  fill="hsl(var(--secondary))" 
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Análise por Hora */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Hora do Dia</CardTitle>
            <CardDescription>Padrão de comportamento dos leads</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Análise por Dia da Semana */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Dia da Semana</CardTitle>
            <CardDescription>Performance semanal</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Ranking de Campanhas */}
        <Card>
          <CardHeader>
            <CardTitle>Performance por Campanha</CardTitle>
            <CardDescription>Taxa de conversão por campanha</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignRanking} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="hsl(var(--muted))" />
                  <Bar dataKey="converted" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Análise por Idade vs Conversão */}
        <Card>
          <CardHeader>
            <CardTitle>Conversão por Faixa Etária</CardTitle>
            <CardDescription>Performance por grupo demográfico</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="hsl(var(--muted))" />
                  <Bar dataKey="converted" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};