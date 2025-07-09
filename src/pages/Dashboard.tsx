import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, RefreshCw, Database, BarChart3, Lightbulb } from "lucide-react";
import { KPICards } from "@/components/dashboard/KPICards";
import { AdvancedCharts } from "@/components/dashboard/AdvancedCharts";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { ConversionFunnel } from "@/components/dashboard/ConversionFunnel";
import { ConversionPieChart } from "@/components/dashboard/ConversionPieChart";
import { LeadSummaryModal } from "@/components/dashboard/LeadSummaryModal";
import { generateSyntheticData, insertSyntheticData } from "@/services/syntheticDataService";

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
  status_conversa?: string;
  corretor_responsavel?: string;
  resumo_detalhado?: string;
  data_ultima_interacao?: string;
}

const Dashboard = () => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const { isAdmin } = useAuth();
  
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCorretores, setSelectedCorretores] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jocrosscorretores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
      setFilteredLeads(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = async () => {
    try {
      setGenerating(true);
      toast({
        title: "Gerando dados...",
        description: "Criando 150 leads sintéticos para análise",
      });

      const syntheticLeads = generateSyntheticData(150);
      await insertSyntheticData(syntheticLeads);
      
      await fetchLeads();
      
      toast({
        title: "Dados gerados com sucesso!",
        description: "150 leads sintéticos foram criados para análise",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar os dados sintéticos",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCampaigns.length > 0) {
      filtered = filtered.filter(lead => 
        lead.campanha && selectedCampaigns.includes(lead.campanha)
      );
    }


    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(lead => 
        lead.status_conversa && selectedStatuses.includes(lead.status_conversa)
      );
    }

    if (selectedCorretores.length > 0) {
      filtered = filtered.filter(lead => 
        lead.Whatsapp_corretor && selectedCorretores.includes(lead.Whatsapp_corretor)
      );
    }

    setFilteredLeads(filtered);
  }, [searchTerm, selectedCampaigns, selectedStatuses, selectedCorretores, leads]);

  const campaigns = [...new Set(leads.map(l => l.campanha).filter(Boolean))];
  
  const statuses = [...new Set(leads.map(l => l.status_conversa).filter(Boolean))];
  const corretores = [...new Set(leads.map(l => l.Whatsapp_corretor).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Profissional de Corretores</h1>
              <p className="text-muted-foreground">Análise avançada de leads com insights inteligentes</p>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Button 
                  onClick={generateSampleData} 
                  variant="outline"
                  disabled={generating}
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  {generating ? "Gerando..." : "Gerar Dados"}
                </Button>
              )}
              <Button 
                onClick={fetchLeads} 
                variant="outline"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </div>

        {/* KPIs Avançados */}
        <KPICards leads={filteredLeads} />

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <MultiSelect
                options={campaigns}
                selectedValues={selectedCampaigns}
                onValueChange={setSelectedCampaigns}
                placeholder="Campanha"
                className="w-full md:w-[200px]"
              />
              <MultiSelect
                options={statuses}
                selectedValues={selectedStatuses}
                onValueChange={setSelectedStatuses}
                placeholder="Status"
                className="w-full md:w-[180px]"
              />
              <MultiSelect
                options={corretores}
                selectedValues={selectedCorretores}
                onValueChange={setSelectedCorretores}
                placeholder="Corretor"
                className="w-full md:w-[180px]"
              />
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCampaigns([]);
                  setSelectedStatuses([]);
                  setSelectedCorretores([]);
                }}
              >
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs com conteúdo */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Análises Avançadas
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="leads">Lista de Leads</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Funil de Conversão */}
            <ConversionFunnel leads={filteredLeads} />
            
            {/* Gráficos de Conversão */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConversionPieChart leads={filteredLeads} groupBy="status" />
              <ConversionPieChart leads={filteredLeads} groupBy="corretor" />
            </div>
            
            {/* Gráficos Básicos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Campanha</CardTitle>
                  <CardDescription>Leads por campanha de marketing</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ value: { label: "Quantidade", color: "hsl(var(--primary))" } }} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                           data={Object.entries(filteredLeads.reduce((acc, lead) => {
                             const campaign = lead.campanha || 'Não informado';
                             acc[campaign] = (acc[campaign] || 0) + 1;
                             return acc;
                           }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }))}
                           cx="50%"
                           cy="50%"
                           outerRadius={80}
                           fill="hsl(var(--primary))"
                           dataKey="value"
                           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {Object.entries(filteredLeads.reduce((acc, lead) => {
                              const campaign = lead.campanha || 'Não informado';
                              acc[campaign] = (acc[campaign] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={[
                                'hsl(var(--chart-primary))', 
                                'hsl(var(--chart-secondary))', 
                                'hsl(var(--chart-accent))', 
                                'hsl(var(--chart-warning))',
                                'hsl(var(--chart-info))',
                                'hsl(var(--chart-error))'
                              ][index % 6]} />
                            ))}
                         </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status do Plano de Saúde</CardTitle>
                  <CardDescription>Distribuição de leads por status do plano</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ value: { label: "Quantidade", color: "hsl(var(--primary))" } }} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={[
                         { name: 'Com Plano', value: filteredLeads.filter(l => l.PossuiPlanoDeSaude === 'Sim').length, fill: 'hsl(var(--chart-secondary))' },
                         { name: 'Sem Plano', value: filteredLeads.filter(l => l.PossuiPlanoDeSaude === 'Não').length, fill: 'hsl(var(--chart-error))' },
                         { name: 'Não Informado', value: filteredLeads.filter(l => !l.PossuiPlanoDeSaude || l.PossuiPlanoDeSaude === '').length, fill: 'hsl(var(--chart-warning))' }
                      ]}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <ChartTooltip content={<ChartTooltipContent />} />
                         <Bar dataKey="value">
                           {[
                             { name: 'Com Plano', value: filteredLeads.filter(l => l.PossuiPlanoDeSaude === 'Sim').length, fill: 'hsl(var(--chart-secondary))' },
                             { name: 'Sem Plano', value: filteredLeads.filter(l => l.PossuiPlanoDeSaude === 'Não').length, fill: 'hsl(var(--chart-error))' },
                             { name: 'Não Informado', value: filteredLeads.filter(l => !l.PossuiPlanoDeSaude || l.PossuiPlanoDeSaude === '').length, fill: 'hsl(var(--chart-warning))' }
                           ].map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.fill} />
                           ))}
                         </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <AdvancedCharts leads={filteredLeads} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <InsightsPanel leads={filteredLeads} />
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Leads ({filteredLeads.length})</CardTitle>
                <CardDescription>Visualização detalhada dos leads cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                     <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Corretor</TableHead>
                        <TableHead>Campanha</TableHead>
                        <TableHead>Tem Plano</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.nome || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.status_conversa || 'N/A'}</Badge>
                          </TableCell>
                          <TableCell>{lead.Whatsapp_corretor || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.campanha || 'N/A'}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={lead.PossuiPlanoDeSaude === 'Sim' ? 'default' : 'secondary'}
                            >
                              {lead.PossuiPlanoDeSaude || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedLead(lead);
                                setIsModalOpen(true);
                              }}
                            >
                              Ver Resumo
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
      
      {/* Modal para exibir detalhes do lead */}
      <LeadSummaryModal 
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
};

export default Dashboard;