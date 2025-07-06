import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface LeadData {
  id: number;
  nome: string | null;
  campanha: string | null;
  created_at: string;
}

interface BrazilMapProps {
  leads: LeadData[];
}

interface StateData {
  name: string;
  code: string;
  campaigns: Record<string, number>;
  total: number;
  cities: Record<string, number>;
}

export const BrazilMap = ({ leads }: BrazilMapProps) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Simulação de dados geográficos baseados nas campanhas
  const stateMapping = {
    'Instagram Julho 2025': ['SP', 'RJ', 'MG', 'RS'],
    'Facebook Saúde': ['SP', 'RJ', 'BA', 'PR'],
    'YouTube Educativo': ['SP', 'MG', 'SC', 'GO'],
    'WhatsApp Direct': ['RJ', 'SP', 'PE', 'CE'],
    'Indicação Médica': ['SP', 'RJ', 'MG', 'BA'],
    'Google Ads Família': ['SP', 'RJ', 'PR', 'RS'],
    'LinkedIn Empresarial': ['SP', 'RJ', 'MG', 'DF'],
    'TikTok Jovens': ['SP', 'RJ', 'BA', 'PE'],
    'Parceria Farmácia': ['MG', 'SP', 'GO', 'MT'],
    'Email Marketing': ['SP', 'RJ', 'RS', 'SC']
  };

  const cityMapping = {
    'SP': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'],
    'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Nova Iguaçu'],
    'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora'],
    'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Santa Maria'],
    'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari'],
    'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa'],
    'SC': ['Florianópolis', 'Blumenau', 'Joinville', 'Chapecó'],
    'PE': ['Recife', 'Jaboatão', 'Olinda', 'Caruaru'],
    'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú'],
    'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde'],
    'DF': ['Brasília', 'Taguatinga', 'Ceilândia', 'Gama'],
    'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop']
  };

  // Processa dados por estado
  const statesData: Record<string, StateData> = {};
  
  leads.forEach(lead => {
    const campaign = lead.campanha || 'Outros';
    const states = stateMapping[campaign as keyof typeof stateMapping] || ['SP'];
    
    states.forEach(stateCode => {
      if (!statesData[stateCode]) {
        statesData[stateCode] = {
          name: getStateName(stateCode),
          code: stateCode,
          campaigns: {},
          total: 0,
          cities: {}
        };
      }
      
      statesData[stateCode].campaigns[campaign] = (statesData[stateCode].campaigns[campaign] || 0) + 1;
      statesData[stateCode].total += 1;
      
      // Simula distribuição por cidades
      const cities = cityMapping[stateCode as keyof typeof cityMapping] || [];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      statesData[stateCode].cities[randomCity] = (statesData[stateCode].cities[randomCity] || 0) + 1;
    });
  });

  function getStateName(code: string): string {
    const names: Record<string, string> = {
      'SP': 'São Paulo', 'RJ': 'Rio de Janeiro', 'MG': 'Minas Gerais',
      'RS': 'Rio Grande do Sul', 'BA': 'Bahia', 'PR': 'Paraná',
      'SC': 'Santa Catarina', 'PE': 'Pernambuco', 'CE': 'Ceará',
      'GO': 'Goiás', 'DF': 'Distrito Federal', 'MT': 'Mato Grosso'
    };
    return names[code] || code;
  }

  function getStateColor(total: number): string {
    if (total === 0) return 'hsl(var(--muted))';
    if (total <= 5) return 'hsl(var(--chart-info))';
    if (total <= 15) return 'hsl(var(--chart-warning))';
    if (total <= 30) return 'hsl(var(--chart-accent))';
    return 'hsl(var(--chart-primary))';
  }

  const maxLeads = Math.max(...Object.values(statesData).map(s => s.total));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Mapa do Brasil */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Distribuição Geográfica - Campanhas por Estado</CardTitle>
          <CardDescription>Clique nos estados para ver detalhes das cidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[400px] bg-muted/20 rounded-lg overflow-hidden">
            <svg viewBox="0 0 800 600" className="w-full h-full">
              {/* Estados brasileiros simplificados */}
              {Object.entries(statesData).map(([code, data]) => {
                const position = getStatePosition(code);
                const size = Math.max(20, (data.total / maxLeads) * 80);
                
                return (
                  <g key={code}>
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={size}
                      fill={getStateColor(data.total)}
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedState(selectedState === code ? null : code)}
                    />
                    <text
                      x={position.x}
                      y={position.y + 5}
                      textAnchor="middle"
                      className="text-xs fill-current font-medium pointer-events-none"
                    >
                      {code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* Legenda */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-chart-info"></div>
              <span>1-5 leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-chart-warning"></div>
              <span>6-15 leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-chart-accent"></div>
              <span>16-30 leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-chart-primary"></div>
              <span>30+ leads</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes por Estado/Cidade */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes por Região</CardTitle>
          <CardDescription>
            {selectedState ? `${getStateName(selectedState)}` : 'Selecione um estado no mapa'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedState && statesData[selectedState] ? (
            <div className="space-y-4">
              {/* Campanhas no estado */}
              <div>
                <h4 className="font-semibold mb-2">Campanhas Ativas</h4>
                <div className="space-y-2">
                  {Object.entries(statesData[selectedState].campaigns)
                    .sort(([,a], [,b]) => b - a)
                    .map(([campaign, count]) => (
                      <div key={campaign} className="flex justify-between items-center">
                        <span className="text-sm truncate flex-1">{campaign}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Cidades principais */}
              <div>
                <h4 className="font-semibold mb-2">Principais Cidades</h4>
                <div className="space-y-2">
                  {Object.entries(statesData[selectedState].cities)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([city, count]) => (
                      <div key={city} className="flex justify-between items-center">
                        <span className="text-sm">{city}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Clique em um estado no mapa para ver os detalhes das campanhas e cidades.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Posições aproximadas dos estados no mapa
function getStatePosition(code: string): { x: number; y: number } {
  const positions: Record<string, { x: number; y: number }> = {
    'SP': { x: 500, y: 400 },
    'RJ': { x: 550, y: 380 },
    'MG': { x: 480, y: 320 },
    'RS': { x: 450, y: 500 },
    'BA': { x: 420, y: 280 },
    'PR': { x: 450, y: 430 },
    'SC': { x: 470, y: 460 },
    'PE': { x: 380, y: 220 },
    'CE': { x: 340, y: 180 },
    'GO': { x: 400, y: 320 },
    'DF': { x: 410, y: 300 },
    'MT': { x: 350, y: 320 }
  };
  return positions[code] || { x: 400, y: 300 };
}