import type { Bookmark, ID, SelectBookmarks, UserUsername } from "./types";

import { db } from "connections";
import { restaurant_db } from "db";

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
  bookmarkTable()
    .select(
      "bookmark.restaurant_id",
      "restaurant_identifiers.name",
      "restaurant_identifiers.image_url"
    )
    .where({ username })
    .join(
      restaurant_db.selectRestaurantIdentifiers(),
      "bookmark.restaurant_id",
      "restaurant_identifiers.id"
    );

// *--- Delete ---* //

export const deleteBookmarkByRestaurantIDnUsername = (restaurant_id: ID, username: UserUsername) =>
  bookmarkTable().del().where({ username, restaurant_id });
