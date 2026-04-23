export interface MenuBarMenuItem {
  key: string;
  label: string;
  icon?: unknown;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface MenuBarMenuDivider {
  type: "divider";
}

export type MenuBarMenuEntry = MenuBarMenuItem | MenuBarMenuDivider;

export interface MenuBarMenu {
  key: string;
  label: string;
  items: MenuBarMenuEntry[];
}

export interface MenuBarSearchConfig {
  appId: string;
  searchType: "movie" | "tv" | "book" | "photo" | "music";
  placeholder?: string;
  onSelect: (item: {
    id: string;
    title: string;
    [key: string]: unknown;
  }) => void;
  recentItems?: Array<{
    id: string;
    title: string;
    posterPath?: string | null;
    type?: string;
  }>;
}

export interface MenuBarConfig {
  menus?: MenuBarMenu[];
  search?: MenuBarSearchConfig;
  about?: { description?: string; version?: string };
}
