# การใช้งาน mp4-muxer สำหรับ Android/Chrome

## ภาพรวม

ระบบได้รับการปรับปรุงให้ใช้ `mp4-muxer` สำหรับ Android/Chrome เพื่อสร้างไฟล์ MP4 ที่สมบูรณ์ตั้งแต่แรก โดยไม่ต้องแปลงจาก WebM

## การทำงาน

### 1. การตรวจจับ Browser

- **Android/Chrome**: ใช้ `mp4-muxer` กับ `VideoEncoder` และ `AudioEncoder` Web APIs
- **Browser อื่นๆ**: ใช้ `MediaRecorder` ตามปกติ

### 2. การอัดวิดีโอด้วย mp4-muxer

#### การตั้งค่า Muxer

```javascript
muxerRef.current = new Muxer({
  target: new ArrayBufferTarget(),
  video: { codec: "avc", width: videoWidth, height: videoHeight },
  audio: { codec: "aac", sampleRate: 44100, numberOfChannels: 1 },
  fastStart: "in-memory",
});
```

#### การตั้งค่า VideoEncoder

```javascript
videoEncoderRef.current = new VideoEncoder({
  output: (chunk, meta) => muxerRef.current.addVideoChunk(chunk, meta),
  error: (e) => console.error("VideoEncoder error:", e),
});
await videoEncoderRef.current.configure({
  codec: "avc1.42001f",
  width: videoWidth,
  height: videoHeight,
  bitrate: 3_000_000,
});
```

#### การตั้งค่า AudioEncoder

```javascript
audioEncoderRef.current = new AudioEncoder({
  output: (chunk, meta) => muxerRef.current.addAudioChunk(chunk, meta),
  error: (e) => console.error("AudioEncoder error:", e),
});
await audioEncoderRef.current.configure({
  codec: "mp4a.40.2",
  sampleRate: audioContext.sampleRate,
  numberOfChannels: 1,
  bitrate: 96000,
});
```

### 3. การประมวลผล Frame

```javascript
const processFrame = (currentTime) => {
  if (!isRecordingRef.current) return;
  if (recordingStartTime === null) recordingStartTime = currentTime;

  // วาดภาพลง Canvas
  // ...

  // ส่ง Frame ไป Encode
  if (videoEncoderRef.current?.state === "configured") {
    const elapsedTimeMs = currentTime - recordingStartTime;
    const timestamp = Math.round(elapsedTimeMs * 1000);
    const videoFrame = new VideoFrame(recordingCanvas, { timestamp });
    videoEncoderRef.current.encode(videoFrame);
    videoFrame.close();
  }

  animationFrameIdRef.current = requestAnimationFrame(processFrame);
};
```

### 4. การหยุดการอัดและสร้างไฟล์

```javascript
// Flush encoders
if (videoEncoderRef.current?.state === "configured") {
  await videoEncoderRef.current.flush().catch(console.error);
}
if (audioEncoderRef.current?.state === "configured") {
  await audioEncoderRef.current.flush().catch(console.error);
}

// Finalize muxer
if (muxerRef.current) {
  muxerRef.current.finalize();
  const { buffer } = muxerRef.current.target;
  const videoBlob = new Blob([buffer], { type: "video/mp4" });
  const videoUrl = URL.createObjectURL(videoBlob);
  setPreview({ type: "video", src: videoUrl, mimeType: "video/mp4" });
}
```

## ข้อดีของ mp4-muxer

1. **ไฟล์สมบูรณ์**: สร้างไฟล์ MP4 ที่สมบูรณ์ตั้งแต่แรก
2. **ไม่ต้องแปลง**: ไม่ต้องแปลงจาก WebM เป็น MP4
3. **คุณภาพดี**: ควบคุมคุณภาพได้ดีกว่า
4. **ขนาดไฟล์**: ขนาดไฟล์เหมาะสมกว่า

## การทดสอบ

### ตรวจสอบ Browser Support

```javascript
const androidChrome = isAndroid() && isChrome();
console.log("Using mp4-muxer:", androidChrome);
```

### ตรวจสอบ Web APIs Support

```javascript
const hasVideoEncoder = "VideoEncoder" in window;
const hasAudioEncoder = "AudioEncoder" in window;
console.log("VideoEncoder support:", hasVideoEncoder);
console.log("AudioEncoder support:", hasAudioEncoder);
```

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **VideoEncoder ไม่รองรับ**

   - ตรวจสอบ browser support
   - ใช้ MediaRecorder fallback

2. **AudioEncoder ไม่รองรับ**

   - บันทึกวิดีโอโดยไม่มีเสียง
   - ใช้ MediaRecorder fallback

3. **Memory Usage สูง**
   - ลด bitrate
   - ลดความละเอียด
   - ใช้ `fastStart: 'in-memory'`

## Dependencies

```json
{
  "mp4-muxer": "^5.2.1"
}
```

## Browser Support

- **Android Chrome**: ✅ รองรับเต็มรูปแบบ
- **Desktop Chrome**: ✅ รองรับเต็มรูปแบบ
- **Safari**: ❌ ไม่รองรับ (ใช้ MediaRecorder)
- **Firefox**: ❌ ไม่รองรับ (ใช้ MediaRecorder)
- **Edge**: ❌ ไม่รองรับ (ใช้ MediaRecorder)

## การพัฒนาในอนาคต

1. เพิ่มการรองรับ codec อื่นๆ
2. ปรับปรุงการจัดการ memory
3. เพิ่มการรองรับ browser อื่นๆ
4. เพิ่มการตั้งค่าคุณภาพที่หลากหลาย
