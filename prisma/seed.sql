-- Sample data for Places and Spaces
-- This SQL dump can be used to populate your database with initial data

-- Clear existing data (if needed)
TRUNCATE TABLE "Place" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Space" RESTART IDENTITY CASCADE;

-- Insert sample Places
INSERT INTO "Place" (name, location, "createdAt", "updatedAt") VALUES
('Coworking Central', 'Av. Providencia 1234, Providencia, Santiago', NOW(), NOW()),
('Innovation Hub', 'Av. Libertad 567, Viña del Mar, Valparaíso', NOW(), NOW()),
('Creative Space', 'Av. Pedro Montt 890, Valparaíso', NOW(), NOW()),
('Business Center', 'Av. Arturo Prat 456, Concepción', NOW(), NOW()),
('Tech Campus', 'Av. Francisco de Aguirre 321, La Serena', NOW(), NOW());

-- Insert sample Spaces for Coworking Central
INSERT INTO "Space" ("placeId", name, reference, capacity, description, "createdAt", "updatedAt") VALUES
(1, 'Sala Reuniones A', 'CC-SRA', 8, 'Sala de reuniones equipada con proyector y pizarra', NOW(), NOW()),
(1, 'Sala Reuniones B', 'CC-SRB', 4, 'Sala pequeña para reuniones íntimas', NOW(), NOW()),
(1, 'Espacio Abierto 1', 'CC-EA1', 20, 'Zona de trabajo compartido con mesas individuales', NOW(), NOW()),
(1, 'Oficina Privada 1', 'CC-OP1', 3, 'Oficina cerrada para equipos pequeños', NOW(), NOW()),
(1, 'Oficina Privada 2', 'CC-OP2', 5, 'Oficina cerrada para equipos medianos', NOW(), NOW());

-- Insert sample Spaces for Innovation Hub
INSERT INTO "Space" ("placeId", name, reference, capacity, description, "createdAt", "updatedAt") VALUES
(2, 'Sala Conferencias', 'IH-SC', 30, 'Sala grande para presentaciones y eventos', NOW(), NOW()),
(2, 'Sala Brainstorming', 'IH-SB', 10, 'Espacio creativo con mobiliario flexible', NOW(), NOW()),
(2, 'Zona Coworking', 'IH-ZC', 25, 'Espacio abierto con mesas compartidas', NOW(), NOW()),
(2, 'Cabina Individual 1', 'IH-CI1', 1, 'Espacio insonorizado para llamadas o concentración', NOW(), NOW()),
(2, 'Cabina Individual 2', 'IH-CI2', 1, 'Espacio insonorizado para llamadas o concentración', NOW(), NOW());

-- Insert sample Spaces for Creative Space
INSERT INTO "Space" ("placeId", name, reference, capacity, description, "createdAt", "updatedAt") VALUES
(3, 'Estudio Fotografía', 'CS-EF', 6, 'Estudio equipado para sesiones fotográficas', NOW(), NOW()),
(3, 'Sala Multimedia', 'CS-SM', 8, 'Sala con equipamiento audiovisual avanzado', NOW(), NOW()),
(3, 'Espacio Maker', 'CS-EM', 15, 'Zona con herramientas para prototipos y manualidades', NOW(), NOW()),
(3, 'Sala Reuniones Creativa', 'CS-SRC', 10, 'Sala de reuniones con diseño inspirador', NOW(), NOW());

-- Insert sample Spaces for Business Center
INSERT INTO "Space" ("placeId", name, reference, capacity, description, "createdAt", "updatedAt") VALUES
(4, 'Sala Ejecutiva', 'BC-SE', 12, 'Sala de reuniones con acabados premium', NOW(), NOW()),
(4, 'Despacho Individual 1', 'BC-DI1', 1, 'Oficina privada para una persona', NOW(), NOW()),
(4, 'Despacho Individual 2', 'BC-DI2', 1, 'Oficina privada para una persona', NOW(), NOW()),
(4, 'Oficina Compartida A', 'BC-OCA', 6, 'Oficina para equipos pequeños', NOW(), NOW()),
(4, 'Oficina Compartida B', 'BC-OCB', 8, 'Oficina para equipos medianos', NOW(), NOW());

-- Insert sample Spaces for Tech Campus
INSERT INTO "Space" ("placeId", name, reference, capacity, description, "createdAt", "updatedAt") VALUES
(5, 'Laboratorio Tech', 'TC-LT', 20, 'Espacio equipado con tecnología de última generación', NOW(), NOW()),
(5, 'Sala Formación', 'TC-SF', 15, 'Aula para workshops y cursos', NOW(), NOW()),
(5, 'Zona Gaming', 'TC-ZG', 10, 'Área de descanso con consolas y juegos', NOW(), NOW()),
(5, 'Sala Reuniones Tech', 'TC-SRT', 8, 'Sala de reuniones con equipamiento tecnológico', NOW(), NOW()),
(5, 'Espacio Coworking Tech', 'TC-ECT', 30, 'Zona de trabajo compartido orientada a tecnología', NOW(), NOW());