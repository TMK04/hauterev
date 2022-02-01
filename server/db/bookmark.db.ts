import type { Bookmark, ID, SelectBookmarks, UserUsername } from "./types";

import { db } from "connections";

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

export const selectBookmarksByUsername = (username: UserUsername): Promise<SelectBookmarks> =>
  bookmarkTable().select().where({ username });

// *--- Delete ---* //

export const deleteBookmarkByRestaurantIDnUsername = (restaurant_id: ID, username: UserUsername) =>
  bookmarkTable().del().where({ username, restaurant_id });
