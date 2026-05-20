DELETE FROM skills;

INSERT INTO skills (category, items, is_ai, sort_order) VALUES
  ('Core SAP Engineering', ARRAY['SAP ABAP on HANA (CDS, AMDP, RAP)','ABAP OO, RICEF, Web Dynpro ABAP','SAP HANA Platform Native Developments','SAP Fiori (CDS, Annotations)'], false, 1),
  ('SAP BTP', ARRAY['SAP BTP CAP (project experience)','SAP BTP Integration Suite (exposure and prototyping)','Event-driven patterns, Event Mesh, Kyma runtime (proof-of-concept)'], false, 2),
  ('Architecture and Performance', ARRAY['High-volume data processing and performance optimisation','Clean core and S/4HANA transformation, including custom code remediation and cloud readiness','Code pushdown, SQL optimisation, and system modernisation'], false, 3),
  ('AI Engineering', ARRAY['RAG pipelines, embeddings, reranking, and LLM evaluation workflows','Agentic automation, MCP patterns, and AI-assisted enterprise tooling','SAP HANA PAL and R-based modelling, plus modern LLM integration on BTP'], true, 4),
  ('Programming and Tools', ARRAY['Languages: Node.js, Python, R','Frontend: JavaScript, HTML5, SAP UI5','Databases: SAP HANA, MongoDB, Neo4J','Tools: SAP BAS, Eclipse, Visual Studio Code, Git'], false, 5);
