export const getContractAddress: any = {
  "10": "0xbC307E204E6F4D9052cedCcc5Dc69aC7EDaC51E6",
  "8453": "0x4686609FDc0b3A707422d2e1d6ee26F01f745678"
};

export const navItems = [
  { icon: "🔍", text: "Browse", key: "browse", path: "/" },
  { icon: "💰", text: "Borrow", key: "create", path: "/create" },
  { icon: "📂", text: "Portfolio", key: "portfolio", path: "/portfolio" }
  // { icon: "👤", text: "Profile", key: "profile", path: "/profile" }
];

export const routeMappings: Record<string, { title: string; navItem: string }> =
  {
    browse: { title: "Browse Active Loans", navItem: "browse" },
    create: { title: "Create Borrow Request", navItem: "create" },
    // profile: { title: "User Profile", navItem: "profile" },
    portfolio: { title: "Portfolio Dashboard", navItem: "portfolio" }
  };
