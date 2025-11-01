import React, { useEffect, useRef, useState } from "react";
import "../styles/CameraView.css";

const CameraView = ({ onReady }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const width = 600;
    const height = 450;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    video.width = width;
    video.height = height;
    canvas.width = width;
    canvas.height = height;

    const loadScripts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!document.getElementById("cameraUtils")) {
          const script1 = document.createElement("script");
          script1.src =
            "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
          script1.id = "cameraUtils";
          script1.onerror = () => {
            setError("Failed to load camera utilities");
            setIsLoading(false);
          };
          script1.onload = () => {
            if (!document.getElementById("faceMeshScript")) {
              const script2 = document.createElement("script");
              script2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh";
              script2.id = "faceMeshScript";
              script2.onerror = () => {
                setError("Failed to load face mesh detection");
                setIsLoading(false);
              };
              script2.onload = () => {
                try {
                  onReady(video, canvas, ctx);
                  setIsLoading(false);
                } catch (err) {
                  console.error("Error initializing camera:", err);
                  setError("Failed to initialize camera");
                  setIsLoading(false);
                }
              };
              document.body.appendChild(script2);
            } else {
              try {
                onReady(video, canvas, ctx);
                setIsLoading(false);
              } catch (err) {
                console.error("Error initializing camera:", err);
                setError("Failed to initialize camera");
                setIsLoading(false);
              }
            }
          };
          document.body.appendChild(script1);
        } else {
          try {
            onReady(video, canvas, ctx);
            setIsLoading(false);
          } catch (err) {
            console.error("Error initializing camera:", err);
            setError("Failed to initialize camera");
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error("Error loading scripts:", err);
        setError("Failed to load required scripts");
        setIsLoading(false);
      }
    };

    loadScripts();

    return () => {
      // Stop camera tracks when unmounting (modal close)
      try {
        const v = videoRef.current;
        if (v && v.srcObject) {
          const tracks = v.srcObject.getTracks?.() || [];
          tracks.forEach((t) => t.stop?.());
          v.srcObject = null;
        }
      } catch {}
    };
  }, [onReady]);

  if (error) {
    return (
      <div className="camera-error">
        <div className="error-content">
          <h3>Camera Error</h3>
          <p>{error}</p>
          <p className="error-help">
            Please check your camera permissions and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="camera-wrapper">
      {isLoading && (
        <div className="camera-loading">
          <div className="loading-spinner"></div>
          <p>Loading camera...</p>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="camera-video"
      />
      <canvas ref={canvasRef} className="camera-canvas" />
    </div>
  );
};

export default CameraView;
