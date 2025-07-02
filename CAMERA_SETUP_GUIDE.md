# คู่มือการตั้งค่าระบบกล้องสำหรับ iOS/Safari และ Chrome

## ภาพรวม

ระบบกล้องได้รับการปรับปรุงเพื่อรองรับการทำงานที่เหมาะสมกับ browser และ platform ต่างๆ โดยเฉพาะ:

- **iOS/Safari**: ใช้ `video/mp4` สำหรับการอัดวิดีโอ
- **Android/Chrome**: ใช้ `video/webm; codecs=vp9,opus` สำหรับการอัดวิดีโอ (คุณภาพดีกว่า)
- **Browser อื่นๆ**: ใช้ `video/mp4` เป็น fallback

## การตรวจจับ Browser และ Platform

### ฟังก์ชัน `detectBrowserAndPlatform()`

ฟังก์ชันนี้จะตรวจจับ browser และ platform ที่ผู้ใช้ใช้งาน:

```javascript
const { isIOS, isSafari, isChrome, isAndroid } = detectBrowserAndPlatform();
```

**ผลลัพธ์:**

- `isIOS`: `true` สำหรับ iPhone, iPad, iPod
- `isSafari`: `true` สำหรับ Safari browser (ไม่รวม Chrome ที่ใช้ WebKit)
- `isChrome`: `true` สำหรับ Chrome browser
- `isAndroid`: `true` สำหรับ Android devices

## การตั้งค่า MIME Type

### ฟังก์ชัน `getOptimalVideoMimeType()`

ฟังก์ชันนี้จะคืนค่า MIME type ที่เหมาะสมที่สุดสำหรับ browser ปัจจุบัน:

```javascript
const mimeType = getOptimalVideoMimeType();
// iOS/Safari: "video/mp4"
// Android/Chrome: "video/webm; codecs=vp9,opus"
// อื่นๆ: "video/mp4"
```

### ฟังก์ชัน `getVideoMimeTypes()`

ฟังก์ชันนี้จะคืนค่ารายการ MIME types ที่เหมาะสมตามลำดับความสำคัญ:

**สำหรับ iOS/Safari:**

```javascript
[
  "video/mp4",
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
  "video/ogg;codecs=theora,vorbis",
];
```

**สำหรับ Android/Chrome:**

```javascript
[
  "video/webm; codecs=vp9,opus",
  "video/webm; codecs=vp8,opus",
  "video/webm",
  "video/mp4; codecs=avc1.42E01E,mp4a.40.2",
  "video/mp4",
  "video/ogg;codecs=theora,vorbis",
];
```

## การตั้งค่า Video Constraints

### สำหรับ iOS/Safari

```javascript
const videoConstraints = {
  facingMode: "user",
  width: { ideal: 1280, max: 1920 },
  height: { ideal: 720, max: 1080 },
};
```

### สำหรับ Chrome และ Browser อื่นๆ

```javascript
const videoConstraints = {
  facingMode: "user",
  width: { ideal: 1280 },
  height: { ideal: 720 },
};
```

## การใช้งานใน MediaRecorder

### การเลือก MIME Type ที่เหมาะสม

```javascript
const mimeTypes = getVideoMimeTypes();
let selectedMimeType = null;

for (const mimeType of mimeTypes) {
  if (MediaRecorder.isTypeSupported(mimeType)) {
    selectedMimeType = mimeType;
    console.log(`Using MIME type: ${mimeType}`);
    break;
  }
}

const options = selectedMimeType ? { mimeType: selectedMimeType } : {};
const mediaRecorder = new MediaRecorder(stream, options);
```

## การทดสอบ

### ฟังก์ชัน `testBrowserDetection()`

ฟังก์ชันนี้จะทดสอบและแสดงผลการตรวจจับ browser:

```javascript
import { testBrowserDetection } from "./utils/browserTest";

// เรียกใช้ใน console หรือ component
testBrowserDetection();
```

**ผลลัพธ์ใน Console:**

```
🧪 Testing Browser Detection...
Browser Info: { isIOS: false, isSafari: false, isChrome: true, ... }
Optimal MIME Type: video/webm; codecs=vp9,opus
Available MIME Types: [...]
video/mp4; codecs=avc1.42E01E,mp4a.40.2: ✅ Supported
✅ Supported MIME Types: [...]
```

### ฟังก์ชัน `testVideoConstraints()`

ฟังก์ชันนี้จะทดสอบการตั้งค่า video constraints:

```javascript
import { testVideoConstraints } from "./utils/browserTest";

const constraints = testVideoConstraints();
```

### ฟังก์ชัน `testWebMSupport()`

ฟังก์ชันนี้จะทดสอบการรองรับ WebM format:

```javascript
import { testWebMSupport } from "./utils/browserTest";

const webmSupport = testWebMSupport();
```

**ผลลัพธ์ใน Console:**

```
🧪 Testing WebM Support...
Platform: Android=true, Chrome=true
video/webm; codecs=vp9,opus: ✅ Supported
video/webm; codecs=vp8,opus: ✅ Supported
video/webm: ✅ Supported
✅ Supported WebM formats: 3/3
🎯 Best WebM format: video/webm; codecs=vp9,opus
```

## ไฟล์ที่เกี่ยวข้อง

1. **`src/utils/deviceUtils.js`** - ฟังก์ชันหลักสำหรับตรวจจับ browser และ MIME type
2. **`src/utils/browserTest.js`** - ฟังก์ชันทดสอบการทำงาน
3. **`src/utils/videoUtils.js`** - ฟังก์ชันจัดการวิดีโอและ WebM conversion
4. **`src/components/CameraUI/CameraUI.jsx`** - การใช้งานใน MediaRecorder
5. **`src/hooks/useUserCamera.js`** - การใช้งานใน camera hook
6. **`src/App.jsx`** - การใช้งานในการขอ permission

## หมายเหตุสำคัญ

1. **iOS/Safari**: ต้องการการตั้งค่า `playsinline` สำหรับ video elements
2. **Android/Chrome**: รองรับ WebM format ที่ให้คุณภาพดีกว่าและขนาดไฟล์เล็กลง
3. **Fallback**: ระบบจะใช้ `video/mp4` เป็น fallback หากไม่พบ MIME type ที่เหมาะสม
4. **Testing**: ควรทดสอบบนอุปกรณ์จริงเพื่อให้แน่ใจว่าการทำงานถูกต้อง

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **MediaRecorder ไม่รองรับ MIME type**

   - ตรวจสอบด้วย `MediaRecorder.isTypeSupported()`
   - ใช้ fallback MIME type

2. **iOS ไม่สามารถอัดวิดีโอได้**

   - ตรวจสอบการตั้งค่า `playsinline`
   - ตรวจสอบ permission สำหรับ microphone

3. **Chrome ไม่รองรับ codec**
   - ตรวจสอบเวอร์ชันของ Chrome
   - ใช้ fallback MIME type

### การ Debug

เปิด Developer Tools และดู console logs:

- Browser detection results
- MIME type selection
- MediaRecorder support status
