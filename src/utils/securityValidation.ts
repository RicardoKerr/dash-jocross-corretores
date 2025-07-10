import { supabase } from '@/integrations/supabase/client';

// Validação de entrada para prevenir XSS e injeção
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove caracteres HTML básicos
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Validação de email mais robusta
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

// Validação de senha segura
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting simples para tentativas de login
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  isLimited(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return false;
    }
    
    if (record.count >= maxAttempts) {
      return true;
    }
    
    record.count++;
    return false;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const loginRateLimiter = new RateLimiter();

// Verificação de admin com cache
let adminStatusCache: { userId: string; isAdmin: boolean; expires: number } | null = null;

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  const now = Date.now();
  
  // Check cache first (5 minutes TTL)
  if (adminStatusCache && 
      adminStatusCache.userId === userId && 
      adminStatusCache.expires > now) {
    return adminStatusCache.isAdmin;
  }
  
  try {
    const { data, error } = await supabase.rpc('is_admin', { user_uuid: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    // Cache the result
    adminStatusCache = {
      userId,
      isAdmin: data || false,
      expires: now + (5 * 60 * 1000) // 5 minutes
    };
    
    return data || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Limpeza do cache quando o usuário faz logout
export const clearAdminCache = () => {
  adminStatusCache = null;
};