export class CameraPresenter {
  constructor(model, presets) {
    this.model = model;
    this.presets = presets;
    this.compareSide = null; // 'left' or 'right' or null
    this.compareOffsetPx = 0;
  }

  setCompareSide(side) {
    this.compareSide = side === "left" || side === "right" ? side : null;
  }

  setCompareOffset(px) {
    this.compareOffsetPx = Number.isFinite(+px) ? +px : 0;
  }

  createCallback() {
    return async (video, canvas, ctx) => {
      await this.model.loadFaceMesh(video, (results) => {
        const lms = results.multiFaceLandmarks?.[0];
        if (!lms) return;

        // 1) Đồng bộ DPR + reset
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const cssW = Math.max(1, Math.round(rect.width));
        const cssH = Math.max(1, Math.round(rect.height));
        if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
          canvas.width = cssW * dpr;
          canvas.height = cssH * dpr;
        }

        const w = canvas.width,
          h = canvas.height;

        // Reset mọi state trước khi vẽ
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.filter = "none";
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, w, h);

        // 2) Render makeup vào offscreen cùng kích thước
        const fx =
          this._fxCanvas || (this._fxCanvas = document.createElement("canvas"));
        if (fx.width !== w || fx.height !== h) {
          fx.width = w;
          fx.height = h;
        }
        const fxCtx = fx.getContext("2d");
        fxCtx.setTransform(1, 0, 0, 1, 0, 0);
        fxCtx.filter = "none";
        fxCtx.globalAlpha = 1;
        fxCtx.globalCompositeOperation = "source-over";
        fxCtx.clearRect(0, 0, w, h);

        // Vẽ các feature
        if (this.model.isFeatureActive("blush"))
          this.drawBlush(fxCtx, lms, canvas);
        if (this.model.isFeatureActive("eyebrow"))
          this.drawEyebrows(fxCtx, lms, canvas);
        if (this.model.isFeatureActive("eyelash"))
          this.drawEyelashes(fxCtx, lms, canvas);
        if (this.model.isFeatureActive("eyeshadow"))
          this.drawEyeshadow(fxCtx, lms, canvas);
        if (this.model.isFeatureActive("lipstick"))
          this.drawLips(fxCtx, lms, canvas);

        // 3) Ghép nửa khung theo kích thước HIỂN THỊ
        const mid = Math.round((cssW / 2 + (this.compareOffsetPx || 0)) * dpr);

        if (!this.compareSide) {
          ctx.drawImage(fx, 0, 0);
        } else {
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.filter = "none";
          ctx.beginPath();
          if (this.compareSide === "right") ctx.rect(mid, 0, w - mid, h);
          else ctx.rect(0, 0, mid, h);
          ctx.clip();
          ctx.drawImage(fx, 0, 0);
          ctx.restore();

          this._drawCompareDivider(ctx, w, h, mid);
        }
      });
    };
  }

  _drawCompareDivider(ctx, w, h, x) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = "none";
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = Math.max(1, Math.round(Math.min(w, h) * 0.0035));
    const xPx = Math.round(x) + 0.5;
    ctx.beginPath();
    ctx.moveTo(xPx, 0);
    ctx.lineTo(xPx, h);
    ctx.stroke();
    ctx.restore();
  }

  drawLips(ctx, landmarks, canvas) {
    const w = canvas.width;
    const h = canvas.height;

    // --- Các nhóm landmark môi ---
    const upperLipIdx = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
    const lowerLipIdx = [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61];
    const innerMouthIdx = [
      78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 78,
    ];

    // --- Hàm chuyển landmark thành toạ độ canvas ---
    const mapPts = (idxs) =>
      idxs
        .map((i) => landmarks[i])
        .filter((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y))
        .map((p) => ({ x: p.x * w, y: p.y * h }));

    const outerPts = mapPts([...upperLipIdx, ...lowerLipIdx]);
    const innerPts = mapPts(innerMouthIdx);

    if (outerPts.length < 3 || innerPts.length < 3) return;

    // --- Khi há miệng, mở rộng vùng trong để không bị che răng ---
    const topInner = landmarks[13];
    const bottomInner = landmarks[14];
    if (topInner && bottomInner) {
      const mouthOpen = Math.abs(bottomInner.y - topInner.y);
      if (mouthOpen > 0.03) {
        const cy = innerPts.reduce((s, p) => s + p.y, 0) / innerPts.length;
        const scale = 1 + (mouthOpen - 0.12) * 2.2; // độ giãn khi há miệng
        innerPts.forEach((p) => (p.y = cy + (p.y - cy) * scale));
      }
    }

    // --- Hàm sắp xếp quanh tâm để tránh polygon tự cắt ---
    const sortAroundCentroid = (pts) => {
      const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
      return pts
        .slice()
        .sort(
          (a, b) =>
            Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx)
        );
    };

    const outerSorted = sortAroundCentroid(outerPts);
    const innerSorted = sortAroundCentroid(innerPts);

    // --- Vẽ vùng môi (outer - inner) ---
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(outerSorted[0].x, outerSorted[0].y);
    for (let i = 1; i < outerSorted.length; i++)
      ctx.lineTo(outerSorted[i].x, outerSorted[i].y);
    ctx.closePath();

    ctx.moveTo(innerSorted[0].x, innerSorted[0].y);
    for (let i = 1; i < innerSorted.length; i++)
      ctx.lineTo(innerSorted[i].x, innerSorted[i].y);
    ctx.closePath();

    // --- Tô màu môi ---
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = this.model.getColor();
    try {
      ctx.fill("evenodd");
    } catch {
      ctx.save();
      ctx.clip("evenodd");
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;

    // --- Thêm bóng sáng highlight môi ---
    const center = outerSorted.reduce(
      (s, p) => ({ x: s.x + p.x, y: s.y + p.y }),
      { x: 0, y: 0 }
    );
    const cnt = outerSorted.length;
    const cx = center.x / cnt;
    const cy = center.y / cnt;

    const rad = Math.max(18, Math.min(w, h) * 0.04);
    const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, rad);
    g.addColorStop(0, "rgba(255,255,255,0.34)");
    g.addColorStop(0.5, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.55;
    ctx.filter = "blur(6px)";
    ctx.beginPath();
    ctx.moveTo(outerSorted[0].x, outerSorted[0].y);
    for (let i = 1; i < outerSorted.length; i++)
      ctx.lineTo(outerSorted[i].x, outerSorted[i].y);
    ctx.closePath();

    ctx.moveTo(innerSorted[0].x, innerSorted[0].y);
    for (let i = 1; i < innerSorted.length; i++)
      ctx.lineTo(innerSorted[i].x, innerSorted[i].y);
    ctx.closePath();

    try {
      ctx.fillStyle = g;
      ctx.fill("evenodd");
    } catch {
      ctx.save();
      ctx.clip("evenodd");
      ctx.fillStyle = g;
      ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      ctx.restore();
    }
    ctx.filter = "none";
    ctx.globalAlpha = 1.0;
    ctx.restore();
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
      const thicknessBase = Math.max(1.2, (eyelash.thickness || 1) * 1.2 * scale); // Increased from 0.8 to 1.2
      const thicknessTail = thicknessBase * 2.8; // Increased from 2.5 to 2.8

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
    // Initialize storage for previous lash positions if not exists
    if (!this._prevLashes) this._prevLashes = {};
    if (!this._prevLashes[side]) this._prevLashes[side] = {};
    if (!this._prevLashes[side][position])
      this._prevLashes[side][position] = [];

    // Smoothing factor for lash animation
    const smoothingFactor = 0.65; // Higher = more smoothing (0-1)

    // Array to store current lash end points for next frame
    const currentLashes = [];

    for (let i = 0; i < eyePoints.length - 1; i++) {
      const pt = landmarks[eyePoints[i]];
      if (!pt) continue;

      const x = pt.x * w;
      const y = pt.y * h;

      // Calculate lash direction and length
      const isUpper = position === "upper";
      const lengthMultiplier = eyelash.length * (isUpper ? 15 : 8);
      const curlFactor = eyelash.curl;
      
      // Different curl directions for upper/lower lashes
      const baseAngle = isUpper ? -Math.PI / 2 : Math.PI / 2;
      const curlAngle = baseAngle + curlFactor * (side === "left" ? -0.5 : 0.5);

      // Calculate raw end point
      const rawEndX = x + Math.cos(curlAngle) * lengthMultiplier;
      const rawEndY = y + Math.sin(curlAngle) * lengthMultiplier;

      // Get previous lash end point if available
      const prevLash = this._prevLashes[side][position][i];

      // Apply smoothing if we have previous data
      let endX = rawEndX;
      let endY = rawEndY;

      if (prevLash) {
        endX = prevLash.x * smoothingFactor + rawEndX * (1 - smoothingFactor);
        endY = prevLash.y * smoothingFactor + rawEndY * (1 - smoothingFactor);
      }

      // Store current end point for next frame
      currentLashes[i] = { x: endX, y: endY };

      // Draw the lash with a slight curve for more natural look
      ctx.beginPath();
      ctx.moveTo(x, y);

      // Use quadratic curve instead of straight line for more natural lashes
      const controlX = x + (endX - x) * 0.5 + (Math.random() - 0.5) * 2;
      const controlY = y + (endY - y) * 0.4;

      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.stroke();
    }

    // Store current lashes for next frame
    this._prevLashes[side][position] = currentLashes;
  }

  drawEyebrows(ctx, landmarks, canvas) {
    const eyebrow = this.model.getEyebrow();
    const w = canvas.width;
    const h = canvas.height;

    const leftTop = [70, 63, 105, 66, 107];
    const leftBottom = [46, 53, 52, 65, 55];
    const rightTop = [336, 296, 334, 293, 300];
    const rightBottom = [285, 295, 282, 283, 276];

    this.drawEyebrowShape(
      ctx,
      landmarks,
      leftTop,
      leftBottom,
      w,
      h,
      eyebrow,
      "left"
    );
    this.drawEyebrowShape(
      ctx,
      landmarks,
      rightTop,
      rightBottom,
      w,
      h,
      eyebrow,
      "right"
    );
  }

  drawEyebrowShape(ctx, landmarks, topIdx, bottomIdx, w, h, eyebrow, side) {
    const parseColorWithAlpha = (c, a) => {
      if (!c) return `rgba(94,52,24,${a})`;
      if (c.startsWith("rgba("))
        return c.replace(/rgba\(([^)]+), ?[\d.]+\)/, `rgba($1, ${a})`);
      if (c.startsWith("rgb("))
        return c.replace("rgb(", "rgba(").replace(")", `, ${a})`);
      if (c.startsWith("#")) {
        const hex = c.slice(1);
        const full =
          hex.length === 3
            ? hex
                .split("")
                .map((x) => x + x)
                .join("")
            : hex;
        const n = parseInt(full, 16);
        const r = (n >> 16) & 255,
          g = (n >> 8) & 255,
          b = n & 255;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
      return c; // fallback
    };

    const mapIdx = (idxs) =>
      idxs
        .map((i) => landmarks[i])
        .filter((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y))
        .map((p) => ({ x: p.x * w, y: p.y * h }));

    const top = mapIdx(topIdx);
    const bottom = mapIdx(bottomIdx);
    if (top.length < 3 || bottom.length < 3) return;

    // Làm dày nhẹ theo tham số thickness
    const thickness =
      (Math.max(0, eyebrow.thickness ?? 3) * Math.max(w, h)) / 900;
    const minLen = Math.min(top.length, bottom.length);
    const bottomInflated = bottom.slice(0, minLen).map((b, i) => {
      const t = top[i];
      const nx = b.x - t.x;
      const ny = b.y - t.y;
      const len = Math.hypot(nx, ny) || 1;
      const ox = (nx / len) * thickness;
      const oy = (ny / len) * thickness;
      return { x: b.x + ox, y: b.y + oy };
    });
    if (bottom.length > minLen) {
      for (let i = minLen; i < bottom.length; i++)
        bottomInflated.push(bottom[i]);
    }

    const allPts = [...top, ...bottomInflated];
    const minX = Math.min(...allPts.map((p) => p.x));
    const maxX = Math.max(...allPts.map((p) => p.x));
    const minY = Math.min(...allPts.map((p) => p.y));
    const maxY = Math.max(...allPts.map((p) => p.y));
    if (![minX, maxX, minY, maxY].every(Number.isFinite)) return;

    // Offscreen để blur mềm và blend
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const oc = off.getContext("2d");

    // Tweak: hỗ trợ nâng cong lông mày nhẹ
    const liftParam = typeof eyebrow.lift === "number" ? eyebrow.lift : 0.15;
    const liftPx = Math.max(2, liftParam * Math.max(8, thickness * 1.6));

    // Đường lông mày mượt (dùng quadraticCurve giữa các midpoint)
    const drawSmoothShape = (c) => {
      c.beginPath();
      // cung trên (với cp được dịch lên theo liftPx, tập trung ở giữa cung)
      if (top.length > 1) {
        c.moveTo(top[0].x, top[0].y);
        const midIndex = (top.length - 1) / 2;
        for (let i = 1; i < top.length - 1; i++) {
          const cp = top[i];
          const mp = {
            x: (top[i].x + top[i + 1].x) / 2,
            y: (top[i].y + top[i + 1].y) / 2,
          };
          const weight =
            midIndex > 0 ? 1 - Math.abs(i - midIndex) / midIndex : 1;
          const cpY = cp.y - liftPx * Math.max(0, weight);
          c.quadraticCurveTo(cp.x, cpY, mp.x, mp.y);
        }
        c.lineTo(top[top.length - 1].x, top[top.length - 1].y);
      }

      // quay lại theo cung dưới (đảo chiều)
      const lb = bottomInflated;
      if (lb.length > 1) {
        c.lineTo(lb[lb.length - 1].x, lb[lb.length - 1].y);
        for (let i = lb.length - 2; i > 0; i--) {
          const cp = lb[i];
          const mp = {
            x: (lb[i].x + lb[i - 1].x) / 2,
            y: (lb[i].y + lb[i - 1].y) / 2,
          };
          c.quadraticCurveTo(cp.x, cp.y, mp.x, mp.y);
        }
        c.lineTo(lb[0].x, lb[0].y);
      }
      c.closePath();
    };

    // Gradient theo trục dọc
    const baseOpacity = eyebrow.opacity ?? 0.45;
    const grad = oc.createLinearGradient(0, minY, 0, maxY);
    grad.addColorStop(
      0.0,
      parseColorWithAlpha(eyebrow.color || "#5E3418", baseOpacity * 0.35)
    );
    grad.addColorStop(
      0.5,
      parseColorWithAlpha(eyebrow.color || "#5E3418", baseOpacity)
    );
    grad.addColorStop(
      1.0,
      parseColorWithAlpha(eyebrow.color || "#5E3418", baseOpacity * 0.45)
    );

    // Vẽ chính trên offscreen (base shape)
    const softness = Math.max(1, (eyebrow.softness ?? 2) * 1.5);
    oc.save();
    oc.filter = `blur(${softness}px)`;
    oc.globalCompositeOperation = "source-over";
    drawSmoothShape(oc);
    oc.fillStyle = grad;
    oc.fill();
    oc.restore();

    // ---------- Thêm hiệu ứng "nhuộm" (dyed) và sợi lông mày ----------
    const dyeColor = eyebrow.dyeColor || eyebrow.color || "#5E3418";
    const dyeStrength = Math.max(0, Math.min(1, eyebrow.dyeStrength ?? 0.35));
    const hairStrokeOpacity = eyebrow.hairStrokeOpacity ?? 0.6;

    // Vẽ sợi lông mày (micro hair strokes) lên offscreen
    oc.save();
    oc.lineCap = "round";
    oc.lineJoin = "round";
    oc.globalAlpha = hairStrokeOpacity;
    oc.strokeStyle = parseColorWithAlpha(dyeColor, 0.7);
    const hairLineW = Math.max(0.8, thickness * 0.18);
    oc.lineWidth = hairLineW;

    // Tạo sợi dọc theo đường top
    for (let i = 0; i < top.length - 1; i++) {
      const p0 = top[i];
      const p1 = top[i + 1];
      const segLen = Math.hypot(p1.x - p0.x, p1.y - p0.y) || 1;
      const dirX = (p1.x - p0.x) / segLen;
      const dirY = (p1.y - p0.y) / segLen;
      const strokes = 1 + Math.floor(Math.random() * 2);
      for (let s = 0; s < strokes; s++) {
        const t = Math.random();
        const sx = p0.x + dirX * segLen * t + (Math.random() - 0.5) * 2;
        const sy = p0.y + dirY * segLen * t + (Math.random() - 0.5) * 2;
        const len = segLen * (0.18 + Math.random() * 0.25);
        const perpX = -dirY;
        const perpY = dirX;
        const curl = (side === "left" ? -1 : 1) * (0.6 + Math.random() * 0.6);
        const ex = sx + dirX * len + perpX * curl * (hairLineW * 2);
        const ey = sy + dirY * len + perpY * curl * (hairLineW * 2);
      oc.beginPath();
        oc.moveTo(sx, sy);
        oc.quadraticCurveTo(
          sx + (ex - sx) * 0.45 + perpX * (Math.random() - 0.5) * 2,
          sy + (ey - sy) * 0.45 + perpY * (Math.random() - 0.5) * 2,
          ex,
          ey
        );
        oc.stroke();
      }
    }
    oc.restore();

    // Áp tint màu (dye)
    oc.save();
    oc.globalCompositeOperation = "source-atop";
    oc.fillStyle = parseColorWithAlpha(dyeColor, dyeStrength);
    oc.fillRect(0, 0, w, h);
    oc.restore();

    // Merge blur
    const mergeBlur = Math.max(0, (eyebrow.mergeSoftness ?? 1) * 1.2);
    if (mergeBlur > 0.5) {
      const tmp = document.createElement("canvas");
      tmp.width = w;
      tmp.height = h;
      const tc = tmp.getContext("2d");
      tc.clearRect(0, 0, w, h);
      tc.filter = `blur(${mergeBlur}px)`;
      tc.drawImage(off, 0, 0);
      oc.clearRect(0, 0, w, h);
      oc.drawImage(tmp, 0, 0);
    }

    // Blend vào da
    ctx.save();
    ctx.globalCompositeOperation = eyebrow.blendMode || "multiply";
    ctx.globalAlpha = 0.8;
    ctx.drawImage(off, 0, 0);
      ctx.restore();
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
      const lerp = 0.12; // Reduced from 0.15 to 0.12 for tighter placement
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

    const shiftDown = faceHeight * 0.03; // Reduced from 0.04 to 0.03
    centerY = centerY + shiftDown;

    const baseRadius = Math.max(25, Math.round(faceHeight * 0.08)); // Reduced from 0.1 to 0.08, min 30 to 25
    const radiusX = baseRadius * 1.5; // Reduced from 1.8 to 1.5
    const radiusY = baseRadius * 0.7; // Reduced from 0.8 to 0.7

    let angle = 0;
    if (cheekOuter && cheekLower) {
      const dx = (cheekOuter.x - cheekLower.x) * w;
      const dy = (cheekOuter.y - cheekLower.y) * h;
      angle = Math.atan2(dy, dx);
      angle += side === "left" ? -0.15 : 0.15; // Reduced from 0.2 to 0.15
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
    gradient.addColorStop(0.3, blush.color.replace(/[\d.]+\)$/g, "0.25)")); // More concentrated center
    gradient.addColorStop(0.6, blush.color.replace(/[\d.]+\)$/g, "0.12)")); // Softer middle
    gradient.addColorStop(0.85, blush.color.replace(/[\d.]+\)$/g, "0.05)")); // Very soft edge
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
      radiusX * 1.15 // Reduced from 1.2 to 1.15
    );
    secondGradient.addColorStop(0, blush.color.replace(/[\d.]+\)$/g, "0.08)")); // Very subtle center
    secondGradient.addColorStop(
      0.5,
      blush.color.replace(/[\d.]+\)$/g, "0.03)") // Almost transparent
    );
    secondGradient.addColorStop(1, "rgba(0,0,0,0)");

    offCtx.fillStyle = secondGradient;
    offCtx.beginPath();
    offCtx.ellipse(0, 0, radiusX * 1.15, radiusY * 1.08, 0, 0, Math.PI * 2); // Slightly smaller
    offCtx.fill();

    offCtx.restore();

    offCtx.save();
    offCtx.globalCompositeOperation = "destination-in";

    if (cheekCenter && cheekOuter && cheekLower) {
      const cheekCenterPx = { x: cheekCenter.x * w, y: cheekCenter.y * h };

      const boundaryRadius = Math.max(radiusX * 1.2, radiusY * 1.3); // Reduced from 1.3/1.5 for tighter containment
      const boundaryGradient = offCtx.createRadialGradient(
        cheekCenterPx.x,
        cheekCenterPx.y,
        0,
        cheekCenterPx.x,
        cheekCenterPx.y,
        boundaryRadius
      );
      boundaryGradient.addColorStop(0, "rgba(255,255,255,1)");
      boundaryGradient.addColorStop(0.7, "rgba(255,255,255,0.9)"); // Tighter falloff
      boundaryGradient.addColorStop(0.9, "rgba(255,255,255,0.5)"); // Softer edge
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

    const blurAmount = Math.max(10, Math.round(baseRadius / 3)); // Increased blur for softer look

    ctx.save();
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.globalAlpha = (blush.intensity || 0.35) * 0.9; // Slightly reduce overall intensity
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
    const intensity = eyeshadow.intensity ?? blush.intensity ?? 0.65; // Increased for more visible color

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
      3,
      (((eyeshadow.softness ?? 6) * Math.max(w, h)) / 900) * 2.0
    ); // Increased blur for softer, more diffused look

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

      const cat = Math.max(1, eyeshadow.catFactor ?? 1.05); // Reduced from 1.15 for softer wing
      const upperBase = Math.max(
        3,
        (eyeshadow.upperWidthFactor ?? 0.28) * base // Reduced from 0.35 for smaller area
      );
      const growBase = (eyeshadow.extendFactor ?? 0.08) * base; // Reduced from 0.12 for less spread

      const upperInner = upperBase * (eyeshadow.upperInnerScale ?? 0.15); // Reduced from 0.2
      const upperOuter = upperBase * (eyeshadow.upperOuterScale ?? 1.15 * cat); // Reduced from 1.35
      const growInner = growBase * (eyeshadow.innerExtendScale ?? 0.2); // Reduced from 0.3
      const growOuter = growBase * (eyeshadow.outerExtendScale ?? 1.2 * cat); // Reduced from 1.5

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
      oc.globalAlpha = Math.min(1, intensity * 1.2); // Increased from 1.05 to 1.2 for darker lash line
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

      // 4) Nhấn outer-V nhẹ tại đuôi (theo đường đã nâng) - Optional feature
      if (eyeshadow.enableOuterV !== false) {
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
      }
      
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
    ctx.globalAlpha = eyeshadow.opacity ?? 0.88; // Increased for more visible color
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
      
      // LIMIT: only allow upward offset (negative Y direction) to prevent downward spikes
      // If normal points downward (ny > 0), reduce or neutralize the offset
      if (ny > 0) {
        ny = Math.min(0, ny * 0.3); // Heavily dampen downward movement
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
      let dx = outer[i].x - p.x,
        dy = outer[i].y - p.y;
      const dlen = Math.hypot(dx, dy) || 1;
      
      // LIMIT: prevent downward growth, only allow upward or horizontal
      let growX = (dx / dlen) * grow;
      let growY = (dy / dlen) * grow;
      
      // If growth is downward (positive Y), clamp it
      if (growY > 0) {
        growY = 0; // No downward growth
      }
      
      outer[i].x += growX;
      outer[i].y += growY;
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

  _softSpot(ctx, x, y, radius, color, alpha = 1, blur = 8, mode = "source-over") {
    ctx.save();
    if (mode) ctx.globalCompositeOperation = mode;
    ctx.globalAlpha = alpha;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    if ("filter" in ctx) ctx.filter = `blur(${blur}px)`;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    if ("filter" in ctx) ctx.filter = "none";
    ctx.restore();
  }

  // Helper method để vẽ bridge giữa mí trên và mí dưới ở đuôi mắt
  _bridgeOuterCorner(ctx, upper, lower, center, thickness, color, alpha, blur) {
    if (!upper?.length || !lower?.length) return;
    const a = upper[upper.length - 1]; // điểm A (đuôi mí trên)
    const b = lower[lower.length - 1]; // điểm B (đuôi mí dưới)

    // Pháp tuyến hướng ra ngoài để đẩy control point ra phía thái dương
    const ref = upper[Math.max(0, upper.length - 2)];
    let tx = a.x - ref.x,
      ty = a.y - ref.y;
    const tlen = Math.hypot(tx, ty) || 1;
    tx /= tlen;
    ty /= tlen;
    let nx = -ty,
      ny = tx;
    const vx = a.x - center.cx,
      vy = a.y - center.cy;
    if (nx * vx + ny * vy < 0) {
      nx = -nx;
      ny = -ny;
    }

    const mid = {
      x: (a.x + b.x) / 2 + nx * (thickness * 0.8),
      y: (a.y + b.y) / 2 + ny * (thickness * 0.8),
    };

    ctx.save();
    if ("filter" in ctx) ctx.filter = `blur(${blur}px)`;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(mid.x, mid.y, b.x, b.y);
    ctx.stroke();
    if ("filter" in ctx) ctx.filter = "none";
    ctx.restore();
  }
}
