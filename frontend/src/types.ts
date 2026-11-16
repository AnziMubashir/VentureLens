export interface IdeaInput {
  name: string;
  description: string;
  problem: string;
  target_users: string;
  proposed_solution: string;
}

export interface InvestorAnalysis {
  perspective: 'investor';
  market_opportunity: string;
  revenue_models: string[];
  competitive_differentiation: string;
  commercial_risks: string[];
  recommendations: string[];
  verdict: string;
}

export interface TechnicalAnalysis {
  perspective: 'technical';
  feasibility_assessment: string;
  recommended_stack: string[];
  architecture_overview: string;
  mvp_scope: string[];
  technical_risks: string[];
  verdict: string;
}

export interface UserAnalysis {
  perspective: 'user';
  target_personas: string[];
  core_pain_points: string[];
  user_value_proposition: string;
  adoption_barriers: string[];
  key_user_features: string[];
  verdict: string;
}

export interface SpecialistOutputs {
  investor?: InvestorAnalysis;
  technical?: TechnicalAnalysis;
  user?: UserAnalysis;
}

export interface InitialSynthesis {
  executive_summary: string;
  key_agreements: string[];
  conflicting_perspectives: string[];
  cross_dependencies: string[];
}

export interface CritiqueItem {
  source_agent: 'investor' | 'technical' | 'user';
  target_agent: 'investor' | 'technical' | 'user';
  challenged_claim: string;
  concern: string;
  suggested_pivot: string;
}

export interface ChallengeAnalysis {
  critiques: CritiqueItem[];
}

export interface RefinedAnalysis {
  synthesized_strengths: string[];
  critical_risks: string[];
  trade_offs_made: string[];
  refined_recommendations: string[];
  actionable_mvp: string[];
  final_chair_verdict: string;
}

export interface PitchFeature {
  title: string;
  description: string;
}

export interface PitchContent {
  headline: string;
  tagline: string;
  problem_statement: string;
  solution_overview: string;
  target_audiences: string[];
  key_features: PitchFeature[];
  business_model: string;
  call_to_action: string;
}

export type PipelineStatus =
  | 'idle'
  | 'stage1_running'
  | 'stage1_complete'
  | 'stage2_running'
  | 'awaiting_challenge'
  | 'stage3_running'
  | 'stage4_running'
  | 'completed'
  | 'failed';

export interface PitchRecord {
  id: string;
  created_at: string;
  idea: IdeaInput;
  status: PipelineStatus;
  stage1_specialists?: SpecialistOutputs;
  stage2_initial_synthesis?: InitialSynthesis;
  stage3_challenge?: ChallengeAnalysis;
  stage4_refined_analysis?: RefinedAnalysis;
  pitch_content?: PitchContent;
  boardroom_report_md?: string;
  pitch_site_html?: string;
  error?: string;
}

export interface SampleIdea {
  id: string;
  name: string;
  description: string;
  problem: string;
  target_users: string;
  proposed_solution: string;
}

export interface HealthStatus {
  status: string;
  app: string;
  mode: 'live' | 'mock';
  gemini_model?: string;
}
