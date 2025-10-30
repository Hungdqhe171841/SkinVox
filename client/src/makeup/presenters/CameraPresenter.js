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
          
          if (this.model.isFeatureActive('eyeshadow')) {
            this.drawEyeshadow(ctx, landmarks, canvas);
          }
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
    const w = canvas.width;
    const h = canvas.height;

    const raw =
      typeof this.model.getBlush === "function"
        ? this.model.getBlush() || {}
        : {};
    const blush = {
      color: raw.color || "rgba(255,120,120,0.25)",
      intensity: raw.intensity ?? 0.35,
    };

    this.drawBlushArea(ctx, landmarks, null, w, h, blush, "left");
    this.drawBlushArea(ctx, landmarks, null, w, h, blush, "right");
  }

  drawBlushArea(ctx, landmarks, cheekPoints, w, h, blush, side) {
    const cheekCenter = side === "left" ? landmarks[116] : landmarks[345];
    let centerX = cheekCenter.x * w;
    let centerY = cheekCenter.y * h;

    const cheekLower = side === "left" ? landmarks[205] : landmarks[425];
    const cheekOuter = side === "left" ? landmarks[234] : landmarks[454];

    const nose = landmarks[1] || landmarks[4];
    if (nose && nose.x != null && nose.y != null) {
      const noseX = nose.x * w;
      const noseY = nose.y * h;
      const lerp = 0.15;
      const nudgedX = centerX * (1 - lerp) + noseX * lerp;
      const nudgedY = centerY * (1 - lerp) + noseY * lerp;
      centerX = nudgedX;
      centerY = nudgedY;
    }

    const forehead = landmarks[10];
    const chin = landmarks[152];
    let faceHeight = h * 0.4;

    if (
      forehead &&
      chin &&
      typeof forehead.y === "number" &&
      typeof chin.y === "number"
    ) {
      faceHeight = Math.abs((chin.y - forehead.y) * h);
    }

    const shiftDown = faceHeight * 0.04;
    centerY = centerY + shiftDown;

    const baseRadius = Math.max(30, Math.round(faceHeight * 0.1));
    const radiusX = baseRadius * 1.8;
    const radiusY = baseRadius * 0.8;

    let angle = 0;
    if (cheekOuter && cheekLower) {
      const dx = (cheekOuter.x - cheekLower.x) * w;
      const dy = (cheekOuter.y - cheekLower.y) * h;
      angle = Math.atan2(dy, dx);
      angle += side === "left" ? -0.2 : 0.2;
    }

    const offCanvas = document.createElement("canvas");
    offCanvas.width = w;
    offCanvas.height = h;
    const offCtx = offCanvas.getContext("2d");

    offCtx.save();
    offCtx.translate(centerX, centerY);
    offCtx.rotate(angle);

    const gradient = offCtx.createRadialGradient(0, 0, 0, 0, 0, radiusX);
    gradient.addColorStop(0, blush.color);
    gradient.addColorStop(0.4, blush.color.replace(/[\d.]+\)$/g, "0.2)"));
    gradient.addColorStop(0.7, blush.color.replace(/[\d.]+\)$/g, "0.1)"));
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    offCtx.fillStyle = gradient;
    offCtx.beginPath();
    offCtx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
    offCtx.fill();

    const secondGradient = offCtx.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      radiusX * 1.2
    );
    secondGradient.addColorStop(0, blush.color.replace(/[\d.]+\)$/g, "0.1)"));
    secondGradient.addColorStop(
      0.5,
      blush.color.replace(/[\d.]+\)$/g, "0.05)")
    );
    secondGradient.addColorStop(1, "rgba(0,0,0,0)");

    offCtx.fillStyle = secondGradient;
    offCtx.beginPath();
    offCtx.ellipse(0, 0, radiusX * 1.2, radiusY * 1.1, 0, 0, Math.PI * 2);
    offCtx.fill();

    offCtx.restore();

    offCtx.save();
    offCtx.globalCompositeOperation = "destination-in";

    if (cheekCenter && cheekOuter && cheekLower) {
      const cheekCenterPx = { x: cheekCenter.x * w, y: cheekCenter.y * h };

      const boundaryRadius = Math.max(radiusX * 1.3, radiusY * 1.5);
      const boundaryGradient = offCtx.createRadialGradient(
        cheekCenterPx.x,
        cheekCenterPx.y,
        0,
        cheekCenterPx.x,
        cheekCenterPx.y,
        boundaryRadius
      );
      boundaryGradient.addColorStop(0, "rgba(255,255,255,1)");
      boundaryGradient.addColorStop(0.8, "rgba(255,255,255,0.8)");
      boundaryGradient.addColorStop(1, "rgba(255,255,255,0)");

      offCtx.fillStyle = boundaryGradient;
      offCtx.beginPath();
      offCtx.arc(
        cheekCenterPx.x,
        cheekCenterPx.y,
        boundaryRadius,
        0,
        Math.PI * 2
      );
      offCtx.fill();
    }

    offCtx.restore();

    const blurAmount = Math.max(8, Math.round(baseRadius / 4));

    ctx.save();
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.globalAlpha = blush.intensity || 0.35;
    ctx.drawImage(offCanvas, 0, 0);
    ctx.restore();
  }

  // ==================== EYESHADOW ====================
  drawEyeshadow(ctx, landmarks, canvas) {
    const w = canvas.width,
      h = canvas.height;
    const eyeshadow =
      typeof this.model.getEyeshadow === "function"
        ? this.model.getEyeshadow() || {}
        : {};
    const blush =
      typeof this.model.getBlush === "function"
        ? this.model.getBlush() || {}
        : {};
    const baseColor =
      eyeshadow.color || blush.color || "rgba(198,120,110,0.28)";
    const intensity = eyeshadow.intensity ?? blush.intensity ?? 0.35;

    // Offscreen canvas for blending
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const oc = off.getContext("2d");
    oc.clearRect(0, 0, w, h);
    const filterOK = "filter" in oc;

    // Upper eyelid
    const L_UP = [33, 246, 161, 160, 159, 158, 157, 173, 133];
    const R_UP = [263, 466, 388, 387, 386, 385, 384, 398, 362];

    // Lower eyelid (for eye closed detection)
    const L_DOWN = [33, 7, 163, 144, 145, 153, 154, 155, 133];
    const R_DOWN = [263, 382, 381, 380, 374, 373, 390, 249, 362];

    const softness = Math.max(
      2,
      (((eyeshadow.softness ?? 5) * Math.max(w, h)) / 900) * 1.5
    );

    // Orient by corner
    const orientByCorner = (pts, innerIdx, outerIdx) => {
      const inner = landmarks[innerIdx],
        outer = landmarks[outerIdx];
      if (!inner || !outer) return pts;
      const ix = inner.x * w,
        iy = inner.y * h;
      const ox = outer.x * w,
        oy = outer.y * h;
      const d0 = Math.hypot(pts[0].x - ix, pts[0].y - iy);
      const d1 = Math.hypot(pts[0].x - ox, pts[0].y - oy);
      return d0 < d1 ? pts : pts.slice().reverse();
    };

    // Check if eye is closed
    const checkEyeClosed = (upPts, downPts) => {
      if (!upPts || !downPts || upPts.length < 3 || downPts.length < 3)
        return false;
      let totalDist = 0;
      let count = 0;
      for (let i = 0; i < Math.min(upPts.length, downPts.length); i++) {
        const up = upPts[i];
        const down = downPts[i];
        totalDist += Math.hypot(up.y - down.y, up.x - down.x);
        count++;
      }
      const avgDist = count > 0 ? totalDist / count : 0;
      return avgDist < h * 0.01;
    };

    const paintUpper = (UP, DOWN, innerIdx, outerIdx) => {
      let up = this._eyePtsToCanvas(landmarks, UP, w, h);
      let down = this._eyePtsToCanvas(landmarks, DOWN, w, h);
      if (up.length < 4) return;

      up = orientByCorner(up, innerIdx, outerIdx);
      down = orientByCorner(down, innerIdx, outerIdx);

      const isEyeClosed = checkEyeClosed(up, down);

      const eyeW =
        Math.max(...up.map((p) => p.x)) - Math.min(...up.map((p) => p.x));
      const eyeH =
        Math.max(...up.map((p) => p.y)) - Math.min(...up.map((p) => p.y));
      const base = Math.max(eyeW, eyeH);

      let cx = up.reduce((s, p) => s + p.x, 0) / up.length;
      let cy = up.reduce((s, p) => s + p.y, 0) / up.length;

      const cat = Math.max(1, eyeshadow.catFactor ?? 1.15);
      const upperBase = Math.max(
        3,
        (eyeshadow.upperWidthFactor ?? 0.35) * base
      );
      const growBase = (eyeshadow.extendFactor ?? 0.12) * base;

      const upperInner = upperBase * (eyeshadow.upperInnerScale ?? 0.2);
      const upperOuter = upperBase * (eyeshadow.upperOuterScale ?? 1.35 * cat);
      const growInner = growBase * (eyeshadow.innerExtendScale ?? 0.3);
      const growOuter = growBase * (eyeshadow.outerExtendScale ?? 1.5 * cat);

      const liftFactor = isEyeClosed ? 0.05 : 0.1;
      const liftInner = upperBase * (eyeshadow.liftInnerScale ?? liftFactor);
      const liftOuter =
        upperBase * (eyeshadow.liftOuterScale ?? liftFactor * 2);

      const upLifted = this._offsetPolylineNormal(
        up,
        { cx, cy },
        liftInner,
        liftOuter
      );

      cx = upLifted.reduce((s, p) => s + p.x, 0) / upLifted.length;
      cy = upLifted.reduce((s, p) => s + p.y, 0) / upLifted.length;

      const bandUp = this._computeEyeshadowBand(
        upLifted,
        { cx, cy },
        upperInner,
        upperOuter,
        growInner,
        growOuter
      );

      // 1) Fill wash in band
      oc.save();
      oc.beginPath();
      this._traceBandFromGeom(oc, bandUp);
      oc.clip();
      oc.save();
      if (filterOK) oc.filter = `blur(${softness}px)`;
      oc.globalAlpha = intensity;
      oc.fillStyle = baseColor;
      oc.fillRect(0, 0, w, h);
      oc.restore();

      // 2) Feather outer edge
      oc.save();
      oc.globalCompositeOperation = "destination-out";
      if (filterOK) oc.filter = `blur(${softness * 1.05}px)`;
      oc.lineCap = "round";
      oc.lineJoin = "round";
      oc.strokeStyle = "rgba(0,0,0,1)";
      oc.lineWidth = Math.max(upperBase * 0.9, 5);
      oc.beginPath();
      this._strokePolyline(oc, bandUp.outer);
      oc.stroke();
      oc.restore();

      // 3) Tight to lash line
      oc.save();
      const tight = this._computeEyeshadowBand(
        upLifted,
        { cx, cy },
        0.5,
        Math.max(1.2, upperBase * 0.25),
        growInner * 0.5,
        growOuter * 0.5
      );
      oc.beginPath();
      this._traceBandFromGeom(oc, tight);
      oc.clip();
      if (filterOK) oc.filter = `blur(${Math.max(1, softness * 0.4)}px)`;
      oc.globalAlpha = Math.min(1, intensity * 1.05);
      oc.strokeStyle = baseColor;
      oc.lineCap = "round";
      oc.lineJoin = "round";
      oc.lineWidth = Math.max(1, upperBase * 0.2);
      oc.beginPath();
      upLifted.forEach((p, i) =>
        i ? oc.lineTo(p.x, p.y) : oc.moveTo(p.x, p.y)
      );
      oc.stroke();
      oc.restore();

      // 4) Outer-V at tail
      const outer = upLifted[upLifted.length - 1];
      const prev = upLifted[upLifted.length - 2];
      let tx = outer.x - prev.x,
        ty = outer.y - prev.y;
      const len = Math.hypot(tx, ty) || 1;
      tx /= len;
      ty /= len;
      let nx = -ty,
        ny = tx;
      if ((outer.x - cx) * nx + (outer.y - cy) * ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      const spotX = outer.x + nx * (upperBase * 0.65) + tx * (upperBase * 0.5);
      const spotY = outer.y + ny * (upperBase * 0.65) + ty * (upperBase * 0.5);
      this._softSpot(
        oc,
        spotX,
        spotY,
        upperBase * 0.8,
        baseColor,
        Math.min(0.85, intensity * 1.1),
        Math.max(5, softness * 0.7),
        "multiply"
      );

      oc.restore();
    };

    paintUpper(L_UP, L_DOWN, 133, 33);
    paintUpper(R_UP, R_DOWN, 362, 263);

    // Mask to face oval
    oc.save();
    oc.globalCompositeOperation = "destination-in";
    oc.beginPath();
    this._traceFaceOval(oc, landmarks, w, h);
    oc.fill();
    oc.restore();

    // Composite onto skin
    ctx.save();
    ctx.globalCompositeOperation = eyeshadow.blendMode || "soft-light";
    ctx.globalAlpha = eyeshadow.opacity ?? 0.85;
    ctx.drawImage(off, 0, 0);
    ctx.restore();
  }

  // ==================== HELPER METHODS ====================
  _eyePtsToCanvas(landmarks, indices, w, h) {
    return indices
      .map((i) => {
        const pt = landmarks[i];
        return pt ? { x: pt.x * w, y: pt.y * h } : null;
      })
      .filter((p) => p);
  }

  _offsetPolylineNormal(poly, center, innerDist, outerDist) {
    const n = poly.length;
    const out = [];
    for (let i = 0; i < n; i++) {
      const p = poly[i];
      const prev = poly[i === 0 ? n - 1 : i - 1];
      const next = poly[(i + 1) % n];
      let tx = next.x - prev.x,
        ty = next.y - prev.y;
      const tlen = Math.hypot(tx, ty) || 1;
      tx /= tlen;
      ty /= tlen;
      let nx = -ty,
        ny = tx;
      const dx = p.x - center.cx,
        dy = p.y - center.cy;
      if (dx * nx + dy * ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      const t = i / (n - 1);
      const dist = innerDist + t * (outerDist - innerDist);
      out.push({ x: p.x + nx * dist, y: p.y + ny * dist });
    }
    return out;
  }

  _computeEyeshadowBand(inner, center, innerW, outerW, growI, growO) {
    const outer = this._offsetPolylineNormal(inner, center, innerW, outerW);
    const n = outer.length;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const grow = growI + t * (growO - growI);
      const p = inner[i];
      const dx = outer[i].x - p.x,
        dy = outer[i].y - p.y;
      const dlen = Math.hypot(dx, dy) || 1;
      outer[i].x += (dx / dlen) * grow;
      outer[i].y += (dy / dlen) * grow;
    }
    return { inner, outer };
  }

  _traceBandFromGeom(ctx, band) {
    const { inner, outer } = band;
    ctx.moveTo(inner[0].x, inner[0].y);
    for (let i = 1; i < inner.length; i++) {
      ctx.lineTo(inner[i].x, inner[i].y);
    }
    for (let i = outer.length - 1; i >= 0; i--) {
      ctx.lineTo(outer[i].x, outer[i].y);
    }
    ctx.closePath();
  }

  _strokePolyline(ctx, pts) {
    if (!pts || pts.length < 2) return;
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
  }

  _traceFaceOval(ctx, landmarks, w, h) {
    const oval = [
      10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
      378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
      162, 21, 54, 103, 67, 109,
    ];
    ctx.moveTo(landmarks[oval[0]].x * w, landmarks[oval[0]].y * h);
    for (let i = 1; i < oval.length; i++) {
      const pt = landmarks[oval[i]];
      ctx.lineTo(pt.x * w, pt.y * h);
    }
    ctx.closePath();
  }

  _softSpot(ctx, x, y, radius, color, alpha, blur, mode) {
    ctx.save();
    if (mode) ctx.globalCompositeOperation = mode;
    ctx.globalAlpha = alpha || 0.35;
    if ("filter" in ctx) ctx.filter = `blur(${blur || 5}px)`;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color.replace(/[\d.]+\)$/g, "0)"));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
