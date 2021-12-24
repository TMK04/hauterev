import { HelpfulMark, helpfulMarkSchema } from "database/schemas";

export const insertHelpfulMark = (helpful_mark: HelpfulMark) =>
  helpfulMarkSchema().insert(helpful_mark);

export const selectHelpfulMarksHelpfulCount = () =>
  helpfulMarkSchema()
    .select("review_id")
    .count({ helpful_count: "*" })
    .from("helpful_mark")
    .groupBy("review_id")
    .as("helpful_marks");

export const deleteHelpfulMark = (helpful_mark: HelpfulMark) =>
  helpfulMarkSchema().del().where(helpful_mark);
