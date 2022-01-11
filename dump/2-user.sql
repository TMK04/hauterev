USE `hauterev`;

-- Reset
DELETE FROM `user`;

-- Values
INSERT INTO `user` VALUES (
	'Bob123',
	'$2a$10$LnM8GBiJvs5arTWThTcuV.fJjerfNWWOxL7C5tOqBgL69KyBC/OT2',
	'bob_staub_123@mail.com',
	'Staub',
	'Bob',
	'12345678',
	'Staub Street 123',
	'M',
	'2022-01-04 20:32:07'
  ), (
    'StevenAlex',
    '$2a$10$i2mL/oB2qnVP/1bVTKlbQOsWM./9jPGjTdPA.diIrk6Sy9S2E3wbS',
    'steven_alex@mail.com',
    'Alex',
    'Steven',
    '87654321',
    'Alex Street 87',
    'N',
    '2022-01-04 21:02:24'
  );

-- Check
SELECT * FROM `user`;