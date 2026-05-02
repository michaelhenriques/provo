import PROVO_CAN from '@/assets/provo-can.jpg'

const galleryPlaneData = [
  {
    // 1. Arctic Mint — icy blue, the flagship
    fallbackColor: '#7BC8E2',
    accentColor: '#7BC8E2',
    textureSrc: PROVO_CAN,
    position: { x: -0.5, y: 0 },
    backgroundColor: '#DCF0F8',
    blob1Color: '#A8D8EA',
    blob2Color: '#C8EEF7',
    label: {
      word: 'Arctic Mint',
      pms: 'PROVO 01',
      color: '#0D3D52',
    },
  },
  {
    // 2. Frost Wintergreen — deep forest green
    fallbackColor: '#3A7D44',
    accentColor: '#3A7D44',
    textureSrc: PROVO_CAN,
    position: { x: 0.75, y: 0 },
    backgroundColor: '#1B4332',
    blob1Color: '#2D6A4F',
    blob2Color: '#52B788',
    label: {
      word: 'Frost Wintergreen',
      pms: 'PROVO 02',
      color: '#D8F3DC',
    },
  },
  {
    // 3. Glacier Citrus — pale icy lime-yellow
    fallbackColor: '#B8CC52',
    accentColor: '#B8CC52',
    textureSrc: PROVO_CAN,
    position: { x: -0.7, y: 0 },
    backgroundColor: '#F0F8E0',
    blob1Color: '#D4ED80',
    blob2Color: '#E8F5C0',
    label: {
      word: 'Glacier Citrus',
      pms: 'PROVO 03',
      color: '#2E4410',
    },
  },
  {
    // 4. Iced Berry — cool lavender / icy purple
    fallbackColor: '#9B8EC4',
    accentColor: '#9B8EC4',
    textureSrc: PROVO_CAN,
    position: { x: 0.9, y: 0 },
    backgroundColor: '#EDE8F8',
    blob1Color: '#C5B8E8',
    blob2Color: '#D4C8F0',
    label: {
      word: 'Iced Berry',
      pms: 'PROVO 04',
      color: '#2A1B50',
    },
  },
  {
    // 5. Cold Brew — warm taupe / soft caramel (the warm one)
    fallbackColor: '#C4956A',
    accentColor: '#C4956A',
    textureSrc: PROVO_CAN,
    position: { x: -0.6, y: 0 },
    backgroundColor: '#FDF0E3',
    blob1Color: '#D4A96E',
    blob2Color: '#E8CCA0',
    label: {
      word: 'Cold Brew',
      pms: 'PROVO 05',
      color: '#3D2810',
    },
  },
]

export { galleryPlaneData }
