import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  const { error } = await supabase.from('experience').upsert([
    {
      company: 'SAP Australia',
      client: 'Commonwealth Bank',
      role: 'Contractor',
      location: 'Sydney, Australia',
      start_date: 'Mar 2025',
      end_date: 'Current',
      description: 'Supported CommBank SAP Transactional Banking (TRBK HANA) modernisation as part of the core-banking transformation program. Contributed to code remediation and performance optimisation, resolving legacy issues and translating DB2 query hints to HANA equivalents. Built a Node.js MCP server to expose SAP RAP OData services as controlled tools, enabling AI-assisted execution of business tasks without direct SAP GUI interaction. Proposed, designed, and implemented a data scrambling solution for SAP S/4HANA using ABAP, CDS Views, and AMDPs, reducing runtime from 240 hours to 6 hours (97% improvement).',
      technologies: ['ABAP on HANA', 'CDS', 'AMDP', 'RAP', 'OData', 'Node.js', 'MCP', 'S/4HANA'],
      sort_order: 1
    },
    {
      company: 'DyFlex Solutions',
      client: 'Roy Hill, Syntax',
      role: 'Senior SAP Technical Consultant',
      location: 'Sydney, Australia',
      start_date: 'Nov 2024',
      end_date: 'Feb 2025',
      description: 'Worked on S/4HANA transformation projects for Roy Hill and Syntax. Remediated custom code for S/4HANA compatibility, replaced obsolete objects, adapted enhancements to align with clean-core and cloud standards. Developed new artefacts to support migration and ensure system readiness.',
      technologies: ['ABAP', 'S/4HANA', 'Clean Core', 'Custom Code Migration', 'ATC'],
      sort_order: 2
    },
    {
      company: 'SAP Australia',
      client: 'Woolworths',
      role: 'Development Architect',
      location: 'Sydney, Australia',
      start_date: 'Jul 2022',
      end_date: 'Sep 2024',
      description: 'Led SAP CAR UDF custom developments, designing scalable solutions for forecast data calculations and machine learning reporting. Built multiple high-volume custom objects using AMDP, CDS, and ABAP processing more than 40 billion records across partitioned tables. Focused on performance optimisation through Code Inspector, SQL Trace, AMDP Trace, and PlanViz.',
      technologies: ['AMDP', 'CDS', 'ABAP', 'SAP CAR', 'SQL Trace', 'PlanViz', 'S/4HANA'],
      sort_order: 3
    },
    {
      company: 'SAP Australia',
      client: 'Queensland Health',
      role: 'Development Architect',
      location: 'Sydney, Australia',
      start_date: 'Jun 2023',
      end_date: 'Aug 2023',
      description: 'Contributed to development of Digital Passport Application built using SAP BTP CAP model, consolidating employee information from SAP ECC and QHealth Platform systems into a BTP service layer.',
      technologies: ['SAP BTP', 'CAP', 'SAP ECC', 'Node.js'],
      sort_order: 4
    },
    {
      company: 'SAP Australia',
      client: 'Department of Corrections NZ',
      role: 'Development Architect',
      location: 'Sydney, Australia',
      start_date: 'Sep 2022',
      end_date: 'Jun 2023',
      description: 'Worked on SAP Procurement developments as part of project upgrade preparation. Built custom analytical Fiori apps, activated apps and assigned roles, leveraged key user extensibility using Adapt UI. Evaluated custom code using ABAP Call Monitor (SCMON) and SUSG, used Custom Code Migration App for scoping, remediation, and optimisation.',
      technologies: ['SAP Fiori', 'ABAP', 'SCMON', 'SUSG', 'Custom Code Migration App', 'Adapt UI'],
      sort_order: 5
    },
    {
      company: 'SAP Australia',
      client: 'Services Australia',
      role: 'Development Architect',
      location: 'Sydney, Australia',
      start_date: 'Nov 2018',
      end_date: 'Jun 2022',
      description: 'Development Architect for Services Australia. Contributed to Vision and Scope documents. Designed and built solutions to process large volumes of Financial Instruction Documents using CDS-based BOPF, AMDP code pushdown, and Gateway/OData/CDS APIs. Extended the solution to process Real Time Payments. Built machine learning solutions to identify payment anomalies.',
      technologies: ['CDS', 'BOPF', 'AMDP', 'OData', 'Gateway', 'ABAP RESTful', 'S/4HANA', 'Machine Learning'],
      sort_order: 6
    },
    {
      company: 'SAP Labs India',
      client: 'Stockland',
      role: 'Development Architect',
      location: 'Bangalore, India',
      start_date: 'Mar 2017',
      end_date: 'Nov 2018',
      description: 'Stockland uses PPM and REFX on SAP S/4HANA with BW Integrated Planning for financial forecasting. Developed ABAP and HANA based BW-IP Planning functions, CDS and AMDP objects. Built ADSO with planning functions, Free Style SAP UI5 applications using OData and CDS, and end-to-end Fiori applications with OData Annotations.',
      technologies: ['BW-IP', 'AMDP', 'CDS', 'SAP UI5', 'OData', 'Fiori', 'REFX', 'PPM', 'S/4HANA'],
      sort_order: 7
    },
    {
      company: 'SAP Labs India',
      client: 'Mohawk, Mosaic, BMW, BHP',
      role: 'Senior Developer',
      location: 'Bangalore, India',
      start_date: 'Mar 2012',
      end_date: 'Jan 2018',
      description: 'Mohawk (Jan–Jul 2016): Data science and ML project for carpet quality prediction using PAL (Decision Tree), APL (Regression), and R (Random Forest) models. Followed CRISP-DM methodology. Mosaic (Aug 2015–Jan 2016): SAP HANA native development for minefield visualisations — geographical borehole data, status, alarms, service tickets. BMW GSM (Sep 2014–Mar 2017): Custom add-on for indirect procurement in SRM — ABAP and Web Dynpro ABAP artefacts, automated contract/PO creation. BHP UI Logging (Mar 2012–Aug 2014): Custom SAP UI Logging solution on top of LOGWIN, transforming logs into meaningful audit data.',
      technologies: ['SAP HANA', 'PAL', 'APL', 'R', 'SAP UI5', 'XSJS', 'XSODATA', 'Web Dynpro ABAP', 'SRM', 'ABAP'],
      sort_order: 8
    },
    {
      company: 'Logikal Consulting, Deloitte, IBM, Enteg InfoTech',
      client: 'Standard Bank, Deutsche Bank, Suzlon, Nationwide Building Society',
      role: 'SAP ABAP Specialist / Senior Developer',
      location: 'South Africa, India',
      start_date: 'Jul 2007',
      end_date: 'Jan 2012',
      description: 'Worked across SD, MM, FI, HR, Banking, and ReFX for multiple clients. Delivered ABAP, ABAP HR, and Web Dynpro ABAP artefacts including RICEF, Infotypes, dashboard reports, and custom Web Dynpro ABAP applications. Part of core technical architecture team — requirement gathering, feasibility, designing specs, development, and go-live support.',
      technologies: ['ABAP', 'ABAP HR', 'Web Dynpro ABAP', 'RICEF', 'SD', 'MM', 'FI', 'HR', 'Banking', 'ReFX'],
      sort_order: 9
    }
  ])

  if (error) {
    console.error('Error seeding experience:', error)
  } else {
    console.log('Experience seeded successfully')
  }
}

seed()
