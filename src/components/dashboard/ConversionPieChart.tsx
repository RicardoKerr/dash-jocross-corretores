import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface LeadData {
  status_conversa?: string;
  corretor_responsavel?: string;
}

interface ConversionPieChartProps {
  leads: LeadData[];
  groupBy: 'status' | 'corretor';
}

export const ConversionPieChart = ({ leads, groupBy }: ConversionPieChartProps) => {
  const getChartData = () => {
    if (groupBy === 'status') {
      const statusCounts = leads.reduce((acc, lead) => {
        const status = lead.status_conversa || 'Não definido';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(statusCounts).map(([name, value], index) => ({
        name,
        value,
        color: getStatusColor(name, index)
      }));
    } else {
      const corretorCounts = leads.reduce((acc, lead) => {
        const corretor = lead.corretor_responsavel || 'Não atribuído';
        acc[corretor] = (acc[corretor] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(corretorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8) // Top 8 corretores
        .map(([name, value], index) => ({
          name: name.split(' - ')[0] || name, // Pega só o nome sem a especialidade
          value,
          color: getCorretorColor(index)
        }));
    }
  };

  const getStatusColor = (status: string, index: number) => {
    const colors = {
      "Interessado": "hsl(var(--chart-primary))",
      "Negociando": "hsl(var(--chart-warning))",
      "Proposta Enviada": "hsl(var(--chart-accent))",
      "Aguardando Documentos": "hsl(var(--chart-info))",
      "Fechado": "hsl(var(--chart-secondary))",
      "Perdido": "hsl(var(--chart-error))",
      "Não definido": "hsl(var(--muted-foreground))"
    };
    return colors[status] || `hsl(var(--chart-${index % 4 === 0 ? 'purple' : index % 4 === 1 ? 'pink' : index % 4 === 2 ? 'teal' : 'orange'}))`;
  };

  const getCorretorColor = (index: number) => {
    const colors = [
      "hsl(var(--chart-primary))",
      "hsl(var(--chart-secondary))",
      "hsl(var(--chart-accent))",
      "hsl(var(--chart-warning))",
      "hsl(var(--chart-purple))",
      "hsl(var(--chart-pink))",
      "hsl(var(--chart-teal))",
      "hsl(var(--chart-orange))"
    ];
    return colors[index] || `hsl(var(--chart-info))`;
  };

  const chartData = getChartData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Não mostra label para fatias muito pequenas
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {groupBy === 'status' ? 'Distribuição por Status' : 'Performance por Corretor'}
        </CardTitle>
        <CardDescription>
          {groupBy === 'status' 
            ? 'Visualização da distribuição de leads por status da conversa'
            : 'Leads atribuídos por corretor (Top 8)'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer 
            config={{}} 
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const percentage = ((data.value / total) * 100).toFixed(1);
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.value} leads ({percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span className="text-sm" style={{ color: entry.color }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            <p>Nenhum dado disponível para exibir</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};