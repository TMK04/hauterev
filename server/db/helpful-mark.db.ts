import type { HelpfulMark } from "./types";

import { db } from "connections";

// ----------- //
// * Helpers * //
// ----------- //

const helpfulMarkTable = () => db<HelpfulMark>("helpful_mark");

// ----------- //
// * Queries * //
// ----------- //

// *--- Insert ---* //

export const insertHelpfulMark = (helpful_mark: HelpfulMark) =>
  helpfulMarkTable().insert(helpful_mark);

// *--- Select ---* //

export const selectHelpfulMarksHelpfulCount = () =>
  helpfulMarkTable()
    .select("review_id")
    .count({ helpful_count: "*" })
    .groupBy("review_id")
    .as("helpful_marks");

// *--- Delete ---* //

export const deleteHelpfulMark = (helpful_mark: HelpfulMark) =>
  helpfulMarkTable().del().where(helpful_mark);
