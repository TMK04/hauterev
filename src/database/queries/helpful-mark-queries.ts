import { helpfulMarkSchema } from "database/schemas";

export const selectHelpfulMarksCount = () =>
  helpfulMarkSchema()
    .select("review_id")
    .count({ helpful_count: "*" })
    .from("helpful_mark")
    .groupBy("review_id")
    .as("helpful_marks");
