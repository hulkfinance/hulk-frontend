import { MenuEntry } from '@hulkfinance/hulk-uikit'

const config: MenuEntry[] = [
  {
    label: "Home",
    icon: "HomeIcon",
    href: "/",
  },
  {
    label: "Trade",
    icon: "TradeIcon",
    items: [
      {
        label: "Exchange",
        href: "https://dex.hulkfiinance.com",
      },
      {
        label: "Liquidity",
        href: "https://dex.hulkfiinance.com/#/pool",
      },
    ],
  },
  {
    label: "Pre-Sale",
    icon: "PreSaleIcon",
    href: "/pre-sale",
  },
  {
    label: "Farms",
    icon: "FarmIcon",
    href: "/farms",
  },
  {
    label: "Pools",
    icon: "PoolIcon",
    href: "/syrup",
  },
  {
    label: "Referrals",
    icon: "ReferralIcon",
    href: "/referral",
  },
  {
    label: "Audits",
    icon: "AuditIcon",
    href: "/audits",
  },
  {
    label: "Listings",
    icon: "ListingIcon",
    items: [
      {
        label: "BscScan",
        href: "/",
      },
      {
        label: "DappRadar",
        href: "/",
      },
      {
        label: "CoinGecko",
        href: "/",
      },
      {
        label: "CoinMarketCap",
        href: "/",
      },
      {
        label: "LiveCoinWatch",
        href: "/",
      },
      {
        label: "Vfat",
        href: "/",
      },
    ],
  },
  {
    label: "More",
    icon: "MoreIcon",
    items: [
      {
        label: "Voting",
        href: "https://voting.hulkfiinance.com",
      },
      {
        label: "Github",
        href: "https://github.com/hulkfiinance",
      },
      {
        label: "Docs",
        href: "https://docs.hulkfiinance.com",
      },
      {
        label: "Blog",
        href: "https://hulkfiinance.medium.com",
      },
    ],
  },
]

export default config
