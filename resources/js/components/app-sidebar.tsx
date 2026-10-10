import { Link } from '@inertiajs/react';
import { LayoutGrid, Package, Tag, ShoppingCart } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Product',
        href: '/products',
        icon: Package,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: Tag,
    },
    {
        title: 'Point of Sale',
        href: '/pos',
        icon: ShoppingCart,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="h-20"
                            asChild
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo
                                    className="
                                        h-16 w-16
                                        object-contain
                                        group-data-[collapsible=icon]:h-8
                                        group-data-[collapsible=icon]:w-8
                                    "
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
