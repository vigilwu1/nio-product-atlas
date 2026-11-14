export type VehicleCategory = '轿车' | '旅行车' | 'SUV' | '轿跑SUV';
export type SalesState = 'catalogue-snapshot' | 'review';

export interface VehicleVariant {
  name: string;
  price: number;
  seats?: number;
  note?: string;
}

export interface VehicleSource {
  label: string;
  url: string;
  checkedAt: string;
  kind: '产品页' | '配置表';
}

export interface VehicleHighlight {
  title: string;
  body: string;
  tag: '官方信息' | '研究视角' | '需核实';
  sourceUrl?: string;
  checkedAt?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  salesState: SalesState;
  yearScope: string;
  phrase: string;
  positioning: string;
  editorialLens: string;
  bodyColor: string;
  dimensions: { length: number; width: number; height: number; wheelbase: number };
  seats: string;
  powerKw: number;
  torqueNm: number;
  acceleration: string;
  batteryAndRange: string;
  maxRange: number;
  rangeNote: string;
  variants: VehicleVariant[];
  highlights: VehicleHighlight[];
  gallery: { src?: string; label: string; note: string }[];
  productUrl: string;
  configUrl: string;
  sources: VehicleSource[];
}

const accessed = '2026-10-15';

function sources(slug: string, configPath: string, configLabel = '配置表'): VehicleSource[] {
  return [
    { label: `${slug} 官方车型页`, url: `https://www.nio.cn/${slug.toLowerCase()}`, checkedAt: accessed, kind: '产品页' },
    { label: configLabel, url: configPath, checkedAt: accessed, kind: '配置表' },
  ];
}

