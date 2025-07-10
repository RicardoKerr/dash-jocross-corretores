import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Mail, Shield, AlertTriangle } from 'lucide-react';
import { validateEmail, validatePassword, loginRateLimiter, sanitizeInput } from '@/utils/securityValidation';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logSecurityEvent } = useSecurityMonitoring();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const sanitizedEmail = sanitizeInput(email);
      
      if (!validateEmail(sanitizedEmail)) {
        toast({
          variant: "destructive",
          title: "Email inválido",
          description: "Por favor, insira um email válido.",
        });
        return;
      }

      // Check rate limiting
      if (loginRateLimiter.isLimited(sanitizedEmail)) {
        logSecurityEvent({
          event_type: 'failed_auth',
          details: { reason: 'rate_limited', email: sanitizedEmail }
        });
        
        toast({
          variant: "destructive",
          title: "Muitas tentativas",
          description: "Aguarde 15 minutos antes de tentar novamente.",
        });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        logSecurityEvent({
          event_type: 'failed_auth',
          details: { reason: 'invalid_credentials', email: sanitizedEmail }
        });
        
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: error.message,
        });
      } else {
        // Reset rate limiter on successful login
        loginRateLimiter.reset(sanitizedEmail);
        
        logSecurityEvent({
          event_type: 'login_attempt',
          details: { email: sanitizedEmail, success: true }
        });
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate and sanitize inputs
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedFullName = sanitizeInput(fullName);
      
      if (!validateEmail(sanitizedEmail)) {
        toast({
          variant: "destructive",
          title: "Email inválido",
          description: "Por favor, insira um email válido.",
        });
        return;
      }

      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setPasswordErrors(passwordValidation.errors);
        toast({
          variant: "destructive",
          title: "Senha não atende aos critérios",
          description: "Verifique os requisitos de senha abaixo.",
        });
        return;
      }

      if (!sanitizedFullName.trim()) {
        toast({
          variant: "destructive",
          title: "Nome obrigatório",
          description: "Por favor, insira seu nome completo.",
        });
        return;
      }
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: sanitizedFullName,
          },
        },
      });

      if (error) {
        logSecurityEvent({
          event_type: 'failed_auth',
          details: { reason: 'signup_failed', email: sanitizedEmail, error: error.message }
        });
        
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: error.message,
        });
      } else {
        logSecurityEvent({
          event_type: 'admin_action',
          details: { action: 'user_signup', email: sanitizedEmail }
        });
        
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta.",
        });
        
        // Clear password errors on successful signup
        setPasswordErrors([]);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Real-time password validation
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const validation = validatePassword(value);
    setPasswordErrors(validation.errors);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Sistema de Corretores</h1>
          <p className="text-muted-foreground mt-2">
            Acesse sua conta para continuar
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Autenticação</CardTitle>
            <CardDescription>
              Entre com sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                   <div className="space-y-2">
                     <Label htmlFor="password">Senha</Label>
                     <div className="relative">
                       <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="password"
                         type={showPassword ? "text" : "password"}
                         placeholder="Crie uma senha segura"
                         value={password}
                         onChange={(e) => handlePasswordChange(e.target.value)}
                         className="pl-10 pr-10"
                         required
                         minLength={8}
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                         onClick={() => setShowPassword(!showPassword)}
                       >
                         {showPassword ? (
                           <EyeOff className="h-4 w-4 text-muted-foreground" />
                         ) : (
                           <Eye className="h-4 w-4 text-muted-foreground" />
                         )}
                       </Button>
                     </div>
                     
                     {/* Password Requirements */}
                     {password && (
                       <div className="mt-2 p-3 bg-muted/50 rounded-md">
                         <div className="text-sm font-medium mb-2">Requisitos da senha:</div>
                         {passwordErrors.length > 0 ? (
                           <ul className="text-xs space-y-1">
                             {passwordErrors.map((error, index) => (
                               <li key={index} className="flex items-center text-destructive">
                                 <AlertTriangle className="h-3 w-3 mr-1" />
                                 {error}
                               </li>
                             ))}
                           </ul>
                         ) : (
                           <div className="text-xs text-green-600 flex items-center">
                             <Shield className="h-3 w-3 mr-1" />
                             Senha atende a todos os requisitos
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}