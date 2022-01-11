USE `hauterev`;

-- Reset
DELETE FROM `review`;
ALTER TABLE `review` AUTO_INCREMENT = 1;

SELECT * FROM `user`;

-- VALUES
INSERT INTO `review` (
  restaurant_id,
  username,
  rating,
  title,
  description,
  image_url,
  posted_timestamp
) VALUES (
    1,
    "Bob123",
    2.5,
    "Night at Prive",
    "Prive go there. Food is great.",
    "https://marinakeppelbay.com/wp-content/uploads/2020/09/BK-banner-image.jpg",
    now()
  ), (
    1,
    "StevenAlex",
    2.5,
    "Night at Prive",
    "Prive go there. Food is great.",
    "https://marinakeppelbay.com/wp-content/uploads/2020/09/BK-banner-image.jpg",
    now()
  );

-- Check
SELECT * FROM `review`;