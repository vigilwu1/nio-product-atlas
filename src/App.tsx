import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { activeVehicles, catalogueAsOf, categories, reviewVehicles, vehicles, type Vehicle } from './data/models';

type Tab = '外观' | '座舱' | '参数' | '版本';

const money = (amount: number) => `¥${amount.toLocaleString('zh-CN')}`;
const longestRange = (vehicle: Vehicle) => `${vehicle.maxRange.toLocaleString()} km`;

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="arrow-icon"><path d={diagonal ? 'M7 17 17 7M8 7h9v9' : 'M4 12h15M13 6l6 6-6 6'} /></svg>;
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon"><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4 4" /></svg>;
}

function CarArtwork({ vehicle, compact = false }: { vehicle: Vehicle; compact?: boolean }) {
  const coupe = vehicle.category === '轿跑SUV';
  const suv = vehicle.category === 'SUV';
  const wagon = vehicle.category === '旅行车';
  const roof = suv ? 'M172 147 207 103Q221 85 254 83h173q33 0 58 24l46 43' : wagon ? 'M165 147 197 108q15-20 42-23h214q27 1 48 22l44 40' : coupe ? 'M169 147 213 108q30-26 74-28h115q46 0 78 31l31 36' : 'M170 147 211 109q27-25 72-27h115q44 0 73 30l39 35';
  const body = suv ? 'M137 159 156 145h387l33 13 12 35v29H118v-30z' : wagon ? 'M130 159 156 145h405l26 17 8 32v27H113v-26z' : 'M133 159 158 145h364l26 16 18 34v26H116v-27z';
  return (
    <svg className={`car-artwork ${compact ? 'compact' : ''}`} viewBox="0 0 680 300" role="img" aria-label={`${vehicle.name}车型轮廓示意图`}>
      <defs>
        <linearGradient id={`body-${vehicle.id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f8f8f6" />
          <stop offset=".4" stopColor={vehicle.bodyColor} />
          <stop offset="1" stopColor="#6b7379" />
        </linearGradient>
        <linearGradient id={`glass-${vehicle.id}`} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#6e7a80" />
          <stop offset="1" stopColor="#182329" />
        </linearGradient>
      </defs>
      <ellipse cx="340" cy="239" rx="248" ry="22" fill="#0c1c21" opacity=".14" />
      <path d={roof} fill="none" stroke={`url(#glass-${vehicle.id})`} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m205 144 31-34q20-20 51-20h96q35 0 62 27l28 28z" fill={`url(#glass-${vehicle.id})`} stroke="#b7c2c4" strokeWidth="2" />
      <path d="M340 92v54" stroke="#9da8ab" strokeWidth="2" opacity=".55" />
      <path d={body} fill={`url(#body-${vehicle.id})`} stroke="#f9faf9" strokeWidth="2" strokeLinejoin="round" />
      <path d="M123 193h416" stroke="#eef2f1" strokeWidth="2" opacity=".58" />
      <path d="M139 164h29l-11 7h-29z" fill="#e7f0f0" opacity=".9" />
      <path d="M530 165h22l13 10h-32z" fill="#f06459" opacity=".85" />
      <path d="M182 183h46m14 0h45m101 0h49" stroke="#5d686e" strokeWidth="2" opacity=".48" />
      <circle cx="214" cy="222" r="34" fill="#172328" />
      <circle cx="214" cy="222" r="23" fill="#dce1df" />
      <circle cx="214" cy="222" r="15" fill="#68747a" />
      <circle cx="470" cy="222" r="34" fill="#172328" />
      <circle cx="470" cy="222" r="23" fill="#dce1df" />
      <circle cx="470" cy="222" r="15" fill="#68747a" />
      <path d="M196 222h36m220 0h36M214 204v36m256-36v36" stroke="#f8f8f6" strokeWidth="2" opacity=".65" />
      <path d="M128 188h28M542 188h20" stroke="#202e33" strokeWidth="5" strokeLinecap="round" />
      <text x="339" y="275" textAnchor="middle" fill="#5e696d" fontSize="11" letterSpacing="3">{vehicle.name} · 轮廓示意</text>
    </svg>
  );
}

function VehicleCard({ vehicle, comparing, compareFull, onOpen, onCompare }: {
  vehicle: Vehicle; comparing: boolean; compareFull: boolean; onOpen: () => void; onCompare: () => void;
}) {
  const image = vehicle.gallery.find((item) => item.src)?.src;
  return (
    <article className="vehicle-card">
      <button className="vehicle-card__visual" onClick={onOpen} aria-label={`查看${vehicle.name}详情`}>
        {image ? <img src={image} loading="lazy" alt={`${vehicle.name}官方外观图`} /> : <div className="card-silhouette"><CarArtwork vehicle={vehicle} compact /></div>}
        <span className="visual-corner">{image ? '官方外观图' : '轮廓示意'}</span>
        <span className="open-round"><ArrowIcon diagonal /></span>
      </button>
      <div className="vehicle-card__body">
        <div className="card-topline"><span>{vehicle.category}</span><span>{vehicle.yearScope}</span></div>
        <button className="vehicle-name-button" onClick={onOpen}><span className="vehicle-card__name">{vehicle.name}</span><ArrowIcon diagonal /></button>
        <p className="vehicle-card__phrase">{vehicle.phrase}</p>
        <div className="card-stats">
          <div><b>{vehicle.dimensions.wheelbase.toLocaleString()}</b><span>轴距 mm</span></div>
          <div><b>{vehicle.powerKw}</b><span>综合功率 kW</span></div>
          <div><b>{longestRange(vehicle)}</b><span>最高CLTC口径</span></div>
        </div>
        <div className="card-bottom">
          <div><small>配置表列价起</small><strong>{money(Math.min(...vehicle.variants.map((variant) => variant.price)))}</strong></div>
          <button className={`compare-toggle ${comparing ? 'is-selected' : ''}`} onClick={onCompare} aria-pressed={comparing} disabled={!comparing && compareFull} title={!comparing && compareFull ? '最多选择三款车型' : undefined}>
            <span>{comparing ? '✓' : '+'}</span> {compareFull && !comparing ? '已选满' : '对比'}
          </button>
        </div>
      </div>
    </article>
  );
}

function VisualStage({ vehicle, tab, featureIndex, setFeatureIndex }: {
  vehicle: Vehicle; tab: Tab; featureIndex: number; setFeatureIndex: (index: number) => void;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const availableImage = vehicle.gallery.find((item) => item.src);
  const features = vehicle.highlights;
  const isCabin = tab === '座舱';
  const feature = features[featureIndex % features.length];

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current) return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    setTilt({ x: Math.max(-4, Math.min(4, -dy / 24)), y: Math.max(-8, Math.min(8, dx / 20)) });
  };
  const endPointer = () => { pointerStart.current = null; setTilt({ x: 0, y: 0 }); };

  return (
    <div className={`visual-stage ${isCabin ? 'is-cabin' : ''}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endPointer} onPointerCancel={endPointer}>
      <div className="stage-grid" />
      <div className="stage-orbit stage-orbit--one" /><div className="stage-orbit stage-orbit--two" />
      <div className="stage-label"><span className="live-dot" /> 交互式产品预览 <span className="stage-label__line" /> {isCabin ? '座舱信息' : '外观视角'}</div>
      <div className="stage-visual" style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        {isCabin ? (
          <div className="cabin-diagram">
            <div className="cabin-glass"><span /><span /><span /></div>
            <div className="cabin-dash"><i /><i /><i /></div>
            <div className="cabin-seat cabin-seat--a" /><div className="cabin-seat cabin-seat--b" />
            <div className="cabin-console" />
            <div className="cabin-caption"><small>座舱结构示意</small><b>以具体版本配置为准</b></div>
          </div>
        ) : availableImage ? (
          <img src={availableImage.src} alt={`${vehicle.name}外观官方素材`} className="stage-photo" draggable="false" />
        ) : (
          <CarArtwork vehicle={vehicle} />
        )}
      </div>
      <button className="hotspot hotspot--a" onClick={() => setFeatureIndex(0)} aria-label={`查看${features[0]?.title ?? '第一个'}细节`}><span>01</span></button>
      <button className="hotspot hotspot--b" onClick={() => setFeatureIndex((featureIndex + 1) % features.length)} aria-label="查看下一个车型细节"><span>02</span></button>
      <div className="stage-controls">
        <span>按住并拖动，探索视角</span>
        <div className="stage-dots" aria-label="车型细节导航">{features.map((item, index) => <button key={item.title} className={index === featureIndex ? 'active' : ''} onClick={() => setFeatureIndex(index)} aria-label={`查看${item.title}`} />)}</div>
      </div>
      <div className="stage-detail-card"><span className="eyebrow">{feature.tag}</span><strong>{feature.title}</strong><p>{feature.body}</p></div>
      <div className="stage-index">{String(featureIndex + 1).padStart(2, '0')} <i>/</i> {String(features.length).padStart(2, '0')}</div>
    </div>
  );
}

function DetailDialog({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('外观');
  const [featureIndex, setFeatureIndex] = useState(0);
  const feature = vehicle.highlights[featureIndex % vehicle.highlights.length];
  const [layout, setLayout] = useState<number | undefined>(vehicle.id === 'es8' ? 5 : undefined);
  const [es9Layout, setEs9Layout] = useState<'通道' | '中岛'>('通道');
  const [activeVariant, setActiveVariant] = useState(0);
  const activeVariants = vehicle.id === 'es8' && layout
    ? vehicle.variants.filter((variant) => variant.seats === layout)
    : vehicle.id === 'es9'
      ? vehicle.variants.filter((variant) => variant.name.includes(es9Layout))
      : vehicle.variants;
  const selectedVariant = activeVariants[Math.min(activeVariant, activeVariants.length - 1)];
  const layoutVariants = vehicle.id === 'es8' ? [5, 6, 7] : [];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  const selectLayout = (seatCount: number) => {
    setLayout(seatCount);
    setActiveVariant(0);
  };

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="dialog-close" onClick={onClose} aria-label="关闭车型详情">×</button>
        <div className="detail-header">
          <div className="detail-overline"><span>NIO / PRODUCT FILE</span><span>资料核实至 {catalogueAsOf}</span></div>
          <div className="detail-title-row"><div><p className="detail-category">{vehicle.category} <span>·</span> {vehicle.yearScope}</p><h2 id="detail-title">{vehicle.name}</h2></div><p className="detail-phrase">“{vehicle.phrase}”</p></div>
          <p className="detail-positioning">{vehicle.positioning}<span className="detail-separator">/</span><span className="editorial-tag">研究视角：{vehicle.editorialLens}</span></p>
        </div>
        <div className="detail-tabs" role="tablist" aria-label="车型内容分类">
          {(['外观', '座舱', '参数', '版本'] as Tab[]).map((name) => <button role="tab" aria-selected={tab === name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)} key={name}>{name}</button>)}
        </div>
        <div className="detail-content">
          <div className="detail-view-column">
            <VisualStage vehicle={vehicle} tab={tab} featureIndex={featureIndex} setFeatureIndex={setFeatureIndex} />
            {vehicle.gallery.find((item) => item.src) && <p className="media-caption">{vehicle.gallery.find((item) => item.src)?.note}</p>}
            {!vehicle.gallery.find((item) => item.src) && <p className="media-caption">车型轮廓仅作页面交互示意；官方多角度外观与座舱图组待补。</p>}
          </div>
          <div className="detail-info-column">
            {(vehicle.id === 'es8' || vehicle.id === 'es9') && <div className="layout-switch">
              <div><span className="eyebrow">座舱布局</span><strong>{vehicle.id === 'es8' ? '选择座位数' : '行政座舱'}</strong></div>
              {layoutVariants.map((seats) => <button key={seats} className={layout === seats ? 'selected' : ''} onClick={() => selectLayout(seats)}>{seats}座</button>)}
              {vehicle.id === 'es9' && <><button className={es9Layout === '通道' ? 'selected' : ''} onClick={() => { setEs9Layout('通道'); setActiveVariant(0); }}>通道</button><button className={es9Layout === '中岛' ? 'selected' : ''} onClick={() => { setEs9Layout('中岛'); setActiveVariant(0); }}>中岛</button></>}
            </div>}
            {tab === '版本' ? (
              <div className="version-section">
                <div className="section-heading"><span className="eyebrow">01 / CONFIGURATIONS</span><h3>版本与价格</h3></div>
                <p className="price-disclaimer">配置表列价，资料核实日 {catalogueAsOf}。请以官网配置器实时价格及当期权益为准。</p>
                <div className="variant-list">{activeVariants.map((variant, index) => <button className={`variant-row ${activeVariant === index ? 'selected' : ''}`} key={variant.name} onClick={() => setActiveVariant(index)}>
                  <span className="variant-radio" /><span className="variant-name">{variant.name}</span><strong>{money(variant.price)}</strong>
                </button>)}</div>
                <div className="baas-note"><span className="note-icon">↗</span><div><b>电池租用与购车权益</b><p>当前BaaS月费、补贴及活动条件未在本页面重复引用；请打开官方配置器查验当期条款。</p><a href={vehicle.configUrl} target="_blank" rel="noreferrer">查看官方配置器 <ArrowIcon diagonal /></a></div></div>
                <div className="source-list"><span className="eyebrow">SOURCES / 来源</span>{vehicle.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{source.kind} · {source.label}</span><small>核对 {source.checkedAt}</small><ArrowIcon diagonal /></a>)}</div>
              </div>
            ) : tab === '参数' ? (
              <div className="spec-section">
                <div className="section-heading"><span className="eyebrow">01 / KEY FIGURES</span><h3>参数一览</h3></div>
                <div className="dimension-card"><div className="dimension-top"><strong>{vehicle.dimensions.length.toLocaleString()}<small>mm</small></strong><span>车长</span></div><div className="dimension-graphic"><i /><i /><i /><i /><b>{vehicle.dimensions.wheelbase.toLocaleString()} mm 轴距</b></div><div className="dimension-bottom"><span>车宽 {vehicle.dimensions.width.toLocaleString()} mm</span><span>车高 {vehicle.dimensions.height.toLocaleString()} mm</span></div></div>
                <div className="spec-pair-grid"><div><span>座位布局</span><strong>{vehicle.seats}</strong></div><div><span>综合功率</span><strong>{vehicle.powerKw} <small>kW</small></strong></div><div><span>最大扭矩</span><strong>{vehicle.torqueNm} <small>N·m</small></strong></div><div><span>零百加速</span><strong>{vehicle.acceleration}</strong></div></div>
                <div className="range-card"><div><span className="eyebrow">BATTERY / CLTC</span><strong>{vehicle.batteryAndRange}</strong></div><span className="range-arc">{longestRange(vehicle)}<small>最高口径</small></span></div>
                <p className="fine-print">CLTC为实验室工况口径，不代表实际道路续航。{vehicle.rangeNote} 来源：官方配置表，核对于 {catalogueAsOf}。</p>
              </div>
            ) : (
              <div className="feature-section">
                <div className="section-heading"><span className="eyebrow">0{featureIndex + 1} / EXPLORE DETAIL</span><h3>{feature.title}</h3></div>
                <p className="feature-copy">{feature.body}</p>
                <div className="claim-audit"><span>{feature.tag === '研究视角' ? '研究分析 · 非公司自述' : `适用范围：${vehicle.yearScope} · 核对：${feature.checkedAt ?? catalogueAsOf}`}</span>{feature.sourceUrl && <a href={feature.sourceUrl} target="_blank" rel="noreferrer">配置来源 <ArrowIcon diagonal /></a>}</div>
                <div className="feature-rows">{vehicle.highlights.map((highlight, index) => <button key={highlight.title} className={featureIndex === index ? 'selected' : ''} onClick={() => setFeatureIndex(index)}><span className="feature-index">0{index + 1}</span><span><b>{highlight.title}</b><small>{highlight.tag}</small></span><ArrowIcon /></button>)}</div>
                <div className="quick-specs"><span>车身尺寸</span><b>{vehicle.dimensions.length.toLocaleString()} × {vehicle.dimensions.width.toLocaleString()} × {vehicle.dimensions.height.toLocaleString()} mm</b></div>
                <div className="quick-specs"><span>配置表列价</span><b>{money(Math.min(...vehicle.variants.map((variant) => variant.price)))} 起</b></div>
                <button className="source-link-button" onClick={() => setTab('版本')}>查看版本、购车方式与来源 <ArrowIcon /></button>
              </div>
            )}
            {tab === '版本' && selectedVariant && <div className="selected-version-footer"><span>当前选择</span><strong>{selectedVariant.name}</strong><small>{selectedVariant.seats ? `${selectedVariant.seats}座 · ` : ''}{money(selectedVariant.price)}</small></div>}
          </div>
        </div>
        <div className="detail-footer"><span>车型叙述与官方主张分开标注。参数和价格按版本对应，不混用。</span><a href={vehicle.productUrl} target="_blank" rel="noreferrer">访问蔚来官网车型页 <ArrowIcon diagonal /></a></div>
      </section>
    </div>
  );
}

function CompareDialog({ compare, onRemove, onClose, onAdd }: {
  compare: Vehicle[]; onRemove: (id: string) => void; onClose: () => void; onAdd: (id: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const fields: { label: string; get: (v: Vehicle) => string }[] = [
    { label: '车型定位', get: (v) => v.positioning },
    { label: '车身类别', get: (v) => v.category },
    { label: '座位布局', get: (v) => v.seats },
    { label: '车身尺寸', get: (v) => `${v.dimensions.length} × ${v.dimensions.width} × ${v.dimensions.height} mm` },
    { label: '轴距', get: (v) => `${v.dimensions.wheelbase.toLocaleString()} mm` },
    { label: '综合功率', get: (v) => `${v.powerKw} kW` },
    { label: '最大扭矩', get: (v) => `${v.torqueNm} N·m` },
    { label: '零百加速', get: (v) => v.acceleration },
    { label: '电池 / CLTC', get: (v) => v.batteryAndRange },
    { label: '配置表列价', get: (v) => `${money(Math.min(...v.variants.map((variant) => variant.price)))} 起` },
  ];
  const available = activeVehicles.filter((vehicle) => !compare.some((item) => item.id === vehicle.id));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <div className="dialog-backdrop compare-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="compare-dialog" role="dialog" aria-modal="true" aria-labelledby="compare-title">
        <button className="dialog-close" onClick={onClose} aria-label="关闭车型对比">×</button>
        <div className="compare-heading"><span className="eyebrow">COMPARE / 最多三款</span><h2 id="compare-title">放在一起，差异更清楚</h2><p>官方配置表口径，核实至 {catalogueAsOf}。不同版本与测试条件请进一步查看来源。</p></div>
        <div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>对比项目</th>{compare.map((vehicle) => <th key={vehicle.id}><div className="compare-car-head"><span>{vehicle.category}</span><strong>{vehicle.name}</strong><button onClick={() => onRemove(vehicle.id)} aria-label={`移除${vehicle.name}`}>移除 ×</button></div></th>)}{compare.length < 3 && <th className="add-column"><button onClick={() => setShowPicker(!showPicker)}>＋ 添加车型</button>{showPicker && <div className="compare-picker">{available.map((vehicle) => <button key={vehicle.id} onClick={() => { onAdd(vehicle.id); setShowPicker(false); }}>{vehicle.name}<span>{vehicle.category}</span></button>)}</div>}</th>}</tr></thead><tbody>{fields.map((field) => <tr key={field.label}><th>{field.label}</th>{compare.map((vehicle) => <td key={vehicle.id}>{field.get(vehicle)}</td>)}{compare.length < 3 && <td className="empty-cell">—</td>}</tr>)}</tbody></table></div>
        <div className="compare-footnote">BaaS、选装、权益及锁单条件不由此表推断；点击具体车型卡片查看对应的版本说明和官方来源。</div>
      </section>
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState<(typeof categories)[number]>('全部');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const gridRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => activeVehicles.filter((vehicle) => {
    const categoryMatch = category === '全部' || vehicle.category === category;
    const textMatch = `${vehicle.name} ${vehicle.phrase} ${vehicle.positioning}`.toLowerCase().includes(query.trim().toLowerCase());
    return categoryMatch && textMatch;
  }), [category, query]);
  const compared = compareIds.map((id) => vehicles.find((vehicle) => vehicle.id === id)).filter((vehicle): vehicle is Vehicle => Boolean(vehicle));

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  const scrollToCatalogue = () => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        scrollToCatalogue();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setSelected(null);
        setCompareOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, []);

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="回到首页"><span>蔚来</span><i /> <small>PRODUCT ATLAS</small></a>
        <nav className="main-nav" aria-label="主导航"><a href="#catalogue">车型图鉴</a><a href="#how-to-read">阅读指南</a><button onClick={() => setCompareOpen(true)}>车型对比 <span>{compareIds.length || ''}</span></button></nav>
        <button className="mobile-menu" onClick={scrollToCatalogue} aria-label="跳到车型列表">车型</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="kicker-line" /> NIO · 中国车型图鉴 <span className="kicker-date">资料基线 {catalogueAsOf}</span></div>
          <h1>先认识一台车。<br /><em>再看见它的更多可能。</em></h1>
          <p>从车身尺寸、座舱布局到版本差异，打开一份可以探索的蔚来产品图鉴。</p>
          <div className="hero-actions"><button className="primary-button" onClick={scrollToCatalogue}>开始探索 <ArrowIcon /></button><a href="#how-to-read" className="text-button">如何阅读这份图鉴 <span>↓</span></a></div>
          <div className="hero-meta"><span><b>01</b> 车型</span><i /><span>参数 · 空间 · 版本</span><i /><span>互动图鉴</span></div>
        </div>
        <div className="hero-visual" aria-label="蔚来ES9外观展示">
          <div className="hero-glow" /><div className="hero-sun" />
          <img src="./images/es9.jpg" alt="蔚来ES9官方外观图" fetchPriority="high" />
          <div className="hero-visual-shadow" />
          <div className="hero-visual-title"><span>FEATURED / 旗舰SUV</span><strong>ES9</strong><small>天地纵览</small></div>
          <div className="hero-visual-side"><span>5,365 mm</span><small>车身长度</small></div>
          <button className="hero-visual-cta" onClick={() => setSelected(vehicles.find((vehicle) => vehicle.id === 'es9')!)} aria-label="探索ES9详情"><span>探索车型</span><ArrowIcon diagonal /></button>
        </div>
        <div className="hero-bottom"><span>PRODUCT STORIES / 车型故事与配置事实分开阅读</span><span>SCROLL TO EXPLORE <b>↓</b></span></div>
      </section>

      <section className="catalogue-section" id="catalogue" ref={gridRef}>
        <div className="section-topline"><span className="eyebrow">01 / MODEL INDEX</span><span className="section-note">从车身形态进入，再打开每款车的细节。</span></div>
        <div className="catalogue-intro"><div><h2>认识每一种<br /><em>蔚来。</em></h2></div><div className="catalogue-intro-right"><p>轿车、旅行车、SUV与轿跑SUV。按你关注的形态浏览，也可以挑选三款并排对照。</p><div className="catalogue-count"><strong>{activeVehicles.length.toString().padStart(2, '0')}</strong><span>款车型资料<br />可供浏览</span></div></div></div>
        <div className="catalogue-controls">
          <div className="category-tabs" aria-label="按车型分类">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <label className="search-box"><SearchIcon /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索车型或主题" aria-label="搜索车型或主题" /><kbd>⌘ K</kbd></label>
        </div>
        <div className="vehicle-grid">
          {filtered.map((vehicle, index) => <div className="card-entry" key={vehicle.id} style={{ animationDelay: `${index * 45}ms` }}>
            <VehicleCard vehicle={vehicle} comparing={compareIds.includes(vehicle.id)} compareFull={compareIds.length >= 3} onOpen={() => setSelected(vehicle)} onCompare={() => toggleCompare(vehicle.id)} />
          </div>)}
          {filtered.length === 0 && <div className="empty-state"><span>没有找到这款车</span><button onClick={() => { setQuery(''); setCategory('全部'); }}>清空筛选</button></div>}
        </div>
        <div className="catalogue-footnote"><span className="footnote-mark">i</span><p>车型配置与价格底稿核对于 {catalogueAsOf}。页面呈现已记录的公开配置，不等同于实时可下定状态。价格、版本和权益请以官方配置器当前信息为准。</p><a href="https://www.nio.cn/" target="_blank" rel="noreferrer">蔚来官网 <ArrowIcon diagonal /></a></div>

        <div className="review-archive">
          <button className="review-toggle" onClick={() => setShowReview(!showReview)} aria-expanded={showReview}><span><b>其他车型资料</b><small>{reviewVehicles.length} 款在售状态待复核，不计入上方在售筛选</small></span><span className={`review-plus ${showReview ? 'open' : ''}`}>+</span></button>
          {showReview && <div className="review-list">{reviewVehicles.map((vehicle) => <article key={vehicle.id} className="review-row"><div><b>{vehicle.name}</b><span>{vehicle.yearScope}</span></div><p>{vehicle.highlights[0]?.body}</p><a href={vehicle.productUrl} target="_blank" rel="noreferrer">官方车型页 <ArrowIcon diagonal /></a><a href={vehicle.configUrl} target="_blank" rel="noreferrer">配置表 <ArrowIcon diagonal /></a></article>)}</div>}
        </div>
      </section>

      <section className="reading-section" id="how-to-read">
        <div className="reading-header"><span className="eyebrow">02 / HOW TO READ</span><h2>一页，不止一组<br /><em>参数。</em></h2><p>这是一份面向阅读与学习的产品资料，不是销售页面。每条信息都尽量告诉你它来自哪里、适用于哪种版本。</p></div>
        <div className="reading-steps">
          <article><span className="step-no">01</span><div className="step-icon step-icon--orbit"><i /><i /><b /></div><h3>点开细节</h3><p>拖动互动预览查看倾斜视角，再点击标记查看对应的车型说明。当前图片不是360°实车模型。</p></article>
          <article><span className="step-no">02</span><div className="step-icon step-icon--layers"><i /><i /><i /></div><h3>读懂版本</h3><p>价格按配置表记录。标配、选装、座位布局与权益单独说明，不把高配内容套到全系。</p></article>
          <article><span className="step-no">03</span><div className="step-icon step-icon--source"><i>↗</i><i>01</i><i>02</i></div><h3>沿着来源核对</h3><p>每款车提供官方车型页与配置表链接，并保留本地资料核实日期。未知项明确标记。</p></article>
        </div>
      </section>

      <section className="closing-section"><span className="eyebrow">A BETTER WAY TO KNOW</span><h2>从参数开始。<br /><em>最后，留下自己的判断。</em></h2><button onClick={scrollToCatalogue}>回到车型图鉴 <ArrowIcon /></button><div className="closing-index">NIO<br />PRODUCT<br />ATLAS</div></section>

      <footer className="site-footer"><a className="wordmark" href="#top"><span>蔚来</span><i /> <small>PRODUCT ATLAS</small></a><p>车型资料核对于 {catalogueAsOf} · 中国市场公开信息整理</p><span>公开信息科普 · 非实时配置报价</span></footer>

      {selected && <DetailDialog key={selected.id} vehicle={selected} onClose={() => setSelected(null)} />}
      {compareOpen && <CompareDialog compare={compared} onRemove={(id) => setCompareIds((current) => current.filter((item) => item !== id))} onClose={() => setCompareOpen(false)} onAdd={(id) => { if (compareIds.length < 3) setCompareIds((current) => [...current, id]); }} />}
      {compared.length > 0 && !compareOpen && <div className="compare-dock"><div><span className="compare-dock-label">COMPARE</span><strong>{compared.length} / 3</strong><small>选择车型并排比较</small></div><div className="compare-dock-items">{compared.map((vehicle) => <button key={vehicle.id} onClick={() => toggleCompare(vehicle.id)} aria-label={`移除${vehicle.name}`}>{vehicle.name} <span>×</span></button>)}</div><button className="compare-open" onClick={() => setCompareOpen(true)}>开始对比 <ArrowIcon /></button></div>}
    </main>
  );
}
