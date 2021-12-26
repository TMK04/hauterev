import type { HelpfulMark } from "./types";

import db from "database";

// ----------- //
// * Helpers * //
// ----------- //

const helpfulMarkSchema = () => db<HelpfulMark>("helpful_mark");

// ----------- //
// * Queries * //
// ----------- //

// *--- Insert ---* //

export const insertHelpfulMark = (helpful_mark: HelpfulMark) =>
  helpfulMarkSchema().insert(helpful_mark);

// *--- Select ---* //

export const selectHelpfulMarksHelpfulCount = () =>
  helpfulMarkSchema()
    .select("review_id")
    .count({ helpful_count: "*" })
    .groupBy("review_id")
    .as("helpful_marks");

// *--- Delete ---* //

export const deleteHelpfulMark = (helpful_mark: HelpfulMark) =>
  helpfulMarkSchema().del().where(helpful_mark);
