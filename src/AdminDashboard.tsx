import { useState, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const STATS = [
  { label: "Total Users", value: "12,842", change: "+12.5%", trend: "up", icon: <Users className="w-5 h-5" /> },
  { label: "Active Loans", value: "842", change: "+5.2%", trend: "up", icon: <FileText className="w-5 h-5" /> },
  { label: "Total Disbursed", value: "₦458.2M", change: "+8.1%", trend: "up", icon: <DollarSign className="w-5 h-5" /> },
  { label: "Default Rate", value: "2.4%", change: "-0.5%", trend: "down", icon: <AlertCircle className="w-5 h-5" /> },
];

const RECENT_LOANS = [
  { id: "#PC-9021", user: "Tosin Akindele", amount: "₦1,200,000", date: "2 mins ago", status: "Approved", car: "Toyota Camry 2022" },
  { id: "#PC-9022", user: "Chioma Okereke", amount: "₦4,500,000", date: "15 mins ago", status: "Pending", car: "Mercedes G63" },
  { id: "#PC-9023", user: "Musa Ibrahim", amount: "₦850,000", date: "1 hour ago", status: "Disbursed", car: "Lexus ES350" },
  { id: "#PC-9024", user: "Faith Adebayo", amount: "₦2,100,000", date: "3 hours ago", status: "Rejected", car: "Honda Accord 2018" },
  { id: "#PC-9025", user: "John Doe", amount: "₦500,000", date: "5 hours ago", status: "Approved", car: "Toyota Corolla 2015" },
];

// --- Components ---

const SidebarItem = ({ icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
        : "text-muted-foreground hover:bg-white/5 hover:text-white"
    )}
  >
    <div className={cn("transition-transform duration-300 group-hover:scale-110", active ? "text-primary-foreground" : "text-primary")}>
      {icon}
    </div>
    <span className="font-semibold text-sm tracking-wide">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-pill"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground"
      />
    )}
  </button>
);

const StatCard = ({ label, value, change, trend, icon }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-card/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
        trend === "up" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
      )}>
        {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <div>
      <h3 className="text-muted-foreground text-sm font-medium mb-1">{label}</h3>
      <div className="text-2xl font-black text-white">{value}</div>
    </div>
  </motion.div>
);

const Header = () => (
  <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-background/50 backdrop-blur-md sticky top-0 z-30">
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl w-96 group focus-within:ring-2 focus-within:ring-primary transition-all">
      <Search className="w-4 h-4 text-muted-foreground" />
      <input 
        type="text" 
        placeholder="Search users, loans, or transactions..." 
        className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-muted-foreground"
      />
    </div>

    <div className="flex items-center gap-6">
      <button className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
        <Bell className="w-5 h-5 text-muted-foreground" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
      </button>
      
      <div className="h-8 w-[1px] bg-white/10" />
      
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-bold text-white leading-none mb-1">Admin User</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Super Admin</div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
          <img src="https://i.pravatar.cc/150?u=admin" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </header>
);

const SectionTitle = ({ title, subtitle, action }: { title: string, subtitle: string, action?: any }) => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
    </div>
    {action}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    Approved: "bg-green-500/10 text-green-400 border-green-500/20",
    Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Disbursed: "bg-primary/10 text-primary border-primary/20",
    Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", styles[status])}>
      {status}
    </span>
  );
};

