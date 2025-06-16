import React, { useState, useMemo, useRef, useEffect } from 'react';
import './AROverlay.css';
import { AdvancedVideo, AdvancedImage } from '@cloudinary/react';
import { useFaceTracker } from '../../hooks/useFaceTracker';
import { FLAVORS } from '../../data/flavors';
import { cld } from '../../utils/cloudinary';
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { videoCodec } from "@cloudinary/url-gen/actions/transcode";
import { auto } from "@cloudinary/url-gen/qualifiers/videoCodec";
import FlavorSelector from '../FlavorSelector/FlavorSelector';

import { FaceDebugMesh } from '../Debug/FaceMeshDebug'; // Import ตัวดีบัก
// import { ARScene } from '../ARScene/ARScene';


const AROverlay = ({ cameraStream }) => {
    const [selectedFlavorId, setSelectedFlavorId] = useState(FLAVORS[0].id);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const userCameraCanvasRef = useRef(null);

    const { results: faceTrackerResults, videoStream: trackerVideoStream } = useFaceTracker(cameraStream);

    useEffect(() => {
        if (cameraStream && userCameraCanvasRef.current) {
            const canvas = userCameraCanvasRef.current;
            const ctx = canvas.getContext('2d');
            const video = document.createElement('video');
            video.srcObject = cameraStream;
            video.play();
            let animationFrameId;

            const drawToCanvas = () => {
                if (video.readyState >= video.HAVE_CURRENT_DATA) {
                    if (!isCameraReady) setIsCameraReady(true);
                    if (canvas.width !== video.videoWidth) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                    }
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.translate(-canvas.width, 0);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    ctx.restore();
                }
                animationFrameId = requestAnimationFrame(drawToCanvas);
            };
            video.onloadeddata = drawToCanvas;
            return () => {
                cancelAnimationFrame(animationFrameId);
                video.pause();
                video.srcObject = null;
            };
        }
    }, [cameraStream, isCameraReady]);

    const selectedFlavor = FLAVORS.find(flavor => flavor.id === selectedFlavorId);

    const cldVideo = useMemo(() => {
        if (!selectedFlavor?.videoPublicId) return null;
        return cld.video(selectedFlavor.videoPublicId)
            .delivery(quality('auto'))
            .transcode(videoCodec(auto()));
    }, [selectedFlavor]);

    const cldLogo = useMemo(() => {
        return cld.image('TKO/MAMAOK/images/mama-logo.webp').delivery(quality('auto'));
    }, []);

    return (
        <div className="ar-overlay">
            {/* Layer 1: ภาพกล้อง */}
            <canvas ref={userCameraCanvasRef} className="user-camera-feed" />

            {/* Layer 2: Debug Mesh */}
            {/* แสดงก็ต่อเมื่อมีผลลัพธ์ */}
            {faceTrackerResults && (
                <FaceDebugMesh
                    results={faceTrackerResults}
                    videoElement={trackerVideoStream}
                />
            )}

            {/* Layer 2: โลก 3D */}
            {/* <ARScene landmarks={faceTrackerResults} selectedFlavor={selectedFlavor} /> */}

            {/* Layer 3: UI 2D */}
            <div className={`presenter-video-container ${isCameraReady ? 'visible' : ''}`}>
                <AdvancedImage cldImg={cldLogo} alt="Client Logo" className="client-logo" />
                {cldVideo && (
                    <AdvancedVideo
                        key={selectedFlavor.id}
                        cldVid={cldVideo}
                        className="presenter-video"
                        autoPlay muted loop playsInline
                    />
                )}
            </div>

            {isCameraReady && (
                <FlavorSelector
                    selectedFlavorId={selectedFlavorId}
                    onSelectFlavor={setSelectedFlavorId}
                />
            )}
        </div>
    );
};

export default AROverlay;