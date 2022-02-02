DELETE FROM `bookmark`;

-- VALUES
INSERT INTO `bookmark` VALUES (
    "Bob123",
    1,
    now()
  ), (
    "Bob123",
    2,
    now()
  ), (
    "StevenAlex",
    1,
    now()
  );

-- Check
SELECT * FROM `bookmark`;