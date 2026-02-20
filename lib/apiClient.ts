import { createClient } from './supabaseClient';
import { useAeroStore } from '@/store/useAeroStore';

// Demo data interfaces
export interface VaultData {
  locked_balance: number;
  spendable_balance: number;
  aero_score: number;
}

export interface BioScanResult {
  id: string;
  user_id: string;
  scan_type: 'vocal' | 'ppg' | 'face';
  confidence_score: number;
  completed_at: string;
  status: 'success' | 'failed' | 'pending';
}

export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  streak_days: number;
  merit_level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// Demo data service
class DemoDataService {
  private static instance: DemoDataService;
  
  static getInstance(): DemoDataService {
    if (!DemoDataService.instance) {
      DemoDataService.instance = new DemoDataService();
    }
    return DemoDataService.instance;
  }

  async getVault(userId: string): Promise<VaultData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      locked_balance: 75.50,
      spendable_balance: 24.50,
      aero_score: 82
    };
  }

  async updateVault(userId: string, data: Partial<VaultData>): Promise<VaultData> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const current = await this.getVault(userId);
    return { ...current, ...data };
  }

  async getBioScans(userId: string, limit = 10): Promise<BioScanResult[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const scans: BioScanResult[] = [
      {
        id: '1',
        user_id: userId,
        scan_type: 'vocal',
        confidence_score: 0.92,
        completed_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        status: 'success'
      },
      {
        id: '2',
        user_id: userId,
        scan_type: 'ppg',
        confidence_score: 0.88,
        completed_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: 'success'
      },
      {
        id: '3',
        user_id: userId,
        scan_type: 'face',
        confidence_score: 0.95,
        completed_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        status: 'success'
      }
    ];

    return scans.slice(0, limit);
  }

  async submitBioScan(userId: string, scanType: 'vocal' | 'ppg' | 'face', metrics: any): Promise<BioScanResult> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      scan_type: scanType,
      confidence_score: 0.85 + Math.random() * 0.14, // 0.85-0.99
      completed_at: new Date().toISOString(),
      status: 'success'
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      id: userId,
      email: 'demo@aero.app',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      streak_days: 12,
      merit_level: 'silver'
    };
  }

  async calculateAeroScore(userId: string, clinicalData: any, bioMetrics: any): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Simulate complex score calculation
    const baseScore = 50;
    const clinicalBonus = Math.min(30, clinicalData?.consistency || 0);
    const bioBonus = Math.min(20, bioMetrics?.averageConfidence * 20 || 0);
    
    return Math.min(100, Math.round(baseScore + clinicalBonus + bioBonus + Math.random() * 10));
  }
}

// Real Supabase service
class SupabaseService {
  private static instance: SupabaseService;
  
  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  private getClient() {
    return createClient();
  }

  async getVault(userId: string): Promise<VaultData> {
    const { data, error } = await this.getClient()
      .from('vaults')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateVault(userId: string, data: Partial<VaultData>): Promise<VaultData> {
    const { data: result, error } = await this.getClient()
      .from('vaults')
      .upsert({ user_id: userId, ...data })
      .select()
      .single();

    if (error) throw error;
    return result as VaultData;
  }

  async getBioScans(userId: string, limit = 10): Promise<BioScanResult[]> {
    const { data, error } = await this.getClient()
      .from('bio_scans')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async submitBioScan(userId: string, scanType: 'vocal' | 'ppg' | 'face', metrics: any): Promise<BioScanResult> {
    const { data: result, error } = await this.getClient()
      .from('bio_scans')
      .insert({
        user_id: userId,
        scan_type: scanType,
        metrics,
        completed_at: new Date().toISOString(),
        status: 'success'
      })
      .select()
      .single();

    if (error) throw error;
    return result as BioScanResult;
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await this.getClient()
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async calculateAeroScore(userId: string, clinicalData: any, bioMetrics: any): Promise<number> {
    const { data: result, error } = await this.getClient()
      .rpc('calculate_aero_score', {
        p_user_id: userId,
        p_clinical_data: clinicalData,
        p_bio_metrics: bioMetrics
      });

    if (error) throw error;
    return result as number;
  }
}

// Main API Client with toggle
export class AeroApiClient {
  private demoService: DemoDataService;
  private supabaseService: SupabaseService;

  constructor() {
    this.demoService = DemoDataService.getInstance();
    this.supabaseService = SupabaseService.getInstance();
  }

  private isDemoMode(): boolean {
    // Check store for demo mode - this works in client components
    if (typeof window !== 'undefined') {
      return useAeroStore.getState().demoMode;
    }
    // Default to demo mode on server
    return true;
  }

  async getVault(userId: string): Promise<VaultData> {
    return this.isDemoMode() 
      ? this.demoService.getVault(userId)
      : this.supabaseService.getVault(userId);
  }

  async updateVault(userId: string, data: Partial<VaultData>): Promise<VaultData> {
    return this.isDemoMode() 
      ? this.demoService.updateVault(userId, data)
      : this.supabaseService.updateVault(userId, data);
  }

  async getBioScans(userId: string, limit = 10): Promise<BioScanResult[]> {
    return this.isDemoMode() 
      ? this.demoService.getBioScans(userId, limit)
      : this.supabaseService.getBioScans(userId, limit);
  }

  async submitBioScan(userId: string, scanType: 'vocal' | 'ppg' | 'face', metrics: any): Promise<BioScanResult> {
    return this.isDemoMode() 
      ? this.demoService.submitBioScan(userId, scanType, metrics)
      : this.supabaseService.submitBioScan(userId, scanType, metrics);
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    return this.isDemoMode() 
      ? this.demoService.getUserProfile(userId)
      : this.supabaseService.getUserProfile(userId);
  }

  async calculateAeroScore(userId: string, clinicalData: any, bioMetrics: any): Promise<number> {
    return this.isDemoMode() 
      ? this.demoService.calculateAeroScore(userId, clinicalData, bioMetrics)
      : this.supabaseService.calculateAeroScore(userId, clinicalData, bioMetrics);
  }

  // New method for detailed score calculation
  async calculateDetailedAeroScore(userId: string, input: any): Promise<any> {
    if (this.isDemoMode()) {
      // Use local calculator for demo mode
      const { calculateAeroScore } = await import('./aeroScoreCalculator');
      return calculateAeroScore(input);
    }
    
    // For real mode, this would call an edge function
    const client = createClient();
    const { data, error } = await client
      .functions.invoke('calculate-detailed-aero-score', {
        body: { userId, input }
      });
    
    if (error) throw error;
    return data;
  }
}

// Singleton instance
export const apiClient = new AeroApiClient();

// Hook for easy usage in components
export function useApiClient() {
  return apiClient;
}
