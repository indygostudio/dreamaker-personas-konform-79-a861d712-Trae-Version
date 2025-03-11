interface DescriptionProps {
  description?: string;
}

export const Description = ({ description }: DescriptionProps) => {
  if (!description) return null;

  return (
    <div className="text-gray-300 text-lg leading-relaxed max-w-2xl animate-fade-up" style={{ animationDelay: '200ms' }}>
      {description}
    </div>
  );
};