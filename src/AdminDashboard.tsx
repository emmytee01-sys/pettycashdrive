import { useState, useEffect, type FC } from "react";
import { 
  Zap, 
  Users, 
  BarChart3, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  ChevronRight,
  X,
  
  Download,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StatCard: FC<{ label: string, value: string, icon: any, color: string, trend?: string }> = ({ label, value, icon: Icon, color, trend }) => (
  <div className="bg-card/40 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
    <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity", color)} />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <span className="text-[10px] font-black px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full tracking-widest uppercase">
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{label}</div>
        <div className="text-3xl font-black text-white tracking-tight">{value}</div>
      </div>
    </div>
  </div>
);

const SectionTitle: FC<{ title: string, subtitle: string, action?: any }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
    <div>
       <h2 className="text-5xl font-black tracking-tight mb-4 leading-none">{title}</h2>
       <p className="text-muted-foreground font-medium text-lg">{subtitle}</p>
    </div>
    {action}
  </div>
);

const SidebarItem: FC<{ icon: any, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative",
      active ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <div className={cn("transition-transform duration-300 group-hover:scale-110", active ? "scale-100" : "")}>{icon}</div>
    <span className="font-bold tracking-wide text-sm">{label}</span>
    {active && (
      <motion.div layoutId="sidebar-accent" className="absolute left-0 w-1 h-6 bg-white rounded-full translate-x-[-2px]" />
    )}
  </button>
);

const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const styles: any = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    approved: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    disbursed: "bg-green-500/10 text-green-500 border-green-500/20"
  };
  return (
    <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", styles[status] || styles.pending)}>
      {status}
    </span>
  );
};

