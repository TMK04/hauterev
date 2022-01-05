import type { Bookmark, ID, UserUsername } from "../types";

import db from "database";

// ----------- //
// * Helpers * //
// ----------- //

const bookmarkTable = () => db<Bookmark>("bookmark");

// ----------- //
// * Queries * //
// ----------- //

// *--- Insert ---* //

export const insertBookmark = (bookmark: Bookmark) => bookmarkTable().insert(bookmark);

// *--- Select ---* //

export const selectBookmarksByUsername = (username: UserUsername) =>
  bookmarkTable().select().where({ username });

// *--- Delete ---* //

export const deleteBookmarkByRestaurantIDnUsername = (restaurant_id: ID, username: UserUsername) =>
  bookmarkTable().del().where({ username, restaurant_id });
