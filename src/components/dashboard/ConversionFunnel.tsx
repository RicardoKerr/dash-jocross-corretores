import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Users, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface LeadData {
  status_conversa?: string;
  corretor_responsavel?: string;
}

interface ConversionFunnelProps {
  leads: LeadData[];
}

export const ConversionFunnel = ({ leads }: ConversionFunnelProps) => {
  const statusOrder = ["Interessado", "Negociando", "Proposta Enviada", "Aguardando Documentos", "Fechado", "Perdido"];
  
  const getStatusData = () => {
    const statusCount = statusOrder.reduce((acc, status) => {
      acc[status] = leads.filter(lead => lead.status_conversa === status).length;
      return acc;
    }, {} as Record<string, number>);

    const total = leads.length;
    
    return statusOrder.map((status, index) => {
      const count = statusCount[status] || 0;
      const percentage = total > 0 ? ((count / total) * 100) : 0;
      const prevCount = index > 0 ? (statusCount[statusOrder[index - 1]] || 0) : total;
      const conversionRate = prevCount > 0 ? ((count / prevCount) * 100) : 0;
      
      return {
        status,
        count,
        percentage: percentage.toFixed(1),
        conversionRate: conversionRate.toFixed(1),
        color: getStatusColor(status),
        icon: getStatusIcon(status)
      };
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      "Interessado": "hsl(var(--chart-primary))",
      "Negociando": "hsl(var(--chart-warning))",
      "Proposta Enviada": "hsl(var(--chart-accent))",
      "Aguardando Documentos": "hsl(var(--chart-info))",
      "Fechado": "hsl(var(--chart-secondary))",
      "Perdido": "hsl(var(--chart-error))"
    };
    return colors[status] || "hsl(var(--muted))";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      "Interessado": Users,
      "Negociando": TrendingUp,
      "Proposta Enviada": AlertCircle,
      "Aguardando Documentos": AlertCircle,
      "Fechado": CheckCircle,
      "Perdido": XCircle
    };
    return icons[status] || Users;
  };

  const statusData = getStatusData();
  const totalClosed = leads.filter(lead => lead.status_conversa === "Fechado").length;
  const totalLost = leads.filter(lead => lead.status_conversa === "Perdido").length;
  const overallConversion = leads.length > 0 ? ((totalClosed / leads.length) * 100).toFixed(1) : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Funil de Conversão
        </CardTitle>
        <CardDescription>
          Acompanhe o progresso dos leads através do pipeline de vendas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Métricas gerais */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{totalClosed}</div>
              <div className="text-sm text-muted-foreground">Fechados</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-destructive">{totalLost}</div>
              <div className="text-sm text-muted-foreground">Perdidos</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">{overallConversion}%</div>
              <div className="text-sm text-muted-foreground">Conversão Geral</div>
            </div>
          </div>

          {/* Funil visual */}
          <div className="space-y-3">
            {statusData.map((stage, index) => {
              const IconComponent = stage.icon;
              const maxWidth = Math.max(20, parseFloat(stage.percentage));
              
              return (
                <div key={stage.status} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" style={{ color: stage.color }} />
                      <span className="font-medium">{stage.status}</span>
                      <Badge variant="outline">{stage.count}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{stage.percentage}% do total</span>
                      {index > 0 && (
                        <span className="text-xs">
                          ({stage.conversionRate}% conv.)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-3 relative overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${maxWidth}%`,
                        backgroundColor: stage.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};