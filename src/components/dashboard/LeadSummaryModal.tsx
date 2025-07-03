import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone, User, Building, FileText, Clock, Target } from "lucide-react";

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

interface LeadSummaryModalProps {
  lead: LeadData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadSummaryModal = ({ lead, isOpen, onClose }: LeadSummaryModalProps) => {
  if (!lead) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      "Interessado": "default",
      "Negociando": "secondary",
      "Proposta Enviada": "outline",
      "Aguardando Documentos": "outline",
      "Fechado": "default",
      "Perdido": "destructive"
    };
    return colors[status] || "secondary";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.nome || 'Lead sem nome'}
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas do lead
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Informações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status da Conversa</label>
              <Badge variant={getStatusColor(lead.status_conversa || "")}>
                {lead.status_conversa || "Não definido"}
              </Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Corretor Responsável</label>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.corretor_responsavel || "Não atribuído"}</span>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.email || "Não informado"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.Whatsapp_corretor || "Não informado"}</span>
              </div>
            </div>
          </div>

          {/* Informações do Plano */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Informações do Plano</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Possui Plano de Saúde</label>
                <Badge variant={lead.PossuiPlanoDeSaude === 'Sim' ? 'default' : 'secondary'}>
                  {lead.PossuiPlanoDeSaude || "Não informado"}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tipo de Plano</label>
                <span className="text-sm">{lead.PlanoParaVoceFamiliaEmpresa || "Não informado"}</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Faixa Etária</label>
                <span className="text-sm">{lead.Idade || "Não informado"}</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Especialista</label>
                <span className="text-sm">{lead.Especialista || "Não informado"}</span>
              </div>
            </div>
          </div>

          {/* Origem e Campanha */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Origem do Lead</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Fonte</label>
                <Badge variant="outline">{lead.source || "Não informado"}</Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Campanha</label>
                <Badge variant="outline">{lead.campanha || "Não informado"}</Badge>
              </div>
            </div>
          </div>

          {/* Resumos */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Resumo</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Resumo Básico
                </label>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">
                  {lead.Resumo || "Nenhum resumo disponível"}
                </p>
              </div>
              
              {lead.resumo_detalhado && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Resumo Detalhado
                  </label>
                  <p className="text-sm bg-primary/10 p-3 rounded-lg border border-primary/20">
                    {lead.resumo_detalhado}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Datas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Histórico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data de Cadastro
                </label>
                <span className="text-sm">{formatDate(lead.created_at)}</span>
              </div>
              {lead.data_ultima_interacao && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Última Interação
                  </label>
                  <span className="text-sm">{formatDate(lead.data_ultima_interacao)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button>
              Editar Lead
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};