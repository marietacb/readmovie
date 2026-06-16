/** Pegatinas decorativas del cuaderno (sustituibles en public/notebook-assets/stickers/). */

export const NOTEBOOK_STICKERS = {
  wishlistRibbon: {
    id: "wishlistRibbon",
    label: "Cinta Wishlist",
    path: "/notebook-assets/stickers/wishlist-ribbon.png",
  },
  wishlistFlower: {
    id: "wishlistFlower",
    label: "Margarita",
    path: "/notebook-assets/stickers/wishlist-flower.png",
  },
  trackerMoon: {
    id: "trackerMoon",
    label: "Luna",
    path: "/notebook-assets/stickers/moon.png",
  },
  overviewRose: {
    id: "overviewRose",
    label: "Rosa",
    path: "/notebook-assets/stickers/rose.png",
  },
  favoritesTrophy: {
    id: "favoritesTrophy",
    label: "Trofeo",
    path: "/notebook-assets/stickers/trophy.png",
  },
  bookOfYearCrown: {
    id: "bookOfYearCrown",
    label: "Corona",
    path: "/notebook-assets/stickers/crown.png",
  },
  bookOfYearMedals: {
    id: "bookOfYearMedals",
    label: "Medallas",
    path: "/notebook-assets/stickers/medals.png",
  },
  introBookshelf: {
    id: "introBookshelf",
    label: "Estantería intro",
    path: "/notebook-assets/stickers/bookshelf.png",
  },
  starsDecoration: {
    id: "starsDecoration",
    label: "Estrellas decorativas",
    path: "/notebook-assets/stickers/stars-row.png",
  },
  vineLeaves: {
    id: "vineLeaves",
    label: "Hojas",
    path: "/notebook-assets/stickers/vine.png",
  },
} as const;

export type NotebookStickerId = keyof typeof NOTEBOOK_STICKERS;

export const DEFAULT_ENABLED_STICKERS: NotebookStickerId[] = [
  "wishlistRibbon",
  "wishlistFlower",
  "trackerMoon",
  "overviewRose",
  "favoritesTrophy",
  "bookOfYearCrown",
  "bookOfYearMedals",
  "introBookshelf",
  "starsDecoration",
  "vineLeaves",
];

export const NOTEBOOK_TEXTURES = {
  dotGrid: "/notebook-assets/textures/dot-grid.png",
  parchment: "/notebook-assets/textures/parchment.png",
} as const;
