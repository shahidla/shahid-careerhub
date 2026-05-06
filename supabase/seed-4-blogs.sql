DELETE FROM blogs;

INSERT INTO blogs (title, url, tags, is_ai, sort_order) VALUES
  ('Event Driven SAP CAP on Kyma with Agentic AI and UI Auto Refresh', 'https://community.sap.com/t5/technology-blog-posts-by-sap/event-driven-sap-cap-on-kyma-with-agentic-ai-and-ui-auto-refresh/ba-p/14280626', ARRAY['CAP','Kyma','AI','Event-driven'], true, 1),
  ('Event Driven Integration Using SAP Integration Suite, Solace, HANA DB, and OpenAI Validation', 'https://community.sap.com/t5/technology-blog-posts-by-sap/event-driven-integration-using-sap-integration-suite-solace-hana-db-and/ba-p/14273167', ARRAY['Integration Suite','OpenAI','Event-driven','AI'], true, 2),
  ('Automated Job Screening Using SAP Integration Suite, Adzuna, and ChatGPT', 'https://community.sap.com/t5/technology-blog-posts-by-sap/automated-job-screening-using-sap-integration-suite-adzuna-and-chatgpt/ba-p/14270454', ARRAY['Integration Suite','ChatGPT','AI','Automation'], true, 3),
  ('Multi-Service PAYG Application: SAP BTP Kyma Runtime, Docker, Ethereum, SAP AI Business Services', 'https://community.sap.com/t5/technology-blogs-by-sap/multi-service-payg-application-sap-btp-kyma-runtime-docker-ethereum-sap-ai/ba-p/13502402', ARRAY['BTP','Kyma','AI Business Services','Docker'], true, 4),
  ('SAP Cloud Platform Enterprise Messaging with Twitter', 'https://community.sap.com/t5/technology-blogs-by-sap/sap-cloud-platform-enterprise-messaging-with-twitter/ba-p/13468559', ARRAY['Event Mesh','Integration','BTP'], false, 5),
  ('SAP S/4HANA, Machine Learning, and MQTT', 'https://community.sap.com/t5/enterprise-resource-planning-blogs-by-sap/sap-s-4hana-machinelearning-mqtt/ba-p/13398320', ARRAY['S/4HANA','Machine Learning','AI','Messaging'], true, 6),
  ('SAP Product and Custom Solution: SAP UI Logging', 'https://blogs.sap.com/2014/10/20/how-to-implement-sap-ui-logging-user-s-point-of-view/', ARRAY['SAP UI','Logging','ABAP'], false, 7);
