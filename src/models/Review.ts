import type { Optional } from "types";

export interface BaseReview {
  rating: number;
  title: string;
  description: string;
  image_url: string;
}

export class PostReview implements BaseReview {
  readonly restaurant_id: number;
  readonly username: string;
  readonly posted_timestamp = Date.now();
  rating: number;
  title: string;
  description: string;
  image_url: string;

  constructor(
    restaurant_id: number,
    username: string,
    rating: number,
    title: string,
    description: string,
    image_url: string
  ) {
    this.restaurant_id = restaurant_id;
    this.username = username;
    this.rating = rating;
    this.title = title;
    this.description = description;
    this.image_url = image_url;
  }
}

export class EditReview implements Optional<BaseReview> {
  readonly id: number;
  edited_timestamp = Date.now();
  rating?: number;
  title?: string;
  description?: string;
  image_url?: string;

  constructor(
    id: number,
    rating?: number,
    title?: string,
    description?: string,
    image_url?: string
  ) {
    this.id = id;
    if (rating) this.rating = rating;
    if (title) this.title = title;
    if (description) this.description = description;
    if (image_url) this.image_url = image_url;
  }
}

export interface Review extends PostReview {
  readonly id: number;
  edited_timestamp?: number;
}
