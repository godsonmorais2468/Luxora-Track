// LUXORA TRACK — Central dummy data for the prototype

export const goldRate = 6245; // per 10g
export const silverRate = 78.4; // per gram

// ---------------------------------------------------------------------------
// Branches — each branch holds stock split by Group (Gold / Silver), and each
// group breaks down further into Categories (Ring, Chain, Bangle, etc).
// ---------------------------------------------------------------------------
export const branches = [
  {
    id: "br-trivandrum",
    name: "Trivandrum",
    code: "TVM001",
    manager: "Devika Nair",
    phone: "+91 471 555 0110",
    groups: [
      {
        group: "Gold",
        quantity: 120,
        weight: 540,
        categories: [
          { category: "Ring", quantity: 25, weight: 120 },
          { category: "Chain", quantity: 40, weight: 180 },
          { category: "Necklace", quantity: 30, weight: 150 },
          { category: "Bangle", quantity: 25, weight: 90 },
        ],
      },
      {
        group: "Silver",
        quantity: 60,
        weight: 750,
        categories: [{ category: "Bangle", quantity: 60, weight: 750 }],
      },
    ],
  },
  {
    id: "br-dubai",
    name: "Dubai Marina Atelier",
    code: "DXB-01",
    manager: "Alessandra Moretti",
    phone: "+971 4 555 0192",
    groups: [
      {
        group: "Gold",
        quantity: 210,
        weight: 860,
        categories: [
          { category: "Ring", quantity: 60, weight: 220 },
          { category: "Chain", quantity: 70, weight: 260 },
          { category: "Necklace", quantity: 50, weight: 220 },
          { category: "Pendant", quantity: 30, weight: 160 },
        ],
      },
      {
        group: "Silver",
        quantity: 95,
        weight: 610,
        categories: [
          { category: "Bangle", quantity: 50, weight: 320 },
          { category: "Coin", quantity: 45, weight: 290 },
        ],
      },
    ],
  },
  {
    id: "br-geneva",
    name: "Geneva Rue du Rhone",
    code: "GVA-02",
    manager: "Henri Laurent",
    phone: "+41 22 555 0148",
    groups: [
      {
        group: "Gold",
        quantity: 150,
        weight: 560,
        categories: [
          { category: "Ring", quantity: 40, weight: 150 },
          { category: "Bracelet", quantity: 35, weight: 140 },
          { category: "Necklace", quantity: 45, weight: 170 },
          { category: "Earrings", quantity: 30, weight: 100 },
        ],
      },
      {
        group: "Silver",
        quantity: 70,
        weight: 430,
        categories: [
          { category: "Chain", quantity: 40, weight: 260 },
          { category: "Bangle", quantity: 30, weight: 170 },
        ],
      },
    ],
  },
  {
    id: "br-singapore",
    name: "Singapore Marina Bay",
    code: "SIN-03",
    manager: "Wei Lin Tan",
    phone: "+65 6555 0177",
    groups: [
      {
        group: "Gold",
        quantity: 240,
        weight: 980,
        categories: [
          { category: "Chain", quantity: 80, weight: 320 },
          { category: "Ring", quantity: 70, weight: 260 },
          { category: "Necklace", quantity: 60, weight: 260 },
          { category: "Bangle", quantity: 30, weight: 140 },
        ],
      },
      {
        group: "Silver",
        quantity: 110,
        weight: 720,
        categories: [
          { category: "Bangle", quantity: 60, weight: 380 },
          { category: "Coin", quantity: 50, weight: 340 },
        ],
      },
    ],
  },
  {
    id: "br-london",
    name: "London Bond Street",
    code: "LDN-04",
    manager: "Olivia Pemberton",
    phone: "+44 20 555 0163",
    groups: [
      {
        group: "Gold",
        quantity: 130,
        weight: 480,
        categories: [
          { category: "Ring", quantity: 35, weight: 130 },
          { category: "Pendant", quantity: 30, weight: 120 },
          { category: "Necklace", quantity: 35, weight: 140 },
          { category: "Earrings", quantity: 30, weight: 90 },
        ],
      },
      {
        group: "Silver",
        quantity: 60,
        weight: 360,
        categories: [
          { category: "Bracelet", quantity: 35, weight: 210 },
          { category: "Coin", quantity: 25, weight: 150 },
        ],
      },
    ],
  },
  {
    id: "br-mumbai",
    name: "Mumbai Bandra Fort",
    code: "BOM-05",
    manager: "Arjun Malhotra",
    phone: "+91 22 5555 0188",
    groups: [
      {
        group: "Gold",
        quantity: 320,
        weight: 1240,
        categories: [
          { category: "Chain", quantity: 110, weight: 420 },
          { category: "Ring", quantity: 90, weight: 340 },
          { category: "Necklace", quantity: 70, weight: 280 },
          { category: "Bangle", quantity: 50, weight: 200 },
        ],
      },
      {
        group: "Silver",
        quantity: 140,
        weight: 860,
        categories: [
          { category: "Bangle", quantity: 80, weight: 520 },
          { category: "Coin", quantity: 60, weight: 340 },
        ],
      },
    ],
  },
  {
    id: "br-paris",
    name: "Paris Place Vendome",
    code: "CDG-06",
    manager: "Camille Dubois",
    phone: "+33 1 5555 0151",
    groups: [
      {
        group: "Gold",
        quantity: 110,
        weight: 410,
        categories: [
          { category: "Ring", quantity: 30, weight: 110 },
          { category: "Necklace", quantity: 30, weight: 120 },
          { category: "Bracelet", quantity: 25, weight: 90 },
          { category: "Earrings", quantity: 25, weight: 90 },
        ],
      },
      {
        group: "Silver",
        quantity: 55,
        weight: 330,
        categories: [
          { category: "Chain", quantity: 30, weight: 190 },
          { category: "Bangle", quantity: 25, weight: 140 },
        ],
      },
    ],
  },
];

