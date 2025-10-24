export class MakeupModel {
  constructor() {
    this.selectedColor = "rgba(211, 39, 42, 0.7)";
    this.selectedEyelash = {
      name: "Default",
      color: "rgba(0, 0, 0, 0.9)",
      length: 1.0,
      thickness: 1.0,
      curl: 0.3,
      softness: 0.6,
      opacity: 0.95
    };
    this.selectedEyebrow = {
      name: "Default",
      color: "rgba(139, 69, 19, 0.8)",
      thickness: 1.0
    };
    this.selectedBlush = {
      name: "Default",
      color: "rgba(255, 218, 185, 0.4)",
      intensity: 0.35
    };
    this.activeFeatures = {
      lipstick: true,
      eyelash: false,
      eyebrow: false,
      blush: false
    };
  }

  getColor() {
    return this.selectedColor;
  }

  setColor(color) {
    // Kiểm tra nếu color là undefined hoặc null
    if (!color || typeof color !== 'string') {
      console.warn('Invalid color provided to setColor:', color);
      return;
    }

    if (color.startsWith("#")) {
      // Convert hex to rgba with alpha 0.3
      const bigint = parseInt(color.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      this.selectedColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
    } else {
      const match = color.match(/rgba?\((\d+), ?(\d+), ?(\d+)(, ?([\d.]+))?\)/);
      if (match) {
        this.selectedColor = `rgba(${match[1]}, ${match[2]}, ${match[3]}, 0.3)`;
      } else {
        this.selectedColor = color;
      }
    }
  }

  getPresets() {
    return {}; // No longer using static presets
  }

  // Eyelash methods 
  getEyelash() {
    return this.selectedEyelash;
  }

  setEyelash(eyelash) {
    this.selectedEyelash = eyelash;
  }

  getEyelashPresets() {
    return {}; // No longer using static presets
  }

  // Eyebrow methods 
  getEyebrow() {
    return this.selectedEyebrow;
  }

  setEyebrow(eyebrow) {
    this.selectedEyebrow = eyebrow;
  }

  getEyebrowPresets() {
    return {}; // No longer using static presets
  }

  // Blush methods
  getBlush() {
    return this.selectedBlush;
  }

  setBlush(blush) {
    this.selectedBlush = blush;
  }

  getBlushPresets() {
    return {}; // No longer using static presets
  }

  // Feature toggle methods
  toggleFeature(feature) {
    this.activeFeatures[feature] = !this.activeFeatures[feature];
  }

  isFeatureActive(feature) {
    return this.activeFeatures[feature];
  }

  setFeatureActive(feature, active) {
    this.activeFeatures[feature] = active;
  }

  async loadFaceMesh(video, onResults) {
    // Yêu cầu quyền truy cập camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // Lấy class FaceMesh và Camera từ window nếu dùng CDN
    const FaceMesh = window.FaceMesh;
    const Camera = window.Camera;

    if (!FaceMesh || !Camera) {
      console.error("❌ Mediapipe scripts chưa được load đúng cách!");
      return;
    }

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    const camera = new Camera(video, {
      onFrame: async () => {
        await faceMesh.send({ image: video });
      },
      width: 800,
      height: 640,
    });

    camera.start();
  }
}
