import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Palette, Upload, Download, Layers, History, ShoppingBag, Settings, 
  CheckCircle2, Eye, Camera, FolderOpen, Save, Trash2, RefreshCw, 
  ChevronDown, ZoomIn, ZoomOut, Trophy, Star, Focus, Grid3X3, DownloadCloud,
  Wand2, ShieldCheck, ListOrdered, Ban, SlidersHorizontal, X
} from 'lucide-react';

const CORE_DICTIONARY = {
  "#FAF4C8": {"MARD":"A01","COCO":"E02","漫漫":"E2","盼盼":"65","咪小窝":"77"},
  "#FFFFD5": {"MARD":"A02","COCO":"E01","漫漫":"B1","盼盼":"2","咪小窝":"2"},
  "#FEFF8B": {"MARD":"A03","COCO":"E05","漫漫":"B2","盼盼":"28","咪小窝":"28"},
  "#FBED56": {"MARD":"A04","COCO":"E07","漫漫":"B3","盼盼":"3","咪小窝":"3"},
  "#F4D738": {"MARD":"A05","COCO":"D03","漫漫":"B4","盼盼":"74","咪小窝":"79"},
  "#FEAC4C": {"MARD":"A06","COCO":"D05","漫漫":"B5","盼盼":"29","咪小窝":"29"},
  "#FE8B4C": {"MARD":"A07","COCO":"D08","漫漫":"B6","盼盼":"4","咪小窝":"4"},
  "#FFDA45": {"MARD":"A08","COCO":"D01","漫漫":"B7","盼盼":"5","咪小窝":"5"},
  "#D6AA87": {"MARD":"ZG2","COCO":"GB2","漫漫":"ZG2","盼盼":"255","咪小窝":"ZG2"},
  "#C1BD8D": {"MARD":"ZG3","COCO":"GB3","漫漫":"ZG3","盼盼":"256","咪小窝":"ZG3"},
  "#96869F": {"MARD":"ZG4","COCO":"GB4","漫漫":"ZG4","盼盼":"257","咪小窝":"ZG4"},
  "#8490A6": {"MARD":"ZG5","COCO":"GB5","漫漫":"ZG5","盼盼":"258","咪小窝":"ZG5"},
  "#94BFE2": {"MARD":"ZG6","COCO":"GB6","漫漫":"ZG6","盼盼":"259","咪小窝":"ZG6"},
  "#E2A9D2": {"MARD":"ZG7","COCO":"GB7","漫漫":"ZG7","盼盼":"260","咪小窝":"ZG7"},
  "#AB91C0": {"MARD":"ZG8","COCO":"GB8","漫漫":"ZG8","盼盼":"261","咪小窝":"ZG8"},
  
  // --- 补充的基础色库 ---
  "#FFFFFF": {"MARD":"T01","COCO":"A01","漫漫":"W1","盼盼":"1","咪小窝":"1"},
  "#1D1414": {"MARD":"H16","COCO":"A02","漫漫":"K1","盼盼":"18","咪小窝":"18"},
  "#2F2B2F": {"MARD":"H06","COCO":"A03","漫漫":"K2","盼盼":"19","咪小窝":"19"},
  "#D21F2F": {"MARD":"F01","COCO":"C01","漫漫":"R1","盼盼":"5","咪小窝":"11"},
  "#8E1525": {"MARD":"F11","COCO":"C03","漫漫":"R3","盼盼":"21","咪小窝":"12"},
  "#244B9C": {"MARD":"E01","COCO":"F01","漫漫":"BL1","盼盼":"8","咪小窝":"19"},
  "#82C0E9": {"MARD":"E23","COCO":"F05","漫漫":"BL4","盼盼":"9","咪小窝":"22"},
  "#309E53": {"MARD":"G01","COCO":"G01","漫漫":"G1","盼盼":"10","咪小窝":"28"},
  "#A8CE4A": {"MARD":"G14","COCO":"G05","漫漫":"G5","盼盼":"11","咪小窝":"30"},
  "#7337A5": {"MARD":"P01","COCO":"H01","漫漫":"P1","盼盼":"7","咪小窝":"33"},
  "#ED89A4": {"MARD":"F24","COCO":"B01","漫漫":"PK1","盼盼":"6","咪小窝":"07"},
  "#6A412B": {"MARD":"R22","COCO":"GB8","漫漫":"BR1","盼盼":"12","咪小窝":"39"},
  "#FDD5B5": {"MARD":"S01","COCO":"E08","漫漫":"SK1","盼盼":"26","咪小窝":"63"},
  "#C6C8C9": {"MARD":"H10","COCO":"A04","漫漫":"GR1","盼盼":"17","咪小窝":"03"},
  "#888B8D": {"MARD":"H13","COCO":"A05","漫漫":"GR2","盼盼":"71","咪小窝":"04"}
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

const rgbToLab = (r, g, b) => {
  let r_ = r / 255, g_ = g / 255, b_ = b / 255;
  r_ = r_ > 0.04045 ? Math.pow((r_ + 0.055) / 1.055, 2.4) : r_ / 12.92;
  g_ = g_ > 0.04045 ? Math.pow((g_ + 0.055) / 1.055, 2.4) : g_ / 12.92;
  b_ = b_ > 0.04045 ? Math.pow((b_ + 0.055) / 1.055, 2.4) : b_ / 12.92;
  let x = (r_ * 0.4124 + g_ * 0.3576 + b_ * 0.1805) / 0.95047;
  let y = (r_ * 0.2126 + g_ * 0.7152 + b_ * 0.0722) / 1.00000;
  let z = (r_ * 0.0193 + g_ * 0.1192 + b_ * 0.9505) / 1.08883;
  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
};

const generateFullPalette = () => {
  const palette = Object.entries(CORE_DICTIONARY).map(([hex, brands]) => ({
    hex, rgb: hexToRgb(hex), lab: rgbToLab(...hexToRgb(hex)), brands
  }));
  const remaining = 192 - palette.length;
  for (let i = 0; i < remaining; i++) {
    const hue = (i * 137.5) % 360; const sat = 45 + (i % 3) * 15; const lit = 30 + (i % 5) * 10;
    const a = (sat * Math.min(lit, 100 - lit)) / 10000;
    const f = n => {
      const k = (n + hue / 30) % 12;
      return Math.round(255 * (lit / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
    };
    const r = f(0), g = f(8), b = f(4);
    const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`.toUpperCase();
    palette.push({
      hex, rgb: [r, g, b], lab: rgbToLab(r, g, b),
      brands: { "MARD": `EX${i}`, "COCO": `C-EX${i}`, "漫漫": `M-EX${i}`, "盼盼": `P-EX${i}`, "咪小窝": `MI${i}` }
    });
  }
  return palette;
};
const MASTER_PALETTE = generateFullPalette();

const App = () => {
  const [activeTab, setActiveTab] = useState('studio');
  const [viewMode, setViewMode] = useState('editor'); 
  const [localHistory, setLocalHistory] = useState([]);
  
  // 核心属性
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [gridWidth, setGridWidth] = useState(50);
  const [gridHeight, setGridHeight] = useState(50);
  const [colorSystemId, setColorSystemId] = useState('MARD'); 
  const [colorCount, setColorCount] = useState(48); 
  const [pixelationMode, setPixelationMode] = useState('dominant'); 
  const [mergeThreshold, setMergeThreshold] = useState(24); 
  const [excludedColors, setExcludedColors] = useState(new Set()); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPixelMap, setCurrentPixelMap] = useState([]); 
  const [exportSettings, setExportSettings] = useState({ showLabels: true, showStats: true }); 
  const [isDragActive, setIsDragActive] = useState(false); 
  
  // 水印图层属性 (画中画)
  const [watermark, setWatermark] = useState(null); 
  const [draggingWm, setDraggingWm] = useState(false);
  const [resizingWm, setResizingWm] = useState(false);
  const [wmDragStart, setWmDragStart] = useState({ x: 0, y: 0, wmX: 0, wmY: 0 });
  const [wmResizeStart, setWmResizeStart] = useState({ x: 0, y: 0, wmW: 0, wmH: 0 });

  // 交互控制
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 100, y: 100 });
  const BASE_CELL_SIZE = 24; 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [trackPos, setTrackPos] = useState({ x: -1, y: -1 });
  const [placedBeads, setPlacedBeads] = useState(new Set()); 

  const fileInputRef = useRef(null);
  const viewportRef = useRef(null); 
  const contentRef = useRef(null);

  const totalXP = localHistory.reduce((acc, item) => acc + (item.totalCount || 0), 0);
  const level = Math.floor(Math.sqrt(totalXP / 500)) + 1;
  const nextLevelXP = Math.pow(level, 2) * 500;
  const progress = Math.min((totalXP / nextLevelXP) * 100, 100);

  const activePalette = useMemo(() => {
    return MASTER_PALETTE
      .filter(c => c.brands[colorSystemId] && !excludedColors.has(c.hex))
      .slice(0, colorCount); 
  }, [colorSystemId, excludedColors, colorCount]);

  // 通用核心渲染
  const processImageCore = async (src, w, palette, mode, threshold) => {
    const img = new Image(); img.src = src;
    await new Promise(r => img.onload = r);
    const h = Math.max(1, Math.round(w * (img.height / img.width)));

    const origCvs = document.createElement('canvas');
    origCvs.width = img.width; origCvs.height = img.height;
    const origCtx = origCvs.getContext('2d');
    origCtx.drawImage(img, 0, 0);
    const origData = origCtx.getImageData(0, 0, img.width, img.height).data;

    const outCvs = document.createElement('canvas');
    outCvs.width = w; outCvs.height = h;
    const outCtx = outCvs.getContext('2d');
    const outData = outCtx.createImageData(w, h);

    const blockW = img.width / w;
    const blockH = img.height / h;
    const initialCounts = {};
    const pixelMap = new Array(w * h);

    const findMatchLab = (r, g, b) => {
      const targetLab = rgbToLab(r, g, b);
      let best = palette[0], minD = Infinity;
      for (let i = 0; i < palette.length; i++) {
        const c = palette[i];
        const dl = targetLab[0] - c.lab[0];
        const da = targetLab[1] - c.lab[1];
        const db = targetLab[2] - c.lab[2];
        const d = dl*dl + da*da + db*db; 
        if (d < minD) { minD = d; best = c; }
      }
      return best;
    };

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const startX = Math.floor(x * blockW);
        const startY = Math.floor(y * blockH);
        const endX = Math.floor((x + 1) * blockW);
        const endY = Math.floor((y + 1) * blockH);
        let r = 0, g = 0, b = 0, a = 0;

        if (mode === 'average') {
          let count = 0;
          for (let py = startY; py < endY; py++) {
            for (let px = startX; px < endX; px++) {
              if (px >= img.width || py >= img.height) continue;
              const idx = (py * img.width + px) * 4;
              r += origData[idx]; g += origData[idx+1]; b += origData[idx+2]; a += origData[idx+3];
              count++;
            }
          }
          if (count > 0) { r = Math.round(r/count); g = Math.round(g/count); b = Math.round(b/count); a = Math.round(a/count); }
        } else {
          const cx = Math.min(Math.floor(startX + blockW / 2), img.width - 1);
          const cy = Math.min(Math.floor(startY + blockH / 2), img.height - 1);
          const idx = (cy * img.width + cx) * 4;
          r = origData[idx]; g = origData[idx+1]; b = origData[idx+2]; a = origData[idx+3];
        }

        const pixelIndex = y * w + x;
        if (a < 128) { pixelMap[pixelIndex] = null; continue; }

        const match = findMatchLab(r, g, b);
        pixelMap[pixelIndex] = match.hex;
        initialCounts[match.hex] = (initialCounts[match.hex] || 0) + 1;
      }
    }

    const sortedHexes = Object.keys(initialCounts).sort((a, b) => initialCounts[b] - initialCounts[a]);
    const hexToMergedHex = {};
    const keptHexes = [];
    const effectiveThreshold = threshold * 0.4;

    for (const hex of sortedHexes) {
      const colorObj = palette.find(p => p.hex === hex);
      let bestMatch = null; let minDist = Infinity;
      for (const keptHex of keptHexes) {
        const keptObj = palette.find(p => p.hex === keptHex);
        const dl = colorObj.lab[0] - keptObj.lab[0];
        const da = colorObj.lab[1] - keptObj.lab[1];
        const db = colorObj.lab[2] - keptObj.lab[2];
        const dist = Math.sqrt(dl*dl + da*da + db*db); 
        if (dist < minDist) { minDist = dist; bestMatch = keptHex; }
      }
      if (bestMatch && minDist <= effectiveThreshold) hexToMergedHex[hex] = bestMatch;
      else { hexToMergedHex[hex] = hex; keptHexes.push(hex); }
    }

    const finalCounts = {};
    const finalPixelMap = new Array(w * h);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const pixelIndex = y * w + x;
        const outIdx = pixelIndex * 4;
        const initialHex = pixelMap[pixelIndex];

        if (!initialHex) { outData.data[outIdx+3] = 0; finalPixelMap[pixelIndex] = null; continue; }

        const finalHex = hexToMergedHex[initialHex];
        finalPixelMap[pixelIndex] = finalHex;
        const finalColor = palette.find(p => p.hex === finalHex);
        
        outData.data[outIdx] = finalColor.rgb[0]; outData.data[outIdx+1] = finalColor.rgb[1]; outData.data[outIdx+2] = finalColor.rgb[2]; outData.data[outIdx+3] = 255;
        finalCounts[finalHex] = (finalCounts[finalHex] || 0) + 1;
      }
    }
    
    outCtx.putImageData(outData, 0, 0);
    return { dataURL: outCvs.toDataURL(), counts: finalCounts, pixelMap: finalPixelMap, height: h };
  };

  // 处理主图
  useEffect(() => {
    if (originalImage) {
      const t = setTimeout(async () => {
        setIsProcessing(true);
        const res = await processImageCore(originalImage, gridWidth, activePalette, pixelationMode, mergeThreshold);
        setGridHeight(res.height);
        setProcessedImage(res.dataURL);
        setCurrentPixelMap(res.pixelMap);
        setIsProcessing(false);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [gridWidth, originalImage, activePalette, pixelationMode, mergeThreshold]);

  // 处理水印图层
  useEffect(() => {
    if (watermark && watermark.original && activePalette.length > 0) {
      const processWm = async () => {
        const res = await processImageCore(watermark.original, watermark.gridWidth, activePalette, pixelationMode, mergeThreshold);
        setWatermark(prev => ({ ...prev, dataURL: res.dataURL, pixelMap: res.pixelMap, gridHeight: res.height }));
      };
      const t = setTimeout(() => processWm(), 100);
      return () => clearTimeout(t);
    }
  }, [watermark?.original, watermark?.gridWidth, activePalette, pixelationMode, mergeThreshold]);

  const { displayPixelMap, displayStats } = useMemo(() => {
    if (!currentPixelMap || currentPixelMap.length === 0) return { displayPixelMap: [], displayStats: [] };
    const fMap = [...currentPixelMap];
    const fCounts = {};

    if (watermark && watermark.pixelMap && watermark.pixelMap.length > 0) {
      const wmGridW = watermark.gridWidth;
      const wmGridH = watermark.gridHeight;
      const wmCellW = watermark.width / wmGridW;
      const wmCellH = watermark.height / wmGridH;

      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          const mainPx = x * BASE_CELL_SIZE + BASE_CELL_SIZE / 2;
          const mainPy = y * BASE_CELL_SIZE + BASE_CELL_SIZE / 2;
          
          // 如果主图网格坐标落入水印的区域内
          if (mainPx >= watermark.x && mainPx < watermark.x + watermark.width &&
              mainPy >= watermark.y && mainPy < watermark.y + watermark.height) {
              const wmX = Math.floor((mainPx - watermark.x) / wmCellW);
              const wmY = Math.floor((mainPy - watermark.y) / wmCellH);
              if (wmX >= 0 && wmX < wmGridW && wmY >= 0 && wmY < wmGridH) {
                  const wmHex = watermark.pixelMap[wmY * wmGridW + wmX];
                  if (wmHex) fMap[y * gridWidth + x] = wmHex; // 完美嵌入覆盖！
              }
          }
        }
      }
    }

    // 重新统计融合后的整体豆子消耗
    for (let i = 0; i < fMap.length; i++) {
      const hex = fMap[i];
      if (hex) fCounts[hex] = (fCounts[hex] || 0) + 1;
    }

    const statsArray = Object.keys(fCounts).map(hex => {
      const colorData = activePalette.find(p => p.hex === hex) || MASTER_PALETTE.find(p => p.hex === hex);
      return { ...colorData, count: fCounts[hex] };
    }).sort((a,b) => b.count - a.count);

    return { displayPixelMap: fMap, displayStats: statsArray };
  }, [currentPixelMap, watermark, gridWidth, gridHeight, activePalette]);

  const toggleExcludeColor = (hex) => {
    const newEx = new Set(excludedColors);
    if (newEx.has(hex)) newEx.delete(hex);
    else newEx.add(hex);
    setExcludedColors(newEx);
  };

  const handleZoom = (e) => {
    if (!originalImage || !viewportRef.current) return;
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    const nextZoom = Math.min(Math.max(zoom + zoomDelta, 0.1), 8);
    if (nextZoom === zoom) return;

    const rect = viewportRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const pointX = (mouseX - pan.x) / zoom;
    const pointY = (mouseY - pan.y) / zoom;
    setZoom(nextZoom);
    setPan({ x: mouseX - pointX * nextZoom, y: mouseY - pointY * nextZoom });
  };

  const processFile = (f) => {
    if (f && f.type.startsWith('image/')) {
      const r = new FileReader();
      r.onload = (ev) => {
        if (!originalImage) {
          setOriginalImage(ev.target.result);
          setExcludedColors(new Set()); 
          setWatermark(null);
          setZoom(0.8);
          const i = new Image(); i.src = ev.target.result;
          i.onload = () => {
            setGridWidth(Math.min(i.width > i.height ? 60 : Math.round(60 * (i.width / i.height)), 300));
            if (viewportRef.current) {
              const rect = viewportRef.current.getBoundingClientRect();
              setPan({ x: rect.width / 4, y: rect.height / 4 });
            }
          };
        } else {
          // 已经有图，作为水印层加入
          const i = new Image(); i.src = ev.target.result;
          i.onload = () => {
            const aspect = i.height / i.width;
            const wmGridW = Math.min(i.width > i.height ? 30 : Math.round(30 / aspect), 100);
            const defaultW = wmGridW * BASE_CELL_SIZE;
            setWatermark({
              original: ev.target.result,
              dataURL: null,
              x: (gridWidth * BASE_CELL_SIZE) / 2 - defaultW / 2, // 居中显示
              y: (gridHeight * BASE_CELL_SIZE) / 2 - (defaultW * aspect) / 2,
              width: defaultW,
              height: defaultW * aspect,
              gridWidth: wmGridW,
              gridHeight: Math.round(wmGridW * aspect),
              pixelMap: []
            });
          };
        }
      };
      r.readAsDataURL(f);
    }
  };

  const upload = (e) => { processFile(e.target.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragActive(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragActive(false); if (e.dataTransfer.files?.length > 0) processFile(e.dataTransfer.files[0]); };

  const startDragOrTrack = (e) => {
    if (!originalImage) return;
    if (viewMode === 'tracker') {
        const rect = viewportRef.current.getBoundingClientRect();
        const x = Math.floor(((e.clientX - rect.left - pan.x) / zoom) / BASE_CELL_SIZE);
        const y = Math.floor(((e.clientY - rect.top - pan.y) / zoom) / BASE_CELL_SIZE);
        if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) setTrackPos({ x, y });
    }
    if (viewMode === 'editor' || e.altKey) {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y });
    }
  };

  const onDrag = (e) => {
    if (draggingWm && watermark) {
      const dx = (e.clientX - wmDragStart.x) / zoom;
      const dy = (e.clientY - wmDragStart.y) / zoom;
      setWatermark(prev => ({ ...prev, x: wmDragStart.wmX + dx, y: wmDragStart.wmY + dy }));
    } else if (resizingWm && watermark) {
      const dx = (e.clientX - wmResizeStart.x) / zoom;
      const newW = Math.max(BASE_CELL_SIZE, wmResizeStart.wmW + dx); // 最小1个颗粒宽
      const aspect = wmResizeStart.wmH / wmResizeStart.wmW;
      const newGridW = Math.max(1, Math.round(newW / BASE_CELL_SIZE)); // 动态调整水印分辨率
      setWatermark(prev => ({ ...prev, width: newW, height: newW * aspect, gridWidth: newGridW, gridHeight: Math.max(1, Math.round(newGridW * aspect)) }));
    } else if (isDragging) {
      setPan({ x: dragStart.panX + (e.clientX - dragStart.x), y: dragStart.panY + (e.clientY - dragStart.y) });
    }
  };

  const handleMouseUp = () => { setIsDragging(false); setDraggingWm(false); setResizingWm(false); };

  const handleExportImage = async () => {
    if (!processedImage || displayPixelMap.length === 0) return;
    
    const exportCellSize = exportSettings.showLabels ? 40 : 32; 
    const padding = 30;
    const gridW_px = gridWidth * exportCellSize;
    const gridH_px = gridHeight * exportCellSize;
    const statsItemWidth = 160;
    const cols = Math.max(1, Math.floor((gridW_px) / statsItemWidth));
    const rows = Math.ceil(displayStats.length / cols);
    const statsH_px = exportSettings.showStats ? (rows * 30 + 80) : 0;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = Math.max(gridW_px + padding * 2, cols * statsItemWidth + padding * 2);
    canvas.height = gridH_px + statsH_px + padding * 2;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const gridStartX = padding + Math.max(0, (canvas.width - padding * 2 - gridW_px) / 2);
    const gridStartY = padding;

    // 先画大图
    const img = new Image(); img.src = processedImage;
    await new Promise(r => img.onload = r);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, gridStartX, gridStartY, gridW_px, gridH_px);
    
    // 叠加画水印图层
    if (watermark && watermark.dataURL) {
      const wmImg = new Image(); wmImg.src = watermark.dataURL;
      await new Promise(r => wmImg.onload = r);
      const scale = exportCellSize / BASE_CELL_SIZE;
      ctx.drawImage(wmImg, gridStartX + watermark.x * scale, gridStartY + watermark.y * scale, watermark.width * scale, watermark.height * scale);
    }
      
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= gridWidth; x++) { ctx.beginPath(); ctx.moveTo(gridStartX + x * exportCellSize, gridStartY); ctx.lineTo(gridStartX + x * exportCellSize, gridStartY + gridH_px); ctx.stroke(); }
    for (let y = 0; y <= gridHeight; y++) { ctx.beginPath(); ctx.moveTo(gridStartX, gridStartY + y * exportCellSize); ctx.lineTo(gridStartX + gridW_px, gridStartY + y * exportCellSize); ctx.stroke(); }
      
    if (exportSettings.showLabels) {
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          const hex = displayPixelMap[y * gridWidth + x];
          if (hex) {
            const colorObj = activePalette.find(p => p.hex === hex) || MASTER_PALETTE.find(p => p.hex === hex);
            if (colorObj) {
              const [r, g, b] = colorObj.rgb;
              const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
              ctx.fillStyle = luminance > 140 ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)';
              ctx.fillText(colorObj.brands[colorSystemId] || '', gridStartX + x * exportCellSize + exportCellSize / 2, gridStartY + y * exportCellSize + exportCellSize / 2 + 1);
            }
          }
        }
      }
    }
      
    if (exportSettings.showStats) {
      const statsStartY = gridStartY + gridH_px + 40;
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      const totalBeads = displayStats.reduce((sum, item) => sum + item.count, 0);
      ctx.fillText(`图纸耗材统计表 - ${colorSystemId}色系 (总计: ${totalBeads} 颗)`, gridStartX, statsStartY);
      
      ctx.font = '14px Arial';
      let currentCol = 0; let currentRow = 0;
      
      displayStats.forEach((stat) => {
        const cx = gridStartX + currentCol * statsItemWidth;
        const cy = statsStartY + 40 + currentRow * 30;
        ctx.fillStyle = stat.hex; ctx.fillRect(cx, cy - 12, 16, 16);
        ctx.strokeStyle = '#000000'; ctx.lineWidth = 1; ctx.strokeRect(cx, cy - 12, 16, 16);
        ctx.fillStyle = '#333333'; ctx.fillText(`${stat.brands[colorSystemId]} : ${stat.count} 颗`, cx + 24, cy);
        
        currentCol++;
        if (currentCol >= cols) { currentCol = 0; currentRow++; }
      });
    }

    const link = document.createElement('a');
    link.download = `拼豆打印图纸_${colorSystemId}_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const vWidth = gridWidth * BASE_CELL_SIZE;
  const vHeight = gridHeight * BASE_CELL_SIZE;

  return (
    <div className="flex h-screen bg-[#FFF5F7] text-slate-800 font-sans overflow-hidden select-none">
      <input type="file" ref={fileInputRef} onChange={upload} accept="image/*" className="hidden" />

      {/* 侧边导航 */}
      <aside className="w-64 border-r-4 border-black flex flex-col p-5 bg-white z-20 flex-shrink-0 shadow-[4px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center space-x-3 px-1 py-2 mb-8">
          <div className="w-10 h-10 bg-[#FFD93D] border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Palette className="text-black" size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-black uppercase">拼拼豆</h1>
        </div>
        
        <nav className="flex-1 space-y-4 font-bold text-sm">
          <button onClick={() => setActiveTab('explore')} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl border-2 transition-all ${activeTab === 'explore' ? 'bg-[#FF85A1] text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'text-slate-500 border-transparent hover:bg-pink-50'}`}>
            <History size={20} /> <span>灵感记录馆</span>
          </button>
          <button onClick={() => setActiveTab('studio')} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl border-2 transition-all ${activeTab === 'studio' ? 'bg-[#FF85A1] text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'text-slate-500 border-transparent hover:bg-pink-50'}`}>
            <Palette size={20} /> <span>创作工坊</span>
          </button>
        </nav>

        {/* 成就系统 */}
        <div className="p-4 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-auto bg-gradient-to-b from-white to-slate-50">
          <div className="flex items-center justify-between mb-2 font-black italic text-[#FFD93D]">
            <div className="flex items-center"><Trophy size={14} className="mr-1" /><span className="text-[10px]">经验成就</span></div>
            <span className="text-[10px] text-slate-400">等级 {level}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full border border-black overflow-hidden mb-2">
             <div className="bg-[#6BCBCA] h-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between text-[8px] font-black text-slate-400 italic">
             <span>{totalXP} 经验</span>
             <span>距升级需 {nextLevelXP - totalXP}</span>
          </div>
        </div>
      </aside>

      {/* 主画布区 */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <header className="h-16 border-b-4 border-black flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-30 flex-shrink-0">
          <div className="flex bg-slate-100 border-2 border-black p-0.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <button onClick={() => setViewMode('editor')} className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'editor' ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-black'}`}>编辑器</button>
            <button onClick={() => setViewMode('tracker')} className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'tracker' ? 'bg-[#FF85A1] text-white shadow-sm' : 'text-slate-500 hover:text-[#FF85A1]'}`}>辅助制作模式 ✨</button>
          </div>
          <div className="flex items-center space-x-4 text-xs font-black uppercase italic">
            <button onClick={() => fileInputRef.current.click()} className="text-[#FF85A1] hover:underline flex items-center space-x-1"><RefreshCw size={14} className="mr-1"/>更换底稿</button>
            <button onClick={() => { setOriginalImage(null); setProcessedImage(null); setExcludedColors(new Set()); setWatermark(null); setPan({x: 100, y: 100}); setZoom(0.8); }} className="bg-[#FFD93D] border-2 border-black px-4 py-1.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300">重置</button>
          </div>
        </header>

        <div className="flex-1 flex min-h-0 overflow-hidden">
          {activeTab === 'studio' && (
            <>
              {/* 画布核心交互层 */}
              <div 
                ref={viewportRef}
                className={`flex-1 relative overflow-hidden flex items-start justify-start min-w-0 ${isDragging ? 'cursor-grabbing' : (originalImage ? 'cursor-crosshair' : 'cursor-default')} ${isDragActive ? 'bg-pink-50' : ''}`}
                onWheel={handleZoom}
                onMouseDown={startDragOrTrack}
                onMouseMove={onDrag}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
                
                {originalImage ? (
                  <div 
                    ref={contentRef}
                    className="absolute bg-white shadow-[15px_15px_0px_rgba(0,0,0,0.1)] origin-top-left border-[4px] border-black"
                    style={{ 
                      width: `${vWidth}px`, height: `${vHeight}px`,
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      willChange: 'transform'
                    }}
                  >
                    <img src={processedImage || originalImage} className="absolute inset-0 w-full h-full pointer-events-none object-fill block" style={{ imageRendering: 'pixelated' }} />
                    
                    {/* 水印画中画系统 */}
                    {watermark && watermark.dataURL && (
                        <div
                            style={{
                                position: 'absolute',
                                left: watermark.x, top: watermark.y,
                                width: watermark.width, height: watermark.height,
                                cursor: draggingWm ? 'grabbing' : 'grab',
                                border: '2px dashed #FF85A1',
                                zIndex: 20
                            }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                setDraggingWm(true);
                                setWmDragStart({ x: e.clientX, y: e.clientY, wmX: watermark.x, wmY: watermark.y });
                            }}
                        >
                            <img src={watermark.dataURL} style={{width: '100%', height: '100%', imageRendering: 'pixelated', pointerEvents: 'none'}} />
                            
                            {/* 关闭按钮 */}
                            <div
                                onClick={(e) => { e.stopPropagation(); setWatermark(null); }}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 cursor-pointer border-2 border-black shadow-md z-30"
                            >
                                <X size={12} strokeWidth={4} />
                            </div>
                            
                            {/* 缩放拖拽柄 */}
                            <div
                                className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#FF85A1] cursor-nwse-resize rounded-full border-2 border-black shadow-md z-30 flex items-center justify-center"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setResizingWm(true);
                                    setWmResizeStart({ x: e.clientX, y: e.clientY, wmW: watermark.width, wmH: watermark.height });
                                }}
                            ><div className="w-1.5 h-1.5 bg-black rounded-full pointer-events-none"></div></div>
                        </div>
                    )}

                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
                        <defs><pattern id="grid" width={BASE_CELL_SIZE} height={BASE_CELL_SIZE} patternUnits="userSpaceOnUse"><path d={`M ${BASE_CELL_SIZE} 0 L 0 0 0 ${BASE_CELL_SIZE}`} fill="none" stroke="#000" strokeWidth="1" shapeRendering="crispEdges" /></pattern></defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    
                    {viewMode === 'tracker' && trackPos.x !== -1 && (
                        <>
                            <div className="absolute left-0 right-0 z-30 bg-[#FF85A1]/40 border-y-2 border-[#FF85A1]" style={{ top: trackPos.y * BASE_CELL_SIZE, height: BASE_CELL_SIZE }} />
                            <div className="absolute top-0 bottom-0 z-30 bg-[#FF85A1]/20 border-x-2 border-[#FF85A1]" style={{ left: trackPos.x * BASE_CELL_SIZE, width: BASE_CELL_SIZE }} />
                            <div className="absolute z-40 border-4 border-black shadow-2xl animate-pulse" style={{ left: trackPos.x * BASE_CELL_SIZE, top: trackPos.y * BASE_CELL_SIZE, width: BASE_CELL_SIZE, height: BASE_CELL_SIZE }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[#FFD93D] text-[10px] px-2 py-0.5 rounded font-black whitespace-nowrap">坐标: {trackPos.x + 1}, {trackPos.y + 1}</div>
                            </div>
                        </>
                    )}
                    {isProcessing && <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center font-black italic text-[#FF85A1]">网格重采样渲染中...</div>}
                  </div>
                ) : (
                  <div className={`m-auto w-full max-w-md p-10 bg-white border-4 ${isDragActive ? 'border-[#FF85A1]' : 'border-black'} rounded-[3rem] flex flex-col items-center justify-center text-center space-y-5 hover:bg-pink-50 transition-all cursor-pointer shadow-[8px_8px_0px_rgba(0,0,0,1)] group`} onClick={() => fileInputRef.current.click()}>
                    <div className={`w-20 h-20 ${isDragActive ? 'bg-[#FF85A1]' : 'bg-[#FFD93D]'} border-4 border-black rounded-[2rem] flex items-center justify-center shadow-[6px_6px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform`}><Upload size={40} className={isDragActive ? "text-white" : "text-black"}/></div>
                    <div>
                      <h3 className="text-xl font-black italic uppercase text-black">{isDragActive ? '松开鼠标导入照片' : '点击或拖拽照片至此处'}</h3>
                    </div>
                  </div>
                )}
              </div>

              {/* 高级控制面板 */}
              <div className="w-80 border-l-4 border-black bg-white flex flex-col flex-shrink-0 z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] p-4 space-y-4 overflow-hidden">
                {viewMode === 'editor' ? (
                  <>
                    <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                      <h4 className="font-black text-xs uppercase mb-3 text-[#FF85A1] flex items-center"><SlidersHorizontal size={14} className="mr-2" /> 渲染控制台</h4>
                      <div className="space-y-4">
                        {/* 画幅控制 */}
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 italic mb-2">
                            <span>主网格宽度 (颗粒)</span>
                            <span className="text-black font-black text-sm underline decoration-[#FF85A1]">{gridWidth}</span>
                          </div>
                          <input type="range" min="10" max="300" value={gridWidth} onChange={(e) => setGridWidth(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full border border-black appearance-none cursor-pointer accent-black" />
                        </div>

                        {/* 颜色合并阈值控制 */}
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 italic mb-2">
                            <span>颜色合并阈值</span>
                            <span className="text-black font-black text-sm underline decoration-[#6BCBCA]">{mergeThreshold}</span>
                          </div>
                          <input type="range" min="0" max="100" value={mergeThreshold} onChange={(e) => setMergeThreshold(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full border border-black appearance-none cursor-pointer accent-black" />
                          <p className="text-[8px] text-slate-400 font-bold mt-1.5 leading-tight italic">数值越大，相近色合并越多，起消噪作用。</p>
                        </div>

                        {/* 处理模式 (抗锯齿控制) */}
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 italic mb-2">像素化采样模式</div>
                           <div className="grid grid-cols-2 gap-2">
                              <button onClick={() => setPixelationMode('dominant')} className={`py-1.5 text-[10px] font-black rounded-lg border-2 transition-all ${pixelationMode === 'dominant' ? 'bg-black text-white border-black shadow-sm' : 'bg-white text-slate-600 border-black hover:bg-slate-50'}`}>卡通 (中心色)</button>
                              <button onClick={() => setPixelationMode('average')} className={`py-1.5 text-[10px] font-black rounded-lg border-2 transition-all ${pixelationMode === 'average' ? 'bg-black text-white border-black shadow-sm' : 'bg-white text-slate-600 border-black hover:bg-slate-50'}`}>真实 (均值色)</button>
                           </div>
                        </div>
                        
                        {/* 品牌系统选择 */}
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 italic mb-2">国内品牌色系对标</div>
                          <div className="grid grid-cols-3 gap-2">
                            {['MARD', 'COCO', '漫漫', '盼盼', '咪小窝'].map(brand => (
                              <button 
                                key={brand} onClick={() => setColorSystemId(brand)}
                                className={`py-1.5 rounded-lg border-2 border-black font-black text-[10px] transition-all ${colorSystemId === brand ? 'bg-[#6BCBCA] text-white shadow-sm scale-105' : 'bg-white text-slate-600 hover:bg-[#E0F2F1]'}`}
                              >
                                {brand}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 色彩总数控制 */}
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 italic mb-2">
                            <span>应用色彩总数</span>
                            <span className="text-black font-black text-sm underline decoration-[#FFD93D]">{colorCount} 色</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {[12, 24, 48, 72, 96, 120, 144, 168, 192].map(count => (
                              <button 
                                key={count} 
                                onClick={() => setColorCount(count)} 
                                className={`py-1.5 rounded-lg border-2 border-black font-black text-[10px] transition-all ${colorCount === count ? 'bg-black text-white shadow-sm scale-105' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                              >
                                {count}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                    
                    {/* 杂色去除系统 */}
                    <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex-1 flex flex-col overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-xs uppercase text-emerald-500 flex items-center"><ShieldCheck size={14} className="mr-2" /> 点击剔除杂色</h4>
                        {excludedColors.size > 0 && <button onClick={() => setExcludedColors(new Set())} className="text-[9px] text-[#FF85A1] font-bold underline">重置</button>}
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                        {displayStats.map((item, idx) => {
                          const isExcluded = excludedColors.has(item.hex);
                          return (
                            <div 
                              key={idx} 
                              onClick={() => toggleExcludeColor(item.hex)}
                              className={`flex items-center justify-between p-2 rounded-xl border-2 transition-all cursor-pointer group ${isExcluded ? 'bg-red-50 border-red-300 opacity-60' : 'bg-slate-50 border-transparent hover:border-black'}`}
                              title={isExcluded ? "点击恢复该颜色" : `点击剔除 ${item.brands[colorSystemId]}`}
                            >
                              <div className="flex items-center space-x-2">
                                <div className="relative">
                                  <div className="w-5 h-5 rounded-full border-2 border-black shadow-sm" style={{backgroundColor: item.hex}}></div>
                                  {isExcluded && <Ban size={14} className="absolute -top-1 -right-1 text-red-500 bg-white rounded-full" />}
                                </div>
                                <div className="text-[9px] font-black leading-none uppercase tracking-tighter text-slate-800">
                                  {colorSystemId}: {item.brands[colorSystemId]}<br/>
                                  <span className={`text-[7px] italic ${isExcluded ? 'text-red-400' : 'text-slate-400'}`}>{isExcluded ? '已剔除' : item.hex}</span>
                                </div>
                              </div>
                              <span className={`text-xs font-black italic ${isExcluded ? 'text-red-500 line-through' : 'text-slate-600'}`}>{item.count} 颗</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {originalImage && (
                        <button onClick={() => {
                          const count = displayStats.reduce((acc, item) => acc + item.count, 0);
                          setLocalHistory([{ id: Date.now(), title: `${colorSystemId} 色系混合图纸`, date: new Date().toLocaleDateString(), size: `${gridWidth}x${gridHeight}`, image: processedImage, totalCount: count }, ...localHistory]);
                          setActiveTab('explore');
                        }} className="w-full py-4 bg-[#FF85A1] text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black text-xs uppercase italic active:translate-y-1 rounded-2xl transition-all">
                          保存图纸并赚取 XP
                        </button>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col space-y-4">
                    <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <h4 className="font-black text-xs uppercase mb-3 text-[#FF85A1] flex items-center"><Settings size={14} className="mr-2" /> 导出图纸设置</h4>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${exportSettings.showLabels ? 'bg-black border-black' : 'border-slate-400 group-hover:border-black'}`}>
                                    {exportSettings.showLabels && <CheckCircle2 size={12} className="text-white" />}
                                </div>
                                <input type="checkbox" checked={exportSettings.showLabels} onChange={e => setExportSettings({...exportSettings, showLabels: e.target.checked})} className="hidden" />
                                <span className="text-[10px] font-black text-slate-700">在图纸网格中印制色号编号</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${exportSettings.showStats ? 'bg-black border-black' : 'border-slate-400 group-hover:border-black'}`}>
                                    {exportSettings.showStats && <CheckCircle2 size={12} className="text-white" />}
                                </div>
                                <input type="checkbox" checked={exportSettings.showStats} onChange={e => setExportSettings({...exportSettings, showStats: e.target.checked})} className="hidden" />
                                <span className="text-[10px] font-black text-slate-700">在图纸底部附加色号消耗统计表</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <h4 className="font-black text-xs uppercase mb-3 text-[#FF85A1] flex items-center"><Focus size={14} className="mr-2" /> 制作导航仪</h4>
                        <div className="flex items-center justify-between p-4 bg-slate-50 border-2 border-black border-dashed rounded-xl mb-4">
                            <span className="text-[10px] font-black italic">锁定坐标:</span>
                            <span className="text-sm font-black text-[#FF85A1]">{trackPos.x === -1 ? '--' : `${trackPos.x+1}, ${trackPos.y+1}`}</span>
                        </div>
                        <button onClick={() => setPlacedBeads(new Set([...placedBeads, `${trackPos.x},${trackPos.y}`]))} disabled={trackPos.x === -1} className="w-full py-3 bg-black text-white rounded-xl text-[10px] font-black italic disabled:opacity-30 transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)]">标记此颗粒已完成</button>
                    </div>
                    <button onClick={handleExportImage} className="w-full py-4 bg-[#6BCBCA] text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black text-xs uppercase italic rounded-2xl transition-all flex items-center justify-center space-x-2 active:translate-y-1"><DownloadCloud size={16}/><span>导出高清图纸 (PNG)</span></button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 记录馆 */}
          {activeTab === 'explore' && (
            <div className="flex-1 p-10 overflow-auto bg-[#FFF9FA] custom-scrollbar">
              <div className="flex items-end justify-between mb-8 border-b-4 border-black pb-4">
                <div>
                  <h2 className="text-4xl font-black italic tracking-tighter text-black uppercase underline decoration-pink-300 decoration-8">创作记录馆</h2>
                </div>
                <div className="flex items-center space-x-2 bg-black text-white px-5 py-3 rounded-2xl font-black italic text-xs shadow-xl"><Star size={16} className="text-[#FFD93D] fill-[#FFD93D]" /><span>总工艺值: {totalXP} XP</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {localHistory.map(item => (
                  <div key={item.id} className="bg-white border-4 border-black rounded-[2rem] overflow-hidden shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group hover:-translate-y-2 transition-all">
                    <div className="aspect-square border-b-4 border-black flex items-center justify-center p-4 bg-slate-50 relative">
                      <img src={item.image} className="max-w-full max-h-full object-contain pixelated relative z-10" />
                    </div>
                    <div className="p-5 flex flex-col space-y-4">
                      <div className="flex justify-between items-center text-black">
                         <h3 className="font-black italic text-xs uppercase tracking-tighter truncate">{item.title}</h3>
                         <span className="text-[9px] bg-[#6BCBCA]/20 text-[#2d7c7a] px-2 py-0.5 rounded-lg border border-[#6BCBCA]/30 font-bold">+{item.totalCount} XP</span>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => {setOriginalImage(item.image); setActiveTab('studio'); setViewMode('editor'); setPan({x: 100, y: 100}); setZoom(0.8);}} className="flex-1 py-2.5 bg-black text-white rounded-xl text-[10px] italic shadow-[3px_3px_0px_rgba(255,133,161,1)]">再次编辑</button>
                        <button onClick={() => setLocalHistory(localHistory.filter(h => h.id !== item.id))} className="p-2 border-2 border-black rounded-xl text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; border: 2px solid white; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #000; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #000; cursor: pointer; border: 3px solid white; box-shadow: 3px 3px 0px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

export default App;