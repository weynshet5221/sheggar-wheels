import { STORAGE_KEYS } from './constants';
import { readStorage, writeStorage } from './storage';

export function getAnnouncements() {
  return readStorage(STORAGE_KEYS.ANNOUNCEMENTS, []);
}

export function createAnnouncement(announcementData, adminId) {
  const announcements = readStorage(STORAGE_KEYS.ANNOUNCEMENTS, []);
  const newAnn = {
    id: `ann-${Date.now()}`,
    ...announcementData,
    active: true,
    createdBy: adminId,
    createdAt: new Date().toISOString(),
  };
  announcements.push(newAnn);
  writeStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  return newAnn;
}