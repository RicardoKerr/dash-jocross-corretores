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
      created_at: generateRandomDate(startDate, endDate)
    });
  }

  return leads;
}

export async function insertSyntheticData(leads: SyntheticLead[]) {
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