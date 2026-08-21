import React from 'react';
import type { RoomStatus } from '../../types';
import { STATUS_META } from '../../utils/room';

export function StatusBadge({ status, className = '' }: {status: RoomStatus;className?: string;}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.className} ${className}`}>
      
      <span className={`size-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>);

}