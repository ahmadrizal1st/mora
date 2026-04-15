interface RibbonCardProps {
  color?: string;
  top?: boolean;
  left?: boolean;
  bottom?: boolean;
  bookmark?: boolean;
  lorem?: boolean;
}

export function RibbonCard({
  color = 'primary',
  top = false,
  left = false,
  bottom = false,
  bookmark = false,
  lorem = false,
}: RibbonCardProps) {
  const ribbonClass = [
    'ribbon',
    `bg-${color}`,
    top ? 'ribbon-top' : '',
    left ? 'ribbon-start' : '',
    bottom ? 'ribbon-bottom' : '',
    bookmark ? 'ribbon-bookmark' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="card">
      <div className="card-body" style={!lorem ? { height: '5rem' } : undefined}>
        {lorem && (
          <>
            <h3 className="card-title">Card with ribbon</h3>
            <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
          </>
        )}
      </div>
      <div className={ribbonClass}>
        {bookmark && (
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
            viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="currentColor">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
          </svg>
        )}
      </div>
    </div>
  );
}
