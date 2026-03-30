import { useState, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  CreditCard, 
  Car, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight, 
  LogOut, 
  Plus, 
  Download, 
  ArrowUpRight, 
  PieChart as PieChartIcon, 
  History,
  DollarSign,
  Zap,
  Info
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const USER_DATA = {
  name: "Tosin Akindele",
  id: "#PC-67902",
  creditScore: 785,
  nextPayment: {
    amount: "₦125,000",
    date: "April 15, 2026",
    daysLeft: 12
  },
  loan: {
    total: "₦1,500,000",
    paid: "₦750,000",
    remaining: "₦750,000",
    tenure: "12 Months",
    monthsRemaining: 6,
    interestRate: "3.5%",
    progress: 50
  },
  car: {
    make: "Mercedes-Benz",
    model: "G63 AMG",
    year: "2022",
    plate: "LND-456-AA",
    value: "₦45,000,000",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=1000"
  },
  history: [
    { id: "P-450", date: "March 15, 2026", amount: "₦125,000", method: "Direct Debit", status: "Successful" },
    { id: "P-449", date: "Feb 15, 2026", amount: "₦125,000", method: "Direct Debit", status: "Successful" },
    { id: "P-448", date: "Jan 15, 2026", amount: "₦125,000", method: "Manual Transfer", status: "Successful" },
  ]
};

interface UserPortalProps {
  onLogout: () => void;
}

const NavButton = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
        : "text-muted-foreground hover:bg-white/5 hover:text-white"
    )}
  >
    <div className={cn("transition-transform group-hover:scale-110", active ? "text-primary-foreground" : "text-primary")}>
      {icon}
    </div>
    <span className="font-bold text-sm">{label}</span>
  </button>
);

const StatBox = ({ label, value, sub, icon, color = "primary" }: any) => (
  <div className="bg-card/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
    <div className={cn("absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity", `text-${color}`)}>
       {icon}
    </div>
    <div className="flex items-center gap-4 mb-4">
       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", `bg-${color}/10 border-${color}/20 text-${color}`)}>
          {icon}
       </div>
       <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</div>
    </div>
    <div className="text-2xl font-black text-white mb-1">{value}</div>
    <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
       {sub}
    </div>
  </div>
);

