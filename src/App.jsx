import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Palette, Upload, Download, Layers, History, ShoppingBag, Settings, 
  CheckCircle2, Eye, Camera, FolderOpen, Save, Trash2, RefreshCw, 
  ChevronDown, ZoomIn, ZoomOut, Trophy, Star, Focus, Grid3X3, DownloadCloud,
  Wand2, ShieldCheck, ListOrdered, Ban, SlidersHorizontal, X, Menu,
  Hash, Type
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

// 辅助函数
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

const MASTER_PALETTE = (() => {
  const palette = Object.entries(CORE_DICTIONARY).map(([hex, brands]) => ({
    hex, rgb: hexToRgb(hex), lab: rgbToLab(...hexToRgb(hex)), brands
  }));
  const remaining = 192 - palette.length;
  for (let i = 0; i < remaining; i++) {
    const hue = (i * 137.5) % 360; const sat = 60 + (i % 4) * 10; const lit = 40 + (i % 6) * 8;
    const a = (sat * Math.min(lit, 100 - lit)) / 10000;
    const f = n => {
      const k = (n + hue / 30) % 12;
      return Math.round(255 * (lit / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
    };
    const r = f(0), g = f(8), b = f(4);
    const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`.toUpperCase();
    palette.push({
      hex, rgb: [r, g, b], lab: rgbToLab(r, g, b),
      brands: { "MARD": `X${i+100}`, "COCO": `C${i+100}`, "漫漫": `M${i+100}`, "盼盼": `P${i+100}`, "咪小窝":"MI"+i }
    });
  }
  return palette;
})();

const App = () => {
  const [activeTab, setActiveTab] = useState('studio');
  const [viewMode, setViewMode] = useState('editor'); // editor | tracker (导出模式)
  
  useEffect(() => {
    document.title = "拼豆豆 - 创作工坊";
  }, []);

  const [localHistory, setLocalHistory] = useState(() => {
    const saved = localStorage.getItem('pixelforge_data_v2');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => localStorage.setItem('pixelforge_data_v2', JSON.stringify(localHistory)), [localHistory]);

  const totalXP = useMemo(() => localHistory.reduce((acc, item) => acc + (item.totalCount || 0), 0), [localHistory]);
  const level = Math.floor(Math.sqrt(totalXP / 500)) + 1;
  const nextLevelXP = Math.pow(level, 2) * 500;
  const progress = Math.min((totalXP / nextLevelXP) * 100, 100);

  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [gridWidth, setGridWidth] = useState(50);
  const [gridHeight, setGridHeight] = useState(50);
  const [colorSystemId, setColorSystemId] = useState('MARD'); 
  const [colorCount, setColorCount] = useState(48); 
  const [mergeThreshold, setMergeThreshold] = useState(24); 
  const [pixelationMode, setPixelationMode] = useState('dominant'); 
  const [excludedColors, setExcludedColors] = useState(new Set()); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPixelMap, setCurrentPixelMap] = useState([]); 

  const [exportSettings, setExportSettings] = useState({ 
    showLabels: true, 
    showCoordinates: false,
    showStats: true 
  });
  
  const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [trackPos, setTrackPos] = useState({ x: -1, y: -1 });
  const BASE_CELL_SIZE = 24; 

  const fileInputRef = useRef(null);
  const viewportRef = useRef(null); 

  const centerImage = (w, h) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const finalZoom = Math.min(rect.width / (w * BASE_CELL_SIZE) * 0.9, 0.8);
    setTransform({
      x: (rect.width - w * BASE_CELL_SIZE * finalZoom) / 2,
      y: (rect.height - h * BASE_CELL_SIZE * finalZoom) / 2,
      zoom: finalZoom
    });
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (e) => {
      if (!originalImage) return;
      e.preventDefault(); 
      const rect = viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setTransform(prev => {
        const nextZoom = Math.min(Math.max(prev.zoom * zoomFactor, 0.05), 15);
        if (nextZoom === prev.zoom) return prev;
        const ratio = nextZoom / prev.zoom;
        return { zoom: nextZoom, x: mouseX - (mouseX - prev.x) * ratio, y: mouseY - (mouseY - prev.y) * ratio };
      });
    };
    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [originalImage]);

  const processImageCore = async (src, w, capacity, threshold, mode) => {
    if (!src) return null;
    const img = new Image(); img.src = src; await new Promise(r => img.onload = r);
    const h = Math.max(1, Math.round(w * (img.height / img.width)));
    const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = mode === 'average';
    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h).data;
    const availablePalette = MASTER_PALETTE.filter(c => !excludedColors.has(c.hex));
    const initialMap = []; const counts = {};
    for (let i = 0; i < imageData.length; i += 4) {
      if (imageData[i+3] < 128) { initialMap.push(null); continue; }
      const targetLab = rgbToLab(imageData[i], imageData[i+1], imageData[i+2]);
      let best = availablePalette[0], minD = Infinity;
      for (const c of availablePalette) {
        const d = Math.pow(targetLab[0]-c.lab[0],2) + Math.pow(targetLab[1]-c.lab[1],2) + Math.pow(targetLab[2]-c.lab[2],2);
        if (d < minD) { minD = d; best = c; }
      }
      initialMap.push(best.hex); counts[best.hex] = (counts[best.hex] || 0) + 1;
    }
    const sortedUsed = Object.keys(counts).sort((a,b) => counts[b] - counts[a]);
    const winnersHexes = sortedUsed.slice(0, capacity);
    const winners = winnersHexes.map(h => MASTER_PALETTE.find(p => p.hex === h));
    const finalMap = initialMap.map(hex => {
      if (!hex) return null;
      if (winnersHexes.includes(hex)) return hex;
      const target = MASTER_PALETTE.find(p => p.hex === hex);
      let b = winners[0], minD = Infinity;
      for (const wc of winners) {
        const d = Math.pow(target.lab[0]-wc.lab[0],2) + Math.pow(target.lab[1]-wc.lab[1],2) + Math.pow(target.lab[2]-wc.lab[2],2);
        if (d < minD) { minD = d; b = wc; }
      }
      return b.hex;
    });
    const outCvs = document.createElement('canvas'); outCvs.width = w; outCvs.height = h;
    const outCtx = outCvs.getContext('2d'); const outImgData = outCtx.createImageData(w, h);
    for(let i=0; i<finalMap.length; i++){
        const hex = finalMap[i];
        if(hex){
            const c = MASTER_PALETTE.find(p => p.hex === hex);
            outImgData.data[i*4]=c.rgb[0]; outImgData.data[i*4+1]=c.rgb[1]; outImgData.data[i*4+2]=c.rgb[2]; outImgData.data[i*4+3]=255;
        } else { outImgData.data[i*4+3]=0; }
    }
    outCtx.putImageData(outImgData, 0, 0);
    return { dataURL: outCvs.toDataURL(), pixelMap: finalMap, height: h };
  };

  useEffect(() => {
    if (originalImage) {
      const t = setTimeout(async () => {
        setIsProcessing(true);
        const res = await processImageCore(originalImage, gridWidth, colorCount, mergeThreshold, pixelationMode);
        setGridHeight(res.height); setProcessedImage(res.dataURL); setCurrentPixelMap(res.pixelMap);
        setIsProcessing(false); if (transform.x === 0 && transform.y === 0) centerImage(gridWidth, res.height);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [gridWidth, originalImage, colorCount, mergeThreshold, pixelationMode, excludedColors]);

  const stats = useMemo(() => {
    const f = {}; currentPixelMap.forEach(h => { if (h) f[h] = (f[h] || 0) + 1; });
    return Object.keys(f).map(h => ({ ...MASTER_PALETTE.find(p => p.hex === h), count: f[h] })).sort((a,b) => b.count - a.count);
  }, [currentPixelMap, colorSystemId]);

  const handleStart = (e) => {
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    if (viewMode === 'tracker' && !e.touches) {
      const rect = viewportRef.current.getBoundingClientRect();
      const x = Math.floor(((cx - rect.left - transform.x) / transform.zoom) / BASE_CELL_SIZE);
      const y = Math.floor(((cy - rect.top - transform.y) / transform.zoom) / BASE_CELL_SIZE);
      if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) setTrackPos({ x, y });
    } else {
      setIsDragging(true); setDragStart({ x: cx, y: cy, panX: transform.x, panY: transform.y });
    }
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    setTransform(curr => ({ ...curr, x: dragStart.panX + (cx - dragStart.x), y: dragStart.panY + (cy - dragStart.y) }));
  };

  const handleExport = async (pixelMapData, width, height, customSettings = null) => {
    const map = pixelMapData || currentPixelMap;
    const w = width || gridWidth;
    const h = height || gridHeight;
    const cfg = customSettings || exportSettings;
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); const cellSize = 40;
    canvas.width = w * cellSize + 100; canvas.height = h * cellSize + (cfg.showStats ? 600 : 100);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    map.forEach((hex, i) => {
      if (!hex) return;
      const x = i % w, y = Math.floor(i / w);
      ctx.fillStyle = hex; ctx.fillRect(50 + x * cellSize, 50 + y * cellSize, cellSize, cellSize);
      let label = "";
      if (cfg.showLabels) label = (MASTER_PALETTE.find(p => p.hex === hex)).brands[colorSystemId] || '';
      else if (cfg.showCoordinates) label = `${x},${y}`;
      if (label) {
          ctx.fillStyle = hexToRgb(hex).reduce((a,b)=>a+b) > 400 ? '#000' : '#fff';
          ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center';
          ctx.fillText(label, 50 + x * cellSize + cellSize/2, 50 + y * cellSize + cellSize/2 + 5);
      }
    });
    if(cfg.showStats) {
        ctx.fillStyle = '#000'; ctx.font = 'bold 24px Arial'; ctx.textAlign = 'left';
        ctx.fillText('拼豆豆耗材清单', 50, h * cellSize + 100);
        const currentStats = {}; map.forEach(hex => { if(hex) currentStats[hex] = (currentStats[hex]||0)+1; });
        const statEntries = Object.keys(currentStats).map(h => ({ ...MASTER_PALETTE.find(p => p.hex === h), count: currentStats[h] })).sort((a,b)=>b.count-a.count);
        statEntries.forEach((item, idx) => {
            const r = Math.floor(idx / 4), c = idx % 4;
            ctx.fillStyle = item.hex; ctx.fillRect(50 + c * 200, h * cellSize + 140 + r * 40, 25, 25);
            ctx.fillStyle = '#000'; ctx.font = '16px Arial';
            ctx.fillText(`${item.brands[colorSystemId]}: ${item.count}颗`, 85 + c * 200, h * cellSize + 160 + r * 40);
        });
    }
    const link = document.createElement('a'); link.download = `拼豆豆图纸_${Date.now()}.png`; link.href = canvas.toDataURL(); link.click();
  };

  const saveToHistory = () => {
    if (!processedImage) return;
    const newItem = { 
      id: Date.now(), image: originalImage, thumb: processedImage, 
      title: `创作 #${localHistory.length + 1}`, pixelMap: currentPixelMap,
      gridWidth, gridHeight, totalCount: currentPixelMap.filter(h => h).length, 
      date: new Date().toLocaleString(),
      settings: { gridWidth, colorCount, mergeThreshold, pixelationMode, colorSystemId }
    };
    setLocalHistory([newItem, ...localHistory]);
    setActiveTab('explore');
  };

  const loadFromHistory = (item) => {
    setOriginalImage(item.image);
    setGridWidth(item.settings.gridWidth);
    setColorCount(item.settings.colorCount);
    setMergeThreshold(item.settings.mergeThreshold);
    setPixelationMode(item.settings.pixelationMode);
    setColorSystemId(item.settings.colorSystemId);
    setActiveTab('studio');
    setTimeout(() => centerImage(item.gridWidth, item.gridHeight), 100);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#FFF5F7] text-slate-800 font-sans overflow-hidden select-none">
      <input type="file" ref={fileInputRef} onChange={e => {
          const f = e.target.files[0]; if (f) {
            const r = new FileReader(); r.onload = (ev) => { setOriginalImage(ev.target.result); centerImage(gridWidth, gridHeight); }; r.readAsDataURL(f);
          }
      }} accept="image/*" className="hidden" />

      {/* 侧边栏 */}
      <aside className="hidden md:flex w-64 border-r-4 border-black flex-col p-5 bg-white z-20 shadow-[4px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-[#FFD93D] border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)]"><Palette size={24} /></div>
          <h1 className="text-2xl font-black text-black">拼豆豆</h1>
        </div>
        <nav className="flex-1 space-y-4">
          <button onClick={() => setActiveTab('studio')} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl border-2 font-bold transition-all ${activeTab === 'studio' ? 'bg-[#FF85A1] text-white border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]' : 'text-slate-500 border-transparent hover:bg-pink-50'}`}><Palette size={20} /> <span>创作工坊</span></button>
          <button onClick={() => setActiveTab('explore')} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl border-2 font-bold transition-all ${activeTab === 'explore' ? 'bg-[#FF85A1] text-white border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]' : 'text-slate-500 border-transparent hover:bg-pink-50'}`}><History size={20} /> <span>灵感记录馆</span></button>
        </nav>
        <div className="mt-auto p-4 bg-slate-50 border-2 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between text-[10px] font-black italic mb-1"><span>LV.{level}</span><span>{totalXP} XP</span></div>
          <div className="w-full bg-slate-200 h-2 rounded-full border border-black overflow-hidden"><div className="bg-[#6BCBCA] h-full" style={{ width: `${progress}%` }}></div></div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="h-14 md:h-16 border-b-4 border-black flex items-center justify-between px-4 md:px-8 bg-white/80 z-30 flex-shrink-0">
          <div className="flex bg-slate-100 border-2 border-black p-0.5 rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <button onClick={() => setViewMode('editor')} className={`px-3 md:px-5 py-1 rounded-md text-[10px] md:text-xs font-bold transition-all ${viewMode === 'editor' ? 'bg-black text-white' : 'text-slate-500'}`}>编辑器</button>
            <button onClick={() => setViewMode('tracker')} className={`px-3 md:px-5 py-1 rounded-md text-[10px] md:text-xs font-bold transition-all ${viewMode === 'tracker' ? 'bg-[#FF85A1] text-white' : 'text-slate-500'}`}>导出模式 ✨</button>
          </div>
          <button onClick={() => { setOriginalImage(null); setTransform({x:0,y:0,zoom:0.8}); }} className="bg-[#FFD93D] border-2 border-black px-3 py-1 rounded-xl font-black text-[10px] md:text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)]">清空</button>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          <div ref={viewportRef} className={`h-[45vh] md:h-full md:flex-1 relative overflow-hidden bg-slate-200 touch-none flex-shrink-0 ${isDragging ? 'cursor-grabbing' : 'cursor-crosshair'}`} onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={() => setIsDragging(false)} onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={() => setIsDragging(false)}>
            {originalImage ? (
              <div className="absolute bg-white shadow-2xl border-4 border-black origin-top-left" style={{ width: gridWidth * BASE_CELL_SIZE, height: gridHeight * BASE_CELL_SIZE, transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`, willChange: 'transform' }}>
                <img src={processedImage || originalImage} draggable="false" className="absolute inset-0 w-full h-full object-fill block" style={{ imageRendering: 'pixelated' }} />
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: `${BASE_CELL_SIZE}px ${BASE_CELL_SIZE}px`, opacity: 0.1 }}></div>
                {viewMode === 'tracker' && (exportSettings.showLabels || exportSettings.showCoordinates) && transform.zoom > 0.5 && currentPixelMap.map((hex, i) => {
                    if (!hex) return null;
                    const x = i % gridWidth, y = Math.floor(i / gridWidth);
                    const color = MASTER_PALETTE.find(p => p.hex === hex);
                    return (
                        <div key={i} className="absolute pointer-events-none font-black flex items-center justify-center text-[6px] overflow-hidden leading-tight text-center" style={{ left: x * BASE_CELL_SIZE, top: y * BASE_CELL_SIZE, width: BASE_CELL_SIZE, height: BASE_CELL_SIZE, color: hexToRgb(hex).reduce((a,b)=>a+b)>400 ? '#000' : '#fff' }}>
                            {exportSettings.showLabels ? color.brands[colorSystemId] : `${x},${y}`}
                        </div>
                    );
                })}
                {viewMode === 'tracker' && trackPos.x !== -1 && <div className="absolute z-40 border-4 border-black shadow-2xl animate-pulse bg-pink-500/20" style={{ left: trackPos.x * BASE_CELL_SIZE, top: trackPos.y * BASE_CELL_SIZE, width: BASE_CELL_SIZE, height: BASE_CELL_SIZE }} />}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-[280px] md:max-w-md p-6 md:p-10 bg-white border-4 border-black rounded-[2rem] md:rounded-[3rem] text-center shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-[#FFD93D] border-4 border-black rounded-[1rem] md:rounded-[2rem] m-auto flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-3 md:mb-4"><Upload size={24}/></div>
                    <h3 className="text-sm md:text-xl font-black italic">点击导入底稿图片</h3>
                </div>
              </div>
            )}
          </div>

          <aside className="w-full md:w-85 bg-white border-t-4 md:border-t-0 md:border-l-4 border-black p-4 md:p-5 flex-1 overflow-y-auto custom-scrollbar">
            {viewMode === 'editor' ? (
              <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-5">
                <h4 className="font-black text-xs uppercase mb-3 text-[#FF85A1] flex items-center"><SlidersHorizontal size={14} className="mr-2" /> 渲染配置</h4>
                <div className="space-y-4">
                  <div><div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1"><span>网格密度: {gridWidth}</span></div><input type="range" min="10" max="300" value={gridWidth} onChange={(e) => setGridWidth(parseInt(e.target.value))} className="w-full accent-black" /></div>
                  <div><div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1"><span>合并消噪: {mergeThreshold}</span></div><input type="range" min="0" max="100" value={mergeThreshold} onChange={(e) => setMergeThreshold(parseInt(e.target.value))} className="w-full accent-black" /></div>
                  <div><div className="text-[10px] font-bold text-slate-400 mb-2">处理模式</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setPixelationMode('dominant')} className={`py-1.5 text-[9px] font-black border-2 border-black rounded-lg ${pixelationMode === 'dominant' ? 'bg-black text-white' : 'bg-white'}`}>卡通 (主色)</button>
                      <button onClick={() => setPixelationMode('average')} className={`py-1.5 text-[9px] font-black border-2 border-black rounded-lg ${pixelationMode === 'average' ? 'bg-black text-white' : 'bg-white'}`}>真实 (柔和)</button>
                    </div>
                  </div>
                  <div><div className="text-[10px] font-bold text-slate-400 mb-2">色彩容量</div>
                    <div className="grid grid-cols-3 gap-1">
                      {[12, 24, 48, 72, 96, 120, 144, 168, 192].map(c => (
                        <button key={c} onClick={() => setColorCount(c)} className={`py-1 rounded-lg border-2 border-black font-black text-[9px] ${colorCount === c ? 'bg-[#FF85A1] text-white' : 'bg-white'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div><div className="text-[10px] font-bold text-slate-400 mb-2">色系品牌</div><div className="grid grid-cols-3 gap-1">{['MARD', 'COCO', '漫漫', '盼盼', '咪小窝'].map(brand => (<button key={brand} onClick={() => setColorSystemId(brand)} className={`py-1.5 rounded-lg border-2 border-black font-black text-[9px] ${colorSystemId === brand ? 'bg-[#6BCBCA] text-white' : 'bg-white'}`}>{brand}</button>))}</div></div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-5">
                <h4 className="font-black text-xs uppercase mb-3 text-[#6BCBCA] flex items-center"><Eye size={14} className="mr-2" /> 导出设置</h4>
                <div className="space-y-4">
                    <button onClick={() => setExportSettings(p => ({...p, showLabels: !p.showLabels, showCoordinates: false}))} className={`w-full flex items-center justify-between p-3 border-2 border-black rounded-xl transition-all ${exportSettings.showLabels ? 'bg-black text-white shadow-[4px_4px_0px_rgba(107,203,202,1)]' : 'bg-white text-black'}`}>
                        <div className="flex items-center space-x-2"><Type size={16}/> <span className="text-xs font-black">导出带色号标签</span></div>
                        {exportSettings.showLabels && <CheckCircle2 size={16}/>}
                    </button>
                    <button onClick={() => setExportSettings(p => ({...p, showCoordinates: !p.showCoordinates, showLabels: false}))} className={`w-full flex items-center justify-between p-3 border-2 border-black rounded-xl transition-all ${exportSettings.showCoordinates ? 'bg-black text-white shadow-[4px_4px_0px_rgba(255,133,161,1)]' : 'bg-white text-black'}`}>
                        <div className="flex items-center space-x-2"><Hash size={16}/> <span className="text-xs font-black">导出带坐标数字</span></div>
                        {exportSettings.showCoordinates && <CheckCircle2 size={16}/>}
                    </button>
                    <button onClick={() => setExportSettings(p => ({...p, showStats: !p.showStats}))} className={`w-full flex items-center justify-between p-3 border-2 border-black rounded-xl transition-all ${exportSettings.showStats ? 'bg-black text-white shadow-[4px_4px_0px_rgba(255,217,61,1)]' : 'bg-white text-black'}`}>
                        <div className="flex items-center space-x-2"><ListOrdered size={16}/> <span className="text-xs font-black">包含详细耗材表</span></div>
                        {exportSettings.showStats && <CheckCircle2 size={16}/>}
                    </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex-1 flex flex-col min-h-[250px] mb-5">
              <h4 className="font-black text-xs uppercase mb-3 text-emerald-500 flex items-center"><ShieldCheck size={14} className="mr-2" /> 耗材实时清单</h4>
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">{stats.map((item, idx) => (<div key={idx} onClick={() => { const next = new Set(excludedColors); if(next.has(item.hex)) next.delete(item.hex); else next.add(item.hex); setExcludedColors(next); }} className={`flex items-center justify-between p-2 rounded-xl border-2 transition-all cursor-pointer ${excludedColors.has(item.hex) ? 'opacity-30 border-dashed scale-95' : 'bg-slate-50 border-transparent hover:border-black'}`}><div className="flex items-center space-x-2"><div className="w-5 h-5 rounded-full border-2 border-black" style={{backgroundColor: item.hex}}></div><span className="text-[9px] font-black">{item.brands[colorSystemId]}</span></div><span className="text-xs font-black italic">{item.count} 颗</span></div>))}</div>
            </div>

            <div className="flex space-x-2 pb-5">
              <button onClick={saveToHistory} className="flex-1 py-4 bg-black text-white border-2 border-black shadow-[4px_4px_0px_rgba(255,133,161,1)] font-black uppercase italic rounded-2xl active:translate-y-1">保存作品</button>
              <button onClick={() => handleExport()} className="p-4 bg-[#6BCBCA] text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-2xl active:translate-y-1" title="下载高清图纸"><DownloadCloud size={20}/></button>
            </div>
          </aside>
        </div>
      </main>

      {activeTab === 'explore' && (
        <div className="fixed inset-0 z-50 bg-[#FFF9FA] overflow-auto p-4 md:p-10 pb-24">
          <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
            <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase underline">灵感记录馆</h2>
            <button onClick={() => setActiveTab('studio')} className="bg-black text-white px-3 py-1.5 md:px-5 md:py-2 rounded-xl text-[10px] md:text-xs font-bold shadow-xl">返回</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">{localHistory.map(item => (
            <div key={item.id} className="bg-white border-4 border-black rounded-[2rem] overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group">
              <div className="aspect-square border-b-4 border-black flex items-center justify-center p-4 bg-slate-50 relative">
                <img src={item.thumb} draggable="false" className="max-w-full max-h-full object-contain pixelated" />
                <div className="absolute top-4 right-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleExport(item.pixelMap, item.gridWidth, item.gridHeight, item.settings)} className="p-3 bg-[#6BCBCA] border-2 border-black rounded-full shadow-lg active:scale-95 transition-transform"><Download size={20} className="text-white"/></button>
                </div>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <div className="flex justify-between items-center text-black">
                   <div>
                     <h3 className="font-black italic text-[10px] md:text-xs truncate uppercase">{item.title}</h3>
                     <p className="text-[8px] text-slate-400">{item.date}</p>
                   </div>
                   <span className="text-[9px] font-bold">+{item.totalCount} XP</span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => loadFromHistory(item)} className="flex-1 py-2 bg-black text-white rounded-xl text-[10px] italic shadow-[3px_3px_0px_rgba(255,133,161,1)]">重新加载配置</button>
                  <button onClick={() => setLocalHistory(localHistory.filter(h => h.id !== item.id))} className="p-2 border-2 border-black rounded-xl text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}</div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border-radius: 10px; }
        input[type=range] { -webkit-appearance: none; height: 6px; background: #eee; border-radius: 5px; border: 1px solid #000; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #FFD93D; border: 2px solid #000; box-shadow: 2px 2px 0px #000; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default App;