const vehicleRecords: Vehicle[] = [
  {
    id: 'et5', name: 'ET5', category: '轿车', salesState: 'catalogue-snapshot', yearScope: '2026款',
    phrase: '一触即发，型动进阶', positioning: '智能电动中型轿车', editorialLens: '运动设计与日常驾乘的平衡', bodyColor: '#d7cbd3',
    dimensions: { length: 4790, width: 1960, height: 1499, wheelbase: 2888 }, seats: '5座',
    powerKw: 360, torqueNm: 700, acceleration: '4.0 秒（工程条件）',
    batteryAndRange: '75 / 100 / 150 kWh；CLTC 585 / 740 / 1,055 km（普通版）', maxRange: 1055,
    rangeNote: '轮圈、版本与轮胎会影响续航；特殊版数据另核。',
    variants: [{ name: 'ET5', price: 298000 }, { name: '自然奇境版', price: 310000 }, { name: '冠军纪念版', price: 313000 }],
    highlights: [
      { title: '动力', body: '双电机综合功率 360 kW，最大扭矩 700 N·m。', tag: '官方信息' },
      { title: '续航', body: '配置表列示 75、100、150 kWh 电池组合；续航随版本与轮胎变化。', tag: '官方信息' },
      { title: '设计阅读', body: '从低车身比例、座舱包裹感和驾驶姿态观察它的运动取向。', tag: '研究视角' },
    ],
    gallery: [{ src: '/images/et5.jpg', label: '外观', note: '官方产品图；单张视角，非360°模型。' }, { label: '座舱', note: '官方座舱图组待补；此处先展示可追溯配置摘要。' }],
    productUrl: 'https://www.nio.cn/et5', configUrl: 'https://www.nio.cn/vehicle/configuration/et5?scene=office&is_nav_show=false&wv=lg&fix_font=true',
    sources: sources('ET5', 'https://www.nio.cn/vehicle/configuration/et5?scene=office&is_nav_show=false&wv=lg&fix_font=true'),
  },
  {
    id: 'et5t', name: 'ET5T', category: '旅行车', salesState: 'catalogue-snapshot', yearScope: '2026款',
    phrase: '一往无前，舒享升级', positioning: '智能电动旅行车', editorialLens: '旅行装载、生活方式与驾控', bodyColor: '#b8c2bf',
    dimensions: { length: 4790, width: 1960, height: 1499, wheelbase: 2888 }, seats: '5座',
    powerKw: 360, torqueNm: 700, acceleration: '4.0 秒（工程条件）',
    batteryAndRange: '75 / 100 / 150 kWh；CLTC 550 / 710 / 1,010 km（普通版）', maxRange: 1010,
    rangeNote: '后排放倒时最大装载空间为配置状态数据；车顶导轨、拖挂、天幕及放电套装需分别核对。',
    variants: [{ name: 'ET5T', price: 298000 }, { name: '自然奇境版', price: 310000 }, { name: '冠军纪念版', price: 313000 }],
    highlights: [
      { title: '旅行空间', body: '后排放倒后最大装载容积为 1,687 L；不同座椅状态不可混写。', tag: '官方信息' },
      { title: '拓展装备', body: '车顶导轨、拖挂、天幕与充放电套装逐项对应配置，不默认全系标配。', tag: '需核实' },
      { title: '生活方式', body: '用装载与户外拓展解读旅行车形态，而不是简单把轿车加大后备厢。', tag: '研究视角' },
    ],
    gallery: [{ label: '外观', note: '官方多角度图组待补；当前以车型轮廓示意呈现。' }, { label: '座舱', note: '官方座舱图组待补；展示已记录的车型信息。' }],
    productUrl: 'https://www.nio.cn/et5t', configUrl: 'https://www.nio.cn/vehicle/configuration/tt5?scene=office&is_nav_show=false&wv=lg&fix_font=true',
    sources: sources('ET5T', 'https://www.nio.cn/vehicle/configuration/tt5?scene=office&is_nav_show=false&wv=lg&fix_font=true'),
  },
  {
    id: 'es6', name: 'ES6', category: 'SUV', salesState: 'catalogue-snapshot', yearScope: '配置页标注2026款',
    phrase: '由内而外，全面进阶', positioning: '智能电动全能SUV', editorialLens: '家庭日常、多场景与空间舒适', bodyColor: '#aaaeb3',
    dimensions: { length: 4854, width: 1995, height: 1703, wheelbase: 2915 }, seats: '5座',
    powerKw: 360, torqueNm: 700, acceleration: '4.5 秒（半载）',
    batteryAndRange: '75 kWh：490–510 km；100 kWh：630–650 km；150 kWh：965 km（CLTC）', maxRange: 965,
    rangeNote: '续航区间随轮圈与版本变化。',
    variants: [{ name: '2026款 ES6', price: 338000 }, { name: '自然奇境版', price: 350000 }],
    highlights: [
      { title: '座舱选择', body: '女王副驾、主驾零重力等功能为选装项，需按版本确认。', tag: '官方信息' },
      { title: '空间', body: '5座布局，轴距 2,915 mm；适合与轿跑SUV、旅行车对照阅读。', tag: '官方信息' },
      { title: '车型理解', body: '从均衡与多场景出发，避免把单项舒适配置概括成全系标准。', tag: '研究视角' },
    ],
    gallery: [{ label: '外观', note: '官方车型图片待补；当前为车型轮廓示意。' }, { label: '座舱', note: '官方座舱图组待补；可从版本差异与空间信息继续探索。' }],
    productUrl: 'https://www.nio.cn/es6', configUrl: 'https://www.nio.cn/vehicle/configuration/es6?scene=office&is_nav_show=false&wv=lg&fix_font=true',
    sources: sources('ES6', 'https://www.nio.cn/vehicle/configuration/es6?scene=office&is_nav_show=false&wv=lg&fix_font=true'),
  },
  {
    id: 'ec6', name: 'EC6', category: '轿跑SUV', salesState: 'catalogue-snapshot', yearScope: '当前配置页；特别版另标2026背景',
    phrase: '个性表达，格调进化', positioning: '智能电动轿跑SUV', editorialLens: '轿跑线条、个性表达与舒适', bodyColor: '#b9a8a4',
    dimensions: { length: 4849, width: 1995, height: 1697, wheelbase: 2915 }, seats: '5座',
    powerKw: 360, torqueNm: 700, acceleration: '4.4 秒（半载）',
    batteryAndRange: '75 kWh：495–515 km；100 kWh：635–655 km；150 kWh：970 km（CLTC）', maxRange: 970,
    rangeNote: '特别版、轮圈和轮胎配置可能对应不同续航。',
    variants: [{ name: 'EC6', price: 358000 }, { name: '自然奇境版', price: 370000 }, { name: '冠军纪念版', price: 373000 }, { name: '灵韵特别版', price: 369800 }],
    highlights: [
      { title: '车身比例', body: '长 4,849 mm，轴距 2,915 mm；车高与车顶线条体现轿跑SUV形态。', tag: '官方信息' },
      { title: '特别版本', body: '灵韵特别版的轮圈、内饰与冠军版底盘升级按各自配置展示。', tag: '官方信息' },
      { title: '选装提示', body: '六活塞制动为选装套装，不据产品页概述推断为全系标准配置。', tag: '需核实' },
    ],
    gallery: [{ label: '外观', note: '官方车型图组待补；当前为车型轮廓示意。' }, { label: '座舱', note: '官方座舱图组待补；重点标出不同版本边界。' }],
    productUrl: 'https://www.nio.cn/ec6', configUrl: 'https://www.nio.cn/vehicle/configuration/ec6?scene=office&is_nav_show=false&wv=lg&fix_font=true',
    sources: sources('EC6', 'https://www.nio.cn/vehicle/configuration/ec6?scene=office&is_nav_show=false&wv=lg&fix_font=true'),
  },
  {
    id: 'et9', name: 'ET9', category: '轿车', salesState: 'catalogue-snapshot', yearScope: '当前配置页',
    phrase: '敢想，有为', positioning: '行政旗舰轿车', editorialLens: '行政座舱、原创技术与私享后排', bodyColor: '#b9b7ae',
    dimensions: { length: 5325, width: 2017, height: 1621, wheelbase: 3250 }, seats: '座椅布局以所选配置为准',
    powerKw: 520, torqueNm: 700, acceleration: '4.1 秒（单载）',
    batteryAndRange: '102 kWh；CLTC 620–650 km（按轮圈与配置）', maxRange: 650,
    rangeNote: '加速与续航数据保留配置表条件；不要与不同电池或测试条件拼接。',
    variants: [{ name: 'ET9', price: 768000 }, { name: '签名版', price: 788000 }, { name: '地平线特别版', price: 818000 }],
    highlights: [
      { title: '旗舰尺寸', body: '车长 5,325 mm、轴距 3,250 mm；为蔚来轿车产品中更大的行政旗舰车身。', tag: '官方信息' },
      { title: '技术表达', body: '双神玑、天行全主动悬架等具体技术以对应版本与官方材料为准。', tag: '需核实' },
      { title: '内容角度', body: '围绕后排私享、座舱科技和原创工程组织内容。', tag: '研究视角' },
    ],
    gallery: [{ label: '外观', note: '官方车型图组待补；当前为车型轮廓示意。' }, { label: '座舱', note: '官方座舱图组待补；版本对应关系需逐项复核。' }],
    productUrl: 'https://www.nio.cn/et9', configUrl: 'https://www.nio.cn/vehicle/configuration/et9?scene=office&is_nav_show=false&wv=lg&fix_font=true',
    sources: sources('ET9', 'https://www.nio.cn/vehicle/configuration/et9?scene=office&is_nav_show=false&wv=lg&fix_font=true'),
  },
  {
    id: 'es8', name: 'ES8', category: 'SUV', salesState: 'catalogue-snapshot', yearScope: '全新ES8；五座与六/七座分开',
    phrase: '全场景科技旗舰SUV', positioning: '全场景科技旗舰SUV', editorialLens: '多人出行与大五座的不同空间价值', bodyColor: '#d5d3cb',
    dimensions: { length: 5280, width: 2010, height: 1800, wheelbase: 3130 }, seats: '5 / 6 / 7座',
    powerKw: 520, torqueNm: 700, acceleration: '五座 3.90 秒；六/七座 3.97 秒',
    batteryAndRange: '102 kWh；五座 655 km，六/七座 635 km（CLTC）', maxRange: 655,
    rangeNote: '座位布局对应不同续航、储物与安全配置。',
    variants: [
      { name: '五座行政豪华', price: 382800, seats: 5 }, { name: '五座行政签名', price: 422800, seats: 5 },
      { name: '六座行政豪华', price: 406800, seats: 6 }, { name: '六座行政签名', price: 446800, seats: 6 },
      { name: '七座行政豪华', price: 406800, seats: 7 },
    ],
    highlights: [
      { title: '布局切换', body: '五座、六座、七座版本分开比较：座椅、储物、加速、续航与安全配置不可混用。', tag: '官方信息' },
      { title: '五座空间', body: '五座版轴距 3,130 mm，CLTC 续航 655 km；六/七座版为 635 km。', tag: '官方信息' },
      { title: '选装提示', body: '投影大灯、调光窗与不同气囊数量按具体配置核对，不推广为全系标配。', tag: '需核实' },
    ],
    gallery: [{ src: '/images/es8.jpg', label: '外观', note: '官方产品图；单张视角，非360°模型。' }, { label: '座舱', note: '五/六/七座官方图组待补；本页先按布局展示已核实差异。' }],
    productUrl: 'https://www.nio.cn/es8', configUrl: 'https://www.nio.cn/vehicle/configuration/es8?scene=office&is_nav_show=false&wv=lg&fix_font=true',
    sources: sources('ES8', 'https://www.nio.cn/vehicle/configuration/es8?scene=office&is_nav_show=false&wv=lg&fix_font=true'),
  },
  {
    id: 'es9', name: 'ES9', category: 'SUV', salesState: 'catalogue-snapshot', yearScope: '当前配置页',
    phrase: '天地纵览', positioning: '科技行政旗舰SUV', editorialLens: '六座行政空间、私密与社交体验', bodyColor: '#c7b7a7',
    dimensions: { length: 5365, width: 2029, height: 1870, wheelbase: 3250 }, seats: '6座；通道 / 中岛布局',
    powerKw: 520, torqueNm: 700, acceleration: '4.3 秒（载荷条件待配置表核实）',
    batteryAndRange: '102 kWh；豪华版 580–620 km，其余配置 580–600 km（CLTC）', maxRange: 620,
    rangeNote: '通道/中岛与版本需分别核对；悬架、气囊和续航存在配置差异。',
    variants: [
      { name: '行政豪华·通道', price: 498000, seats: 6 }, { name: '行政豪华·中岛', price: 498000, seats: 6 },
      { name: '行政签名·通道', price: 558000, seats: 6 }, { name: '行政签名·中岛', price: 558000, seats: 6 },
      { name: '地平线·通道', price: 628000, seats: 6 }, { name: '地平线·中岛', price: 628000, seats: 6 },
    ],
    highlights: [
      { title: '通道与中岛', body: '中岛布局为12气囊、通道布局为11气囊；不可将其中一项写成全系配置。', tag: '官方信息' },
      { title: '底盘差异', body: '行政豪华为双腔空悬与外置阀CDC；签名/地平线版为天行全主动悬架。', tag: '官方信息' },
      { title: '天空岛', body: '可从空间布局、声学与照明理解天空岛的座舱体验；表达需关联实际版本。', tag: '研究视角' },
    ],
    gallery: [{ src: '/images/es9.jpg', label: '外观', note: '官方ES9产品图；单张视角，非360°模型。' }, { label: '座舱', note: '官方座舱图组待补；通道与中岛布局信息分开展示。' }],
    productUrl: 'https://www.nio.cn/es9', configUrl: 'https://order-front-h5.nio.com/configuration-detail/index?model_code=ES9&scene=office&is_nav_show=false&wv=lg&fix_font=true',
    sources: sources('ES9', 'https://order-front-h5.nio.com/configuration-detail/index?model_code=ES9&scene=office&is_nav_show=false&wv=lg&fix_font=true'),
  },
  {
    id: 'et7', name: 'ET7', category: '轿车', salesState: 'review', yearScope: '现有配置表标注2024款',
    phrase: '智能电动高端行政轿车', positioning: '行政轿车', editorialLens: '后排舒适、互联办公与行政出行', bodyColor: '#9faeb9',
    dimensions: { length: 5101, width: 1987, height: 1509, wheelbase: 3060 }, seats: '5座', powerKw: 480, torqueNm: 850,
    acceleration: '3.8 秒（半载）', batteryAndRange: '75 kWh：470–550 km；100 kWh：600–705 km；150 kWh：890–1,050 km（CLTC）', maxRange: 1050,
    rangeNote: '现有配置表标注2024款；当期可下定与交付状态未复核。',
    variants: [{ name: '行政版', price: 428000 }, { name: '行政签名版', price: 458000 }],
    highlights: [{ title: '状态说明', body: '本地资料为2024款配置表，无法据此确认制作当日仍可下定。核实前不纳入在售筛选。', tag: '需核实' }],
    gallery: [{ label: '外观', note: '在售状态待复核；暂不展示为当前在售车型。' }, { label: '座舱', note: '年份及配置状态核实后补充。' }],
    productUrl: 'https://www.nio.cn/et7', configUrl: 'https://www.nio.cn/vehicle/configuration/et7?scene=office&is_nav_show=false&wv=lg&fix_font=true',
    sources: sources('ET7', 'https://www.nio.cn/vehicle/configuration/et7?scene=office&is_nav_show=false&wv=lg&fix_font=true'),
  },
  {
    id: 'ec7', name: 'EC7', category: '轿跑SUV', salesState: 'review', yearScope: '现有配置表标注2024款',
    phrase: '感受优雅的力量', positioning: '智能电动旗舰轿跑SUV', editorialLens: '旗舰轿跑姿态与优雅力量感', bodyColor: '#aaa6a0',
    dimensions: { length: 4968, width: 1974, height: 1714, wheelbase: 2960 }, seats: '5座', powerKw: 480, torqueNm: 850,
    acceleration: '3.8 秒（半载）', batteryAndRange: '配置表列100 kWh、CLTC 635 km；其他电池口径需单独核实', maxRange: 635,
    rangeNote: '现有配置表标注2024款；产品页与配置表口径不同，避免拼接。',
    variants: [{ name: 'EC7', price: 458000 }, { name: 'EC7签名版', price: 490000 }],
    highlights: [{ title: '状态说明', body: '在售状态未复核；现有配置表为2024款，确认当期版本后再发布当前价格与配置。', tag: '需核实' }],
    gallery: [{ label: '外观', note: '在售状态待复核；暂不展示为当前在售车型。' }, { label: '座舱', note: '年份及配置状态核实后补充。' }],
    productUrl: 'https://www.nio.cn/ec7', configUrl: 'https://order-front-h5.nio.com/configuration-detail/index?model_code=EC7&scene=office&is_nav_show=false&wv=lg&fix_font=true',
    sources: sources('EC7', 'https://order-front-h5.nio.com/configuration-detail/index?model_code=EC7&scene=office&is_nav_show=false&wv=lg&fix_font=true'),
  },
];

export const vehicles: Vehicle[] = vehicleRecords.map((vehicle) => ({
  ...vehicle,
  highlights: vehicle.highlights.map((highlight) => ({
    ...highlight,
    sourceUrl: highlight.tag === '研究视角' ? undefined : vehicle.configUrl,
    checkedAt: highlight.tag === '研究视角' ? '研究分析' : accessed,
  })),
}));

export const catalogueAsOf = accessed;
export const categories = ['全部', '轿车', '旅行车', 'SUV', '轿跑SUV'] as const;
export const activeVehicles = vehicles.filter((vehicle) => vehicle.salesState === 'catalogue-snapshot');
export const reviewVehicles = vehicles.filter((vehicle) => vehicle.salesState === 'review');
