import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Palette, Upload, Download, Layers, History, ShoppingBag, Settings, 
  CheckCircle2, Eye, Camera, FolderOpen, Save, Trash2, RefreshCw, 
  ChevronDown, ZoomIn, ZoomOut, Trophy, Star, Focus, Grid3X3, DownloadCloud,
  Wand2, ShieldCheck, ListOrdered, Ban, SlidersHorizontal, X, Menu
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

const MASTER_PALETTE = Object.entries(CORE_DICTIONARY).map(([hex, brands]) => ({
  hex, rgb: hexToRgb(hex), lab: rgbToLab(...hexToRgb(hex)), brands
}));

const App = () => {
  const [activeTab, setActiveTab] = useState('studio');
  const [viewMode, setViewMode] = useState('editor'); 
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  
  const [localHistory, setLocalHistory] = useState(() => {
    const saved = localStorage.getItem('pixelforge_data_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pixelforge_data_v1', JSON.stringify(localHistory));
  }, [localHistory]);

  const totalXP = useMemo(() => localHistory.reduce((acc, item) => acc + (item.totalCount || 0), 0), [localHistory]);
  const level = Math.floor(Math.sqrt(totalXP / 500)) + 1;
  const nextLevelXP = Math.pow(level, 2) * 500;
  const progress = Math.min((totalXP / nextLevelXP) * 100, 100);

  // 渲染配置
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
  const [exportSettings, setExportSettings] = useState({ showLabels: true, showStats: true }); 
  
  // 交互控制
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const BASE_CELL_SIZE = 24; 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [trackPos, setTrackPos] = useState({ x: -1, y: -1 });

  const fileInputRef = useRef(null);
  const viewportRef = useRef(null); 

  // ==========================================
  // 核心优化：以指针为中心的缩放逻辑
  // ==========================================
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (e) => {
      if (!originalImage) return;
      e.preventDefault();

      const rect = viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomSpeed = 0.12;
      const zoomDelta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;

      setZoom(prevZoom => {
        const nextZoom = Math.min(Math.max(prevZoom + zoomDelta, 0.05), 10);
        
        // 计算缩放比，用于调整位移补偿
        const ratio = nextZoom / prevZoom;

        setPan(prevPan => ({
          x: mouseX - (mouseX - prevPan.x) * ratio,
          y: mouseY - (mouseY - prevPan.y) * ratio
        }));

        return nextZoom;
      });
    };

    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [originalImage]);

  const activePalette = useMemo(() => {
    return MASTER_PALETTE
      .filter(c => c.brands[colorSystemId] && !excludedColors.has(c.hex))
      .slice(0, colorCount); 
  }, [colorSystemId, excludedColors, colorCount]);

  const processImageCore = async (src, w, palette, mode, threshold) => {
    const img = new Image(); img.src = src;
    await new Promise(r => img.onload = r);
    const h = Math.max(1, Math.round(w * (img.height / img.width)));

    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = mode === 'average';
    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h).data;

    const initialPixelMap = [];
    const initialCounts = {};

    const findMatchLab = (r, g, b) => {
      const targetLab = rgbToLab(r, g, b);
      let best = palette[0], minD = Infinity;
      for (let i = 0; i < palette.length; i++) {
        const c = palette[i];
        const dist = Math.pow(targetLab[0]-c.lab[0],2) + Math.pow(targetLab[1]-c.lab[1],2) + Math.pow(targetLab[2]-c.lab[2],2);
        if (dist < minD) { minD = dist; best = c; }
      }
      return best;
    };

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i], g = imageData[i+1], b = imageData[i+2], a = imageData[i+3];
      if (a < 128) { initialPixelMap.push(null); continue; }
      const match = findMatchLab(r, g, b);
      initialPixelMap.push(match.hex);
      initialCounts[match.hex] = (initialCounts[match.hex] || 0) + 1;
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
        const dist = Math.sqrt(Math.pow(colorObj.lab[0]-keptObj.lab[0],2)+Math.pow(colorObj.lab[1]-keptObj.lab[1],2)+Math.pow(colorObj.lab[2]-keptObj.lab[2],2));
        if (dist < minDist) { minDist = dist; bestMatch = keptHex; }
      }
      if (bestMatch && minDist <= effectiveThreshold) hexToMergedHex[hex] = bestMatch;
      else { hexToMergedHex[hex] = hex; keptHexes.push(hex); }
    }

    const finalPixelMap = initialPixelMap.map(h => h ? hexToMergedHex[h] : null);
    
    const outCvs = document.createElement('canvas');
    outCvs.width = w; outCvs.height = h;
    const outCtx = outCvs.getContext('2d');
    const outImgData = outCtx.createImageData(w, h);
    for(let i=0; i<finalPixelMap.length; i++){
        const hex = finalPixelMap[i];
        if(hex){
            const c = palette.find(p => p.hex === hex);
            outImgData.data[i*4]=c.rgb[0]; outImgData.data[i*4+1]=c.rgb[1]; outImgData.data[i*4+2]=c.rgb[2]; outImgData.data[i*4+3]=255;
        } else { outImgData.data[i*4+3]=0; }
    }
    outCtx.putImageData(outImgData, 0, 0);
    return { dataURL: outCvs.toDataURL(), pixelMap: finalPixelMap, height: h };
  };

  useEffect(() => {
    if (originalImage) {
      const t = setTimeout(async () => {
        setIsProcessing(true);
        const res = await processImageCore(originalImage, gridWidth, activePalette, pixelationMode, mergeThreshold);
        setGridHeight(res.height);
        setProcessedImage(res.dataURL);
        setCurrentPixelMap(res.pixelMap);
        setIsProcessing(false);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [gridWidth, originalImage, activePalette, pixelationMode, mergeThreshold]);

  const { displayStats } = useMemo(() => {
    const fCounts = {};
    currentPixelMap.forEach(hex => { if (hex) fCounts[hex] = (fCounts[hex] || 0) + 1; });
    return { displayStats: Object.keys(fCounts).map(hex => ({ ...MASTER_PALETTE.find(p => p.hex === hex), count: fCounts[hex] })).sort((a,b) => b.count - a.count) };
  }, [currentPixelMap, colorSystemId]);

  const handleStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    if (viewMode === 'tracker' && !e.touches) {
      const rect = viewportRef.current.getBoundingClientRect();
      const x = Math.floor(((clientX - rect.left - pan.x) / zoom) / BASE_CELL_SIZE);
      const y = Math.floor(((clientY - rect.top - pan.y) / zoom) / BASE_CELL_SIZE);
      if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) setTrackPos({ x, y });
    } else {
      setIsDragging(true);
      setDragStart({ x: clientX, y: clientY, panX: pan.x, panY: pan.y });
    }
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPan({ x: dragStart.panX + (clientX - dragStart.x), y: dragStart.panY + (clientY - dragStart.y) });
  };

  const toggleExcludeColor = (hex) => {
    const next = new Set(excludedColors);
    if(next.has(hex)) next.delete(hex); else next.add(hex);
    setExcludedColors(next);
  };

  const handleExportImage = async () => {
    if (!processedImage || currentPixelMap.length === 0) return;
    const exportCellSize = exportSettings.showLabels ? 40 : 32; 
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w_px = gridWidth * exportCellSize;
    const h_px = gridHeight * exportCellSize;
    const footerH = exportSettings.showStats ? 500 : 0;
    canvas.width = w_px + 100; canvas.height = h_px + footerH + 100;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    currentPixelMap.forEach((hex, i) => {
      if (!hex) return;
      const x = i % gridWidth, y = Math.floor(i / gridWidth);
      ctx.fillStyle = hex; ctx.fillRect(50 + x * exportCellSize, 50 + y * exportCellSize, exportCellSize, exportCellSize);
      if (exportSettings.showLabels) {
        const color = MASTER_PALETTE.find(p => p.hex === hex);
        ctx.fillStyle = hexToRgb(hex).reduce((a,b)=>a+b) > 400 ? '#000' : '#fff';
        ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center';
        ctx.fillText(color.brands[colorSystemId] || '', 50 + x * exportCellSize + exportCellSize/2, 50 + y * exportCellSize + exportCellSize/2 + 5);
      }
    });

    if(exportSettings.showStats){
        ctx.fillStyle = '#000'; ctx.font = 'bold 24px Arial'; ctx.textAlign = 'left';
        ctx.fillText('拼豆耗材清单', 50, h_px + 100);
        displayStats.forEach((item, idx) => {
            const row = Math.floor(idx / 4), col = idx % 4;
            ctx.fillStyle = item.hex; ctx.fillRect(50 + col * 200, h_px + 140 + row * 40, 25, 25);
            ctx.fillStyle = '#000'; ctx.font = '16px Arial';
            ctx.fillText(`${item.brands[colorSystemId]}: ${item.count}颗`, 85 + col * 200, h_px + 160 + row * 40);
        });
    }
    const link = document.createElement('a');
    link.download = `拼豆图纸_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#FFF5F7] text-slate-800 font-sans overflow-hidden select-none">
      <input type="file" ref={fileInputRef} onChange={e => {
          const f = e.target.files[0];
          if (f) {
            const r = new FileReader();
            r.onload = (ev) => { setOriginalImage(ev.target.result); setZoom(0.8); setPan({x: 20, y: 20}); };
            r.readAsDataURL(f);
          }
      }} accept="image/*" className="hidden" />

      {/* 侧边栏 */}
      <aside className="hidden md:flex w-64 border-r-4 border-black flex-col p-5 bg-white z-20 flex-shrink-0 shadow-[4px_0_0_rgba(0,0,0,1)]">
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
        <div className="p-4 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-auto font-black italic text-[10px]">
          <div className="flex justify-between mb-1"><span>LV.{level}</span><span>{totalXP} XP</span></div>
          <div className="w-full bg-slate-100 h-2 rounded-full border border-black overflow-hidden"><div className="bg-[#6BCBCA] h-full" style={{ width: `${progress}%` }}></div></div>
        </div>
      </aside>

      {/* 工作区 */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <header className="h-16 border-b-4 border-black flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md z-30">
          <div className="flex bg-slate-100 border-2 border-black p-0.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <button onClick={() => setViewMode('editor')} className={`px-4 py-1.5 rounded-md text-[10px] md:text-xs font-bold ${viewMode === 'editor' ? 'bg-black text-white' : 'text-slate-500'}`}>编辑器</button>
            <button onClick={() => setViewMode('tracker')} className={`px-4 py-1.5 rounded-md text-[10px] md:text-xs font-bold ${viewMode === 'tracker' ? 'bg-[#FF85A1] text-white' : 'text-slate-500'}`}>辅助模式 ✨</button>
          </div>
          <button onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)} className="md:hidden p-2 bg-white border-2 border-black rounded-lg">{isMobilePanelOpen ? <X size={20}/> : <Menu size={20}/>}</button>
          <button onClick={() => setOriginalImage(null)} className="hidden md:block bg-[#FFD93D] border-2 border-black px-4 py-1.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black text-xs">重置</button>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          <div 
            ref={viewportRef}
            className={`flex-1 relative overflow-hidden bg-slate-200 touch-none flex items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-crosshair'}`}
            onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={() => setIsDragging(false)}
            onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={() => setIsDragging(false)}
          >
            {originalImage ? (
              <div 
                className="absolute bg-white shadow-2xl border-4 border-black origin-top-left" 
                style={{ width: gridWidth * BASE_CELL_SIZE, height: gridHeight * BASE_CELL_SIZE, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, willChange: 'transform' }}
              >
                <img 
                  src={processedImage || originalImage} 
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                  className="absolute inset-0 w-full h-full object-fill block" 
                  style={{ imageRendering: 'pixelated' }} 
                />
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20"><defs><pattern id="grid" width={BASE_CELL_SIZE} height={BASE_CELL_SIZE} patternUnits="userSpaceOnUse"><path d={`M ${BASE_CELL_SIZE} 0 L 0 0 0 ${BASE_CELL_SIZE}`} fill="none" stroke="#000" strokeWidth="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                {viewMode === 'tracker' && trackPos.x !== -1 && <div className="absolute z-40 border-4 border-black shadow-2xl animate-pulse bg-pink-500/20" style={{ left: trackPos.x * BASE_CELL_SIZE, top: trackPos.y * BASE_CELL_SIZE, width: BASE_CELL_SIZE, height: BASE_CELL_SIZE }} />}
              </div>
            ) : (
              <div className="m-auto w-full max-w-xs md:max-w-md p-8 bg-white border-4 border-black rounded-[3rem] text-center space-y-5 shadow-[8px_8px_0px_rgba(0,0,0,1)]" onClick={() => fileInputRef.current.click()}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FFD93D] border-4 border-black rounded-[2rem] m-auto flex items-center justify-center shadow-[6px_6px_0px_rgba(0,0,0,1)]"><Upload size={32}/></div>
                <h3 className="text-lg md:text-xl font-black italic">点击导入底稿</h3>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 flex flex-col space-y-2 md:hidden z-30">
              <button onClick={() => setZoom(z => Math.min(z + 0.2, 8))} className="p-3 bg-white border-2 border-black rounded-full shadow-md"><ZoomIn size={20}/></button>
              <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.05))} className="p-3 bg-white border-2 border-black rounded-full shadow-md"><ZoomOut size={20}/></button>
            </div>
          </div>

          <aside className={`fixed md:relative inset-y-0 right-0 w-80 bg-white border-l-4 border-black z-40 p-4 space-y-4 overflow-y-auto custom-scrollbar transform transition-transform ${isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
            <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <h4 className="font-black text-xs uppercase mb-3 text-[#FF85A1] flex items-center"><SlidersHorizontal size={14} className="mr-2" /> 渲染控制台</h4>
              <div className="space-y-4">
                <div><div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2"><span>网格密度: {gridWidth}</span></div><input type="range" min="10" max="300" value={gridWidth} onChange={(e) => setGridWidth(parseInt(e.target.value))} className="w-full accent-black" /></div>
                <div><div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2"><span>合并消噪: {mergeThreshold}</span></div><input type="range" min="0" max="100" value={mergeThreshold} onChange={(e) => setMergeThreshold(parseInt(e.target.value))} className="w-full accent-black" /></div>
                <div><div className="text-[10px] font-bold text-slate-400 mb-2">渲染模式</div><div className="grid grid-cols-2 gap-2"><button onClick={() => setPixelationMode('dominant')} className={`py-1.5 text-[9px] font-black border-2 border-black rounded-lg ${pixelationMode === 'dominant' ? 'bg-black text-white' : 'bg-white'}`}>卡通</button><button onClick={() => setPixelationMode('average')} className={`py-1.5 text-[9px] font-black border-2 border-black rounded-lg ${pixelationMode === 'average' ? 'bg-black text-white' : 'bg-white'}`}>真实</button></div></div>
                <div><div className="text-[10px] font-bold text-slate-400 mb-2">对标品牌</div><div className="grid grid-cols-3 gap-1">{['MARD', 'COCO', '漫漫', '盼盼', '咪小窝'].map(brand => (<button key={brand} onClick={() => setColorSystemId(brand)} className={`py-1.5 rounded-lg border-2 border-black font-black text-[9px] ${colorSystemId === brand ? 'bg-[#6BCBCA] text-white' : 'bg-white'}`}>{brand}</button>))}</div></div>
                <div><div className="text-[10px] font-bold text-slate-400 mb-2">色彩上限</div><div className="grid grid-cols-3 gap-1">{[12, 24, 48, 72, 96, 192].map(c => (<button key={c} onClick={() => setColorCount(c)} className={`py-1 rounded-lg border-2 border-black font-black text-[9px] ${colorCount === c ? 'bg-black text-white' : 'bg-white'}`}>{c}</button>))}</div></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex-1 flex flex-col min-h-[200px]">
              <h4 className="font-black text-xs uppercase mb-3 text-emerald-500 flex items-center"><ShieldCheck size={14} className="mr-2" /> 实时清单</h4>
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">{displayStats.map((item, idx) => (<div key={idx} onClick={() => toggleExcludeColor(item.hex)} className={`flex items-center justify-between p-2 rounded-xl border-2 transition-all cursor-pointer ${excludedColors.has(item.hex) ? 'bg-red-50 border-red-300 opacity-40' : 'bg-slate-50 border-transparent hover:border-black'}`}><div className="flex items-center space-x-2"><div className="w-5 h-5 rounded-full border-2 border-black" style={{backgroundColor: item.hex}}></div><span className="text-[9px] font-black">{item.brands[colorSystemId]}</span></div><span className="text-xs font-black italic">{item.count} 颗</span></div>))}</div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <h4 className="font-black text-xs uppercase mb-3 text-[#6BCBCA] flex items-center"><Download size={14} className="mr-2" /> 导出设置</h4>
                <div className="space-y-3"><label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={exportSettings.showLabels} onChange={e => setExportSettings(prev => ({ ...prev, showLabels: e.target.checked }))} className="w-4 h-4 accent-black" /><span className="text-[10px] font-black">显示色号标签 (PDF)</span></label><label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={exportSettings.showStats} onChange={e => setExportSettings(prev => ({ ...prev, showStats: e.target.checked }))} className="w-4 h-4 accent-black" /><span className="text-[10px] font-black">显示耗材清单</span></label></div>
            </div>
            <button onClick={handleExportImage} className="w-full py-4 bg-[#6BCBCA] text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black text-xs uppercase italic rounded-2xl flex items-center justify-center space-x-2"><DownloadCloud size={16}/><span>导出图纸</span></button>
          </aside>
        </div>

        <nav className="flex md:hidden h-16 border-t-4 border-black bg-white z-30">
          <button onClick={() => setActiveTab('studio')} className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'studio' ? 'text-[#FF85A1]' : 'text-slate-400'}`}><Palette size={20}/><span className="text-[10px] font-bold">工作台</span></button>
          <button onClick={() => setActiveTab('explore')} className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'explore' ? 'text-[#FF85A1]' : 'text-slate-400'}`}><History size={20}/><span className="text-[10px] font-bold">记录馆</span></button>
        </nav>
      </main>

      {activeTab === 'explore' && (
        <div className="fixed inset-0 z-50 bg-[#FFF9FA] overflow-auto p-6 md:p-10 pb-24 md:pb-10">
          <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4"><h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase underline">创作记录馆</h2><button onClick={() => setActiveTab('studio')} className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xl">返回</button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">{localHistory.map(item => (<div key={item.id} className="bg-white border-4 border-black rounded-[2rem] overflow-hidden shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group">
            <div className="aspect-square border-b-4 border-black flex items-center justify-center p-4 bg-slate-50">
              <img src={item.image} draggable="false" className="max-w-full max-h-full object-contain pixelated" />
            </div>
            <div className="p-5 space-y-4"><div className="flex justify-between items-center text-black"><h3 className="font-black italic text-xs truncate uppercase">{item.title}</h3><span className="text-[9px] font-bold">+{item.totalCount} XP</span></div><div className="flex space-x-2"><button onClick={() => { setOriginalImage(item.image); setActiveTab('studio'); setIsMobilePanelOpen(false); }} className="flex-1 py-2.5 bg-black text-white rounded-xl text-[10px] italic shadow-[3px_3px_0px_rgba(255,133,161,1)]">编辑</button><button onClick={() => setLocalHistory(localHistory.filter(h => h.id !== item.id))} className="p-2 border-2 border-black rounded-xl text-red-500"><Trash2 size={16} /></button></div></div></div>))}</div>
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