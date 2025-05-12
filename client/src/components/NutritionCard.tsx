
type NutritionCardProps = {
  title: string;
  value: number;
  unit: string;
  color: string;
  icon: string;
};

const NutritionCard = ({ title, value, unit, color, icon }: NutritionCardProps) => {
  return (
    <div className="nutrition-card flex flex-col items-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: `${color}20` }}
      >
        <span 
          className="text-xl"
          style={{ color }}
        >
          {icon}
        </span>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
        <span className="text-sm ml-1">{unit}</span>
      </p>
    </div>
  );
};

export default NutritionCard;
