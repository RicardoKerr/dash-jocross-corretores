import { supabase } from "@/integrations/supabase/client";

interface SyntheticLead {
  nome: string;
  email: string;
  source: string;
  campanha: string;
  PossuiPlanoDeSaude: string;
  PlanoParaVoceFamiliaEmpresa: string;
  Idade: string;
  Especialista: string;
  Resumo: string;
  Whatsapp_corretor: string;
  created_at: string;
  status_conversa: string;
  corretor_responsavel: string;
  resumo_detalhado: string;
  data_ultima_interacao: string;
}

// Dados sintéticos realistas para geração
const nomes = [
  "João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa", "Carlos Pereira",
  "Lucia Fernandes", "Rafael Souza", "Juliana Lima", "Marco Antonio", "Patrícia Alves",
  "Fernando Rocha", "Camila Ribeiro", "Diego Martins", "Isabela Moreira", "Rodrigo Cardoso",
  "Beatriz Nunes", "Gabriel Torres", "Larissa Castro", "Thiago Barbosa", "Viviane Dias",
  "Leonardo Gomes", "Priscila Ramos", "André Monteiro", "Carolina Freitas", "Bruno Carvalho",
  "Melissa Silva", "Gustavo Araújo", "Natália Correia", "Felipe Pinto", "Vanessa Lopes",
  "Marcelo Reis", "Daniela Ferreira", "Alexandre Mendes", "Renata Vieira", "Vinicius Teixeira"
];

const campanhas = [
  "Instagram Julho 2025", "Facebook Saúde", "Google Ads Família", "LinkedIn Empresarial",
  "TikTok Jovens", "YouTube Educativo", "WhatsApp Direct", "Email Marketing",
  "Indicação Médica", "Parceria Farmácia", "Evento Corporativo", "Webinar Saúde"
];

const especialistas = [
  "Dr. João Cardiologista", "Dra. Maria Pediatra", "Dr. Carlos Ortopedista",
  "Dra. Ana Ginecologista", "Dr. Pedro Neurologista", "Dra. Lucia Dermatologista",
  "Dr. Rafael Endocrinologista", "Dra. Juliana Psiquiatra", "Dr. Marco Urologista",
  "Dra. Patrícia Oftalmologista"
];

const corretores = [
  "Carlos Silva - Corretor Senior", "Ana Paula - Especialista Familiar", "Roberto Santos - Corretor Empresarial",
  "Maria Fernanda - Consultora Individual", "José Carlos - Corretor Master", "Luciana Costa - Especialista Sênior",
  "Pedro Henrique - Corretor Pleno", "Beatriz Lima - Consultora Premium", "Fernando Rocha - Especialista Gold",
  "Camila Alves - Corretor Executivo"
];

const statusConversa = ["Interessado", "Negociando", "Proposta Enviada", "Aguardando Documentos", "Fechado", "Perdido"];
const idades = ["18-25", "26-35", "36-45", "46-55", "56-65", "65+"];
const planoStatus = ["Sim", "Não"];
const planoTipos = ["Individual", "Familiar", "Empresarial"];
const sources = ["WhatsApp", "Site", "Telefone", "Email", "Presencial"];

const resumos = [
  "Cliente interessado em plano individual básico",
  "Família procurando cobertura completa",
  "Empresa buscando plano corporativo",
  "Pessoa física com histórico médico",
  "Jovem casal planejando família",
  "Aposentado necessitando cobertura",
  "Profissional liberal autonomo",
  "Executivo com plano empresarial",
  "Estudante universitário",
  "Mãe solteira com filhos pequenos"
];

const resumosDetalhados = [
  "Lead demonstrou interesse em plano básico. Precisa de cobertura para emergências. Orçamento limitado de R$ 200/mês.",
  "Família de 4 pessoas busca cobertura completa. Priorizam pediatria e maternidade. Orçamento até R$ 800/mês.",
  "Empresa com 25 funcionários. Interessados em plano corporativo com cobertura nacional. Orçamento R$ 15.000/mês.",
  "Cliente com histórico de diabetes tipo 2. Necessita cobertura para endocrinologia. Disposto a pagar até R$ 400/mês.",
  "Casal jovem planejando primeiro filho. Querem cobertura maternidade. Orçamento flexível até R$ 600/mês.",
  "Aposentado de 68 anos. Precisa de cobertura geriátrica completa. Já possui plano, quer migrar por melhor preço.",
  "Advogado autônomo. Busca plano individual com boa rede credenciada em SP. Orçamento até R$ 350/mês.",
  "Executivo de multinacional. Empresa oferece plano básico, quer complementar com cobertura premium particular.",
  "Universitário de 22 anos. Pais querem contratar plano individual. Foco em emergências e clínica geral.",
  "Mãe solteira com 2 filhos pequenos. Prioridade pediatria e emergência infantil. Orçamento apertado R$ 250/mês."
];

function generateRandomDate(startDate: Date, endDate: Date): string {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const random = Math.random() * (end - start) + start;
  return new Date(random).toISOString();
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateEmail(nome: string): string {
  const cleanName = nome.toLowerCase().replace(/\s+/g, '.');
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'uol.com.br'];
  return `${cleanName}@${getRandomItem(domains)}`;
}

function generateWhatsApp(): string {
  const ddd = ['11', '21', '31', '41', '51', '61', '71', '81', '85', '87'];
  const number = Math.floor(Math.random() * 900000000) + 100000000;
  return `+55${getRandomItem(ddd)}9${number}`;
}

export function generateSyntheticData(count: number = 150): SyntheticLead[] {
  const leads: SyntheticLead[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date();

  for (let i = 0; i < count; i++) {
    const nome = getRandomItem(nomes);
    const createdAt = generateRandomDate(startDate, endDate);
    const lastInteraction = generateRandomDate(new Date(createdAt), endDate);
    
    leads.push({
      nome,
      email: generateEmail(nome),
      source: getRandomItem(sources),
      campanha: getRandomItem(campanhas),
      PossuiPlanoDeSaude: getRandomItem(planoStatus),
      PlanoParaVoceFamiliaEmpresa: getRandomItem(planoTipos),
      Idade: getRandomItem(idades),
      Especialista: getRandomItem(especialistas),
      Resumo: getRandomItem(resumos),
      Whatsapp_corretor: generateWhatsApp(),
      created_at: createdAt,
      status_conversa: getRandomItem(statusConversa),
      corretor_responsavel: getRandomItem(corretores),
      resumo_detalhado: getRandomItem(resumosDetalhados),
      data_ultima_interacao: lastInteraction
    });
  }

  return leads;
}

export async function insertSyntheticData(leads: SyntheticLead[]) {
  // Verificar se o usuário é admin antes de executar operações perigosas
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    throw new Error('Usuário não autenticado');
  }

  // Verificar permissões de admin
  const { data: isAdmin } = await supabase.rpc('is_admin', { user_uuid: user.user.id });
  if (!isAdmin) {
    throw new Error('Acesso negado: apenas administradores podem inserir dados sintéticos');
  }
  
  // Deletar dados existentes
  await supabase.from('jocrosscorretores').delete().neq('id', 0);
  
  // Inserir novos dados em lotes
  const batchSize = 50;
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);
    const { error } = await supabase
      .from('jocrosscorretores')
      .insert(batch);
    
    if (error) {
      throw error;
    }
  }
}