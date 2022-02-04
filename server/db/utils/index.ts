export const whereMatchAgainst = (columns: string[], mode = "NATURAL LANGUAGE MODE") =>
  `MATCH (${columns.join(",")}) AGAINST (? IN ${mode})`;
