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

-- Insert 100 sample Reservations for October 2025 (1 hour max each)
INSERT INTO "Reservation" ("spaceId", "placeId", "clientEmail", "reservationDate", "startTime", "endTime", "createdAt", "updatedAt") VALUES
-- Week 1 (Oct 1-5)
(1, 1, 'maria.gonzalez@empresa.cl', '2025-10-01', '2025-10-01 09:00:00', '2025-10-01 10:00:00', NOW(), NOW()),
(2, 1, 'juan.perez@startup.cl', '2025-10-01', '2025-10-01 10:00:00', '2025-10-01 11:00:00', NOW(), NOW()),
(3, 1, 'ana.silva@tech.cl', '2025-10-01', '2025-10-01 11:00:00', '2025-10-01 12:00:00', NOW(), NOW()),
(4, 1, 'carlos.martinez@innovacion.cl', '2025-10-01', '2025-10-01 14:00:00', '2025-10-01 15:00:00', NOW(), NOW()),
(5, 1, 'laura.torres@consultora.cl', '2025-10-01', '2025-10-01 15:00:00', '2025-10-01 16:00:00', NOW(), NOW()),
(6, 2, 'diego.ramirez@marketing.cl', '2025-10-02', '2025-10-02 09:00:00', '2025-10-02 10:00:00', NOW(), NOW()),
(7, 2, 'sofia.lopez@creative.cl', '2025-10-02', '2025-10-02 10:00:00', '2025-10-02 11:00:00', NOW(), NOW()),
(8, 2, 'miguel.castro@cowork.cl', '2025-10-02', '2025-10-02 11:00:00', '2025-10-02 12:00:00', NOW(), NOW()),
(9, 2, 'valeria.ortiz@freelance.cl', '2025-10-02', '2025-10-02 13:00:00', '2025-10-02 14:00:00', NOW(), NOW()),
(10, 2, 'rodrigo.vargas@digital.cl', '2025-10-02', '2025-10-02 14:00:00', '2025-10-02 15:00:00', NOW(), NOW()),
(11, 3, 'camila.soto@fotografia.cl', '2025-10-03', '2025-10-03 09:00:00', '2025-10-03 10:00:00', NOW(), NOW()),
(12, 3, 'pablo.ruiz@video.cl', '2025-10-03', '2025-10-03 10:00:00', '2025-10-03 11:00:00', NOW(), NOW()),
(13, 3, 'daniela.morales@maker.cl', '2025-10-03', '2025-10-03 11:00:00', '2025-10-03 12:00:00', NOW(), NOW()),
(14, 3, 'fernando.silva@design.cl', '2025-10-03', '2025-10-03 14:00:00', '2025-10-03 15:00:00', NOW(), NOW()),
(15, 4, 'andrea.garcia@business.cl', '2025-10-03', '2025-10-03 15:00:00', '2025-10-03 16:00:00', NOW(), NOW()),
(16, 4, 'ricardo.fernandez@corp.cl', '2025-10-04', '2025-10-04 09:00:00', '2025-10-04 10:00:00', NOW(), NOW()),
(17, 4, 'patricia.rojas@empresa.cl', '2025-10-04', '2025-10-04 10:00:00', '2025-10-04 11:00:00', NOW(), NOW()),
(18, 4, 'luis.munoz@team.cl', '2025-10-04', '2025-10-04 11:00:00', '2025-10-04 12:00:00', NOW(), NOW()),
(19, 4, 'carolina.vega@pyme.cl', '2025-10-04', '2025-10-04 13:00:00', '2025-10-04 14:00:00', NOW(), NOW()),
(20, 5, 'alberto.diaz@tech.cl', '2025-10-04', '2025-10-04 14:00:00', '2025-10-04 15:00:00', NOW(), NOW()),
-- Week 2 (Oct 6-10)
(21, 5, 'monica.alvarez@training.cl', '2025-10-06', '2025-10-06 09:00:00', '2025-10-06 10:00:00', NOW(), NOW()),
(22, 5, 'jorge.herrera@gaming.cl', '2025-10-06', '2025-10-06 10:00:00', '2025-10-06 11:00:00', NOW(), NOW()),
(1, 1, 'isabel.navarro@meeting.cl', '2025-10-06', '2025-10-06 11:00:00', '2025-10-06 12:00:00', NOW(), NOW()),
(2, 1, 'manuel.campos@startup.cl', '2025-10-06', '2025-10-06 14:00:00', '2025-10-06 15:00:00', NOW(), NOW()),
(3, 1, 'elena.paz@work.cl', '2025-10-06', '2025-10-06 15:00:00', '2025-10-06 16:00:00', NOW(), NOW()),
(4, 1, 'raul.ibanez@private.cl', '2025-10-07', '2025-10-07 09:00:00', '2025-10-07 10:00:00', NOW(), NOW()),
(5, 1, 'beatriz.leon@team.cl', '2025-10-07', '2025-10-07 10:00:00', '2025-10-07 11:00:00', NOW(), NOW()),
(6, 2, 'sergio.mendez@evento.cl', '2025-10-07', '2025-10-07 11:00:00', '2025-10-07 12:00:00', NOW(), NOW()),
(7, 2, 'natalia.pena@ideas.cl', '2025-10-07', '2025-10-07 13:00:00', '2025-10-07 14:00:00', NOW(), NOW()),
(8, 2, 'gabriel.cruz@shared.cl', '2025-10-07', '2025-10-07 14:00:00', '2025-10-07 15:00:00', NOW(), NOW()),
(9, 2, 'adriana.mora@call.cl', '2025-10-08', '2025-10-08 09:00:00', '2025-10-08 10:00:00', NOW(), NOW()),
(10, 2, 'francisco.lara@focus.cl', '2025-10-08', '2025-10-08 10:00:00', '2025-10-08 11:00:00', NOW(), NOW()),
(11, 3, 'claudia.bravo@photo.cl', '2025-10-08', '2025-10-08 11:00:00', '2025-10-08 12:00:00', NOW(), NOW()),
(12, 3, 'eduardo.pinto@media.cl', '2025-10-08', '2025-10-08 14:00:00', '2025-10-08 15:00:00', NOW(), NOW()),
(13, 3, 'victoria.reyes@prototype.cl', '2025-10-08', '2025-10-08 15:00:00', '2025-10-08 16:00:00', NOW(), NOW()),
(14, 3, 'oscar.guerra@creative.cl', '2025-10-09', '2025-10-09 09:00:00', '2025-10-09 10:00:00', NOW(), NOW()),
(15, 4, 'julia.solis@executive.cl', '2025-10-09', '2025-10-09 10:00:00', '2025-10-09 11:00:00', NOW(), NOW()),
(16, 4, 'daniel.flores@office.cl', '2025-10-09', '2025-10-09 11:00:00', '2025-10-09 12:00:00', NOW(), NOW()),
(17, 4, 'mariana.castro@desk.cl', '2025-10-09', '2025-10-09 13:00:00', '2025-10-09 14:00:00', NOW(), NOW()),
(18, 4, 'alejandro.ramos@group.cl', '2025-10-09', '2025-10-09 14:00:00', '2025-10-09 15:00:00', NOW(), NOW()),
-- Week 3 (Oct 13-17)
(19, 4, 'paula.nunez@shared.cl', '2025-10-13', '2025-10-13 09:00:00', '2025-10-13 10:00:00', NOW(), NOW()),
(20, 5, 'roberto.ortega@lab.cl', '2025-10-13', '2025-10-13 10:00:00', '2025-10-13 11:00:00', NOW(), NOW()),
(21, 5, 'carmen.mejia@workshop.cl', '2025-10-13', '2025-10-13 11:00:00', '2025-10-13 12:00:00', NOW(), NOW()),
(22, 5, 'ignacio.paredes@fun.cl', '2025-10-13', '2025-10-13 14:00:00', '2025-10-13 15:00:00', NOW(), NOW()),
(1, 1, 'lorena.aguirre@tech.cl', '2025-10-13', '2025-10-13 15:00:00', '2025-10-13 16:00:00', NOW(), NOW()),
(2, 1, 'hector.medina@small.cl', '2025-10-14', '2025-10-14 09:00:00', '2025-10-14 10:00:00', NOW(), NOW()),
(3, 1, 'silvia.robles@open.cl', '2025-10-14', '2025-10-14 10:00:00', '2025-10-14 11:00:00', NOW(), NOW()),
(4, 1, 'guillermo.luna@private.cl', '2025-10-14', '2025-10-14 11:00:00', '2025-10-14 12:00:00', NOW(), NOW()),
(5, 1, 'rosa.velasco@medium.cl', '2025-10-14', '2025-10-14 13:00:00', '2025-10-14 14:00:00', NOW(), NOW()),
(6, 2, 'mario.salazar@conference.cl', '2025-10-14', '2025-10-14 14:00:00', '2025-10-14 15:00:00', NOW(), NOW()),
(7, 2, 'lidia.cabrera@brainstorm.cl', '2025-10-15', '2025-10-15 09:00:00', '2025-10-15 10:00:00', NOW(), NOW()),
(8, 2, 'emilio.sandoval@cowork.cl', '2025-10-15', '2025-10-15 10:00:00', '2025-10-15 11:00:00', NOW(), NOW()),
(9, 2, 'teresa.dominguez@booth.cl', '2025-10-15', '2025-10-15 11:00:00', '2025-10-15 12:00:00', NOW(), NOW()),
(10, 2, 'cristian.escobar@solo.cl', '2025-10-15', '2025-10-15 14:00:00', '2025-10-15 15:00:00', NOW(), NOW()),
(11, 3, 'alicia.montero@studio.cl', '2025-10-15', '2025-10-15 15:00:00', '2025-10-15 16:00:00', NOW(), NOW()),
(12, 3, 'andres.roman@av.cl', '2025-10-16', '2025-10-16 09:00:00', '2025-10-16 10:00:00', NOW(), NOW()),
(13, 3, 'veronica.fuentes@maker.cl', '2025-10-16', '2025-10-16 10:00:00', '2025-10-16 11:00:00', NOW(), NOW()),
(14, 3, 'cesar.guzman@design.cl', '2025-10-16', '2025-10-16 11:00:00', '2025-10-16 12:00:00', NOW(), NOW()),
(15, 4, 'gloria.salas@board.cl', '2025-10-16', '2025-10-16 13:00:00', '2025-10-16 14:00:00', NOW(), NOW()),
(16, 4, 'bruno.cano@workspace.cl', '2025-10-16', '2025-10-16 14:00:00', '2025-10-16 15:00:00', NOW(), NOW()),
-- Week 4 (Oct 20-24)
(17, 4, 'irene.blanco@desk.cl', '2025-10-20', '2025-10-20 09:00:00', '2025-10-20 10:00:00', NOW(), NOW()),
(18, 4, 'ruben.santos@teamwork.cl', '2025-10-20', '2025-10-20 10:00:00', '2025-10-20 11:00:00', NOW(), NOW()),
(19, 4, 'marcela.jimenez@office.cl', '2025-10-20', '2025-10-20 11:00:00', '2025-10-20 12:00:00', NOW(), NOW()),
(20, 5, 'antonio.marin@tech.cl', '2025-10-20', '2025-10-20 14:00:00', '2025-10-20 15:00:00', NOW(), NOW()),
(21, 5, 'clara.molina@course.cl', '2025-10-20', '2025-10-20 15:00:00', '2025-10-20 16:00:00', NOW(), NOW()),
(22, 5, 'jaime.duran@game.cl', '2025-10-21', '2025-10-21 09:00:00', '2025-10-21 10:00:00', NOW(), NOW()),
(1, 1, 'pilar.delgado@meeting.cl', '2025-10-21', '2025-10-21 10:00:00', '2025-10-21 11:00:00', NOW(), NOW()),
(2, 1, 'samuel.rios@quick.cl', '2025-10-21', '2025-10-21 11:00:00', '2025-10-21 12:00:00', NOW(), NOW()),
(3, 1, 'lucia.vidal@space.cl', '2025-10-21', '2025-10-21 13:00:00', '2025-10-21 14:00:00', NOW(), NOW()),
(4, 1, 'tomas.prieto@private.cl', '2025-10-21', '2025-10-21 14:00:00', '2025-10-21 15:00:00', NOW(), NOW()),
(5, 1, 'susana.nieto@team.cl', '2025-10-22', '2025-10-22 09:00:00', '2025-10-22 10:00:00', NOW(), NOW()),
(6, 2, 'marcos.aguilar@event.cl', '2025-10-22', '2025-10-22 10:00:00', '2025-10-22 11:00:00', NOW(), NOW()),
(7, 2, 'nuria.pascual@ideas.cl', '2025-10-22', '2025-10-22 11:00:00', '2025-10-22 12:00:00', NOW(), NOW()),
(8, 2, 'ivan.gallego@collab.cl', '2025-10-22', '2025-10-22 14:00:00', '2025-10-22 15:00:00', NOW(), NOW()),
(9, 2, 'marta.rubio@phone.cl', '2025-10-22', '2025-10-22 15:00:00', '2025-10-22 16:00:00', NOW(), NOW()),
(10, 2, 'esteban.lorenzo@focus.cl', '2025-10-23', '2025-10-23 09:00:00', '2025-10-23 10:00:00', NOW(), NOW()),
(11, 3, 'angela.suarez@photo.cl', '2025-10-23', '2025-10-23 10:00:00', '2025-10-23 11:00:00', NOW(), NOW()),
(12, 3, 'felipe.crespo@video.cl', '2025-10-23', '2025-10-23 11:00:00', '2025-10-23 12:00:00', NOW(), NOW()),
(13, 3, 'rocio.iglesias@build.cl', '2025-10-23', '2025-10-23 13:00:00', '2025-10-23 14:00:00', NOW(), NOW()),
(14, 3, 'hugo.hidalgo@creative.cl', '2025-10-23', '2025-10-23 14:00:00', '2025-10-23 15:00:00', NOW(), NOW()),
-- Week 5 (Oct 27-31)
(15, 4, 'amparo.mora@exec.cl', '2025-10-27', '2025-10-27 09:00:00', '2025-10-27 10:00:00', NOW(), NOW()),
(16, 4, 'adolfo.cano@work.cl', '2025-10-27', '2025-10-27 10:00:00', '2025-10-27 11:00:00', NOW(), NOW()),
(17, 4, 'consuelo.gil@solo.cl', '2025-10-27', '2025-10-27 11:00:00', '2025-10-27 12:00:00', NOW(), NOW()),
(18, 4, 'raquel.serrano@team.cl', '2025-10-27', '2025-10-27 14:00:00', '2025-10-27 15:00:00', NOW(), NOW()),
(19, 4, 'enrique.vicente@shared.cl', '2025-10-27', '2025-10-27 15:00:00', '2025-10-27 16:00:00', NOW(), NOW()),
(20, 5, 'dolores.castillo@lab.cl', '2025-10-28', '2025-10-28 09:00:00', '2025-10-28 10:00:00', NOW(), NOW()),
(21, 5, 'salvador.navarro@training.cl', '2025-10-28', '2025-10-28 10:00:00', '2025-10-28 11:00:00', NOW(), NOW()),
(22, 5, 'encarna.martin@game.cl', '2025-10-28', '2025-10-28 11:00:00', '2025-10-28 12:00:00', NOW(), NOW()),
(1, 1, 'rafael.sanchez@tech.cl', '2025-10-28', '2025-10-28 13:00:00', '2025-10-28 14:00:00', NOW(), NOW()),
(2, 1, 'yolanda.diaz@mini.cl', '2025-10-28', '2025-10-28 14:00:00', '2025-10-28 15:00:00', NOW(), NOW()),
(3, 1, 'gregorio.gomez@open.cl', '2025-10-29', '2025-10-29 09:00:00', '2025-10-29 10:00:00', NOW(), NOW()),
(4, 1, 'remedios.lopez@private.cl', '2025-10-29', '2025-10-29 10:00:00', '2025-10-29 11:00:00', NOW(), NOW()),
(5, 1, 'sebastian.perez@medium.cl', '2025-10-29', '2025-10-29 11:00:00', '2025-10-29 12:00:00', NOW(), NOW()),
(6, 2, 'mercedes.martin@conference.cl', '2025-10-29', '2025-10-29 14:00:00', '2025-10-29 15:00:00', NOW(), NOW()),
(7, 2, 'nicolas.fernandez@storm.cl', '2025-10-29', '2025-10-29 15:00:00', '2025-10-29 16:00:00', NOW(), NOW()),
(8, 2, 'estrella.garcia@cowork.cl', '2025-10-30', '2025-10-30 09:00:00', '2025-10-30 10:00:00', NOW(), NOW()),
(9, 2, 'alfredo.rodriguez@call.cl', '2025-10-30', '2025-10-30 10:00:00', '2025-10-30 11:00:00', NOW(), NOW()),
(10, 2, 'milagros.gonzalez@deep.cl', '2025-10-30', '2025-10-30 11:00:00', '2025-10-30 12:00:00', NOW(), NOW()),
(11, 3, 'clemente.torres@photo.cl', '2025-10-31', '2025-10-31 09:00:00', '2025-10-31 10:00:00', NOW(), NOW()),
(12, 3, 'asuncion.ramirez@final.cl', '2025-10-31', '2025-10-31 10:00:00', '2025-10-31 11:00:00', NOW(), NOW());