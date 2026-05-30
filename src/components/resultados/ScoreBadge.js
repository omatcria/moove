export default function ScoreBadge({ score }) {
  let cor = 'bg-score-low';
  if (score >= 80) cor = 'bg-score-high';
  else if (score >= 60) cor = 'bg-score-mid';

  return (
    <div className={`${cor} text-white text-sm font-bold px-3 py-1 rounded-full shadow-md`}>
      {score}%
    </div>
  );
}
