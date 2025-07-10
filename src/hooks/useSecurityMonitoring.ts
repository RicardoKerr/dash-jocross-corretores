import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  event_type: 'login_attempt' | 'admin_action' | 'data_access' | 'failed_auth';
  user_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// Hook para monitoramento de segurança
export const useSecurityMonitoring = () => {
  
  const logSecurityEvent = async (event: SecurityEvent) => {
    try {
      // Em um ambiente real, isso seria enviado para um serviço de monitoramento
      console.log('Security Event:', {
        ...event,
        timestamp: new Date().toISOString(),
        session_id: (await supabase.auth.getSession()).data.session?.access_token?.substring(0, 8)
      });
      
      // Aqui você poderia enviar para serviços como DataDog, Sentry, etc.
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const monitorAuthEvents = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      logSecurityEvent({
        event_type: event === 'SIGNED_IN' ? 'login_attempt' : 'admin_action',
        user_id: session?.user?.id,
        details: { auth_event: event }
      });
    });
  };

  useEffect(() => {
    monitorAuthEvents();
  }, []);

  return { logSecurityEvent };
};