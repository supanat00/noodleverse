import { useState, useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let faceLandmarkerInstance = null;
let animationFrameId = null;

export const useFaceTracker = (cameraStream) => {
  const [results, setResults] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(!!faceLandmarkerInstance);
  const videoRef = useRef(null);

  useEffect(() => {
    const createFaceLandmarker = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        faceLandmarkerInstance = await FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
              delegate: "GPU",
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          }
        );
        console.log("FaceLandmarker model loaded.");
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };
    if (!faceLandmarkerInstance) {
      createFaceLandmarker();
    }
  }, []);

  useEffect(() => {
    if (!cameraStream || !isModelLoaded) return;

    if (!videoRef.current) videoRef.current = document.createElement("video");
    const video = videoRef.current;

    if (video.srcObject !== cameraStream) video.srcObject = cameraStream;
    video.play();

    let lastVideoTime = -1;
    const predictWebcam = () => {
      if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        if (faceLandmarkerInstance) {
          const detectionResults = faceLandmarkerInstance.detectForVideo(
            video,
            performance.now()
          );
          setResults(detectionResults);
        }
      }
      animationFrameId = window.requestAnimationFrame(predictWebcam);
    };

    video.addEventListener("loadeddata", predictWebcam);
    return () => {
      video.removeEventListener("loadeddata", predictWebcam);
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [cameraStream, isModelLoaded]);

  return { results, videoStream: videoRef.current, isModelLoaded };
};
