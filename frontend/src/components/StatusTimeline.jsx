const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];

export default function StatusTimeline({ status }) {
  const currentIndex = statuses.indexOf(status);

  return (
    <div className="timeline">
      {statuses.map((item, index) => (
        <div className={`timeline-step ${index <= currentIndex ? 'complete' : ''}`} key={item}>
          <span />
          <p>{item.replace('_', ' ')}</p>
        </div>
      ))}
    </div>
  );
}
