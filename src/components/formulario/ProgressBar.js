export default function ProgressBar({ progresso }) {
  return (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      <div 
        className="bg-brand-primary h-full transition-all duration-500 ease-out"
        style={{ width: `${progresso}%` }}
      />
    </div>
  );
}
