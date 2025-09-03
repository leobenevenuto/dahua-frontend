import { FileText, PackageOpen, Truck } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Product Registration",
    url: "/product-registration",
    icon: FileText,
  },
  {
    title: "Inbound",
    url: "/inbound",
    icon: PackageOpen,
  },
  {
    title: "Outbound",
    url: "/outbound",
    icon: Truck,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-secondary/20 text-secondary font-medium border-r-2 border-secondary" 
      : "hover:bg-accent/50 text-foreground/80 hover:text-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 border-r border-border bg-card`}
    >
      <SidebarContent className="p-4">
        {/* Logo section */}
        <div className="mb-8 flex items-center justify-center">
          <img 
            src="/dahua-logo.png" 
            alt="Dahua Technology" 
            className={`${collapsed ? "h-8" : "h-10"} w-auto object-contain transition-all duration-300`}
          />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={`${collapsed ? "sr-only" : ""} text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2`}>
            Main Menu
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="h-12 rounded-lg">
                    <NavLink to={item.url} className={`${getNavCls(item.url)} flex items-center w-full`}>
                      <item.icon className={`${collapsed ? "h-5 w-5" : "h-5 w-5 mr-3"} flex-shrink-0`} />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}