export const UserPortal: FC<UserPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col fixed h-screen z-50 bg-[#020617]">
        <div className="p-8">
           <div className="flex items-center gap-3 mb-10">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              <span className="font-black text-xl tracking-tight text-white">Petty<span className="text-primary italic">Cash</span></span>
           </div>
           
           <div className="space-y-2">
              <NavButton 
                icon={<Home className="w-5 h-5" />} 
                label="Overview" 
                active={activeTab === "Dashboard"} 
                onClick={() => setActiveTab("Dashboard")} 
              />
              <NavButton 
                icon={<CreditCard className="w-5 h-5" />} 
                label="My Loan" 
                active={activeTab === "Loan"} 
                onClick={() => setActiveTab("Loan")} 
              />
              <NavButton 
                icon={<Car className="w-5 h-5" />} 
                label="Car & Valuation" 
                active={activeTab === "Car"} 
                onClick={() => setActiveTab("Car")} 
              />
              <NavButton 
                icon={<History className="w-5 h-5" />} 
                label="Payments" 
                active={activeTab === "Payments"} 
                onClick={() => setActiveTab("Payments")} 
              />
              <div className="pt-6 pb-2 px-4 uppercase text-[10px] font-black text-muted-foreground tracking-widest opacity-50">Support</div>
              <NavButton 
                icon={<Info className="w-5 h-5" />} 
                label="Help Center" 
                active={activeTab === "Help"} 
                onClick={() => setActiveTab("Help")} 
              />
           </div>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-red-400 hover:bg-red-500/5 group"
           >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm">Log Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 max-w-7xl">
        <header className="flex justify-between items-center mb-12">
           <div>
              <h1 className="text-4xl font-black text-white mb-2">Welcome, {USER_DATA.name.split(' ')[0]} 👋</h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                User ID: <span className="font-mono text-xs font-bold text-primary">{USER_DATA.id}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                Updated Today at 10:45 AM
              </p>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="flex items-center gap-3 pl-2">
                 <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 p-0.5">
                    <img src="https://i.pravatar.cc/150?u=user" className="w-full h-full object-cover rounded-xl" />
                 </div>
              </div>
           </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "Dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Quick Actions / Important Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 relative h-64 rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 p-10 flex flex-col justify-between group">
                   <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <Zap className="w-40 h-40 text-primary" />
                   </div>
                   <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Total Outstanding</div>
                        <div className="text-5xl font-black text-white mb-2">{USER_DATA.loan.remaining}</div>
                        <div className="text-sm font-medium text-slate-400">Next payment of <span className="text-white font-bold">{USER_DATA.nextPayment.amount}</span> due in <span className="text-primary font-bold">{USER_DATA.nextPayment.daysLeft} days</span>.</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl text-center">
                         <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Credit Score</div>
                         <div className="text-2xl font-black text-green-400">{USER_DATA.creditScore}</div>
                         <div className="text-[8px] font-bold text-slate-500">EXCELLENT</div>
                      </div>
                   </div>
                   <div className="relative z-10 flex gap-4">
                      <button className="px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                        Make Instant Payment <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button className="px-8 py-3.5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-sm hover:bg-white/10 transition-all">
                        View Schedule
                      </button>
                   </div>
                </div>

                <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 flex flex-col justify-center">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="font-black text-lg">Loan Progress</h3>
                      <div className="text-xs font-bold text-primary">{USER_DATA.loan.progress}%</div>
                   </div>
                   <div className="relative h-4 w-full bg-white/5 rounded-full mb-8 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${USER_DATA.loan.progress}%` }} 
                        className="h-full bg-primary shadow-[0_0_15px_var(--primary)]" 
                      />
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-muted-foreground font-medium">Principal Paid</span>
                         <span className="font-bold">{USER_DATA.loan.paid}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-muted-foreground font-medium">Tenure Remaining</span>
                         <span className="font-bold">{USER_DATA.loan.monthsRemaining} Months</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-muted-foreground font-medium">Interest Accrued</span>
                         <span className="font-bold text-primary">{USER_DATA.loan.interestRate}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatBox icon={<DollarSign className="w-5 h-5" />} label="Approved Loan" value={USER_DATA.loan.total} sub="Disbursed March 2026" />
                 <StatBox icon={<Car className="w-5 h-5" />} label="Car Value" value={USER_DATA.car.value} sub={`${USER_DATA.car.make} ${USER_DATA.car.model}`} color="blue-400" />
                 <StatBox icon={<TrendingUp className="w-5 h-5" />} label="Yearly Yield" value="₦4.2M" sub="+12% from last year" color="purple-400" />
                 <StatBox icon={<ShieldCheck className="w-5 h-5" />} label="Protection" value="Active" sub="Comprehensive Insurance" color="green-400" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Car Profile */}
                 <div className="lg:col-span-1 group relative rounded-[3rem] overflow-hidden bg-card/40 border border-white/5">
                    <img src={USER_DATA.car.image} className="w-full h-64 object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] font-black uppercase mb-3">Your Vehicle</div>
                       <h3 className="text-2xl font-black mb-1">{USER_DATA.car.make} {USER_DATA.car.model}</h3>
                       <div className="text-sm font-bold text-muted-foreground mb-4">{USER_DATA.car.year} • {USER_DATA.car.plate}</div>
                       <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                          Manage Asset <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 {/* Payment Breakdown & History */}
                 <div className="lg:col-span-2 bg-card/40 border border-white/5 rounded-[3rem] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                       <h3 className="text-xl font-black">Payment History</h3>
                       <button className="text-xs font-bold text-primary flex items-center gap-2 hover:underline">
                          <Download className="w-4 h-4" /> Export Statement
                       </button>
                    </div>
                    <div className="p-0">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="text-[10px] text-muted-foreground uppercase font-black tracking-widest border-b border-white/5">
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Reference</th>
                                <th className="px-8 py-5">Amount</th>
                                <th className="px-8 py-5">Method</th>
                                <th className="px-8 py-5">Status</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                             {USER_DATA.history.map((h, i) => (
                               <tr key={i} className="group hover:bg-white/5 transition-colors">
                                  <td className="px-8 py-5 text-sm font-bold">{h.date}</td>
                                  <td className="px-8 py-5 text-xs font-mono text-muted-foreground">#{h.id}</td>
                                  <td className="px-8 py-5 text-sm font-black text-white">{h.amount}</td>
                                  <td className="px-8 py-5 text-sm text-muted-foreground">{h.method}</td>
                                  <td className="px-8 py-5">
                                     <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] font-black uppercase">
                                        {h.status}
                                     </span>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Loan" && (
            <motion.div
              key="loan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
               <h2 className="text-3xl font-black">Loan Breakdown</h2>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-card/40 border border-white/5 rounded-[3rem] p-10">
                     <PieChartIcon className="w-12 h-12 text-primary mb-6" />
                     <h3 className="text-xl font-black mb-4">Repayment Structure</h3>
                     <p className="text-muted-foreground mb-8">Detailed view of how your payments are distributed between principal and interest.</p>
                     
                     <div className="space-y-6">
                        <div>
                           <div className="flex justify-between text-sm mb-2 font-bold">
                              <span>Principal Amount</span>
                              <span>85%</span>
                           </div>
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full w-[85%] bg-primary" />
                           </div>
                        </div>
                        <div>
                           <div className="flex justify-between text-sm mb-2 font-bold">
                              <span>Interest Fees</span>
                              <span>15%</span>
                           </div>
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full w-[15%] bg-blue-500" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-card/40 border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between">
                     <div>
                        <History className="w-12 h-12 text-blue-400 mb-6" />
                        <h3 className="text-xl font-black mb-4">Pay Off Early</h3>
                        <p className="text-muted-foreground mb-8">Reduce your interest rates by paying off your loan before the tenure ends.</p>
                     </div>
                     <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                        Calculate Early Payout <Plus className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
