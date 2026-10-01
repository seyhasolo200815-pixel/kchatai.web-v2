import React from 'react';
import { MessageSquare, FileText, Code, Globe, Image, Mic } from 'lucide-react';
import { FeatureCard } from '../types';

interface FeaturesBarProps {
  features: FeatureCard[];
  onSelectFeature: (featureId: string) => void;
  activeFeature?: string;
}

export const FeaturesBar: React.FC<FeaturesBarProps> = ({
  features,
  onSelectFeature,
  activeFeature,
}) => {
  const getIcon = (iconName: string) => {
    const props = { className: "h-6 w-6 text-cyan-300" };
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Code':
        return <Code {...props} />;
      case 'Globe':
        return <Globe {...props} />;
      case 'Image':
        return <Image {...props} />;
      case 'Mic':
        return <Mic {...props} />;
      default:
        return <MessageSquare {...props} />;
    }
  };

  return (
    <section id="features-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {features.map((feature) => {
          const isSelected = activeFeature === feature.id;
          return (
            <button
              key={feature.id}
              onClick={() => onSelectFeature(feature.id)}
              className={`group flex flex-col items-center justify-center text-center p-4 rounded-2xl transition-all duration-300 ${
                isSelected
                  ? 'bg-[#0f1d38] border-2 border-blue-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] scale-[1.02]'
                  : 'bg-[#0a1222]/90 border border-blue-900/40 hover:border-blue-500/50 hover:bg-[#0c1830] hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              }`}
            >
              {/* Icon Container with glowing background */}
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950/70 border border-blue-500/20 group-hover:border-cyan-400/50 group-hover:scale-110 transition duration-300 shadow-[0_0_12px_rgba(37,99,235,0.2)]">
                {getIcon(feature.iconName)}
              </div>

              {/* Title in Khmer */}
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {feature.title}
              </h3>

              {/* Description in Khmer */}
              <p className="mt-1 text-xs text-slate-400 group-hover:text-slate-300 line-clamp-1">
                {feature.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
