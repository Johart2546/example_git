import { STATUS_LABELS } from '../data.js';

export default function Badge({ status }) {
  const label = STATUS_LABELS[status] || status;
  return <span className={`badge badge--${status}`}>{label}</span>;
}
