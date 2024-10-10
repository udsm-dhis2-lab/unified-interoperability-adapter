import { Menu } from "../models/menu.model";

export const menus: Menu[] = [
    {
        name: 'Dashboard',
        routeUrl: '/dashboard',
        icon: 'dashboard',
        category: 'main',
    },
    {
        name: 'Client Management',
        routeUrl: '/clientManagement',
        icon: 'user',
        category: 'main',
        subMenus: [
            {
                name: 'Clients',
                routeUrl: '/',
                icon: 'unordered-list',
                subMenus: [],
            },
            {
                name: 'Deduplication',
                routeUrl: '/deduplication',
                icon: 'merge',
                subMenus: [],
            },
        ],
    },
    {
        name: 'Worflow Management',
        routeUrl: '/worflowManagement',
        icon: 'apartment',
        category: 'main',
        subMenus: [
            {
                name: 'workflows',
                routeUrl: '/home',
                icon: 'unordered-list',
                subMenus: [],
            },
        ],
    },

];