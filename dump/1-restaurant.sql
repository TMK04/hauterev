USE `hauterev_test`;

-- Reset
DELETE FROM `restaurant`;
ALTER TABLE `restaurant` AUTO_INCREMENT = 1;

-- Values
INSERT INTO `restaurant` (
  name,
  description,
  image_url,
  region,
  opening_hours
) VALUES (
    "Privé @ Keppel Bay",
    "Located on Singapore’s only private island, Privé's laidback atmosphere and simple yet wholesome café fare has cemented its position as one of the best places in Singapore to enjoy a casual meal or to grab brunch by the water’s edge. As a family-friendly venue, we also have an outdoor playground and fun kid’s corner (think television airing cartoons, story books and fun kids colouring activities) to entertain your little ones.\n<https://www.theprivegroup.com.sg/prive-keppel-bay>",
    "https://lh5.googleusercontent.com/p/AF1QipMw_e_jZBRcCdescriptionnCH37uhUm8dRT8R8eoMHI53Ovzh=w408-h571-k-no",
    "South",
    0b000000000111111111111100
  ), (
    "Once Upon a Thyme",
    "Old-world charm, homemade meals, simmering pots of laboriously cooked sauces. That’s what pasta is for us. Nothing revolutionary, we’re perfectly happy cranking out delicious pastas for like-minded pasta lovers like you, and even happier when we earn your smiles and support.\n<https://www.onceuponathyme.com.sg>",
    "https://lh5.googleusercontent.com/p/AF1QipMp4y-qXQd13yzeBRcTTUDAossfLMVZKF_PHttS=w408-h288-k-no",
    "South",
    0b000000001111111111110000
  ), (
    "Madame Fan",
    "Masterfully modern Cantonese classics\n<https://www.madamefan.sg>",
    "https://lh5.googleusercontent.com/p/AF1QipMNy2WWuehs9Ynz_MF9DE1nhtbLk360KIfBSRNI=w408-h281-k-no",
    "South",
    0b000000000000110000111100
  ), (
    "Mikoto Singapore",
    "Creating a store where customers can experience \"joy\" and \"happiness\".\n<https://mikoto.sg>",
    "https://lh5.googleusercontent.com/p/AF1QipNhVfnljMbE9WHHU2PPeUxyLO-4lA6fWaUBKSP8=w408-h240-k-no-pi-0-ya132.27-ro-0-fo100",
    "South",
    0b000000000000000001111100
  ), (
    "Corner House",
    "Corner House is shaped by many inspirations. The strands of history, science, memory, art, passion and gastronomy come together to create a luminous experience in a singular setting.\n<https://cornerhouse.com.sg>",
    "https://lh5.googleusercontent.com/p/AF1QipNKXj1v6JKrZSeJDPDDHNFBDbIBCKvFTR08xBRt=w408-h272-k-no",
    "South",
    0b000000000000111000011110
  ), (
    "Brine",
    ">Brine is our restaurant, our baby, where everything is crafted personally with the aim to cooking the best produce, with lots of imagination and plenty of care. Come join us and share our passion!\nChristopher and Shermain\n\nAt Brine, we serve modern contemporary cuisine with the application of French and Japanese techniques picked up by Chef Christopher through his culinary journey.\n<https://www.brinesingapore.com>",
    "https://lh5.googleusercontent.com/p/AF1QipOZJr-F6-cBfWIK2-CH-X9ApTJoRhZ6gm197L1u=w426-h240-k-no",
    "South",
    0b000000000000110001110000
  ), (
    "The Punggol Settlement",
    "The Punggol Settlement is a bespoke food and beverage specialised development concept envisioned and materialised by its developer, The Colonial Settlement Pte. Ltd. (a wholly owned subsidiary of Fragrance Group Limited), to revive old Punggol and bring it back to its former glory and more as the dining destination of the North-Eastern sunrise pinnacle of our tropical island city state.\nRapid urban planning with land acquisition / relocation policies by the state authorities of the past 2 decades had displaced the food & beverage geocentric of timeless Punggol away from its original seafront pinnacle.\nSited on the original general area of this vintage food and beverage location of the days of yore in pre-millennial Singapore, The Punggol Settlement is Punggol re-established, rebooted, and ready for a wave of delectable dining and entertaining eats, dollops of desserts and rejuvenating recreation - all to be experienced in harmonious symbiosis in natural cohesion with the flora, fauna, and vast peripherally encompassing seafront of the redeveloped and constantly evolving Punggol Point of today...\n<https://www.punggolsettlement.com>",
    "https://lh5.googleusercontent.com/p/AF1QipNqFkSsgR8Oy6kVIkTZ6nPDa_MkkGLk1LL3ysad=w408-h306-k-no",
    "East",
    0b000000000001111111111111
  ), (
    "Imperial Treasure Super Peking Duck",
    "Well-known for roasting the peking duck to perfection, Imperial Treasure serves only the finest and most authentic iteration of this prized dish. With a solemn dedication to preserving the centuries-old methods of the Emperor’s imperial kitchen, each whole duck is roasted to crisp perfection by our chefs and sliced on the platter before your eyes.\n<https://www.imperialtreasure.com/home>",
    "https://www.imperialtreasure.com/resources/ck/images/spd/ImperialTreasure-small-dining-2.jpg",
    "South",
    0b000000000000110000111100
  ), (
    "Harry's Dempsey Hill",
    "Established in 1992, Harry’s is one of the longstanding F&B brands in Singapore today serving over 1 million consumers every year, with more than 28 outlets and footprints across Asia.\nHarry's inviting and laidback ambience makes it the perfect location for a stylish getaway. Harry's is home to many - colleagues unwinding after a long day's work, friends catching up and even families spending quality time together over a weekend lunch. With its expertise, Harry's has also introduced a catering arm; both in-store and outdoor, bringing its signature treats to make every event a memorable one.\nHarry’s holds a few awards to its name and these include the prestigious Novateur Award Winner of 2015 at the inaugural Asia Enterprise BRAND Awards, the distinguished Outstanding Brands Award 2016 in the Bar and Dining Category and Top Brand 2019 - Bar and Dining by Influential Brands. The awards serve to affirm its position as a key market leader.\nDedicated to be the best dining establishment in Singapore and beyond, Harry’s aims to converge people of all ages and friends around the world. One is never too far away for a good time at Harry's.\n\#harryssingapore\n<https://harrys.com.sg>",
    "https://lh5.googleusercontent.com/p/AF1QipM89rpC8u7JaXvlQ_neMXEYpBbdNQre8jdr1tx5=w408-h306-k-no",
    "South",
    0b000000000001111111111100
  ), (
    "Tok Tok Indonesian Soup House",
    "A family dining concept, Tok Tok Indonesian Restaurant serves an extensive range of mouth-watering authentic Indonesian cuisine.\nWith great passion, we crafted an array of much-loved Indonesian favourites and heart-warming dishes that uses only the original family recipes to bring out a nostalgic taste of Indonesia to your home. Delight yourself with our signature dishes such as Batagor, Ayam Bakar Betutu, Dendeng Sambal Bali, Buntut Goreng Sambal Matah, Ikan Bakar Bumbu Bali, Nasi Goreng Kambing, Soto Betawi and many more.\nOur logo, “kentongan” is a traditional communication tool that makes the sound “tok tok”, a sound that is familiar for many Indonesians, as a sound off the street vendors that has become an inspiration to us.\n467 Joo Chiat Road, Singapore 427678   |   +65 6908 3835\n<https://www.toktok.com.sg>",
    "https://lh5.googleusercontent.com/p/AF1QipNBlhQ8qXhGc_KeOdvI19sO7WyLMhBBn5NP-TQ=w426-h240-k-no",
    "South",
    0b000000000001111111111100
  ), (
    "Spice Brasserie",
    "Treat yourself to a tantalising selection of Asian street food while enjoying creative and modern interpretations of local favourites at the newly renovated Restaurant. Be spoilt for choice with the extensive a la carte and buffet offerings, that includes an array of appetizers and sweet treats to complement your meal.",
    "https://lh5.googleusercontent.com/p/AF1QipOWhhkfLlDtrMEk7Hk9l-RWpOZneJ7i8jZ6K1rV=w646-h240-k-no",
    "South",
    0b000000000111111111111100
  ), (
    "Citrus By The Pool",
    "### Nothing Brings People Together Likes Good Food\n\n#### A Place To Bond And Celebrate\n\nOur vision is to create meeting spaces for people to bond and create happy memories. We want to bring smiles and laughter, joy and cheer, to every individual who dines with us.\nStarted in 2013, Citrus By The Pool is a Halal-certified café restaurant, nestled at Woodlands Swimming Complex, that serves Western and Asian Fusion cuisine.\nSeeing a lack of Halal-certified cafés in the North, the owner Chris decided to bring the café experience to the residential estates, offering accessibility, relaxing ambience and good food.\n<https://citrusbythepool.com/>",
    "https://lh5.googleusercontent.com/p/AF1QipOY7_6AEZGH2raDI3YxILx3nqMVxBsS7hnMYLrJ=w426-h240-k-no",
    "North",
    0b111111000000111111111111
  );

-- Check
SELECT * FROM `restaurant`;