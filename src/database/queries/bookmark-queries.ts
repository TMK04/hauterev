import { Bookmark, ID, UserUsername, bookmarkSchema } from "database/schemas";

export const insertBookmark = (bookmark: Bookmark) => bookmarkSchema().insert(bookmark);

export const selectBookmarksByUsername = (username: UserUsername) =>
  bookmarkSchema().select().where({ username });

export const deleteBookmark = (username: UserUsername, restaurant_id: ID) =>
  bookmarkSchema().del().where({ username, restaurant_id });
