import PROVO_CAN from '@/assets/provo-can.jpg'

const galleryPlaneData = [
  {
    // 1. Arctic Mint — icy blue → deep navy gradient
    fallbackColor: '#5BB8E8',
    accentColor: '#5BB8E8',
    textureSrc: PROVO_CAN,
    position: { x: -0.5, y: 0 },
    backgroundColor: '#B8E4F8',
    blob1Color: '#1A6FA8',
    blob2Color: '#E8F8FF',
    label: {
      word: 'Arctic Mint',
      pms: 'PROVO 01',
      color: '#0A2A40',
    },
  },
  {
    // 2. Frost Wintergreen — dark forest → bright emerald gradient
    fallbackColor: '#2EA84E',
    accentColor: '#2EA84E',
    textureSrc: PROVO_CAN,
    position: { x: 0.75, y: 0 },
    backgroundColor: '#0A1F12',
    blob1Color: '#0D6B2A',
    blob2Color: '#5CE884',
    label: {
      word: 'Frost Wintergreen',
      pms: 'PROVO 02',
      color: '#C8F5D8',
    },
  },
  {
    // 3. Glacier Citrus — electric lime → bright lemon gradient
    fallbackColor: '#C4E820',
    accentColor: '#C4E820',
    textureSrc: PROVO_CAN,
    position: { x: -0.7, y: 0 },
    backgroundColor: '#E8F5C0',
    blob1Color: '#8EC800',
    blob2Color: '#F5FA60',
    label: {
      word: 'Glacier Citrus',
      pms: 'PROVO 03',
      color: '#2A3A00',
    },
  },
  {
    // 4. Iced Berry — deep violet → hot pink gradient
    fallbackColor: '#8A5CD8',
    accentColor: '#8A5CD8',
    textureSrc: PROVO_CAN,
    position: { x: 0.9, y: 0 },
    backgroundColor: '#2A1040',
    blob1Color: '#6030B8',
    blob2Color: '#E870C8',
    label: {
      word: 'Iced Berry',
      pms: 'PROVO 04',
      color: '#F0D8FF',
    },
  },
  {
    // 5. Cold Brew — espresso → amber gradient (the warm standout)
    fallbackColor: '#C47830',
    accentColor: '#C47830',
    textureSrc: PROVO_CAN,
    position: { x: -0.6, y: 0 },
    backgroundColor: '#1A0E08',
    blob1Color: '#7A3A10',
    blob2Color: '#F0A840',
    label: {
      word: 'Cold Brew',
      pms: 'PROVO 05',
      color: '#FFF0D8',
    },
  },
]

export { galleryPlaneData }
