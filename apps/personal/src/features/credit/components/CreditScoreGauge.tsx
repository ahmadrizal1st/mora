interface Props {
  score: number;
}

export function CreditScoreGauge({ score }: Props) {
  const min = 300;
  const max = 850;
  
  const clampedScore = Math.max(min, Math.min(score, max));
  const percent = (clampedScore - min) / (max - min);
  const needleAngle = percent * 180;
  
  const segments = [
    { color: '#ff4d4f', start: 0, end: 34 },
    { color: '#faad14', start: 36.5, end: 70.5 },
    { color: '#fadb14', start: 73, end: 107 },
    { color: '#1677ff', start: 109.5, end: 143.5 },
    { color: '#52c41a', start: 146, end: 180 },
  ];

  const getNeedleColor = (sc: number) => {
    if (sc < 410) return '#ff4d4f';
    if (sc < 520) return '#faad14';
    if (sc < 630) return '#fadb14';
    if (sc < 740) return '#1677ff';
    return '#52c41a';
  };

  const getLabel = (sc: number) => {
    if (sc < 580) return 'Poor';
    if (sc < 670) return 'Fair';
    if (sc < 740) return 'Good';
    if (sc < 800) return 'Very Good';
    return 'Excellent';
  };

  const needleColor = getNeedleColor(clampedScore);
  const label = getLabel(clampedScore);

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const needlePos = polarToCartesian(100, 95, 75, needleAngle);
  const needleLineEnd = polarToCartesian(100, 95, 58, needleAngle);

  return (
    <div className="position-relative w-100" style={{ maxWidth: '300px', margin: '0 auto' }}>
      <svg viewBox="0 0 200 120" className="w-100 h-auto">
        {/* Arc Segments */}
        {segments.map((seg, i) => (
          <path
            key={i}
            d={describeArc(100, 95, 75, seg.start, seg.end)}
            fill="none"
            stroke={seg.color}
            strokeWidth="7"
            strokeLinecap="round"
          />
        ))}
        
        {/* Needle Group */}
        <g style={{ transition: 'all 1s ease-out' }}>
          <line 
            x1={needlePos.x} 
            y1={needlePos.y} 
            x2={needleLineEnd.x} 
            y2={needleLineEnd.y} 
            stroke={needleColor} 
            strokeWidth="5" 
            strokeLinecap="round" 
          />
          <circle 
            cx={needlePos.x} 
            cy={needlePos.y} 
            r="4.5" 
            fill={needleColor} 
          />
          <circle 
            cx={needlePos.x} 
            cy={needlePos.y} 
            r="1.8" 
            fill="#ffffff" 
          />
        </g>

        {/* Labels at bottom */}
        <text x="25" y="115" fontSize="9" fill="#adb5bd" fontWeight="700" textAnchor="middle">300</text>
        <text x="175" y="115" fontSize="9" fill="#adb5bd" fontWeight="700" textAnchor="middle">850</text>
        
        {/* Center Text */}
        <text x="100" y="80" fontSize="38" fill="#495057" fontWeight="800" textAnchor="middle" letterSpacing="-1">{score}</text>
        <text x="100" y="100" fontSize="13" fill="#495057" fontWeight="700" textAnchor="middle">{label}</text>
      </svg>
    </div>
  );
}
