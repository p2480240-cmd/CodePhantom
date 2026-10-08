import React from 'react';
import { Sparkles, Search, Shield, EyeOff, Flame, Terminal, Code, Target, Award } from 'lucide-react';

interface BadgeIconProps {
  icon: string;
  unlocked: boolean;
  className?: string;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  icon,
  unlocked,
  className = 'w-6 h-6',
}) => {
  const getIconElement = () => {
    switch (icon) {
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'search':
        return <Search className={className} />;
      case 'shield':
        return <Shield className={className} />;
      case 'eye-off':
        return <EyeOff className={className} />;
      case 'flame':
        return <Flame className={className} />;
      case 'terminal':
        return <Terminal className={className} />;
      case 'code':
        return <Code className={className} />;
      case 'target':
        return <Target className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div
      className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
        unlocked
          ? 'bg-phantom-purple/20 border-phantom-violet/60 text-phantom-cyan shadow-glow-purple'
          : 'bg-black/30 border-white/10 text-white/20'
      }`}
    >
      {getIconElement()}
    </div>
  );
};
