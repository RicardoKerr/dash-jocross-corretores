import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, TrendingUp, LogIn } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Sistema de Análise de Corretores
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Dashboard profissional para análise de leads, performance de campanhas e gestão de corretores de seguros
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 py-3 gap-2">
              <LogIn className="h-5 w-5" />
              Fazer Login
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 gap-2">
              <BarChart className="h-5 w-5" />
              Ver Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Funcionalidades Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Gestão de Leads
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os leads captados pelas campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Filtros avançados por campanha e especialista</li>
                <li>• Busca por nome e email</li>
                <li>• Visualização em tabela detalhada</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Análise Visual
              </CardTitle>
              <CardDescription>
                Gráficos interativos para análise de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Distribuição por campanhas</li>
                <li>• Status de planos de saúde</li>
                <li>• Análise demográfica por idade</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                KPIs e Métricas
              </CardTitle>
              <CardDescription>
                Indicadores chave de performance em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Total de leads captados</li>
                <li>• Taxa de conversão</li>
                <li>• Performance por campanha</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
