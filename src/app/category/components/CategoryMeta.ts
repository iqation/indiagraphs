import {
  LineChart,
  BarChart2,
  CreditCard,
  Wallet,
  Database,
  BriefcaseBusiness,
  PiggyBank,
  Coins,
  Users
} from "lucide-react";

export interface CategoryMetaItem {
  title: string;
  description: string;
  icon: any;
  seoTitle?: string;        // ⭐ OPTIONAL
  seoDescription?: string;  // ⭐ OPTIONAL
}

export const CATEGORY_META: Record<string, CategoryMetaItem> = {
  economy: {
    title: "Economy & Macro",
    description: "GDP, inflation, fiscal deficit, repo rate, macro indicators.",
    icon: LineChart,
    seoTitle:
      "Economy & Macro Data of India - GDP, Inflation, Fiscal Indicators | Indiagraphs",
    seoDescription:
      "Explore India's macroeconomic data including GDP, CPI inflation, fiscal deficit, repo rate trends, and key economic indicators. Updated frequently from RBI & MOSPI."
  },

  banking: {
    title: "Banking & Credit",
    description: "NPAs, loan growth, deposits, credit cards.",
    icon: CreditCard
  },

  "digital-payments": {
    title: "Digital Payments",
    description: "UPI, wallets, net banking and digital transactions.",
    icon: Wallet,
    seoTitle:
      "Digital Payments in India - UPI, Wallets, Net Banking Data | Indiagraphs",
    seoDescription:
      "Track India's digital payments ecosystem including UPI transactions, mobile banking, wallets, and real-time digital commerce metrics."
  },

  commodities: {
    title: "Commodities",
    description: "Gold, silver, crude oil, agriculture commodity prices.",
    icon: Database,
    seoTitle:
      "India Commodities Data - Gold, Silver, Crude Oil, Agri Prices | Indiagraphs",
    seoDescription:
      "Analyze commodity prices including gold, silver, crude oil, agricultural indices, and market trends. Verified data from trusted Indian sources."
  },

  trade: {
    title: "Trade & Exports",
    description: "Imports, exports, trade balance, global trade indicators.",
    icon: BriefcaseBusiness,
    seoTitle:
      "India Trade Data - Imports, Exports, Trade Balance, HS-Code Stats | Indiagraphs",
    seoDescription:
      "Access India's international trade data including export volumes, import trends, trade deficit, and sector-wise performance using official government sources."
  },

  "small-savings": {
    title: "Small Savings",
    description:
      "Savings schemes, interest rates, deposits and collections.",
    icon: PiggyBank,
    seoTitle:
      "Small Savings Scheme Data - PPF, NSC, SCSS, Interest Rates | Indiagraphs",
    seoDescription:
      "Explore interest rates, deposits, maturity details, and long-term performance of PPF, NSC, Sukanya Samriddhi, and other small savings schemes."
  },

  forex: {
    title: "Foreign Exchange",
    description:
      "Currency exchange rates, forex reserves, USD/INR, RBI data.",
    icon: Coins,
    seoTitle:
      "India Forex Data - USD/INR, Forex Reserves, Currency Rates | Indiagraphs",
    seoDescription:
      "Track India's foreign exchange data: USD/INR trends, forex reserves, currency movements, and RBI reference rates updated regularly."
  },

  social: {
    title: "Social & Demographics",
    description: "Population, literacy, health indicators.",
    icon: Users,
    seoTitle:
      "Indian Social & Demographic Data – Population, Literacy, Health | Indiagraphs",
    seoDescription:
      "Explore India's demographic indicators including population trends, literacy rates, health metrics, and social development datasets."
  }
};