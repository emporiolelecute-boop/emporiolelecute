import { icons, type LucideProps, Sparkles } from "lucide-react";

interface LucideIconProps extends LucideProps {
  name?: string | null;
  fallback?: keyof typeof icons;
}

/**
 * Renders a Lucide icon by its PascalCase name (e.g. "Heart", "Gift").
 * Safe fallback when the name is missing or invalid.
 */
export const LucideIcon = ({ name, fallback, ...props }: LucideIconProps) => {
  if (name && (icons as Record<string, unknown>)[name]) {
    const Icon = (icons as Record<string, React.ComponentType<LucideProps>>)[name];
    return <Icon {...props} />;
  }
  if (fallback && icons[fallback]) {
    const Icon = icons[fallback];
    return <Icon {...props} />;
  }
  return <Sparkles {...props} />;
};

export default LucideIcon;
