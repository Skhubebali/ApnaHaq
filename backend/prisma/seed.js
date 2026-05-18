import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding sample schemes...');

  await prisma.scheme.deleteMany(); // Clear existing

  const schemes = [
    {
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      description: "A central sector scheme to provide income support to all landholding farmers' families in the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities.",
      level: "CENTRAL",
      department: "Ministry of Agriculture & Farmers Welfare",
      benefits: "Financial benefit of Rs. 6000/- per year in three equal installments of Rs. 2000/- each, transferred directly into the bank accounts of eligible farmers.",
      eligibilityText: "All landholding farmers' families, which have cultivable landholding in their names are eligible. Excludes institutional landholders, farmer families holding constitutional posts, serving or retired officers, and professionals.",
      requiredDocuments: "Aadhaar Card, Citizenship Certificate, Landownership Papers, Bank Account Details.",
      applicationProcess: "Eligible farmers can apply through the local patwari/revenue officer, Nodal Officer (PM-Kisan) nominated by the State Government, or via the PM-Kisan Portal / CSCs.",
      officialLink: "https://pmkisan.gov.in/",
      category: "Agriculture",
      requiresFarmer: true,
      minAge: 18,
      targetOccupations: ["Farmer"]
    },
    {
      name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
      description: "The world's largest health insurance/ assurance scheme fully financed by the government, providing a cover for secondary and tertiary care hospitalization across public and private empaneled hospitals in India.",
      level: "CENTRAL",
      department: "Ministry of Health and Family Welfare",
      benefits: "Provides health coverage of up to Rs. 5,000,000 per family per year for secondary and tertiary care hospitalization. Covers up to 3 days of pre-hospitalization and 15 days of post-hospitalization expenses.",
      eligibilityText: "Eligibility is based on the deprivation and occupational criteria of the Socio-Economic Caste Census 2011 (SECC 2011) for rural and urban areas respectively. Targets poor, deprived rural families and identified occupational category of urban workers' families.",
      requiredDocuments: "Aadhaar Card, Ration Card, SECC Name Slip or Mobile Number.",
      applicationProcess: "Beneficiaries can verify their eligibility on the PMJAY Am I Eligible portal and obtain an Ayushman Card from empaneled hospitals or Common Service Centres (CSCs).",
      officialLink: "https://pmjay.gov.in/",
      category: "Health",
      maxIncome: 250000
    },
    {
      name: "Sukanya Samriddhi Yojana (SSY)",
      description: "A small savings scheme backed by the Government of India targeted at the parents of girl children. The scheme encourages parents to build a fund for the future education and marriage expenses of their female child.",
      level: "CENTRAL",
      department: "Ministry of Finance",
      benefits: "Offers a high interest rate (currently 8.2% per annum) and provides tax benefits under Section 80C. The account matures after 21 years from the date of opening or at the time of marriage of the girl child.",
      eligibilityText: "Parents or legal guardians can open an account in the name of a girl child until she attains the age of 10 years. Only one account can be opened per girl child, and a maximum of two accounts per family.",
      requiredDocuments: "Birth Certificate of the girl child, Identity and Address Proof of the parent/guardian.",
      applicationProcess: "The account can be opened at any post office or authorized branches of commercial banks by submitting the SSY account opening form and required documents.",
      officialLink: "https://www.nsiindia.gov.in/",
      category: "Women and Child",
      targetGender: "Female",
      maxAge: 10
    },
    {
      name: "Post Matric Scholarship for SC/ST Students",
      description: "A centrally sponsored scheme implemented through state governments to provide financial assistance to Scheduled Caste and Scheduled Tribe students studying at post-matriculation or post-secondary stages.",
      level: "CENTRAL",
      department: "Ministry of Social Justice & Empowerment",
      benefits: "Includes maintenance allowance, reimbursement of compulsory non-refundable fees, study tour charges, and book allowance for scholars.",
      eligibilityText: "Available only to SC and ST students who are studying in India. The annual income of the student's parents/guardians from all sources should not exceed Rs. 2.50 lakh.",
      requiredDocuments: "Caste Certificate, Income Certificate, Previous Year Marksheet, Bank Account details, Aadhaar Card.",
      applicationProcess: "Students must apply online on the National Scholarship Portal (NSP) or respective state scholarship portals.",
      officialLink: "https://scholarships.gov.in/",
      category: "Education",
      requiresStudent: true,
      targetCastes: ["SC", "ST"],
      maxIncome: 250000
    },
    {
      name: "Indira Gandhi National Disability Pension Scheme (IGNDPS)",
      description: "A component of the National Social Assistance Programme (NSAP) providing financial assistance to individuals with severe and multiple disabilities.",
      level: "CENTRAL",
      department: "Ministry of Rural Development",
      benefits: "Eligible beneficiaries receive a monthly pension of Rs. 300/- (for age 18-79) or Rs. 500/- (for age 80+) from the Central Government, often supplemented by State Governments.",
      eligibilityText: "The applicant must be 18 years or older, belong to a Below Poverty Line (BPL) household, and have severe (80% or more) or multiple disabilities.",
      requiredDocuments: "Disability Certificate (minimum 80%), BPL Card/Income Certificate, Age Proof, Bank Account details.",
      applicationProcess: "Applications are submitted to the Gram Panchayat or Municipality, which are then forwarded to the District Social Welfare Officer.",
      officialLink: "https://nsap.nic.in/",
      category: "Social Welfare",
      requiresDisability: true,
      minAge: 18,
      maxIncome: 100000
    },
    {
      name: "Pradhan Mantri Mudra Yojana (PMMY)",
      description: "A scheme to provide loans up to 10 lakh to non-corporate, non-farm small/micro enterprises. These loans are classified as MUDRA loans under Shishu, Kishore, and Tarun categories.",
      level: "CENTRAL",
      department: "Ministry of Finance",
      benefits: "Collateral-free loans for business expansion or startup. Shishu (up to Rs. 50,000), Kishore (Rs. 50,000 to Rs. 5 Lakh), Tarun (Rs. 5 Lakh to Rs. 10 Lakh).",
      eligibilityText: "Any Indian citizen who has a business plan for a non-farm sector income generating activity such as manufacturing, processing, trading or service sector and whose credit need is less than Rs 10 lakh.",
      requiredDocuments: "Aadhaar, PAN Card, Business Plan, Proof of Identity and Address, Bank Statement.",
      applicationProcess: "Applicants can approach any commercial bank, RRB, Small Finance Bank, or apply online through the Udyamimitra portal.",
      officialLink: "https://www.mudra.org.in/",
      category: "Business and Entrepreneurship",
      minAge: 18,
      targetOccupations: ["Business", "Self-Employed"]
    },
    {
      name: "National Fellowship for OBC Candidates",
      description: "A fellowship scheme to increase opportunities for students of Other Backward Classes (OBCs) for pursuing higher education leading to degrees such as M.Phil. and Ph.D.",
      level: "CENTRAL",
      department: "Ministry of Social Justice & Empowerment",
      benefits: "Financial assistance in the form of Junior Research Fellowship (JRF) and Senior Research Fellowship (SRF) along with contingency grants.",
      eligibilityText: "The candidate should belong to the OBC category and must have passed the post-graduate examination. Total family income should not exceed Rs. 8 Lakh per annum.",
      requiredDocuments: "OBC Caste Certificate, Income Certificate, Post-Graduate Marksheet, Admission Proof.",
      applicationProcess: "Selection is usually based on the UGC-NET or CSIR-UGC-NET examinations.",
      officialLink: "https://socialjustice.gov.in/",
      category: "Education",
      requiresStudent: true,
      targetCastes: ["OBC"],
      maxIncome: 800000
    },
    {
      name: "Pradhan Mantri Shram Yogi Maandhan (PM-SYM)",
      description: "A voluntary and contributory pension scheme for the unorganized workers to ensure old age protection.",
      level: "CENTRAL",
      department: "Ministry of Labour and Employment",
      benefits: "Assured minimum monthly pension of Rs. 3000/- after attaining the age of 60 years. Matching contribution is made by the Government of India.",
      eligibilityText: "Unorganized workers (street vendors, agriculture workers, construction workers, etc.) aged between 18 and 40 years, with a monthly income of Rs. 15,000 or less.",
      requiredDocuments: "Aadhaar Card, Savings Bank Account / Jan Dhan Account with IFSC code.",
      applicationProcess: "Eligible subscribers can enroll by visiting their nearest Common Service Centre (CSC) or via the Maandhan portal.",
      officialLink: "https://maandhan.in/",
      category: "Pension",
      minAge: 18,
      maxAge: 40,
      maxIncome: 180000,
      targetOccupations: ["Daily Wage", "Farmer", "Unemployed"]
    },
    {
      name: "Senior Citizen Savings Scheme (SCSS)",
      description: "A government-sponsored savings instrument for individuals aged 60 years and above, offering a regular income stream with the highest safety and tax benefits.",
      level: "CENTRAL",
      department: "Ministry of Finance",
      benefits: "Offers an attractive interest rate (currently 8.2% p.a.) paid quarterly. The deposit amount qualifies for deduction under Section 80C. Maximum deposit limit is Rs. 30 Lakhs.",
      eligibilityText: "Any individual aged 60 years or more. Individuals aged 55 to 60 years who have retired on superannuation or under VRS can also open the account.",
      requiredDocuments: "Age Proof (Passport, Senior Citizen Card, Birth Certificate), PAN Card, Address Proof, Passport size photographs.",
      applicationProcess: "The account can be opened at any post office or authorized bank branch by submitting the account opening form.",
      officialLink: "https://www.nsiindia.gov.in/",
      category: "Finance and Pension",
      minAge: 60
    },
    {
      name: "Pre-Matric Scholarship for Minorities",
      description: "A scholarship scheme to encourage parents from minority communities to send their school-going children to school, lighten their financial burden, and sustain their efforts to support their children.",
      level: "CENTRAL",
      department: "Ministry of Minority Affairs",
      benefits: "Admission fee, tuition fee, and maintenance allowance are provided to eligible students from class I to X.",
      eligibilityText: "Students belonging to minority communities (Muslims, Sikhs, Christians, Buddhists, Jains, and Zoroastrians/Parsis) who have secured not less than 50% marks in the previous final examination. Annual family income should not exceed Rs. 1 Lakh.",
      requiredDocuments: "Minority Certificate / Self-Declaration, Income Certificate, Previous Year Marksheet, Bank Details.",
      applicationProcess: "Apply online through the National Scholarship Portal (NSP).",
      officialLink: "https://scholarships.gov.in/",
      category: "Education",
      requiresStudent: true,
      maxIncome: 100000
    }
  ];

  for (const scheme of schemes) {
    await prisma.scheme.create({ data: scheme });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
