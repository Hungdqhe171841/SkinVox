export class CameraPresenter {
  constructor(model, presets) {
    this.model = model;
    this.presets = presets;
  }

  createCallback() {
    return async (video, canvas, ctx) => {
      await this.model.loadFaceMesh(video, (results) => {
        const landmarks = results.multiFaceLandmarks?.[0];
        if (landmarks) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (this.model.isFeatureActive('blush')) {
            this.drawBlush(ctx, landmarks, canvas);
          }
          if (this.model.isFeatureActive('eyebrow')) {
            this.drawEyebrows(ctx, landmarks, canvas);
          }
          if (this.model.isFeatureActive('eyelash')) {
            this.drawEyelashes(ctx, landmarks, canvas);
          }
          if (this.model.isFeatureActive('lipstick')) {
            this.drawLips(ctx, landmarks, canvas);
          }
        }
      });
    };
  }

  drawLips(ctx, landmarks, canvas) {
    const upperLip = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
    const lowerLip = [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61];
    const innerMouth = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 78];

    const w = canvas.width;
    const h = canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();

    upperLip.forEach((i, idx) => {
      const pt = landmarks[i];
      const x = pt.x * w;
      const y = pt.y * h;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    for (let i = lowerLip.length - 1; i >= 0; i--) {
      const pt = landmarks[lowerLip[i]];
      ctx.lineTo(pt.x * w, pt.y * h);
    }

    ctx.closePath();

    ctx.moveTo(landmarks[innerMouth[0]].x * w, landmarks[innerMouth[0]].y * h);
    for (let i = innerMouth.length - 1; i >= 0; i--) {
      const pt = landmarks[innerMouth[i]];
      ctx.lineTo(pt.x * w, pt.y * h);
    }
    ctx.closePath();

    try {
      ctx.clip("evenodd");
    } catch (e) {
      ctx.clip();
    }

    ctx.globalAlpha = 0.85; // tăng độ đậm
    ctx.fillStyle = this.model.getColor();
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Highlight vùng giữa môi
    const pt = landmarks[13];
    const hx = pt.x * w;
    const hy = pt.y * h;
    const gradient = ctx.createRadialGradient(hx, hy, 2, hx, hy, 30);
    gradient.addColorStop(0, "rgba(255,255,255,0.3)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.arc(hx, hy, 30, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  }

  drawEyelashes(ctx, landmarks, canvas) {
    const eyelash = this.model.getEyelash();
    const w = canvas.width;
    const h = canvas.height;

    // Upper eyelid landmarks for eyeliner
    const leftEyeUpper = [173, 157, 158, 159, 160, 161, 246];
    const rightEyeUpper = [398, 384, 385, 386, 387, 388, 466, 263];

    ctx.save();
    this.drawEyeliner(ctx, landmarks, leftEyeUpper, w, h, eyelash, 'left');
    this.drawEyeliner(ctx, landmarks, rightEyeUpper, w, h, eyelash, 'right');
    ctx.restore();
  }

  drawEyeliner(ctx, landmarks, eyeUpperPts, w, h, eyelash, side) {
    try {
      const upper = eyeUpperPts
        .map(i => landmarks[i] && { x: landmarks[i].x * w, y: landmarks[i].y * h })
        .filter(Boolean);
      if (upper.length < 4) return;

      const outerIdx = upper.length - 1;
      const outer = upper[outerIdx];
      const beforeOuter = upper[Math.max(0, outerIdx - 2)];

      // Vector tiếp tuyến mí trên
      let tx = outer.x - beforeOuter.x;
      let ty = outer.y - beforeOuter.y;
      const tlen = Math.hypot(tx, ty) || 1;
      tx /= tlen; ty /= tlen;

      // Hướng ra ngoài
      const baseAngle = side === 'left' ? -10 : 10; 
      const lift = -0.65; 
      const rad = baseAngle * Math.PI / 180;
      const cosA = Math.cos(rad), sinA = Math.sin(rad);
      const wx = tx * cosA - ty * sinA;
      const wy = tx * sinA + ty * cosA + lift; 

      const scale = Math.max(w, h) / 900;
      const wingLen = Math.max(10, (eyelash.length || 1) * 18 * scale);
      const wingTip = {
        x: outer.x + wx * wingLen,
        y: outer.y + wy * wingLen,
      };

      const curveMid = {
        x: (outer.x + wingTip.x) / 2,
        y: (outer.y + wingTip.y) / 2 - 4 * scale,
      };

      // Độ dày eyeliner
      let nx = -ty, ny = tx;
      if (side === 'left') { nx = -nx; ny = -ny; }
      const thicknessBase = Math.max(0.8, (eyelash.thickness || 1) * 0.8 * scale);
      const thicknessTail = thicknessBase * 2.5;

      ctx.beginPath();
      for (let i = 0; i < upper.length; i++) {
        if (i === 0) ctx.moveTo(upper[i].x, upper[i].y);
        else ctx.lineTo(upper[i].x, upper[i].y);
      }
      ctx.quadraticCurveTo(curveMid.x, curveMid.y, wingTip.x, wingTip.y);

      // Vẽ vùng tô
      for (let i = upper.length - 1; i >= 0; i--) {
        const t = i / (upper.length - 1);
        const thick = thicknessBase + (thicknessTail - thicknessBase) * t;
        const p = upper[i];
        ctx.lineTo(p.x + nx * thick, p.y + ny * thick);
      }

      ctx.closePath();

      ctx.save();
      const blur = Math.max(1, (eyelash.softness || 0.6) * 1.8);
      ctx.filter = `blur(${blur}px)`;
      ctx.fillStyle = eyelash.color || 'rgba(0,0,0,0.9)';
      ctx.globalAlpha = eyelash.opacity ?? 0.95;
      ctx.fill();
      ctx.filter = 'none';
      ctx.restore();
    } catch (e) {
      console.warn('Eyeliner render error:', e);
    }
  }

  drawEyelashSet(ctx, landmarks, eyePoints, w, h, eyelash, position, side) {
    for (let i = 0; i < eyePoints.length - 1; i++) {
      const pt = landmarks[eyePoints[i]];
      const x = pt.x * w;
      const y = pt.y * h;

      // Calculate lash direction and length
      const isUpper = position === 'upper';
      const lengthMultiplier = eyelash.length * (isUpper ? 15 : 8);
      const curlFactor = eyelash.curl;
      
      // Different curl directions for upper/lower lashes
      const baseAngle = isUpper ? -Math.PI/2 : Math.PI/2;
      const curlAngle = baseAngle + (curlFactor * (side === 'left' ? -0.5 : 0.5));
      
      const endX = x + Math.cos(curlAngle) * lengthMultiplier;
      const endY = y + Math.sin(curlAngle) * lengthMultiplier;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }

  drawEyebrows(ctx, landmarks, canvas) {
    const eyebrow = this.model.getEyebrow();
    const w = canvas.width;
    const h = canvas.height;

    // Left eyebrow landmarks
    const leftBrow = [46, 53, 52, 51, 48, 115, 131, 134, 102, 49, 220, 305, 292, 334, 293, 300, 276, 283, 282, 295, 285, 336, 296, 334];
    // Right eyebrow landmarks
    const rightBrow = [276, 283, 282, 295, 285, 336, 296, 334, 293, 300, 276, 283, 282, 295, 285, 336, 296, 334];

    ctx.save();
    ctx.fillStyle = eyebrow.color;
    ctx.strokeStyle = eyebrow.color;
    ctx.lineWidth = eyebrow.thickness;

    // Simplified eyebrow drawing using key landmarks
    const leftBrowPoints = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];
    const rightBrowPoints = [296, 334, 293, 300, 276, 283, 282, 295, 285, 336];

    this.drawEyebrowShape(ctx, landmarks, leftBrowPoints, w, h, eyebrow, 'left');
    this.drawEyebrowShape(ctx, landmarks, rightBrowPoints, w, h, eyebrow, 'right');

    ctx.restore();
  }

  drawEyebrowShape(ctx, landmarks, browPoints, w, h, eyebrow, side) {
    if (browPoints.length < 3) return;

    // Build a smooth filled shape across the brow points and fill with a soft gradient
    ctx.save();
    // Convert browPoints to pixel coordinates
    const pts = browPoints.map((i) => {
      const p = landmarks[i];
      return { x: p.x * w, y: p.y * h };
    });

    // Calculate a simple offset path below the brow to give thickness
    const downOffset = Math.max(6, eyebrow.thickness * 3);
    const lowerPts = pts.map((p, idx) => {
      // approximate normal by using previous and next point
      const prev = pts[Math.max(0, idx - 1)];
      const next = pts[Math.min(pts.length - 1, idx + 1)];
      const vx = next.x - prev.x;
      const vy = next.y - prev.y;
      const len = Math.hypot(vx, vy) || 1;
      // normal pointing roughly downward relative to brow curve
      const nx = -vy / len;
      const ny = vx / len;
      return { x: p.x + nx * downOffset * 0.6, y: p.y + ny * downOffset * 1.2 };
    });

    // Create path: top curve (pts) then bottom curve (lowerPts reversed)
    ctx.beginPath();
    pts.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    // smooth join to lower points
    for (let i = lowerPts.length - 1; i >= 0; i--) {
      const p = lowerPts[i];
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();

    // Gradient fill to simulate makeup shading (lighter at top, denser at center)
    const bboxMinX = Math.min(...pts.map(p => p.x));
    const bboxMaxX = Math.max(...pts.map(p => p.x));
    const bboxMinY = Math.min(...pts.map(p => p.y));
    const bboxMaxY = Math.max(...lowerPts.map(p => p.y));

    // safe helper to set alpha on rgba/hex-ish strings
    const setAlpha = (rgba, a) => {
      const m = rgba && rgba.match && rgba.match(/rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?([\d.]+))?\)/);
      if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${a})`;
      return rgba;
    };

    // Validate bbox values before using them in createLinearGradient
    if (!Number.isFinite(bboxMinX) || !Number.isFinite(bboxMaxX) || !Number.isFinite(bboxMinY) || !Number.isFinite(bboxMaxY)) {
      // Fallback: simple filled shape with semi-opaque color
      ctx.fillStyle = setAlpha(eyebrow.color, 0.8);
      ctx.fill();
      ctx.restore();
      return;
    }

    const grad = ctx.createLinearGradient(bboxMinX, bboxMinY, bboxMaxX, bboxMaxY);
    // top lighter
    grad.addColorStop(0, setAlpha(eyebrow.color, 0.35));
    // center more opaque
    grad.addColorStop(0.5, setAlpha(eyebrow.color, 0.85));
    // edge fade
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    // Soft shadow to blend into skin
    ctx.shadowColor = setAlpha(eyebrow.color, 0.25);
    ctx.shadowBlur = Math.max(4, Math.round(downOffset / 4));

    // Attempt to draw the eyebrow into an offscreen canvas and blur its edges for a soft makeup look
    try {
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const oc = off.getContext('2d');

      // create same gradient on offscreen context
      const ograd = oc.createLinearGradient(bboxMinX, bboxMinY, bboxMaxX, bboxMaxY);
      ograd.addColorStop(0, setAlpha(eyebrow.color, 0.35));
      ograd.addColorStop(0.5, setAlpha(eyebrow.color, 0.85));
      ograd.addColorStop(1, 'rgba(0,0,0,0)');

      // draw shape on offscreen
      oc.beginPath();
      pts.forEach((p, i) => {
        if (i === 0) oc.moveTo(p.x, p.y);
        else oc.lineTo(p.x, p.y);
      });
      for (let i = lowerPts.length - 1; i >= 0; i--) {
        const p = lowerPts[i];
        oc.lineTo(p.x, p.y);
      }
      oc.closePath();

      // apply blur on offscreen before filling
      const blurRadius = Math.max(2, Math.round(downOffset / 3));
      // Some browsers support context.filter
      if (oc.filter !== undefined) {
        oc.filter = `blur(${blurRadius}px)`;
        oc.fillStyle = ograd;
        oc.fill();
        oc.filter = 'none';
        // composite back to main canvas with optional softening
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.drawImage(off, 0, 0);
        ctx.restore();
      } else {
        // fallback: fill directly with gradient and small shadow
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // subtle inner highlight for depth (on main ctx)
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.08;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      // reset shadows
      ctx.shadowBlur = 0;
      ctx.restore();
    } catch (e) {
      // fallback if anything fails: draw directly
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  drawBlush(ctx, landmarks, canvas) {
    const blush = this.model.getBlush();
    const w = canvas.width;
    const h = canvas.height;

    // Cheek landmarks for blush placement
    const leftCheek = [116, 117, 118, 119, 120, 121, 126, 142, 36, 205, 206, 207, 213, 192, 147, 187, 207, 213, 192, 147];
    const rightCheek = [345, 346, 347, 348, 349, 350, 355, 371, 266, 425, 426, 427, 436, 416, 376, 411, 427, 436, 416, 376];

    ctx.save();
    ctx.globalAlpha = blush.intensity;

    // Draw left cheek blush
    this.drawBlushArea(ctx, landmarks, leftCheek, w, h, blush, 'left');
    
    // Draw right cheek blush
    this.drawBlushArea(ctx, landmarks, rightCheek, w, h, blush, 'right');

    ctx.restore();
  }

  drawBlushArea(ctx, landmarks, cheekPoints, w, h, blush, side) {
    // Use key cheek landmarks for blush placement
    const cheekCenter = side === 'left' ? landmarks[116] : landmarks[345];
    let centerX = cheekCenter.x * w;
    let centerY = cheekCenter.y * h;

    // Nudge blush slightly toward the nose for more natural placement
    const nose = landmarks[1] || landmarks[4];
    if (nose && nose.x != null && nose.y != null) {
      const noseX = nose.x * w;
      const noseY = nose.y * h;
      // lerp factor toward nose (0.0 = original, 1.0 = fully at nose)
      const lerp = 0.2; // small shift toward nose (increased per request)
      const nudgedX = centerX * (1 - lerp) + noseX * lerp;
      const nudgedY = centerY * (1 - lerp) + noseY * lerp;
      centerX = nudgedX;
      centerY = nudgedY;
    }

    // Also nudge the blush slightly downward (closer to eyes) by a fraction of face height
    const forehead = landmarks[10];
    const chin = landmarks[152];
    let faceHeight = h * 0.4;
    if (forehead && chin && typeof forehead.y === 'number' && typeof chin.y === 'number') {
      faceHeight = Math.abs((chin.y - forehead.y) * h);
    }
    const shiftDown = faceHeight * 0.06; // ~6% of face height (moved further down)
    centerY = centerY + shiftDown;

    // Create radial gradient for natural blush effect (bigger and softer)
    const radius = Math.max(50, Math.round(faceHeight * 0.12));
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );

    gradient.addColorStop(0, blush.color);
    gradient.addColorStop(0.75, blush.color.replace(/[\d\.]+\)$/g, '0.08)'));
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    // Use a soft shadow to blur the outer edge for a diffused makeup look
    ctx.save();
    ctx.shadowColor = blush.color.replace(/[\d\.]+\)$/g, ', 0.35)');
    ctx.shadowBlur = Math.max(12, Math.round(radius / 6));
    ctx.globalAlpha = blush.intensity || 0.35;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}
