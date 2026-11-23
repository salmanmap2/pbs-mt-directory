'use client';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useDeviceId(): string {
  const [deviceId, setDeviceId] = useState('');
  useEffect(() => {
    let id = localStorage.getItem('pbs_device_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('pbs_device_id', id);
    }
    setDeviceId(id);
  }, []);
  return deviceId;
}
