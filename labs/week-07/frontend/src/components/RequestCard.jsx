import { Link } from 'react-router-dom';

function RequestCard({ request, onDeleteRequest }) {
  return (
    <article className="request-card">
      <div>
        <p className="request-id">{request.id}</p>
        <h3><Link to={`/requests/${request.id}`}>{request.requestType}</Link></h3>
        <p>{request.location}</p>
        <p>{request.details}</p>
        <p><span className={`badge ${request.status}`}>{request.status}</span> · {request.priority}</p>
      </div>
      <div>
        <Link className="button primary" style={{ alignSelf: 'center', textDecoration: 'none' }} to={`/requests/${encodeURIComponent(request.id)}`} aria-label={`เปลี่ยนสถานะคำร้อง ${request.id}`}>
          เปลี่ยนสถานะ
        </Link>
         &nbsp;
        <button className="button danger" type="button" onClick={() => onDeleteRequest(request.id)} aria-label={`ลบคำร้อง ${request.id}`}>
          ลบ
        </button>
      </div>
    </article>
  );
}

export default RequestCard;
