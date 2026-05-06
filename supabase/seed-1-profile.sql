DELETE FROM profile;

INSERT INTO profile (name, headline, years_experience, positioning, education, contact, proof_points)
VALUES (
  'Shahid Mohammed Syed',
  'SAP Development Architect | SAP BTP Solution Architect | S/4HANA Modernisation | ABAP on HANA | CAP/RAP | AI-assisted SAP Automation',
  19,
  ARRAY['Clean-core S/4HANA modernisation and custom code remediation','High-volume HANA processing using ABAP on HANA, CDS, AMDP, RAP, and SQL optimisation','SAP BTP, CAP, Integration Suite, event-driven patterns, and AI-based workflows','Architecture leadership across vision, scope, blueprint, proposal, feasibility, and delivery'],
  ARRAY['Master of Business in Information Systems, Victoria University of Technology, Australia, December 2005','Bachelor of Engineering in Computer Science, J.N.T University, India, April 2003'],
  '{"email":"shahid.la@gmail.com","phone":"+61 451 738 208","linkedin":"https://www.linkedin.com/in/shahidmsyed/","github":"https://github.com/shahidla?tab=repositories","sapCommunity":"https://community.sap.com/t5/user/viewprofilepage/user-id/15422"}'::jsonb,
  ARRAY['Reduced S/4HANA data scrambling runtime from 240 hours to 6 hours','Processed more than 40 billion records in SAP CAR UDF high-volume developments','Granted patent US10304013B2','Active SAP Community contributor, blogger, and TechEd speaker']
);
