export type VerificationStatus = 'verified' | 'pending'
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'LPG'
export type Category = 'Cars' | '2-3 Wheelers' | 'Heavy Vehicles' | 'Spare Parts' | 'Services'

export interface Listing {
  id: string
  title: string
  price: number
  year: number
  km: number
  fuelType: FuelType
  location: string
  district: string
  status: VerificationStatus
  category: Category
  brand: string
  model: string
  color: string
  owners: number
  condition: number
  description: string
  sellerName: string
  sellerType: 'Individual Owner' | 'Dealer'
  sellerPhone: string
  sellerMemberSince: string
  sellerRating: number
  negotiable: boolean
  emoji: string
  images: string[]
}

export const mockListings: Listing[] = [
  {
    id: '1',
    title: '2021 Maruti Suzuki Swift ZXI+',
    price: 685000,
    year: 2021,
    km: 32000,
    fuelType: 'Petrol',
    location: 'Kasaragod',
    district: 'Kasaragod',
    status: 'verified',
    category: 'Cars',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    color: 'Pearl Arctic White',
    owners: 1,
    condition: 4,
    description: 'Single owner, well maintained Swift ZXI+. All service records available. No accidents. Sunroof, automatic climate control. Selling due to upgrade.',
    sellerName: 'Arun Krishnan',
    sellerType: 'Individual Owner',
    sellerPhone: '9876543210',
    sellerMemberSince: 'Jan 2023',
    sellerRating: 4.8,
    negotiable: true,
    emoji: '🚗',
    images: [],
  },
  {
    id: '2',
    title: '2019 Honda Activa 6G',
    price: 65000,
    year: 2019,
    km: 18000,
    fuelType: 'Petrol',
    location: 'Kanhangad',
    district: 'Kasaragod',
    status: 'verified',
    category: '2-3 Wheelers',
    brand: 'Honda',
    model: 'Activa 6G',
    color: 'Black',
    owners: 1,
    condition: 4,
    description: 'Well maintained Activa. Regular servicing done. All papers clear.',
    sellerName: 'Priya Nair',
    sellerType: 'Individual Owner',
    sellerPhone: '9845678901',
    sellerMemberSince: 'Mar 2024',
    sellerRating: 4.5,
    negotiable: false,
    emoji: '🛵',
    images: [],
  },
  {
    id: '3',
    title: '2020 Toyota Innova Crysta 2.4G',
    price: 1850000,
    year: 2020,
    km: 55000,
    fuelType: 'Diesel',
    location: 'Kasaragod',
    district: 'Kasaragod',
    status: 'pending',
    category: 'Cars',
    brand: 'Toyota',
    model: 'Innova Crysta',
    color: 'Avant-Garde Bronze',
    owners: 2,
    condition: 3,
    description: 'Toyota Innova Crysta 7-seater. Good condition. Used for family trips. All documents available.',
    sellerName: 'Mohammed Riyas',
    sellerType: 'Individual Owner',
    sellerPhone: '9012345678',
    sellerMemberSince: 'Jun 2022',
    sellerRating: 4.2,
    negotiable: true,
    emoji: '🚙',
    images: [],
  },
  {
    id: '4',
    title: '2022 Royal Enfield Classic 350',
    price: 185000,
    year: 2022,
    km: 8500,
    fuelType: 'Petrol',
    location: 'Bekal',
    district: 'Kasaragod',
    status: 'verified',
    category: '2-3 Wheelers',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    color: 'Stealth Black',
    owners: 1,
    condition: 5,
    description: 'Barely used Classic 350 in showroom condition. All accessories included. Selling due to relocation.',
    sellerName: 'Vishnu Dev',
    sellerType: 'Individual Owner',
    sellerPhone: '9765432109',
    sellerMemberSince: 'Dec 2023',
    sellerRating: 5.0,
    negotiable: false,
    emoji: '🏍️',
    images: [],
  },
  {
    id: '5',
    title: '2018 Hyundai Creta 1.6 SX+',
    price: 920000,
    year: 2018,
    km: 72000,
    fuelType: 'Diesel',
    location: 'Kasaragod',
    district: 'Kasaragod',
    status: 'verified',
    category: 'Cars',
    brand: 'Hyundai',
    model: 'Creta',
    color: 'Phantom Black',
    owners: 1,
    condition: 3,
    description: 'Single owner Creta SX+. Sunroof, leather seats, android auto. All service records with Hyundai service center.',
    sellerName: 'Rajeev Menon',
    sellerType: 'Dealer',
    sellerPhone: '9988776655',
    sellerMemberSince: 'Aug 2021',
    sellerRating: 4.3,
    negotiable: true,
    emoji: '🚗',
    images: [],
  },
  {
    id: '6',
    title: '2023 Tata Nexon EV Max',
    price: 1650000,
    year: 2023,
    km: 12000,
    fuelType: 'Electric',
    location: 'Kanhangad',
    district: 'Kasaragod',
    status: 'pending',
    category: 'Cars',
    brand: 'Tata',
    model: 'Nexon EV Max',
    color: 'Pristine White',
    owners: 1,
    condition: 5,
    description: 'Tata Nexon EV Max with 437km range. Fast charging compatible. Under warranty till 2030.',
    sellerName: 'Deepa Thomas',
    sellerType: 'Individual Owner',
    sellerPhone: '9654321098',
    sellerMemberSince: 'Feb 2024',
    sellerRating: 4.7,
    negotiable: false,
    emoji: '⚡',
    images: [],
  },
]

