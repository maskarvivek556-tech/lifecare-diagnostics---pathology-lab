export type ClinicalAccent =
  | 'blue'
  | 'teal'
  | 'indigo'
  | 'emerald'
  | 'amber'
  | 'rose';

export interface MedicalTest {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category:
    | 'Hematology'
    | 'Diabetes'
    | 'Thyroid'
    | 'Liver & Kidney'
    | 'Heart & Lipid'
    | 'Vitamins & Iron'
    | 'Hormones & Allergy'
    | 'Infection & Routine';
  accent: ClinicalAccent;
  image: string;
  description: string;
  detailedOverview: string;
  sampleType: string;
  preparation: string;
  fastingRequired: boolean;
  turnaroundTime: string;
  turnaroundHours: number;
  price: number;
  parametersCount: number;
  parametersIncluded: string[];
  popular?: boolean;
  homeCollectionAvailable: boolean;
}

export interface HealthPackage {
  id: string;
  slug: string;
  name: string;
  category: 'Preventive' | 'Organ Care' | 'Life Stage';
  accent: ClinicalAccent;
  image: string;
  price: number;
  originalPrice: number;
  testCount: number;
  shortSummary: string;
  description: string;
  benefits: string[];
  includedTests: string[];
  preparation: string;
  sampleType: string;
  turnaroundTime: string;
  recommendedFor: string;
  featured?: boolean;
}

export interface BookingRecord {
  referenceNumber: string;
  createdAt: string;
  patientName: string;
  mobile: string;
  email: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  selectedTestIds: string[];
  selectedPackageId: string;
  preferredDate: string;
  preferredTime: string;
  collectionMode: 'Home Collection' | 'Lab Visit';
  address: string;
  pincode: string;
  totalAmount: number;
  status: 'Confirmed (Demo)';
}

export interface ReportParameterRow {
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag?: 'Normal' | 'Borderline' | 'Attention';
  method?: string;
}

export interface DemoReport {
  reportId: string;
  patientId: string;
  testTitle: string;
  department: string;
  sampleType: string;
  sampleCollectionDate: string;
  reportDate: string;
  referringDoctor: string;
  sampleStatus: string;
  reportStatus: 'Completed' | 'Processing' | 'Pending';
  results: ReportParameterRow[];
  observations: string[];
  signatoryName: string;
  signatoryTitle: string;
  signatoryRegNo: string;
}

export interface DemoPatient {
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  mobile: string;
  email: string;
  city: string;
  reports: DemoReport[];
}

export interface FacilityItem {
  id: string;
  title: string;
  department: string;
  summary: string;
  details: string;
  highlights: string[];
  image: string;
  imageAlt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category:
    | 'Laboratory'
    | 'Equipment'
    | 'Blood Collection'
    | 'Professionals'
    | 'Facilities'
    | 'Testing Process';
  caption: string;
  department: string;
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualification: string;
  experience: string;
  specialty: string;
  bio: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  serviceUsed: string;
  quote: string;
  outcome: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Home Collection' | 'Reports';
}
