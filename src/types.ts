export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  category?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface QuickPrompt {
  id: string;
  icon: string;
  title: string;
  description: string;
  samplePrompt: string;
}

export interface FeatureCard {
  id: string;
  iconName: string;
  title: string;
  description: string;
  badge?: string;
}

export interface NavLink {
  id: string;
  label: string;
  icon?: string;
  href: string;
}

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
}