export interface Inspector {
  id: string
  name: string
  area: string
  district: string
  rating: number
  experience: number
  services: string[]
  phone: string
  verified: boolean
  certifications: string[]
  reviews: { name: string; rating: number; comment: string }[]
}

export const mockInspectors: Inspector[] = [
  {
    id: '1',
    name: 'Suresh Kumar',
    area: 'Kasaragod Town',
    district: 'Kasaragod',
    rating: 4.9,
    experience: 12,
    services: ['Pre-purchase', 'Insurance', 'RC Help'],
    phone: '9876543211',
    verified: true,
    certifications: ['IAAI Certified', 'Government Authorized'],
    reviews: [
      { name: 'Arun', rating: 5, comment: 'Very thorough inspection. Found hidden issues before purchase.' },
      { name: 'Priya', rating: 5, comment: 'Professional and punctual. Highly recommended!' },
    ],
  },
  {
    id: '2',
    name: 'Rajan Pillai',
    area: 'Kanhangad',
    district: 'Kasaragod',
    rating: 4.7,
    experience: 8,
    services: ['Pre-purchase', 'Insurance'],
    phone: '9845678902',
    verified: true,
    certifications: ['ASDC Certified'],
    reviews: [
      { name: 'Vishnu', rating: 5, comment: 'Saved me from buying a flood-damaged car!' },
    ],
  },
]

export interface Garage {
  id: string
  name: string
  area: string
  district: string
  services: string[]
  rating: number
  phone: string
  offers: string[]
  reviews: { name: string; rating: number; comment: string }[]
}

export const mockGarages: Garage[] = [
  {
    id: '1',
    name: 'Kerala Auto Works',
    area: 'Kasaragod Town',
    district: 'Kasaragod',
    services: ['AC Service', 'Engine Repair', 'Tyre Change', 'Denting & Painting', 'Electrical'],
    rating: 4.6,
    phone: '9876543212',
    offers: ['Free AC check with every service this month!'],
    reviews: [{ name: 'Mohammed', rating: 5, comment: 'Best garage in Kasaragod. Honest pricing.' }],
  },
  {
    id: '2',
    name: 'Speed Auto Care',
    area: 'Kanhangad',
    district: 'Kasaragod',
    services: ['Engine Repair', 'Tyre Change', 'Oil Change', 'Battery'],
    rating: 4.4,
    phone: '9012345679',
    offers: ['10% off on all tyre changes'],
    reviews: [{ name: 'Rajeev', rating: 4, comment: 'Good service, reasonable prices.' }],
  },
]