const Header = ({ showNotifications, setShowNotifications, notifications, setNotifications }: any) => (
  <header className="p-8 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-40">
    <div className="flex items-center gap-6">
       <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
       <div className="flex flex-col">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Institutional Dashboard</span>
          <span className="text-white/40 text-[10px] font-bold">Node: Lagos-NGA-01</span>
       </div>
    </div>
    
    <div className="flex items-center gap-6">
       <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
          >
             <Zap className={cn("w-5 h-5", notifications.length > 0 ? "text-primary fill-primary/20" : "text-muted-foreground")} />
             {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]" />}
          </button>
          
          <AnimatePresence>
             {showNotifications && (
                <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.9 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.9 }}
                   className="absolute right-0 mt-4 w-80 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl z-[100]"
                >
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-black text-sm uppercase tracking-widest text-white">System Alerts</h3>
                      <button onClick={() => setNotifications([])} className="text-[10px] font-bold text-primary hover:underline">Dismiss All</button>
                   </div>
                   <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {notifications.length > 0 ? notifications.map((n: any) => (
                        <div key={n.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-default text-left">
                           <div className="font-bold text-xs mb-1 text-white">{n.title}</div>
                           <div className="text-[10px] text-muted-foreground">{n.text}</div>
                           <div className="text-[8px] font-black uppercase text-primary mt-2">{n.time}</div>
                        </div>
                      )) : (
                        <div className="text-center py-10 text-muted-foreground text-xs italic">No system alerts.</div>
                      )}
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       <div className="flex flex-col items-end">
          <span className="text-sm font-black uppercase tracking-wider text-white">System Admin</span>
          <span className="text-[10px] font-bold text-green-400 flex items-center gap-1.5 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Live Service
          </span>
       </div>
       <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg shadow-primary/20 cursor-pointer hover:rotate-6 transition-transform">
          <Users className="w-6 h-6 text-white" />
       </div>
    </div>
  </header>
);


export const AdminDashboard: FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [_1, setLastFetchTime] = useState<string>(new Date().toLocaleTimeString());
  const [loans, setLoans] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [_2, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loanViewMode, setLoanViewMode] = useState<'list' | 'detail'>('list');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [showLiveFeed, setShowLiveFeed] = useState(false);
  const [modal, setModal] = useState<{ show: boolean, title: string, message: string, type: 'confirm' | 'success' | 'error', onConfirm?: () => void }>({
    show: false, title: '', message: '', type: 'success'
  });
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: 'Network Hub Sync', text: 'Institutional data node connected successfully.', time: 'Live', type: 'info' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [_3, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      setAuditLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await fetch('/api/admin/loans');
      const data = await res.json();
      setLoans(data);
    } catch (err) {
      console.error("Failed to fetch admin loans:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch admin users:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
       setLoading(true);
       await Promise.all([fetchLoans(), fetchUsers(), fetchAuditLogs(), fetchStats()]);
       setLoading(false);
       setLastFetchTime(new Date().toLocaleTimeString());
    };
    loadAll();
  }, []);

  useEffect(() => {
    let newNotifications: any[] = [];
    
    const auditLogList = _3.length > 0 ? _3 : [];
    
    // Check for pending loans
    const pendingLoans = loans.filter(l => l.status === 'pending');
    if (pendingLoans.length > 0) {
      newNotifications.push({
        id: 'pending_loans',
        title: 'Pending Applications',
        text: `There are ${pendingLoans.length} loan applications awaiting review.`,
        time: 'Just now',
        type: 'warning'
      });
    }

    // Recent activity highlights
    if (auditLogList && auditLogList.length > 0) {
      const recentLog = auditLogList[0];
      newNotifications.push({
        id: 'recent_audit',
        title: 'Recent Audit Activity',
        text: `Action: ${recentLog.action.replace('_', ' ').toUpperCase()} on Loan ${recentLog.loan_id.substring(0, 8)}`,
        time: new Date(recentLog.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        type: 'info'
      });
    }

    if (newNotifications.length === 0) {
      newNotifications = [{ id: 1, title: 'Network Hub Sync', text: 'Institutional data node connected successfully.', time: 'Live', type: 'info' }];
    }

    setNotifications(newNotifications);
  }, [loans, _3]);



  const handleUpdateStatus = async (loanId: string, status: string, notes?: string) => {
     try {
       const res = await fetch(`https://api.pettycash.com.ng/api/admin/loans/${loanId}/status`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ status, notes })
       });
       if (res.ok) {
         fetchLoans();
         setSelectedLoan(null);
         setShowRejectModal(false);
         setRejectionReason("");
         setLoanViewMode('list');
       }
     } catch (err) {
       console.error("Update failed:", err);
     }
  };

  const exportToCSV = () => {
    if (loans.length === 0) return;
    const headers = ["Loan ID", "Borrower", "Email", "Vehicle", "Amount", "Status", "Date"];
    const rows = loans.map(l => [
      l.loan_reference,
      l.user_name,
      l.user_email,
      `${l.make} ${l.model} (${l.year})`,
      l.amount,
      l.status,
      new Date(l.created_at).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PettyCash_Loans_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic Dashboard Stats
  const formatCompact = (num: number) => {
     if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
     if (num >= 1000) return `₦${(num / 1000).toFixed(1)}K`;
     return `₦${num}`;
  };

  const totalDisbursed = loans.filter(l => l.status === 'disbursed').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalPending = loans.filter(l => l.status === 'pending').length;
  const totalCapital = loans.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const dynamicStats = [
    { label: "Active Capital", value: formatCompact(totalCapital), icon: DollarSign, color: "bg-primary", trend: "Live" },
    { label: "Processing", value: totalPending.toString(), icon: Clock, color: "bg-amber-400", trend: "Urgent" },
    { label: "Disbursed Total", value: formatCompact(totalDisbursed), icon: TrendingUp, color: "bg-green-400", trend: "Success" },
    { label: "Platform Users", value: users.length.toString(), icon: Users, color: "bg-blue-400", trend: "Active" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col fixed h-screen bg-[#020617] z-50">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab("Dashboard")}>
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-all">
               <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight">Petty<span className="text-primary italic">Cash</span></span>
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
            icon={<ShieldCheck className="w-5 h-5" />} 
            label="Loan Requests" 
            active={activeTab === "Loans"} 
            onClick={() => setActiveTab("Loans")} 
          />
          <SidebarItem 
            icon={<Users className="w-5 h-5" />} 
            label="User Accounts" 
            active={activeTab === "Users"} 
            onClick={() => setActiveTab("Users")} 
          />
          <SidebarItem 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="Financial Reports" 
            active={activeTab === "Reports"} 
            onClick={() => setActiveTab("Reports")} 
          />
          <SidebarItem 
            icon={<BarChart3 className="w-5 h-5 rotate-90" />} 
            label="Audit Logs" 
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
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-500/5 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <Header 
          showNotifications={showNotifications} 
          setShowNotifications={setShowNotifications}
          notifications={notifications}
          setNotifications={setNotifications}
        />

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
                       <button 
                         onClick={exportToCSV}
                         className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                       >
                         <Download className="w-4 h-4" /> Export Data
                       </button>
                       <button onClick={() => setShowLiveFeed(true)} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center gap-2">Live Feed <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /></button>
                    </div>
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dynamicStats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                       <h3 className="text-lg font-bold">Recent Applications</h3>
                       <button onClick={() => setActiveTab("Loans")} className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                          Manage All <ChevronRight className="w-3 h-3" />
                       </button>
                    </div>
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-b border-white/5">
                            <th className="px-6 py-4">Ref</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Car</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {loans.slice(0, 5).map((loan) => (
                            <tr key={loan.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 text-xs font-mono font-bold text-muted-foreground">#{loan.loan_reference}</td>
                              <td className="px-6 py-4 text-sm font-bold">{loan.user_name}</td>
                              <td className="px-6 py-4 text-sm text-slate-300">{loan.make} {loan.model}</td>
                              <td className="px-6 py-4 text-sm font-black text-white">₦{Number(loan.amount).toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <StatusBadge status={loan.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold mb-6">Risk Index</h3>
                    <div className="space-y-6">
                       {[
                         { 
                           label: 'Low Risk Approvals', 
                           val: loans.length > 0 ? Math.round((loans.filter(l => l.status === 'disbursed' || l.status === 'approved').length / loans.length) * 100) : 0, 
                           color: 'primary' 
                         },
                         { 
                           label: 'High Exposure', 
                           val: loans.length > 0 ? Math.round((loans.filter(l => Number(l.amount) > 1000000).length / loans.length) * 100) : 0, 
                           color: 'red-500' 
                         },
                         { 
                           label: 'Under Verification', 
                           val: loans.length > 0 ? Math.round((loans.filter(l => l.status === 'pending').length / loans.length) * 100) : 0, 
                           color: 'blue-400' 
                         }
                       ].map((r, i) => (
                         <div key={i}>
                            <div className="flex justify-between text-[10px] uppercase font-black tracking-widest mb-2">
                               <span className="text-muted-foreground">{r.label}</span>
                               <span className="text-white">{r.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className={cn("h-full", `bg-${r.color}`)} style={{ width: `${r.val}%` }} />
                            </div>
                         </div>
                       ))}
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
                className="space-y-8"
              >
                <SectionTitle title="User Registry" subtitle="Manage all car owners and stakeholders on the platform." />
                <div className="bg-card/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                   <table className="w-full text-left">
                      <thead>
                        <tr className="text-muted-foreground text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                           <th className="px-8 py-5">Profile</th>
                           <th className="px-8 py-5">Joined</th>
                           <th className="px-8 py-5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-white/5">
                             <td className="px-8 py-5">
                                <div className="text-sm font-bold">{u.name}</div>
                                <div className="text-xs text-muted-foreground">{u.email}</div>
                             </td>
                             <td className="px-8 py-5 text-sm text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                             <td className="px-8 py-5">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase">{u.role}</span>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </motion.div>
            )}

            {activeTab === "Loans" && (
              <motion.div key="loans">
                {loanViewMode === 'list' ? (
                  <div className="space-y-8">
                     <SectionTitle title="Loan Applications" subtitle="Review and disburse pending loan requests." />
                     <div className="bg-card/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                          <thead>
                             <tr className="text-muted-foreground text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                                <th className="px-8 py-5">Ref</th>
                                <th className="px-8 py-5">Applicant</th>
                                <th className="px-8 py-5">Amount</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                             {loans.map(loan => (
                               <tr key={loan.id} className="hover:bg-white/5">
                                  <td className="px-8 py-5 text-xs font-mono font-bold text-primary">#{loan.loan_reference}</td>
                                  <td className="px-8 py-5 text-sm font-bold">{loan.user_name}</td>
                                  <td className="px-8 py-5 text-sm font-black">₦{Number(loan.amount).toLocaleString()}</td>
                                  <td className="px-8 py-5"><StatusBadge status={loan.status} /></td>
                                  <td className="px-8 py-5 text-right">
                                     <button 
                                        onClick={() => { setSelectedLoan(loan); setLoanViewMode('detail'); }}
                                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                                     >
                                        Inspect
                                     </button>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                        </table>
                     </div>
                  </div>
                ) : selectedLoan && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                     <button onClick={() => setLoanViewMode('list')} className="flex items-center gap-2 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <ChevronRight className="w-4 h-4 rotate-180" /> Back to List
                     </button>
                     
                     <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 bg-card/40 border border-white/5 rounded-[3rem] p-12">
                           <div className="flex justify-between items-start mb-10">
                              <div>
                                 <h2 className="text-4xl font-black">{selectedLoan.user_name}</h2>
                                 <p className="text-muted-foreground mt-2">{selectedLoan.user_email}</p>
                              </div>
                              <StatusBadge status={selectedLoan.status} />
                           </div>

                           <div className="grid md:grid-cols-2 gap-10">
                              <div>
                                 <div className="text-[10px] font-black uppercase text-primary tracking-widest mb-4">Loan Details</div>
                                 <div className="space-y-4">
                                     <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-muted-foreground uppercase mb-1">Principal</div>
                                        <div className="text-2xl font-black">₦{Number(selectedLoan.amount).toLocaleString()}</div>
                                     </div>
                                     <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-muted-foreground uppercase mb-1">Tenure</div>
                                        <div className="text-2xl font-black">{selectedLoan.tenure} Months</div>
                                     </div>
                                 </div>
                              </div>
                              <div>
                                 <div className="text-[10px] font-black uppercase text-primary tracking-widest mb-4">Vehicle Data</div>
                                 <div className="space-y-4">
                                     <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-muted-foreground uppercase mb-1">Vehicle</div>
                                        <div className="text-2xl font-black">{selectedLoan.make} {selectedLoan.model}</div>
                                     </div>
                                     <div className="p-5 bg-primary/10 rounded-2xl border border-primary/20">
                                        <div className="text-[10px] text-primary/60 uppercase mb-1">Estimated Value</div>
                                        <div className="text-2xl font-black text-primary">₦{(selectedLoan.valuation || selectedLoan.amount * 1.5).toLocaleString()}</div>
                                     </div>
                                 </div>
                              </div>
                           </div>

                           <div className="mt-12">
                              <div className="text-[10px] font-black uppercase text-primary tracking-widest mb-6 flex items-center gap-2">
                                 <FileText className="w-4 h-4" /> Supporting Documents
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                 {selectedLoan.documents && selectedLoan.documents.length > 0 ? (
                                    selectedLoan.documents.map((doc: any) => (
                                       <button 
                                          key={doc.id}
                                          onClick={() => setSelectedDoc(doc)}
                                          className="group relative flex flex-col bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:bg-white/10 hover:border-primary/30 transition-all text-left overflow-hidden"
                                       >
                                          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
                                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                             <FileText className="w-5 h-5" />
                                          </div>
                                          <div className="text-xs font-black uppercase tracking-tight mb-1 truncate pr-8">{doc.type.replace(/_/g, ' ')}</div>
                                          <div className="text-[10px] text-muted-foreground font-bold">Verified Capture</div>
                                          
                                          <div className="mt-4 flex items-center gap-1.5 text-primary text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                             Click to View <ArrowRight className="w-3 h-3" />
                                          </div>
                                       </button>
                                    ))
                                 ) : (
                                    <div className="col-span-full py-16 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground italic font-medium">
                                       <AlertCircle className="w-8 h-8 mb-4 opacity-20" />
                                       No documentation uploaded for this request
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="w-full lg:w-96 space-y-6">
                           <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-10">
                              <h3 className="text-xl font-black mb-6">Management Panel</h3>
                              <div className="space-y-4">
                                 {selectedLoan.status === 'approved' && (
                                   <button 
                                     onClick={() => handleUpdateStatus(selectedLoan.id, 'disbursed')}
                                     className="w-full py-5 bg-green-500 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 animate-pulse"
                                   >
                                     <Zap className="w-5 h-5 fill-current" /> Disburse Funds
                                   </button>
                                 )}
                                 {selectedLoan.status === 'pending' && (
                                   <button onClick={() => handleUpdateStatus(selectedLoan.id, 'approved')} className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                                      <ShieldCheck className="w-5 h-5" /> Approve Loan
                                   </button>
                                 )}
                                 {selectedLoan.status === 'approved' && (
                                   <button onClick={() => handleUpdateStatus(selectedLoan.id, 'pending')} className="w-full py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-sm hover:bg-white/10 transition-all">
                                      Revoke to Review
                                   </button>
                                 )}
                                 <button onClick={() => setShowRejectModal(true)} className="w-full py-5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-white transition-all">
                                    Decline Request
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === "Reports" && (
              <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                 <SectionTitle title="Financial Health" subtitle="Aggregated platform performance and sustainability metrics." />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8">
                       <div className="text-xs font-black text-primary uppercase tracking-widest mb-4">Portfolio Value</div>
                       <div className="text-4xl font-black mb-4">{formatCompact(Number(stats?.loans?.total_capital || 0))}</div>
                       <div className="text-xs font-bold text-green-400">Total Capital</div>
                    </div>
                    <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8 text-blue-400">
                       <div className="text-xs font-black uppercase tracking-widest mb-4 opacity-70">Disbursed Funds</div>
                       <div className="text-4xl font-black mb-4 text-white">{formatCompact(Number(stats?.loans?.total_disbursed || 0))}</div>
                       <div className="text-xs font-bold opacity-100">Live Disbursement</div>
                    </div>
                    <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8 text-red-400">
                       <div className="text-xs font-black uppercase tracking-widest mb-4 opacity-70">Total Repayments</div>
                       <div className="text-4xl font-black mb-4 text-white">{formatCompact(Number(stats?.payments?.total_received || 0))}</div>
                       <div className="text-xs font-bold text-green-500">Collected</div>
                    </div>
                 </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="bg-card/40 border border-white/5 rounded-[3rem] p-10 h-[400px] flex flex-col justify-between">
                        <div>
                           <h3 className="text-xl font-bold mb-1">Growth Index</h3>
                           <p className="text-xs text-muted-foreground">Institutional capital deployment velocity (30d).</p>
                        </div>
                        <div className="flex-1 flex items-end gap-3 mt-10">
                           {[0, 0, 0, 0, 0, 0, 0].map((h, i) => (
                             <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                className="flex-1 bg-gradient-to-t from-primary to-blue-600 rounded-t-xl opacity-80 hover:opacity-100 transition-opacity"
                             />
                           ))}
                        </div>
                     </div>
                     <div className="bg-card/40 border border-white/5 rounded-[3rem] p-10 h-[400px]">
                        <h3 className="text-xl font-bold mb-6">Distribution</h3>
                        <div className="flex items-center justify-center h-full">
                           <div className="relative w-48 h-48 rounded-full border-[10px] border-white/5 flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full border-[10px] border-primary border-t-transparent border-r-transparent rotate-45" />
                              <div className="text-center">
                                 <div className="text-2xl font-black">{stats?.loans?.total_loans || 0}</div>
                                 <div className="text-[10px] uppercase font-bold text-muted-foreground">Active Loans</div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
              </motion.div>
            )}

            {activeTab === "Operations" && (
              <motion.div key="ops" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                 <SectionTitle title="System Logs" subtitle="Internal event monitoring and audit trails." />
                 <div className="bg-card/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                   <table className="w-full text-left">
                      <thead>
                        <tr className="text-muted-foreground text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                           <th className="px-8 py-5">Event</th>
                           <th className="px-8 py-5">Actor</th>
                           <th className="px-8 py-5">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {_3.slice(0, 20).map((log, index) => (
                            <tr key={index} className="hover:bg-white/5">
                               <td className="px-8 py-5">
                                 <div className="text-sm font-bold">{log.action.replace(/_/g, ' ').toUpperCase()}</div>
                                 <div className="text-[10px] text-muted-foreground">Loan Ref: #{log.loan_id.substring(0, 8)}</div>
                               </td>
                               <td className="px-8 py-5 text-xs text-muted-foreground">{log.user_name || 'System Admin'}</td>
                               <td className="px-8 py-5"><span className="text-[10px] font-black text-green-400 uppercase">Logged</span></td>
                            </tr>
                         ))}
                         {_3.length === 0 && (
                            <tr>
                               <td colSpan={3} className="px-8 py-10 text-center text-muted-foreground italic">No audit sequences found.</td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                 </div>
              </motion.div>
            )}

            {activeTab === "Settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-10">
                 <SectionTitle title="Platform Settings" subtitle="Configure system-wide parameters and loan logic." />
                 <div className="bg-card/40 border border-white/5 rounded-3xl p-10">
                    <h3 className="text-xl font-bold mb-8">Loan Engine Constraints</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Base Interest Rate (%)</label>
                          <input type="text" defaultValue="3.5" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Manual Review Threshold (₦)</label>
                          <input type="text" defaultValue="5,000,000" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary" />
                       </div>
                    </div>
                    <button className="mt-10 px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20">Apply Platform Rules</button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showRejectModal && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRejectModal(false)} className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" />
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md bg-card border border-white/10 rounded-[3rem] p-12 relative z-10 shadow-2xl">
                    <h3 className="text-3xl font-black mb-4 leading-tight">Decline <br />Application</h3>
                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Provide a clear justification. This explanation will be visible in the user's rejection dashboard.</p>
                    <textarea 
                      value={rejectionReason} 
                      onChange={(e) => setRejectionReason(e.target.value)} 
                      placeholder="e.g. Asset valuation below minimum threshold..." 
                      className="w-full h-32 p-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-red-500/50 transition-all" 
                    />
                    <div className="flex gap-4 mt-8">
                       <button onClick={() => setShowRejectModal(false)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold">Cancel</button>
                       <button disabled={!rejectionReason.trim()} onClick={() => handleUpdateStatus(selectedLoan.id, 'rejected', rejectionReason)} className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-500/20">Decline User</button>
                    </div>
                 </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Action Modal */}
      <AnimatePresence>
        {modal.show && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]" 
              onClick={() => setModal({ ...modal, show: false })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0f172a] border border-white/10 rounded-[3rem] p-10 z-[210] shadow-2xl"
            >
               <div className="flex flex-col items-center text-center">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center mb-8 border-2 shadow-xl",
                    modal.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                    modal.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                    "bg-primary/10 border-primary/20 text-primary"
                  )}>
                     {modal.type === 'success' ? <ShieldCheck className="w-10 h-10" /> : 
                      modal.type === 'error' ? <AlertCircle className="w-10 h-10" /> : 
                      <Zap className="w-10 h-10" />}
                  </div>
                  <h3 className="text-3xl font-black mb-4">{modal.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed mb-10">{modal.message}</p>
                  
                  <div className="flex gap-4 w-full">
                     {modal.type === 'confirm' ? (
                       <>
                         <button 
                           onClick={() => setModal({ ...modal, show: false })}
                           className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm hover:bg-white/10 transition-all"
                         >
                            Cancel
                         </button>
                         <button 
                           onClick={() => { modal.onConfirm?.(); setModal({ ...modal, show: false }); }}
                           className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                         >
                            Confirm
                         </button>
                       </>
                     ) : (
                       <button 
                         onClick={() => setModal({ ...modal, show: false })}
                         className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                       >
                          Close
                       </button>
                     )}
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[300]" 
              onClick={() => setSelectedDoc(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-10 z-[310] flex flex-col items-center justify-center pointer-events-none"
            >
               <div className="relative w-full max-w-4xl max-h-full bg-[#0f172a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl pointer-events-auto">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
                     <div>
                        <h3 className="text-2xl font-black text-white">{selectedDoc.type.split('_').map((w:string) => w[0].toUpperCase() + w.slice(1)).join(' ')}</h3>
                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mt-1">Official Verification Document</p>
                     </div>
                     <button 
                        onClick={() => setSelectedDoc(null)}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-black text-xs flex items-center gap-2"
                     >
                        <X className="w-4 h-4" /> CLOSE VIEWER
                     </button>
                  </div>
                  <div className="p-10 overflow-auto flex justify-center bg-black/20">
                     <img 
                       src={selectedDoc.url.startsWith('http') ? selectedDoc.url : `https://api.pettycash.com.ng${selectedDoc.url}`} 
                       className="max-w-full h-auto rounded-2xl shadow-2xl border border-white/5" 
                       alt="Verification Document" 
                     />
                  </div>
                  <div className="p-8 border-t border-white/5 bg-[#0f172a]/80 backdrop-blur-md flex justify-end gap-4">
                     <a 
                       href={selectedDoc.url.startsWith('http') ? selectedDoc.url : `https://api.pettycash.com.ng${selectedDoc.url}`} 
                       download
                       className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                     >
                        <Download className="w-4 h-4" /> Download Original
                     </a>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Live Feed Sidebar */}
      <AnimatePresence>
        {showLiveFeed && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setShowLiveFeed(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#020617]/95 backdrop-blur-xl border-l border-white/10 z-[70] flex flex-col shadow-2xl"
            >
               <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="font-black text-lg flex items-center gap-3">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> System Live Feed
                  </h3>
                  <button onClick={() => setShowLiveFeed(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                     <X className="w-5 h-5 text-muted-foreground" />
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {loans.slice(0, 10).map((l, i) => (
                    <div key={i} className="flex gap-4 group">
                       <div className="flex flex-col items-center">
                          <div className={cn("w-2 h-2 rounded-full mt-2 ring-4 ring-[#020617]", l.status === 'disbursed' ? "bg-green-500" : l.status === 'approved' ? "bg-blue-500" : "bg-primary")} />
                          {i !== 9 && <div className="w-[1px] h-full bg-white/5 mt-2 group-hover:bg-primary/20 transition-colors" />}
                       </div>
                       <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all hover:-translate-y-1">
                          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{new Date(l.created_at).toLocaleTimeString()}</div>
                          <div className="text-sm font-bold">{l.user_name}</div>
                          <div className="text-xs text-slate-400 mt-1">
                             {l.status === 'disbursed' ? `Asset funded: ₦${Number(l.amount).toLocaleString()}` :
                              l.status === 'approved' ? `Passed verification protocols.` :
                              `New application submitted for ${l.make} ${l.model}.`}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
