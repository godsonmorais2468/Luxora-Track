import { LayoutDashboard, Building2, PlusCircle, Users, UserPlus, Layers, Tags, BarChart3, PackageOpen, PackageCheck, SlidersHorizontal, User, Package } from "lucide-react";

export const adminNav= [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Branches",
    items: [
      { label: "Branches", path: "/admin/branches", icon: Building2 },
      { label: "Add Branch", path: "/admin/branches/add", icon: PlusCircle },
    ],
  },
  {
    label: "Users",
    items: [
      { label: "Register User", path: "/admin/users/register", icon: UserPlus },
      { label: "Manage Users", path: "/admin/users/manage", icon: Users },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Item Groups", path: "/admin/item-groups", icon: Layers },
      { label: "Categories", path: "/admin/categories", icon: Tags },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", path: "/admin/reports", icon: BarChart3 },
    ],
  },
];

export const staffNav= [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Items", path: "/staff/items", icon: Package },
      { label: "Opening Stock", path: "/staff/opening-stock", icon: PackageOpen },
      { label: "Closing Stock", path: "/staff/closing-stock", icon: PackageCheck },
      { label: "Adjustments", path: "/staff/adjustments", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", path: "/staff/reports", icon: BarChart3 },
      { label: "Profile", path: "/staff/profile", icon: User },
    ],
  },
];
