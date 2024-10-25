export interface Menu {
  id: string;
  name: string;
  icon: string;
  routeUrl: string;
  category?: string;
  subMenus?: Menu[];
}
