// Pictures cut from the front of each exercise card (frontend/public/exercises/<id>.jpg).
// Cards 7 and 11 have no picture yet: add 7.jpg / 11.jpg to that folder and their ids here.
const WITH_PICTURE = new Set([1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);

export function exerciseImage(id: number): string | null {
  return WITH_PICTURE.has(id) ? `/exercises/${id}.jpg` : null;
}

export const IMAGE_CREDIT =
  'Illustration from the Brachial Plexus Program Exercise Cards, Michigan Medicine. © 2017 Regents of the University of Michigan.';