export interface SparePart {
  id: string
  title: string
  price: number
  condition: 'New' | 'Used' | 'Refurbished'
  brand: string
  compatibleWith: string
  location: string
  phone: string
  emoji: string
}

export const mockSpareParts: SparePart[] = [
  {
    id: '1',
    title: 'Maruti Swift Bumper (Front) - 2018-2023',
    price: 4500,
    condition: 'Used',
    brand: 'OEM',
    compatibleWith: 'Maruti Swift',
    location: 'Kasaragod',
    phone: '9876543213',
    emoji: '🔩',
  },
  {
    id: '2',
    title: 'Honda Activa Engine Guard - Original',
    price: 850,
    condition: 'New',
    brand: 'Honda OEM',
    compatibleWith: 'Honda Activa',
    location: 'Kanhangad',
    phone: '9845678903',
    emoji: '⚙️',
  },
  {
    id: '3',
    title: 'Hyundai Creta Alloy Wheels Set (4)',
    price: 28000,
    condition: 'Used',
    brand: 'Hyundai OEM',
    compatibleWith: 'Hyundai Creta 2018-2022',
    location: 'Kasaragod',
    phone: '9012345680',
    emoji: '🛞',
  },
]

export interface SpareDealer {
  id: string
  name: string
  area: string
  phone: string
  specializations: string[]
}

export const mockSpareDealers: SpareDealer[] = [
  {
    id: '1',
    name: 'National Auto Parts',
    area: 'Kasaragod Town',
    phone: '9876543214',
    specializations: ['Maruti', 'Hyundai', 'Honda', 'Tata'],
  },
  {
    id: '2',
    name: 'Kerala Spare Parts Hub',
    area: 'Kanhangad',
    phone: '9845678904',
    specializations: ['All Brands', 'Used Parts', 'Import Parts'],
  },
]

export const keralaDistricts = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod',
]

export const insuranceProviders = [
  { name: 'IFFCO Tokio', phone: '9800001111', type: 'Both' },
  { name: 'Bajaj Allianz', phone: '9800002222', type: 'Both' },
  { name: 'HDFC Ergo', phone: '9800003333', type: 'Both' },
  { name: 'Royal Sundaram', phone: '9800004444', type: 'Two Wheeler' },
  { name: 'New India Assurance', phone: '9800005555', type: 'Both' },
  { name: 'Oriental Insurance', phone: '9800006666', type: 'Both' },
]

export const rcServices = [
  { name: 'RC Transfer', nameML: 'ആർ‌സി ട്രാൻസ്ഫർ', formLink: '#', description: 'Transfer vehicle ownership to new owner', descriptionML: 'വാഹന ഉടമസ്ഥാവകാശം മാറ്റം' },
  { name: 'RC Renewal', nameML: 'ആർ‌സി പുതുക്കൽ', formLink: '#', description: 'Renew your Registration Certificate', descriptionML: 'രജിസ്ട്രേഷൻ സർട്ടിഫിക്കറ്റ് പുതുക്കൽ' },
  { name: 'DL Renewal', nameML: 'ഡ്രൈവിംഗ് ലൈസൻസ് പുതുക്കൽ', formLink: '#', description: "Renew your Driving Licence", descriptionML: 'ഡ്രൈവിംഗ് ലൈസൻസ് പുതുക്കൽ' },
  { name: 'Name Change', nameML: 'പേര് മാറ്റം', formLink: '#', description: 'Change name on RC after marriage/court order', descriptionML: 'ആർ‌സിയിൽ പേര് മാറ്റം' },
  { name: 'Address Change', nameML: 'വിലാസ മാറ്റം', formLink: '#', description: 'Update address on your RC', descriptionML: 'ആർ‌സിയിൽ വിലാസം അപ്ഡേറ്റ് ചെയ്യുക' },
]
