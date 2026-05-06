DELETE FROM achievements;

INSERT INTO achievements (title, description, year, sort_order) VALUES
  ('Winner — Google TensorFlow IoT Challenge', 'Built a machine learning image classification application using Python and Google TensorFlow at SAP Labs.', '2017', 1),
  ('Finalist — SAP What the Hack 2.0', 'Designed and built a click-free Real Time Speech and Predictive Analytics application for differently enabled people using SAP HANA. Granted patent US10304013B2.', '2016', 2),
  ('Nominated — THE TITAN CD BLR LOB 2016 Awards', 'Nominated for outstanding contribution at SAP Labs Bangalore.', '2016', 3),
  ('Multiple Outstanding Performance Awards — BHP Billiton project', 'Received multiple awards for outstanding performance on the BHP Billiton project by SAP.', '2012-2014', 4),
  ('Peer-to-Peer Awards at SAP Labs', 'Received Peer-to-Peer recognition awards in 2012, 2013, and 2015 at SAP Labs India.', '2012-2015', 5),
  ('Appreciation — Deloitte', 'Received an appreciation note from Deloitte for performance and technical competency during the Large Client Project implementation.', '2011', 6),
  ('Active Contributor Silver — SAP Community Network', 'Active Contributor Silver status in SAP Community Network Forums across SAP HANA, SAP ABAP for SAP HANA, SAP ABAP, and Web Dynpro ABAP areas.', '', 7),
  ('Appreciation — Enteg InfoTech', 'Received an appreciation note from Enteg for performance and commitment during the Suzlon Project in SAP HR (PD).', '2010', 8);
