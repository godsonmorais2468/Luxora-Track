import { LayoutDashboard, Building2, PlusCircle, Users, UserPlus, Layers, Tags, BarChart3, PackageOpen, PackageCheck, SlidersHorizontal, User } from "lucide-react";

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

// Curated for the mobile bottom nav — 5 primary tabs (Apple HIG max) plus an
// overflow list surfaced through the "More" bottom sheet. Every route from
// adminNav/staffNav above is still reachable; nothing is removed, only
// reorganized for thumb reach on small screens.
export const adminBottomNav = {
  primary: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Branches", path: "/admin/branches", icon: Building2 },
    { label: "Groups", path: "/admin/item-groups", icon: Layers },
    { label: "Categories", path: "/admin/categories", icon: Tags },
    { label: "Reports", path: "/admin/reports", icon: BarChart3 },
  ],
  overflow: [
    { label: "Add Branch", path: "/admin/branches/add", icon: PlusCircle },
    { label: "Register User", path: "/admin/users/register", icon: UserPlus },
    { label: "Manage Users", path: "/admin/users/manage", icon: Users },
  ],
};

export const staffBottomNav = {
  primary: [
    { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Opening", path: "/staff/opening-stock", icon: PackageOpen },
    { label: "Closing", path: "/staff/closing-stock", icon: PackageCheck },
    { label: "Reports", path: "/staff/reports", icon: BarChart3 },
  ],
  overflow: [
    { label: "Adjustments", path: "/staff/adjustments", icon: SlidersHorizontal },
    { label: "Profile", path: "/staff/profile", icon: User },
  ],
};

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
