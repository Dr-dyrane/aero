'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'user' | 'partner' | 'admin';
  has_baseline: boolean;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const client = createClient();
    
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await client.auth.getSession();
        
        if (session?.user) {
          setSupabaseUser(session.user);
          setIsAuthenticated(true);
          
          // Fetch user profile
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser(profile);
          }
        }
      } catch (error) {
        console.error('Auth session error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          setIsAuthenticated(true);
          
          // Fetch user profile
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser(profile);
          }
        } else {
          setUser(null);
          setSupabaseUser(null);
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const client = createClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const client = createClient();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const client = createClient();
    const { error } = await client.auth.signOut();
    
    if (error) throw error;
  };

  return {
    user,
    supabaseUser,
    isAuthenticated,
    isLoading,
    signIn,
    signInWithGoogle,
    signOut,
  };
}
