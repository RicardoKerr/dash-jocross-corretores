-- Remove the dangerous RLS disable and implement comprehensive security

-- Re-enable RLS on jocrosscorretores (was disabled in previous migration)
ALTER TABLE public.jocrosscorretores ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on all other tables
ALTER TABLE public.argeplan_consultaplanos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.argeplan_interacoes_lola ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.argeplan_ddd_cidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.argeplan_crm ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles table policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only authenticated users can insert profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- jocrosscorretores policies (lead data)
CREATE POLICY "Authenticated users can view leads" 
ON public.jocrosscorretores FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can insert leads" 
ON public.jocrosscorretores FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update leads" 
ON public.jocrosscorretores FOR UPDATE 
TO authenticated 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete leads" 
ON public.jocrosscorretores FOR DELETE 
TO authenticated 
USING (public.is_admin(auth.uid()));

-- Read-only access for reference tables
CREATE POLICY "Authenticated users can view consultaplanos" 
ON public.argeplan_consultaplanos FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view ddd_cidade" 
ON public.argeplan_ddd_cidade FOR SELECT 
TO authenticated 
USING (true);

-- Restricted access for sensitive tables
CREATE POLICY "Only admins can access interacoes_lola" 
ON public.argeplan_interacoes_lola FOR ALL 
TO authenticated 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can access crm" 
ON public.argeplan_crm FOR ALL 
TO authenticated 
USING (public.is_admin(auth.uid()));

-- Create trigger function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profile timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();