export const AdminDashboard: FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col fixed h-screen bg-[#020617] z-50">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-all">
              <img src="/logo.png" alt="PettyCash" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight">Petty<span className="text-primary">Cash</span></span>
              <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Admin Portal</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeTab === "Dashboard"} 
            onClick={() => setActiveTab("Dashboard")} 
          />
          <SidebarItem 
            icon={<Users className="w-5 h-5" />} 
            label="Manage Users" 
            active={activeTab === "Users"} 
            onClick={() => setActiveTab("Users")} 
          />
          <SidebarItem 
            icon={<FileText className="w-5 h-5" />} 
            label="Loan Applications" 
            active={activeTab === "Loans"} 
            onClick={() => setActiveTab("Loans")} 
          />
          <SidebarItem 
            icon={<TrendingUp className="w-5 h-5" />} 
            label="Financial Reports" 
            active={activeTab === "Reports"} 
            onClick={() => setActiveTab("Reports")} 
          />
          <SidebarItem 
            icon={<ShieldCheck className="w-5 h-5" />} 
            label="Operations" 
            active={activeTab === "Operations"} 
            onClick={() => setActiveTab("Operations")} 
          />
          <div className="pt-8 pb-4">
             <div className="h-[1px] bg-white/5 w-full mx-auto" />
          </div>
          <SidebarItem 
            icon={<Settings className="w-5 h-5" />} 
            label="Platform Settings" 
            active={activeTab === "Settings"} 
            onClick={() => setActiveTab("Settings")} 
          />
          <div className="pt-4">
             <button 
               onClick={onBack}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-blue-400 hover:bg-blue-500/5 group"
             >
                <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold text-sm">Back to Website</span>
             </button>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-500/5 group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <Header />

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "Dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <SectionTitle 
                  title="Portfolio Overview" 
                  subtitle="Real-time performance metrics of your lending platform."
                  action={
                    <div className="flex items-center gap-3">
                       <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 grayscale transition-all">
                         <Download className="w-4 h-4" /> Export
                       </button>
                       <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">
                         <Plus className="w-4 h-4" /> New Loan
                       </button>
                    </div>
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {STATS.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Recent Applications */}
                  <div className="lg:col-span-2 bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                       <h3 className="text-lg font-bold">Recent Loan Applications</h3>
                       <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                          View All <ChevronRight className="w-3 h-3" />
                       </button>
                    </div>
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-b border-white/5">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Applicant</th>
                            <th className="px-6 py-4">Car Model</th>
                            <th className="px-6 py-4">Loan Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {RECENT_LOANS.map((loan, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                              <td className="px-6 py-4 text-xs font-mono font-bold text-muted-foreground">{loan.id}</td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-bold">{loan.user}</div>
                                <div className="text-[10px] text-muted-foreground">{loan.date}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-300 font-medium">{loan.car}</td>
                              <td className="px-6 py-4 text-sm font-black">{loan.amount}</td>
                              <td className="px-6 py-4">
                                <StatusBadge status={loan.status} />
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
                                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Analytics Summary */}
                  <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold mb-6">Volume Distribution</h3>
                    <div className="space-y-8">
                       <div className="relative">
                          <div className="flex justify-between text-sm mb-2 font-bold">
                             <span className="text-slate-400">Personal Loans</span>
                             <span>65%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="h-full bg-primary" />
                          </div>
                       </div>
                       <div className="relative">
                          <div className="flex justify-between text-sm mb-2 font-bold">
                             <span className="text-slate-400">Dealer Financing</span>
                             <span>25%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: "25%" }} className="h-full bg-blue-500" />
                          </div>
                       </div>
                       <div className="relative">
                          <div className="flex justify-between text-sm mb-2 font-bold">
                             <span className="text-slate-400">Business Expansion</span>
                             <span>10%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: "10%" }} className="h-full bg-purple-500" />
                          </div>
                       </div>

                       <div className="pt-8 border-t border-white/5">
                          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                             <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold text-primary">System Health</span>
                             </div>
                             <p className="text-xs text-muted-foreground leading-relaxed">
                                All automated valuation models are running at 99.8% precision with no latency issues detected.
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SectionTitle 
                  title="User Management" 
                  subtitle="Manage and view all registered car owners and dealers." 
                  action={
                    <div className="flex items-center gap-2">
                       <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold">
                          <Filter className="w-4 h-4" /> Filters
                       </button>
                    </div>
                  }
                />
                
                <div className="bg-card/40 border border-white/5 rounded-3xl p-12 text-center">
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-primary" />
                   </div>
                   <h3 className="text-xl font-bold mb-2">Detailed User List</h3>
                   <p className="text-muted-foreground max-w-sm mx-auto mb-8">This module allows you to see activity, document verification status, and credit scoring for all users.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="p-6 bg-white/5 rounded-2xl text-left border border-white/10">
                           <div className="flex items-center gap-4 mb-4">
                              <img src={`https://i.pravatar.cc/150?u=${i+20}`} className="w-12 h-12 rounded-xl" />
                              <div>
                                 <div className="font-bold">Member #{i+100}</div>
                                 <div className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</div>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <div className="text-[10px] text-muted-foreground uppercase opacity-50">Last Login</div>
                              <div className="text-xs font-medium">Today at 10:45 AM</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl"
              >
                <SectionTitle title="Platform Settings" subtitle="Configure system parameters, interest rates, and loan limits." />
                
                <div className="space-y-6">
                   <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl p-8">
                      <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                         <DollarSign className="w-5 h-5 text-primary" /> Financial Controls
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Base Interest Rate (%)</label>
                            <input type="text" defaultValue="3.5" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Max Loan Duration (Months)</label>
                            <input type="text" defaultValue="24" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Min. Car Value (₦)</label>
                            <input type="text" defaultValue="1,500,000" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Loan-to-Value Ratio (%)</label>
                            <input type="text" defaultValue="70" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                         </div>
                      </div>
                      
                      <button className="mt-10 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/10">
                         Save Changes
                      </button>
                   </div>

                   <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl p-8">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-primary" /> Risk Management
                      </h3>
                      <p className="text-sm text-muted-foreground mb-8">Adjust the sensitivity of the automated risk scoring system.</p>
                      
                      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl mb-4">
                         <div>
                            <div className="font-bold">Automated Approvals</div>
                            <div className="text-[10px] text-muted-foreground">Approve low-risk loans instantly without human review</div>
                         </div>
                         <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full" />
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
