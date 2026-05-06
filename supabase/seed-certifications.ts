import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  const { error } = await supabase.from('certifications').upsert([
    { name: 'SAP Certified Professional - Solution Architect - SAP BTP', code: 'P_BTPA_2408', credly_url: 'https://www.credly.com/badges/8c21e6e3-b9fa-4c00-8728-f6297b770d23/public_url', is_ai: true, sort_order: 1 },
    { name: 'SAP Certified Development Associate - SAP HANA Cloud 1.0', code: 'C_HCDEV_05', credly_url: 'https://www.credly.com/badges/c570bada-159d-4ca0-bf68-8e7bee505b01/public_url', is_ai: false, sort_order: 2 },
    { name: 'SAP Certified Associate - Backend Developer - SAP Cloud Application Programming Model', code: '', credly_url: 'https://www.credly.com/badges/9f70d269-781c-4949-bc4d-b8571faf328c/public_url', is_ai: true, sort_order: 3 },
    { name: 'SAP Certified Development Associate - SAP BTP Extensions with SAP Cloud Application Programming Model', code: 'C_CPE_14', credly_url: 'https://www.credly.com/badges/d7951a8e-123e-4b7e-9c11-e2768e4b5db4/public_url', is_ai: false, sort_order: 4 },
    { name: 'SAP Certified Associate - Integration Developer', code: 'C_CPI_2404', credly_url: 'https://www.credly.com/badges/81b8caba-b8ab-4697-bef2-07202718e10f/public_url', is_ai: false, sort_order: 5 },
    { name: 'SAP Certified Associate - SAP Fiori Application Developer', code: 'C_FIORD', credly_url: 'https://www.credly.com/badges/17111628-1cf3-4590-bff4-6bdec88d58a2/public_url', is_ai: false, sort_order: 6 },
    { name: 'SAP Certified Associate - SAP Build Developer', code: 'C_LCNC_2406', credly_url: 'https://www.credly.com/earner/earned/badge/4e91341f-8c8d-4a5d-a025-7a2d228ec96e', is_ai: false, sort_order: 7 },
    { name: 'SAP Certified Development Associate - SAP HANA 2.0', code: 'C_HANADEV_13', credly_url: 'https://www.credly.com/badges/7db66b04-736e-4453-b4ee-4284df03f334/public_url', is_ai: false, sort_order: 8 },
    { name: 'SAP Certified Development Specialist - ABAP for SAP HANA 2.0', code: 'E_HANAAW_18', credly_url: 'https://www.credly.com/badges/0a7276d8-d49a-4109-af75-eea0d2b5fa88/public_url', is_ai: false, sort_order: 9 }
  ])

  if (error) {
    console.error('Error seeding certifications:', error)
  } else {
    console.log('Certifications seeded successfully')
  }
}

seed()
