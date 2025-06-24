// Device/Browser detection utilities
export function isIOS() {
  return /iP(hone|od|ad)/.test(navigator.userAgent);
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

export function isChrome() {
  return (
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  );
}
