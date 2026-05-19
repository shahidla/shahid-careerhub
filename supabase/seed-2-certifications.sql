DELETE FROM certifications;

INSERT INTO certifications (title, code, issuer, year, credential_url, is_ai, sort_order) VALUES
  ('SAP Certified Professional - Solution Architect - SAP BTP', 'P_BTPA_2408', 'SAP', '', 'https://www.credly.com/badges/8c21e6e3-b9fa-4c00-8728-f6297b770d23/public_url', false, 1),
  ('SAP Certified Development Associate - SAP HANA Cloud 1.0', 'C_HCDEV_05', 'SAP', '', 'https://www.credly.com/badges/c570bada-159d-4ca0-bf68-8e7bee505b01/public_url', false, 2),
  ('SAP Certified Associate - Backend Developer - SAP Cloud Application Programming Model', '', 'SAP', '', 'https://www.credly.com/badges/9f70d269-781c-4949-bc4d-b8571faf328c/public_url', false, 3),
  ('SAP Certified Development Associate - SAP BTP Extensions with SAP Cloud Application Programming Model', 'C_CPE_14', 'SAP', '', 'https://www.credly.com/badges/d7951a8e-123e-4b7e-9c11-e2768e4b5db4/public_url', false, 4),
  ('SAP Certified Associate - Integration Developer', 'C_CPI_2404', 'SAP', '', 'https://www.credly.com/badges/81b8caba-b8ab-4697-bef2-07202718e10f/public_url', false, 5),
  ('SAP Certified Associate - SAP Fiori Application Developer', 'C_FIORD', 'SAP', '', 'https://www.credly.com/badges/17111628-1cf3-4590-bff4-6bdec88d58a2/public_url', false, 6),
  ('SAP Certified Associate - SAP Build Developer (Low-Code/No-Code)', 'C_LCNC_2406', 'SAP', '', 'https://www.credly.com/earner/earned/badge/4e91341f-8c8d-4a5d-a025-7a2d228ec96e', false, 7),
  ('SAP Certified Development Associate - SAP HANA 2.0', 'C_HANADEV_13', 'SAP', '', 'https://www.credly.com/badges/7db66b04-736e-4453-b4ee-4284df03f334/public_url', false, 8),
  ('SAP Certified Development Specialist - ABAP for SAP HANA 2.0', 'E_HANAAW_18', 'SAP', '', 'https://www.credly.com/badges/0a7276d8-d49a-4109-af75-eea0d2b5fa88/public_url', false, 9),
  ('Introduction to Generative AI', '23949633', 'Google', '2026', 'https://www.skills.google/public_profiles/b9acc2a0-d77f-460e-8563-8dcf38f9aa18/badges/23949633', true, 10);
