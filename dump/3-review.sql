USE `hauterev`;

-- Reset
DELETE FROM `review`;
ALTER TABLE `review` AUTO_INCREMENT = 1;

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
    4.5,
    "Night at Prive",
    "Prive go there. Food is great.",
    "https://marinakeppelbay.com/wp-content/uploads/2020/09/BK-banner-image.jpg",
    now()
  ), (
    1,
    "StevenAlex",
    4.0,
    "Keppel Bay Dining",
    "Decent food, great service, would come back for more.",
    "https://marinakeppelbay.com/wp-content/uploads/2020/09/BK-banner-image.jpg",
    now()
  ), (
    2,
    "Bob123",
    1.5,
    "Out of Thyme",
    "Too traditional.",
    "https://www.onceuponathyme.com.sg/img/ouat-main-feature-pasta.jpg",
    now()
  ), (
    3,
    "StevenAlex",
    5.0,
    "A Day @ Madame Fan",
    "The place offers a fan-tastic cuisine! Definitely a must try if you are getting into Chinese food.",
    "https://www.madamefan.sg/wp-content/themes/madame_fan/img/eat/eat_woman_dimsum.jpg",
    now()
  );

-- Check
SELECT * FROM `review`;