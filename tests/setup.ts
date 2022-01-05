import db from "database";

export const createDatabase = () =>
  db.raw(`
    -- MySQL Script generated by MySQL Workbench
    -- Wed Dec 29 10:57:29 2021
    -- Model: New Model    Version: 1.0
    -- MySQL Workbench Forward Engineering

    SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
    SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
    SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

    -- -----------------------------------------------------
    -- Schema hauterev_test
    -- -----------------------------------------------------
    DROP SCHEMA IF EXISTS \`hauterev_test\` ;

    -- -----------------------------------------------------
    -- Schema hauterev_test
    -- -----------------------------------------------------
    CREATE SCHEMA IF NOT EXISTS \`hauterev_test\` ;
    USE \`hauterev_test\` ;

    -- -----------------------------------------------------
    -- Table \`hauterev_test\`.\`restaurant\`
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS \`hauterev_test\`.\`restaurant\` ;

    CREATE TABLE IF NOT EXISTS \`hauterev_test\`.\`restaurant\` (
      \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      \`name\` VARCHAR(50) NOT NULL,
      \`description\` TEXT NOT NULL,
      \`image_url\` VARCHAR(255) NOT NULL,
      \`region\` VARCHAR(10) NULL,
      \`opening_hours\` MEDIUMINT UNSIGNED NULL,
      PRIMARY KEY (\`id\`),
      FULLTEXT INDEX \`name_description_FULLTEXT\` (\`name\`, \`description\`) VISIBLE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Table \`hauterev_test\`.\`user\`
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS \`hauterev_test\`.\`user\` ;

    CREATE TABLE IF NOT EXISTS \`hauterev_test\`.\`user\` (
      \`username\` VARCHAR(20) NOT NULL,
      \`password_hash\` CHAR(60) NOT NULL,
      \`email\` VARCHAR(255) NOT NULL COMMENT 'One email per user',
      \`last_name\` VARCHAR(50) NOT NULL,
      \`first_name\` VARCHAR(50) NULL,
      \`mobile_number\` VARCHAR(15) NULL,
      \`address\` VARCHAR(100) NULL,
      \`gender\` CHAR(1) NOT NULL DEFAULT 'N' COMMENT 'M: Male\nF: Female\nO: Other\nN: Not Stated',
      \`created_timestamp\` TIMESTAMP NOT NULL,
      PRIMARY KEY (\`username\`),
      UNIQUE INDEX \`email_UNIQUE\` (\`email\` ASC) VISIBLE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Table \`hauterev_test\`.\`review\`
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS \`hauterev_test\`.\`review\` ;

    CREATE TABLE IF NOT EXISTS \`hauterev_test\`.\`review\` (
      \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      \`restaurant_id\` INT UNSIGNED NOT NULL,
      \`username\` VARCHAR(20) NOT NULL,
      \`rating\` DECIMAL(2,1) UNSIGNED NOT NULL,
      \`title\` VARCHAR(30) NOT NULL,
      \`description\` VARCHAR(255) NOT NULL,
      \`image_url\` VARCHAR(255) NOT NULL,
      \`posted_timestamp\` TIMESTAMP NOT NULL,
      \`edited_timestamp\` TIMESTAMP NULL,
      INDEX \`restaurant_id_idx\` (\`restaurant_id\` ASC) VISIBLE,
      INDEX \`username_idx\` (\`username\` ASC) VISIBLE,
      PRIMARY KEY (\`id\`),
      UNIQUE INDEX \`restaurant_id_username_UNIQUE\` (\`restaurant_id\` ASC, \`username\` ASC) VISIBLE,
      CONSTRAINT \`fk_review_restaurant_id\`
        FOREIGN KEY (\`restaurant_id\`)
        REFERENCES \`hauterev_test\`.\`restaurant\` (\`id\`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      CONSTRAINT \`fk_review_username\`
        FOREIGN KEY (\`username\`)
        REFERENCES \`hauterev_test\`.\`user\` (\`username\`)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Table \`hauterev_test\`.\`bookmark\`
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS \`hauterev_test\`.\`bookmark\` ;

    CREATE TABLE IF NOT EXISTS \`hauterev_test\`.\`bookmark\` (
      \`username\` VARCHAR(20) NOT NULL,
      \`restaurant_id\` INT UNSIGNED NOT NULL,
      \`timestamp\` TIMESTAMP NOT NULL,
      PRIMARY KEY (\`username\`, \`restaurant_id\`),
      INDEX \`restaurant_id_idx\` (\`restaurant_id\` ASC) VISIBLE,
      CONSTRAINT \`fk_bookmark_restaurant_id\`
        FOREIGN KEY (\`restaurant_id\`)
        REFERENCES \`hauterev_test\`.\`restaurant\` (\`id\`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      CONSTRAINT \`fk_bookmark_username\`
        FOREIGN KEY (\`username\`)
        REFERENCES \`hauterev_test\`.\`user\` (\`username\`)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Table \`hauterev_test\`.\`helpful_mark\`
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS \`hauterev_test\`.\`helpful_mark\` ;

    CREATE TABLE IF NOT EXISTS \`hauterev_test\`.\`helpful_mark\` (
      \`username\` VARCHAR(20) NOT NULL,
      \`review_id\` INT UNSIGNED NOT NULL,
      PRIMARY KEY (\`username\`, \`review_id\`),
      INDEX \`username_idx\` (\`username\` ASC) VISIBLE,
      INDEX \`review_id_idx\` (\`review_id\` ASC) VISIBLE,
      CONSTRAINT \`fk_helpful_review_username\`
        FOREIGN KEY (\`username\`)
        REFERENCES \`hauterev_test\`.\`user\` (\`username\`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      CONSTRAINT \`fk_helpful_review_review_id\`
        FOREIGN KEY (\`review_id\`)
        REFERENCES \`hauterev_test\`.\`review\` (\`id\`)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
    ENGINE = InnoDB;


    SET SQL_MODE=@OLD_SQL_MODE;
    SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
    SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
`);