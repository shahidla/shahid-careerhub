DELETE FROM certifications;

INSERT INTO certifications (title, code, issuer, year, credential_url, is_ai, sort_order) VALUES
  ('SAP Certified Professional - Solution Architect - SAP BTP', 'P_BTPA_2408', 'SAP', '', '', false, 1),
  ('SAP Certified Development Associate - SAP HANA Cloud 1.0', 'C_HCDEV_05', 'SAP', '', '', false, 2),
  ('SAP Certified Associate - Backend Developer - SAP Cloud Application Programming Model', '', 'SAP', '', '', false, 3),
  ('SAP Certified Development Associate - SAP BTP Extensions with SAP Cloud Application Programming Model', 'C_CPE_14', 'SAP', '', '', false, 4),
  ('SAP Certified Associate - Integration Developer', 'C_CPI_2404', 'SAP', '', '', false, 5),
  ('SAP Certified Associate - SAP Fiori Application Developer', 'C_FIORD', 'SAP', '', '', false, 6),
  ('SAP Certified Associate - SAP Build Developer (Low-Code/No-Code)', 'C_LCNC_2406', 'SAP', '', '', false, 7),
  ('SAP Certified Development Associate - SAP HANA 2.0', 'C_HANADEV_13', 'SAP', '', '', false, 8),
  ('SAP Certified Development Specialist - ABAP for SAP HANA 2.0', 'E_HANAAW_18', 'SAP', '', '', false, 9);
