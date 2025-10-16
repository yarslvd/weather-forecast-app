import { Navigation2, Navigation2Off } from "lucide-react";

interface CurrentLocationButtonProps {
  geoAllowed: boolean | null;
  onClick: () => Promise<void>;
}

export const CurrentLocationButton = ({
  geoAllowed,
  onClick,
}: CurrentLocationButtonProps) => {
  return (
    <button
      className="p-3 rounded-full text-white cursor-pointer hover:bg-stone-800/40 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-auto"
      aria-label="Show weather for your current location"
      title="Show weather for your current location"
      disabled={!geoAllowed}
      onClick={onClick}
    >
      {geoAllowed ? (
        <Navigation2 className="text-white" />
      ) : (
        <Navigation2Off className="text-red-400" />
      )}
    </button>
  );
};