// Net stock position for a branch list, split by metal group. Takes the
// branch array as input so pages can pass live (context) data and totals
// stay correct after branch edits.
export const sumGroupTotals = (branchList, groupName) =>
  branchList.reduce(
    (acc, b) => {
      const g = b.groups.find((x) => x.group === groupName);
      if (g) {
        acc.quantity += g.quantity;
        acc.weight += g.weight;
      }
      return acc;
    },
    { quantity: 0, weight: 0 }
  );

// Sum a list of movement entries into { value, weight, quantity }.
export const sumMovement = (entries) =>
  entries.reduce(
    (acc, e) => ({
      value: acc.value + e.value,
      weight: acc.weight + e.weight,
      quantity: acc.quantity + e.quantity,
    }),
    { value: 0, weight: 0, quantity: 0 }
  );

// Today's movement — used on the Dashboard cards and the Reports page.
export const todayInward = {
  entries: [
    { id: "in1", branch: "Trivandrum", group: "Gold", category: "Ring", quantity: 3, weight: 14.4, value: 89928, time: "09:12" },
    { id: "in2", branch: "Mumbai Bandra Fort", group: "Gold", category: "Chain", quantity: 6, weight: 24.0, value: 149880, time: "10:05" },
    { id: "in3", branch: "Dubai Marina Atelier", group: "Silver", category: "Coin", quantity: 12, weight: 96.0, value: 7526, time: "11:20" },
    { id: "in4", branch: "Singapore Marina Bay", group: "Gold", category: "Necklace", quantity: 4, weight: 18.0, value: 112410, time: "13:47" },
    { id: "in5", branch: "London Bond Street", group: "Silver", category: "Bracelet", quantity: 8, weight: 44.0, value: 3450, time: "15:02" },
  ],
};

export const todayOutward = {
  entries: [
    { id: "out1", branch: "Geneva Rue du Rhone", group: "Gold", category: "Bracelet", quantity: 2, weight: 8.4, value: 52458, time: "10:30" },
    { id: "out2", branch: "Trivandrum", group: "Silver", category: "Bangle", quantity: 5, weight: 55.0, value: 4312, time: "12:15" },
    { id: "out3", branch: "Paris Place Vendome", group: "Gold", category: "Ring", quantity: 3, weight: 11.4, value: 71193, time: "14:00" },
    { id: "out4", branch: "Mumbai Bandra Fort", group: "Silver", category: "Coin", quantity: 6, weight: 42.0, value: 3293, time: "16:40" },
  ],
};

// ---------------------------------------------------------------------------
// Item Groups = metal groupings (Gold / Silver).
// Categories = jewellery types (Ring, Chain, Bangle, etc).
// ---------------------------------------------------------------------------
export const itemGroups = [
  { id: "ig1", name: "Gold", code: "GLD" },
  { id: "ig2", name: "Silver", code: "SLV" },
];

