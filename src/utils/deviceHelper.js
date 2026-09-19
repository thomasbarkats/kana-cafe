import { MOBILE_PLATFORMS } from '../constants';

export const getDeviceInfo = () => {
  return {
    deviceId: getDeviceId(),
    deviceName: getBrowserInfo(),
    platform: 'web',
    appVersion: '1.0.0',
  };
}

const getDeviceId = () => {
  const DEVICE_ID_KEY = 'kanacafe_device_id';
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    // Generate a new device ID
    deviceId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  // Detect browser
  if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
    browser = 'Chrome';
  } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
    browser = 'Safari';
  } else if (ua.indexOf('Firefox') > -1) {
    browser = 'Firefox';
  } else if (ua.indexOf('Edg') > -1) {
    browser = 'Edge';
  }

  // Detect OS
  if (ua.indexOf('Win') > -1) {
    os = 'Windows';
  } else if (ua.indexOf('Mac') > -1) {
    os = 'macOS';
  } else if (ua.indexOf('Linux') > -1) {
    os = 'Linux';
  } else if (ua.indexOf('Android') > -1) {
    os = 'Android';
  } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
    os = 'iOS';
  }

  return `${browser} on ${os}`;
};

// Which mobile OS the keyboard and install instructions should target, null on desktop
export const getMobilePlatform = () => {
  const ua = navigator.userAgent;

  if (/android/i.test(ua)) {
    return MOBILE_PLATFORMS.ANDROID;
  }
  if (/iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && navigator.maxTouchPoints > 1)) {
    return MOBILE_PLATFORMS.IOS;
  }
  return null;
};

// Already launched from the home screen: no browser chrome left to get rid of
export const isInstalledApp = () =>
  window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
