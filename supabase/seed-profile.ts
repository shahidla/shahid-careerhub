import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  const { error } = await supabase.from('profile').upsert({
    name: 'Shahid M Syed',
    headline: 'SAP Development Architect | SAP BTP Solution Architect | S/4HANA Modernisation | ABAP on HANA | CAP/RAP | AI-assisted SAP Automation',
    years_experience: 19,
    positioning: [
      'Clean-core S/4HANA modernisation and custom code remediation',
      'High-volume HANA processing using ABAP on HANA, CDS, AMDP, RAP, and SQL optimisation',
      'SAP BTP, CAP, Integration Suite, event-driven patterns, Kyma, and AI-assisted workflows',
      'Architecture leadership across vision, scope, blueprint, proposal, feasibility, and delivery'
    ],
    education: [
      'Master of Business in Information Systems, Victoria University of Technology, Australia, December 2005',
      'Bachelor of Engineering in Computer Science, J.N.T University, India, April 2003'
    ],
    contact: {
      email: 'shahid.la@gmail.com',
      phone: '+61 451 738 208',
      linkedin: 'https://www.linkedin.com/in/shahidmsyed/',
      github: 'https://github.com/shahidla?tab=repositories',
      sapCommunity: 'https://community.sap.com/t5/user/viewprofilepage/user-id/15422'
    },
    proof_points: [
      'Reduced S/4HANA data scrambling runtime from 240 hours to 6 hours',
      'Processed more than 40 billion records in SAP CAR UDF high-volume developments',
      'Granted patent US10304013B2',
      'SAP Community contributor, blogger, TechEd speaker, and hackathon winner'
    ]
  })

  if (error) {
    console.error('Error seeding profile:', error)
  } else {
    console.log('Profile seeded successfully')
  }
}

seed()