export const categories = [
  { id: "c1", name: "Ring" },
  { id: "c2", name: "Bangle" },
  { id: "c3", name: "Chain" },
  { id: "c4", name: "Necklace" },
  { id: "c5", name: "Pendant" },
  { id: "c6", name: "Bracelet" },
  { id: "c7", name: "Earrings" },
  { id: "c8", name: "Coin" },
];

export const users = [
  { id: "u1", name: "Alessandra Moretti", email: "a.moretti@luxora.io", role: "Staff", branch: "Dubai Marina Atelier", status: "Active", lastLogin: "2026-07-16 08:42" },
  { id: "u2", name: "Henri Laurent", email: "h.laurent@luxora.io", role: "Staff", branch: "Geneva Rue du Rhone", status: "Active", lastLogin: "2026-07-16 07:15" },
  { id: "u3", name: "Olivia Pemberton", email: "o.pemberton@luxora.io", role: "Staff", branch: "London Bond Street", status: "Active", lastLogin: "2026-07-15 18:03" },
  { id: "u4", name: "Arjun Malhotra", email: "a.malhotra@luxora.io", role: "Staff", branch: "Mumbai Bandra Fort", status: "Active", lastLogin: "2026-07-16 06:28" },
  { id: "u5", name: "Camille Dubois", email: "c.dubois@luxora.io", role: "Staff", branch: "Paris Place Vendome", status: "Inactive", lastLogin: "2026-07-12 14:11" },
  { id: "u6", name: "Marcus Whitfield", email: "m.whitfield@luxora.io", role: "Admin", branch: "All Branches", status: "Active", lastLogin: "2026-07-16 09:01" },
  { id: "u7", name: "Sofia Chen", email: "s.chen@luxora.io", role: "Admin", branch: "All Branches", status: "Active", lastLogin: "2026-07-15 22:47" },
];

// Item-level records — still used by the Staff-side Items/Stock/Adjustments
// screens (operational stock counting), independent of the Admin Catalogue.
export const items = [
  { id: "i1", code: "LX-DMD-001", barcode: "8901234500011", name: "Eternity Diamond Ring", group: "Gold", category: "Ring", quantity: 1, weight: 4.82, purity: "18K", branch: "Dubai Marina Atelier", status: "In Stock", value: 30100 },
  { id: "i2", code: "LX-GLD-014", barcode: "8901234500028", name: "Royal Gold Chain", group: "Gold", category: "Chain", quantity: 2, weight: 22.4, purity: "22K", branch: "Mumbai Bandra Fort", status: "In Stock", value: 139940 },
  { id: "i3", code: "LX-PLT-022", barcode: "8901234500035", name: "Platinum Wedding Band", group: "Gold", category: "Ring", quantity: 1, weight: 6.1, purity: "PT950", branch: "London Bond Street", status: "Reserved", value: 24800 },
  { id: "i4", code: "LX-EMR-009", barcode: "8901234500042", name: "Emerald Drop Earrings", group: "Gold", category: "Earrings", quantity: 1, weight: 3.6, purity: "18K", branch: "Geneva Rue du Rhone", status: "In Stock", value: 18600 },
  { id: "i5", code: "LX-TNS-031", barcode: "8901234500059", name: "Diamond Tennis Bracelet", group: "Gold", category: "Bracelet", quantity: 1, weight: 8.9, purity: "18K", branch: "Singapore Marina Bay", status: "In Stock", value: 54200 },
  { id: "i6", code: "LX-PRL-007", barcode: "8901234500066", name: "Pearl Pendant Necklace", group: "Gold", category: "Pendant", quantity: 1, weight: 5.2, purity: "14K", branch: "Paris Place Vendome", status: "In Stock", value: 12800 },
  { id: "i7", code: "LX-KND-018", barcode: "8901234500073", name: "Heritage Kundan Set", group: "Gold", category: "Necklace", quantity: 1, weight: 34.8, purity: "22K", branch: "Mumbai Bandra Fort", status: "In Stock", value: 217400 },
  { id: "i8", code: "LX-BNG-004", barcode: "8901234500080", name: "Antique Silver Bangle", group: "Silver", category: "Bangle", quantity: 3, weight: 18.6, purity: "925", branch: "Dubai Marina Atelier", status: "Sold", value: 1459 },
];

export const formatCurrency = (n) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const formatWeight = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " g";
