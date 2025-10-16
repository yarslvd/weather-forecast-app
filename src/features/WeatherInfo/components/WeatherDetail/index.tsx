import { Skeleton } from "@components/ui/skeleton";

interface WeatherDetailProps {
  icon: React.ReactNode;
  value: string | null;
  label: string;
  loading: boolean;
}

export const WeatherDetail = ({
  icon,
  label,
  value,
  loading,
}: WeatherDetailProps) => (
  <div
    className="bg-stone-800/40 rounded-lg p-3 flex items-center gap-2 hover:bg-stone-700/40 transition-colors"
    title={label}
    aria-label={label}
  >
    {icon}
    {loading ? (
      <Skeleton className="h-4 w-20" />
    ) : (
      <span className="font-medium">{value}</span>
    )}
  </div>
);
