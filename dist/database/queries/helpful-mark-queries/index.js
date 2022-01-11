"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHelpfulMark =
  exports.selectHelpfulMarksHelpfulCount =
  exports.insertHelpfulMark =
    void 0;
const database_1 = __importDefault(require("database"));
// ----------- //
// * Helpers * //
// ----------- //
const helpfulMarkTable = () => (0, database_1.default)("helpful_mark");
// ----------- //
// * Queries * //
// ----------- //
// *--- Insert ---* //
const insertHelpfulMark = (helpful_mark) =>
  helpfulMarkTable().insert(helpful_mark);
exports.insertHelpfulMark = insertHelpfulMark;
// *--- Select ---* //
const selectHelpfulMarksHelpfulCount = () =>
  helpfulMarkTable()
    .select("review_id")
    .count({ helpful_count: "*" })
    .groupBy("review_id")
    .as("helpful_marks");
exports.selectHelpfulMarksHelpfulCount = selectHelpfulMarksHelpfulCount;
// *--- Delete ---* //
const deleteHelpfulMark = (helpful_mark) =>
  helpfulMarkTable().del().where(helpful_mark);
exports.deleteHelpfulMark = deleteHelpfulMark;
