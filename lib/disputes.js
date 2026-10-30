import { STORAGE_KEYS } from './constants';
import { readStorage, writeStorage } from './storage';

export function getDisputes() {
  return readStorage(STORAGE_KEYS.DISPUTES, []);
}

export function createDispute(disputeData, currentUserId) {
  if (!currentUserId) throw new Error('Not signed in');
  const disputes = readStorage(STORAGE_KEYS.DISPUTES, []);
  const newDispute = {
    id: `disp-${Date.now()}`,
    ...disputeData,
    openedBy: currentUserId,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  disputes.push(newDispute);
  writeStorage(STORAGE_KEYS.DISPUTES, disputes);
  return newDispute;
}

export function resolveDispute(disputeId, resolutionNotes, adminId) {
  const disputes = readStorage(STORAGE_KEYS.DISPUTES, []);
  const index = disputes.findIndex((d) => d.id === disputeId);
  if (index !== -1) {
    disputes[index].status = 'resolved';
    disputes[index].resolutionNotes = resolutionNotes;
    disputes[index].resolvedBy = adminId;
    disputes[index].resolvedAt = new Date().toISOString();
    writeStorage(STORAGE_KEYS.DISPUTES, disputes);
    return disputes[index];
  }
  return null;
}