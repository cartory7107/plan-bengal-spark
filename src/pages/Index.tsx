import { useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Coins,
  Gift,
  Globe2,
  Lock,
  Menu,
  MessageCircle,
  Moon,
  PlayCircle,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Trophy,
  UploadCloud,
  Users,
  WalletCards,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const navItems = [
  "Home",
  "Products",
  "Courses",
  "News & Updates",
  "Challenges",
  "Leaderboard",
  "Rewards",
  "Help Center",
  "Become a Reseller",
  "Dashboard",
];

const products = [
  {
    name: "Cartory Smartwatch Pro",
    slug: "cartory-smartwatch-pro",
    category: "Gadgets",
    base: 2450,
    sell: 3290,
    stock: "In stock",
    featured: true,
    sticker: { mark: "WATCH", title: "Smart Pro", glow: "from-sky-400 via-blue-500 to-cyan-300", halo: "bg-sky-400/35" },
    tags: ["SEO title", "Meta tags", "Gallery", "Video"],
  },
  {
    name: "AeroPods Noise Cancel",
    slug: "aeropods-noise-cancel",
    category: "Audio",
    base: 1550,
    sell: 2250,
    stock: "Low stock",
    featured: true,
    sticker: { mark: "AUDIO", title: "AeroPods", glow: "from-violet-400 via-sky-500 to-blue-500", halo: "bg-blue-500/30" },
    tags: ["Published", "Cloudinary", "Gallery", "Meta"],
  },
  {
    name: "HomeGlow LED Kit",
    slug: "homeglow-led-kit",
    category: "Home Decor",
    base: 690,
    sell: 1090,
    stock: "In stock",
    featured: false,
    sticker: { mark: "GLOW", title: "LED Kit", glow: "from-cyan-300 via-sky-500 to-fuchsia-400", halo: "bg-cyan-400/30" },
    tags: ["Unpublish ready", "Variant", "Video", "SEO"],
  },
];

type IconFeature = [LucideIcon, string, string];
type AdminMetric = [string, string, LucideIcon];

const orders = [
  { id: "CT-2048", customer: "Nusrat Jahan", city: "Dhaka", status: "Confirmed", amount: 3290 },
  { id: "CT-2049", customer: "Mahfuz Rahman", city: "Chattogram", status: "Processing", amount: 2250 },
  { id: "CT-2050", customer: "Sadia Akter", city: "Sylhet", status: "Shipped", amount: 1090 },
  { id: "CT-2051", customer: "Rafi Hasan", city: "Rajshahi", status: "Pending", amount: 3290 },
];

const courses = [
  "Dropshipping Mastery Bangladesh",
  "Facebook Ads for E-commerce",
  "Winning Product Research",
  "Customer Conversion Secrets",
];

const leaderboard = [
  { rank: 1, name: "Ayesha Commerce", orders: 742, monthly: 126, revenue: "৳18.4L", badge: "🥇 Gold Seller" },
  { rank: 2, name: "Rafiq Dropship", orders: 618, monthly: 104, revenue: "৳14.9L", badge: "🥈 Silver Seller" },
  { rank: 3, name: "Nadia Mart", orders: 503, monthly: 86, revenue: "৳12.7L", badge: "🥉 Bronze Seller" },
  { rank: 4, name: "Cartory Dhaka Pro", orders: 449, monthly: 73, revenue: "৳10.2L", badge: "Top 10" },
  { rank: 5, name: "Sylhet Seller Hub", orders: 392, monthly: 61, revenue: "৳8.6L", badge: "Top 10" },
];

const rewards = [
  { orders: 50, prize: "Gift Voucher", progress: 100, icon: Gift },
  { orders: 100, prize: "Smart Watch", progress: 82, icon: Trophy },
  { orders: 250, prize: "Smartphone", progress: 44, icon: Star },
  { orders: 500, prize: "Laptop", progress: 21, icon: Rocket },
  { orders: 1000, prize: "International Trip", progress: 9, icon: Globe2 },
];

const chartData = [
  { month: "Jan", revenue: 2.4, orders: 180, growth: 12 },
  { month: "Feb", revenue: 3.2, orders: 240, growth: 18 },
  { month: "Mar", revenue: 4.8, orders: 360, growth: 24 },
  { month: "Apr", revenue: 6.4, orders: 470, growth: 34 },
  { month: "May", revenue: 8.9, orders: 640, growth: 48 },
  { month: "Jun", revenue: 11.6, orders: 830, growth: 63 },
];

const faqs = [
  ["Can resellers sell below base price?", "No. Cartory automatically blocks checkout below the minimum base price to protect supplier margins."],
  ["How is profit calculated?", "Profit equals selling price minus base price, plus a 3% successful-order commission shown in every reseller dashboard."],
  ["When do I get reseller access?", "After submitting your NID, passport, or government ID, admins approve, reject, or request more information."],
  ["Is this deployment ready?", "The blueprint is structured for Vercel, Railway, Supabase, PostgreSQL, Prisma, Cloudinary, NextAuth, JWT, and RBAC."],
];

function formatTk(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

const SectionHeader = ({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) => (
  <div className="mx-auto mb-10 max-w-3xl text-center">
    <Badge className="mb-4 rounded-full bg-sky-100 px-4 py-1.5 text-sky-700 hover:bg-sky-100 dark:bg-sky-400/10 dark:text-sky-200">
      {eyebrow}
    </Badge>
    <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl dark:text-white">{title}</h2>
    <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">{description}</p>
  </div>
);

const GlassCard = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,.45)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70", className)}>
    {children}
  </div>
);

const ProductSticker = ({ mark, title, glow, halo }: { mark: string; title: string; glow: string; halo: string }) => (
  <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-[1.75rem] bg-transparent">
    <div className={cn("absolute h-36 w-36 rounded-full blur-3xl", halo)} />
    <div className="absolute inset-x-8 top-8 h-16 rounded-full bg-white/45 blur-2xl dark:bg-white/10" />
    <div className="relative rotate-[-4deg] text-center drop-shadow-[0_18px_35px_rgba(14,165,233,0.35)]">
      <div className={cn("bg-gradient-to-r bg-clip-text text-5xl font-black uppercase tracking-[-0.08em] text-transparent md:text-6xl", glow)}>
        {mark}
      </div>
      <div className="mx-auto mt-2 w-fit rounded-full bg-white/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.28em] text-slate-700 shadow-lg shadow-sky-500/10 backdrop-blur dark:bg-slate-950/70 dark:text-sky-100">
        {title}
      </div>
    </div>
  </div>
);

const Index = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sellingPrice, setSellingPrice] = useState(3290);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const basePrice = 2450;
  const profit = Math.max(sellingPrice - basePrice, 0);
  const commission = Math.round(sellingPrice * 0.03);
  const totalProfit = profit + commission;

  const adminCards = useMemo<AdminMetric[]>(
    () => [
      ["Total Sales", "৳42.8L", Coins],
      ["Total Orders", "12,840", ShoppingBag],
      ["Pending Orders", "187", ClipboardCheck],
      ["Total Resellers", "3,420", Users],
      ["Verification Requests", "96", BadgeCheck],
      ["Revenue", "৳8.9L", WalletCards],
      ["Active Challenges", "14", Trophy],
      ["Courses", "28", BookOpen],
    ],
    [],
  );

  return (
    <div className={cn("min-h-screen overflow-hidden bg-slate-50 text-slate-950 transition-colors dark:bg-[#020817] dark:text-white", darkMode && "dark")}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/20" />
        <div className="absolute right-[-8rem] top-1/3 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-cyan-300/30 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-500 text-white shadow-lg shadow-sky-500/30">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">Cartory</p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">Reseller Hub</p>
            </div>
          </a>
          <div className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`} className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-white/10">
                {item}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5">
              <Sun className="h-4 w-4 text-amber-500" />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Toggle dark mode" />
              <Moon className="h-4 w-4 text-sky-500" />
            </div>
            <Button variant="ghost" className="rounded-full">Login/Register</Button>
            <Button className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30">Become a Reseller</Button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-2xl border border-slate-200 p-2 xl:hidden dark:border-white/10">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </nav>
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white/95 px-4 py-4 xl:hidden dark:border-white/10 dark:bg-slate-950/95">
            <div className="grid gap-2 sm:grid-cols-2">
              {navItems.map((item) => <a key={item} className="rounded-xl px-3 py-2 font-semibold hover:bg-sky-50 dark:hover:bg-white/10" href={`#${item.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}>{item}</a>)}
              <Button className="mt-2 rounded-full bg-sky-500 sm:col-span-2">Login/Register</Button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative mx-auto grid min-h-[86vh] max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.02fr_.98fr] lg:px-6">
          <div className="space-y-8">
            <Badge className="rounded-full bg-white px-4 py-2 text-sky-700 shadow-sm hover:bg-white dark:bg-white/10 dark:text-sky-200">
              <Sparkles className="mr-2 h-4 w-4" /> Premium Bangladesh reseller SaaS
            </Badge>
            <div className="space-y-5">
              <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">
                Scale your <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-400 bg-clip-text text-transparent">Cartory</span> dropshipping business.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl dark:text-slate-300">
                A mobile-first operating system for verified resellers: product catalog, protected pricing, order tracking, commissions, courses, challenges, rewards, and admin governance.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-14 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-8 text-base shadow-xl shadow-sky-500/25">
                Register as a Dropshipper <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 rounded-full border-slate-300 bg-white/70 px-8 text-base dark:border-white/10 dark:bg-white/5">
                Explore Products
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-xl">
              {["3,420+ Resellers", "12.8k Orders", "৳42.8L Sales"].map((stat) => (
                <div key={stat} className="rounded-2xl border border-white/60 bg-white/70 p-4 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm font-black md:text-lg">{stat.split(" ")[0]}</p>
                  <p className="text-[11px] font-semibold text-slate-500 md:text-xs dark:text-slate-400">{stat.substring(stat.indexOf(" ") + 1)}</p>
                </div>
              ))}
            </div>
          </div>

          <GlassCard className="relative p-4 md:p-6">
            <div className="absolute -right-5 -top-5 rounded-3xl bg-slate-950 px-4 py-3 text-white shadow-2xl dark:bg-white dark:text-slate-950">
              <p className="text-xs text-slate-300 dark:text-slate-500">Live Profit</p>
              <p className="text-xl font-black">{formatTk(totalProfit)}</p>
            </div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-500">Reseller Dashboard</p>
                <h3 className="text-2xl font-black">Today&apos;s command center</h3>
              </div>
              <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Approved</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[['Total Profit', '৳92,450'], ['Total Orders', '486'], ['Monthly Profit', '৳18,760'], ['Lifetime Profit', '৳4.8L']].map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl dark:bg-white/10">
                  <p className="text-sm text-slate-300">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black">Protected selling price</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Base price: {formatTk(basePrice)} • Additional commission: 3%</p>
                </div>
                <Badge variant={sellingPrice < basePrice ? "destructive" : "secondary"} className="rounded-full">
                  {sellingPrice < basePrice ? "Blocked" : "Ready"}
                </Badge>
              </div>
              <Input type="number" min={basePrice} value={sellingPrice} onChange={(event) => setSellingPrice(Number(event.target.value))} className="mt-4 h-12 rounded-2xl text-lg font-bold" />
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-2xl bg-sky-50 p-3 dark:bg-sky-500/10"><p className="text-slate-500">Profit</p><b>{formatTk(profit)}</b></div>
                <div className="rounded-2xl bg-cyan-50 p-3 dark:bg-cyan-500/10"><p className="text-slate-500">3% Bonus</p><b>{formatTk(commission)}</b></div>
                <div className="rounded-2xl bg-blue-50 p-3 dark:bg-blue-500/10"><p className="text-slate-500">Total</p><b>{formatTk(totalProfit)}</b></div>
              </div>
            </div>
          </GlassCard>
        </section>

        <section id="become-a-reseller" className="px-4 py-16 lg:px-6">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {([
              [UploadCloud, "Submit verification", "Full name, email, phone, country, and NID. International applicants can upload passport or government ID."],
              [ShieldCheck, "Admin approval flow", "Requests move through Pending Verification, Approve, Reject, or Request More Information."],
              [Lock, "Secure access", "Only approved users unlock reseller tools with JWT auth, RBAC, rate limiting, validation, CSRF, and XSS protection."],
            ] satisfies IconFeature[]).map(([Icon, title, text]) => (
              <GlassCard key={String(title)} className="p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300"><Icon className="h-6 w-6" /></div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section id="products" className="px-4 py-16 lg:px-6">
          <SectionHeader eyebrow="Product Management" title="Publish, price, and promote winning products" description="Admins control every catalog field while resellers see base cost, stock, media, SEO details, and protected selling controls." />
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
            {products.map((product) => (
              <GlassCard key={product.slug} className="overflow-hidden p-3">
                <ProductSticker {...product.sticker} />
                <div className="p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{product.category}</Badge>
                    {product.featured && <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100">Featured</Badge>}
                  </div>
                  <h3 className="text-xl font-black">{product.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">/{product.slug} • {product.stock}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/5"><p className="text-xs text-slate-500">Base Cost</p><b>{formatTk(product.base)}</b></div>
                    <div className="rounded-2xl bg-sky-50 p-3 dark:bg-sky-500/10"><p className="text-xs text-slate-500">Selling</p><b>{formatTk(product.sell)}</b></div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">{product.tags.map((tag) => <Badge key={tag} variant="outline" className="rounded-full">{tag}</Badge>)}</div>
                  <div className="mt-5 flex gap-2">
                    <Button className="flex-1 rounded-full bg-slate-950 dark:bg-white dark:text-slate-950">Edit</Button>
                    <Button variant="outline" className="flex-1 rounded-full">Publish</Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section id="dashboard" className="px-4 py-16 lg:px-6">
          <SectionHeader eyebrow="Admin Dashboard" title="A production-ready control room" description="Analytics cards, beautiful charts, recent activity, real-time notifications, verification queue, order statuses, and content systems in one responsive workspace." />
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {adminCards.map(([label, value, Icon]) => (
                <GlassCard key={String(label)} className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                    <Icon className="h-5 w-5 text-sky-500" />
                  </div>
                  <p className="mt-3 text-3xl font-black">{value}</p>
                </GlassCard>
              ))}
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
              <GlassCard>
                <div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">Revenue Analytics</h3><Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">+48%</Badge></div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs><linearGradient id="rev" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.45}/><stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b830" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" fill="url(#rev)" strokeWidth={3} />
                      <Area type="monotone" dataKey="growth" stroke="#06B6D4" fill="transparent" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">Orders Analytics</h3><Bell className="h-5 w-5 text-sky-500" /></div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#94a3b830" /><XAxis dataKey="month" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip /><Bar dataKey="orders" fill="#2563EB" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        <section id="orders" className="px-4 py-16 lg:px-6">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.8fr_1.2fr]">
            <GlassCard>
              <Badge className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100">Checkout</Badge>
              <h2 className="mt-4 text-3xl font-black">Customer checkout built for Bangladesh</h2>
              <div className="mt-5 grid gap-3">
                <Input placeholder="Customer name" className="rounded-2xl" />
                <Input placeholder="Phone" className="rounded-2xl" />
                <Input placeholder="City" className="rounded-2xl" />
                <Input placeholder="Area" className="rounded-2xl" />
                <Textarea placeholder="Address and notes" className="rounded-2xl" />
              </div>
            </GlassCard>
            <GlassCard>
              <div className="mb-5 flex items-center justify-between"><h3 className="text-2xl font-black">Order Management</h3><Badge className="rounded-full">Pending → Delivered</Badge></div>
              <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10">
                {orders.map((order) => (
                  <div key={order.id} className="grid grid-cols-2 gap-3 border-b border-slate-200 bg-white/60 p-4 last:border-0 md:grid-cols-5 dark:border-white/10 dark:bg-white/5">
                    <b>{order.id}</b><span>{order.customer}</span><span>{order.city}</span><Badge className="w-fit rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{order.status}</Badge><b>{formatTk(order.amount)}</b>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        <section id="courses" className="px-4 py-16 lg:px-6">
          <SectionHeader eyebrow="Courses Preview" title="Teach every reseller to win" description="Admin-managed lessons support thumbnails, instructors, SEO data, embedded videos, external course URLs, and categories." />
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            {courses.map((course, index) => (
              <GlassCard key={course} className="p-5">
                <div className="mb-5 flex h-40 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-100 to-blue-100 text-sky-600 dark:from-sky-500/10 dark:to-blue-500/10"><PlayCircle className="h-12 w-12" /></div>
                <Badge variant="outline" className="rounded-full">Course {index + 1}</Badge>
                <h3 className="mt-3 text-xl font-black">{course}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Embedded video, external link, instructor profile, slug, thumbnail, and conversion-focused curriculum.</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section id="leaderboard" className="px-4 py-16 lg:px-6">
          <SectionHeader eyebrow="Leaderboard Preview" title="Live performance rankings" description="Rank the top 10 by total orders, monthly orders, and revenue generated with Gold, Silver, and Bronze seller badges." />
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70">
            {leaderboard.map((seller) => (
              <div key={seller.rank} className="grid grid-cols-2 items-center gap-4 border-b border-slate-200 p-5 last:border-0 md:grid-cols-5 dark:border-white/10">
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 font-black text-white dark:bg-white dark:text-slate-950">{seller.rank}</span><b>{seller.name}</b></div>
                <span>{seller.orders} orders</span><span>{seller.monthly} monthly</span><span className="font-black text-sky-600">{seller.revenue}</span><Badge className="w-fit rounded-full">{seller.badge}</Badge>
              </div>
            ))}
          </div>
        </section>

        <section id="challenges" className="px-4 py-16 lg:px-6">
          <SectionHeader eyebrow="Challenges & Rewards" title="Gamified growth that motivates sellers" description="Admins create 50, 100, and 500 order challenges; rewards are displayed automatically with progress bars and unlock notifications." />
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-5" id="rewards">
            {rewards.map(({ orders: orderGoal, prize, progress, icon: Icon }) => (
              <GlassCard key={prize} className="p-5">
                <Icon className="mb-4 h-8 w-8 text-sky-500" />
                <h3 className="text-xl font-black">{orderGoal} Orders</h3>
                <p className="mt-1 text-slate-500 dark:text-slate-400">{prize}</p>
                <Progress value={progress} className="mt-5 h-3" />
                <p className="mt-2 text-sm font-semibold text-slate-500">{progress}% complete</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section id="news-and-updates" className="px-4 py-16 lg:px-6">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            <GlassCard className="lg:col-span-1"><Badge className="rounded-full">News & Updates</Badge><h2 className="mt-4 text-3xl font-black">Latest operational notices for resellers</h2><p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">Admins can create news posts with title, slug, description, thumbnail, SEO metadata, and publish date.</p></GlassCard>
            {["New Dhaka same-day delivery zones", "May challenge winners announced"].map((title) => <GlassCard key={title}><p className="text-sm font-semibold text-sky-500">Published May 30, 2026</p><h3 className="mt-3 text-2xl font-black">{title}</h3><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Thumbnail-ready update cards keep every approved reseller aligned with product, fulfillment, and campaign changes.</p></GlassCard>)}
          </div>
        </section>

        <section id="help-center" className="px-4 py-16 lg:px-6">
          <SectionHeader eyebrow="Help Center" title="Guided support across every step" description="Knowledge base, tutorials, common questions, WhatsApp escalation, and an AI assistant available site-wide." />
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {([
              [Search, "Knowledge Base", "Search policies, pricing rules, return flows, Cloudinary uploads, and fulfillment SOPs."],
              [BookOpen, "Tutorials", "Step-by-step videos on ads, product research, customer conversion, and dashboard usage."],
              [MessageCircle, "Contact Cartory Support", "WhatsApp redirection connects resellers to human support when AI guidance is not enough."],
            ] satisfies IconFeature[]).map(([Icon, title, text]) => <GlassCard key={title}><Icon className="mb-5 h-8 w-8 text-sky-500" /><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p><Button className="mt-5 rounded-full" variant="outline">Open</Button></GlassCard>)}
          </div>
        </section>

        <section className="px-4 py-16 lg:px-6">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            <GlassCard>
              <Badge className="rounded-full bg-cyan-100 text-cyan-700 hover:bg-cyan-100">Security & Stack</Badge>
              <h2 className="mt-4 text-3xl font-black">Scalable architecture blueprint</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["Next.js 15", "TypeScript", "Tailwind CSS", "ShadCN UI", "Framer Motion", "Express.js", "PostgreSQL", "Prisma", "Cloudinary", "NextAuth", "Vercel", "Railway", "Supabase"].map((item) => <div key={item} className="flex items-center gap-2 rounded-2xl bg-white p-3 font-semibold shadow-sm dark:bg-white/5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{item}</div>)}
              </div>
            </GlassCard>
            <GlassCard>
              <Badge className="rounded-full bg-slate-950 text-white hover:bg-slate-950">Testimonials</Badge>
              <h2 className="mt-4 text-3xl font-black">Trusted by Bangladesh sellers</h2>
              {[
                ["Cartory made my pricing mistake-proof and my monthly profit visible from day one.", "Tasnim, Dhaka"],
                ["The challenges and leaderboard keep our seller team motivated every week.", "Imran, Chattogram"],
              ].map(([quote, name]) => <div key={name} className="mt-5 rounded-3xl bg-slate-100 p-5 dark:bg-white/5"><p className="text-lg font-semibold">“{quote}”</p><p className="mt-3 text-sm text-slate-500">— {name}</p></div>)}
            </GlassCard>
          </div>
        </section>

        <section className="px-4 py-16 lg:px-6">
          <SectionHeader eyebrow="FAQ" title="Common reseller questions" description="Short answers to the rules resellers ask about most often." />
          <div className="mx-auto max-w-4xl space-y-3">
            {faqs.map(([question, answer]) => <details key={question} className="group rounded-3xl border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"><summary className="flex cursor-pointer list-none items-center justify-between text-lg font-black">{question}<ChevronDown className="transition group-open:rotate-180" /></summary><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{answer}</p></details>)}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/60 px-4 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <div><p className="text-xl font-black">Cartory Reseller Hub</p><p className="text-slate-500">Premium reseller ecosystem for Bangladesh.</p></div>
          <div className="flex gap-2"><Badge variant="outline" className="rounded-full">Fast Loading</Badge><Badge variant="outline" className="rounded-full">Mobile First</Badge><Badge variant="outline" className="rounded-full">Production Ready</Badge></div>
        </div>
      </footer>

      <button onClick={() => setAssistantOpen(!assistantOpen)} className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-2xl shadow-sky-500/40 transition hover:scale-105" aria-label="Open AI Assistant">
        {assistantOpen ? <X /> : <Bot />}
      </button>
      {assistantOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(92vw,380px)] rounded-[2rem] border border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95">
          <div className="mb-4 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600"><Bot /></div><div><p className="font-black">Cartory AI Assistant</p><p className="text-xs text-slate-500">Ask about orders, products, commissions, or verification.</p></div></div>
          <div className="space-y-3 rounded-3xl bg-slate-100 p-4 text-sm dark:bg-white/5"><p><b>Try:</b> “How do I calculate my profit?”</p><p className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-900">Profit = selling price − base price + 3% commission after a successful delivered order.</p></div>
          <div className="mt-4 flex gap-2"><Input placeholder="Ask Cartory AI..." className="rounded-full" /><Button className="rounded-full bg-sky-500"><Zap className="h-4 w-4" /></Button></div>
        </div>
      )}
    </div>
  );
};

export default Index;
