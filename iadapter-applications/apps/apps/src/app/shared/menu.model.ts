export interface Menu {
    name: string;
    icon: string;
    routeUrl: string;
    category?: string;
    subMenus?: Menu[];
  }
  