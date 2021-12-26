import type { Bookmark, ID, UserUsername } from "../types";

import db from "database";

// ----------- //
// * Helpers * //
// ----------- //

const bookmarkSchema = () => db<Bookmark>("bookmark");

// ----------- //
// * Queries * //
// ----------- //

// *--- Insert ---* //

export const insertBookmark = (bookmark: Bookmark) => bookmarkSchema().insert(bookmark);

// *--- Select ---* //

export const selectBookmarksByUsername = (username: UserUsername) =>
  bookmarkSchema().select().where({ username });

// *--- Delete ---* //

export const deleteBookmark = (username: UserUsername, restaurant_id: ID) =>
  bookmarkSchema().del().where({ username, restaurant_id });
