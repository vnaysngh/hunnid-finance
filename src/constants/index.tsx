export const getContractAddress: any = {
  "10": "0xfB9b03b361cDC9A7A40629AAF79fb492f19c3495",
  "8453": "0x2AE9Efb422d5e7BB7DDF6ea0b94f87114313d1a1"
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
