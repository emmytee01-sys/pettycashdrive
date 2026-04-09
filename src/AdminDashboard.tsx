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
  ArrowRight,
  Menu
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

const Header = ({ title, subtitle, showNotifications, setShowNotifications, notifications, setNotifications }: any) => (
  <header className="p-8 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-40">
    <div className="flex items-center gap-6">
       <div className="flex flex-col">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">{title}</h1>
          <p className="text-lg font-black text-primary uppercase tracking-[0.2em] mt-2">{subtitle}</p>
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

       <div className="flex items-center gap-6">
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
    </div>
  </header>
);

export const AdminDashboard: FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [, setLastFetchTime] = useState<string>(new Date().toLocaleTimeString());
  const [loans, setLoans] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loanViewMode, setLoanViewMode] = useState<'list' | 'detail'>('list');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [showLiveFeed, setShowLiveFeed] = useState(false);
  const [userViewMode, setUserViewMode] = useState<'list' | 'detail'>('list');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modal, setModal] = useState<{ show: boolean, title: string, message: string, type: 'confirm' | 'success' | 'error', onConfirm?: () => void }>({
    show: false, title: '', message: '', type: 'success'
  });
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: 'System Sync', text: 'PettyCash core services connected successfully.', time: 'Live', type: 'info' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    if (auditLogs && auditLogs.length > 0) {
      const recentLog = auditLogs[0];
      newNotifications.push({
        id: 'recent_audit',
        title: 'Recent Audit Activity',
        text: `Action: ${recentLog.action.replace('_', ' ').toUpperCase()} on Loan ${recentLog.loan_id.substring(0, 8)}`,
        time: new Date(recentLog.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        type: 'info'
      });
    }
    if (newNotifications.length === 0) {
      newNotifications = [{ id: 1, title: 'System Sync', text: 'PettyCash core services connected successfully.', time: 'Live', type: 'info' }];
    }
    setNotifications(newNotifications);
  }, [loans, auditLogs]);

  const handleUpdateStatus = async (loanId: string, status: string, notes?: string) => {
     try {
       const res = await fetch(`/api/admin/loans/${loanId}/status`, {
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

  const handleCleanupSystem = async () => {
    setModal({
      show: true,
      title: 'Danger Zone',
      message: 'Are you absolutely sure? This will delete all loans, payments, car details, and all non-admin users. This action is irreversible.',
      type: 'confirm',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/cleanup-all-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await res.json();
          if (res.ok) {
            setModal({ show: true, title: 'Cleanup Success', message: data.message, type: 'success' });
            Promise.all([fetchLoans(), fetchUsers(), fetchAuditLogs(), fetchStats()]);
          } else {
            setModal({ show: true, title: 'Cleanup Failed', message: data.message || 'Server error', type: 'error' });
          }
        } catch (err) {
          setModal({ show: true, title: 'Network Error', message: 'Could not connect to the system cleanup endpoint.', type: 'error' });
        }
      }
    });
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
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PettyCash_Loans_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCompact = (num: number) => {
     if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
     if (num >= 1000) return `₦${(num / 1000).toFixed(1)}K`;
     return `₦${num}`;
  };

  const totalDisbursed = loans.filter(l => l.status === 'disbursed').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalPending = loans.filter(l => l.status === 'pending').length;
  const totalCapital = loans.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const dynamicStats = [
    { label: "Disbursed Funds", value: formatCompact(totalDisbursed), icon: TrendingUp, color: "bg-green-400", trend: "Live" },
    { label: "Processing", value: totalPending.toString(), icon: Clock, color: "bg-amber-400", trend: "Urgent" },
    { label: "Total Repayments", value: formatCompact(stats?.payments?.total_received || 0), icon: DollarSign, color: "bg-blue-400", trend: "Collected" },
    { label: "Platform Users", value: users.length.toString(), icon: Users, color: "bg-slate-400", trend: "Active" }
  ];

  const getHeaderInfo = () => {
    switch (activeTab) {
      case "Dashboard": return { title: "Dashboards", subtitle: "Real-time performance metrics" };
      case "Loans": return { title: "Loan Applications", subtitle: "Review and disburse requests" };
      case "Users": return { title: "Borrowers", subtitle: "Manage platform stakeholders" };
      case "Reports": return { title: "Reports", subtitle: "Platform sustainability metrics" };
      case "Operations": return { title: "Audit Logs", subtitle: "Event monitoring and audit" };
      case "Settings": return { title: "Settings", subtitle: "Platform configuration" };
      default: return { title: "Overview", subtitle: "Real-time metrics" };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col lg:flex-row relative">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-6 border-b border-white/5 bg-[#020617] sticky top-0 z-[60]">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center overflow-hidden">
               <img src="/logo.png" className="w-8 h-8 object-contain" alt="Logo" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">Petty<span className="text-primary italic">Cash</span></span>
         </div>
         <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 transition-all">
           {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-primary" />}
         </button>
      </div>

      <aside className={cn(
        "w-72 border-r border-white/5 flex flex-col fixed h-screen z-50 bg-[#020617] transition-transform duration-300 lg:translate-x-0",
        showMobileMenu ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8">
           <div className="hidden lg:flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center overflow-hidden">
                 <img src="/logo.png" className="w-8 h-8 object-contain" alt="Logo" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">Petty<span className="text-primary italic">Cash</span></span>
           </div>
           
           <div className="space-y-2">
              <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboards" active={activeTab === "Dashboard"} onClick={() => { setActiveTab("Dashboard"); setShowMobileMenu(false); }} />
              <SidebarItem icon={<BarChart3 size={20} />} label="Loan Applications" active={activeTab === "Loans"} onClick={() => { setActiveTab("Loans"); setShowMobileMenu(false); }} />
              <SidebarItem icon={<Users size={20} />} label="Borrowers" active={activeTab === "Users"} onClick={() => { setActiveTab("Users"); setShowMobileMenu(false); }} />
              <SidebarItem icon={<FileText size={20} />} label="Reports" active={activeTab === "Reports"} onClick={() => { setActiveTab("Reports"); setShowMobileMenu(false); }} />
              <SidebarItem icon={<Clock size={20} />} label="Audit Logs" active={activeTab === "Operations"} onClick={() => { setActiveTab("Operations"); setShowMobileMenu(false); }} />
              <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeTab === "Settings"} onClick={() => { setActiveTab("Settings"); setShowMobileMenu(false); }} />
           </div>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
           <button onClick={onBack} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-red-500 hover:bg-red-500/5 group">
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm tracking-wide">Secure Exit</span>
           </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:ml-72 flex flex-col relative">
        <Header 
          title={headerInfo.title} subtitle={headerInfo.subtitle} 
          showNotifications={showNotifications} setShowNotifications={setShowNotifications} 
          notifications={notifications} setNotifications={setNotifications} 
        />
        
        <main className="p-6 md:p-12 flex-1 max-w-[1600px]">
          <AnimatePresence mode="wait">
            {activeTab === "Dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-12">
                <div className="flex justify-end mb-12">
                  <div className="flex items-center gap-3">
                     <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                       <Download className="w-4 h-4" /> Export Data
                     </button>
                     <button onClick={() => setShowLiveFeed(true)} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center gap-2">Live Feed <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dynamicStats.map((stat, i) => <StatCard key={i} {...stat} />)}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                       <h3 className="text-lg font-bold">Recent Applications</h3>
                       <button onClick={() => setActiveTab("Loans")} className="text-primary text-xs font-bold hover:underline flex items-center gap-1">Manage All <ChevronRight className="w-3 h-3" /></button>
                    </div>
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full text-left min-w-[600px]">
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
                              <td className="px-6 py-4"><StatusBadge status={loan.status} /></td>
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
                         { label: 'Low Risk Approvals', val: loans.length > 0 ? Math.round((loans.filter(l => l.status === 'disbursed' || l.status === 'approved').length / loans.length) * 100) : 0, color: 'primary' },
                         { label: 'High Exposure', val: loans.length > 0 ? Math.round((loans.filter(l => Number(l.amount) > 1000000).length / loans.length) * 100) : 0, color: 'red-500' },
                         { label: 'Under Verification', val: loans.length > 0 ? Math.round((loans.filter(l => l.status === 'pending').length / loans.length) * 100) : 0, color: 'blue-400' }
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
              <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                {userViewMode === 'list' ? (
                  <div className="bg-card/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[1000px]">
                        <thead>
                          <tr className="text-muted-foreground text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                             <th className="px-8 py-5">Borrower</th>
                             <th className="px-8 py-5">Joined</th>
                             <th className="px-8 py-5">Requested</th>
                             <th className="px-8 py-5">Paid</th>
                             <th className="px-8 py-5">Repayment</th>
                             <th className="px-8 py-5">Monthly</th>
                             <th className="px-8 py-5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {users.map(u => {
                            const userLoans = loans.filter(l => l.user_id === u.id);
                            const latestLoan = userLoans[0];
                            const requested = latestLoan ? Number(latestLoan.amount) : 0;
                            const repayment = latestLoan ? Number(latestLoan.total_payback) : 0;
                            const monthly = latestLoan ? Number(latestLoan.monthly_payment) : 0;
                            const paid = latestLoan ? Number(latestLoan.amount_paid) : 0;
                            const remaining = latestLoan ? Number(latestLoan.remaining_balance) : 0;
                            
                            return (
                              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                 <td className="px-8 py-5">
                                    <div className="text-sm font-bold">{u.name}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">{u.email}</div>
                                 </td>
                                 <td className="px-8 py-5 text-xs text-slate-400 font-medium">{new Date(u.created_at).toLocaleDateString()}</td>
                                 <td className="px-8 py-5 text-sm font-black">₦{requested.toLocaleString()}</td>
                                 <td className="px-8 py-5 text-sm font-black text-green-400">₦{paid.toLocaleString()}</td>
                                 <td className="px-8 py-5 text-sm font-black text-primary">₦{repayment.toLocaleString()}</td>
                                 <td className="px-8 py-5 text-sm font-black">₦{monthly.toLocaleString()}</td>
                                 <td className="px-8 py-5 text-right">
                                    <button onClick={() => { setSelectedUser({ ...u, loan: latestLoan, stats: { requested, repayment, monthly, paid, remaining } }); setUserViewMode('detail'); }} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">View Plan</button>
                                 </td>
                              </tr>
                            );
                          })}
                        </tbody>
                     </table>
                   </div>
                </div>
                ) : selectedUser && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                     <button onClick={() => setUserViewMode('list')} className="flex items-center gap-2 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Users
                     </button>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                           <div className="bg-card/40 border border-white/5 rounded-[3rem] p-10">
                              <SectionTitle title={selectedUser.name} subtitle={`Member since ${new Date(selectedUser.created_at).toLocaleDateString()}`} />
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                                 <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase mb-2">Amount Disbursed</div>
                                    <div className="text-xl font-black text-white">₦{selectedUser.stats.requested.toLocaleString()}</div>
                                 </div>
                                 <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase mb-2">Total Payback</div>
                                    <div className="text-xl font-black text-primary">₦{selectedUser.stats.repayment.toLocaleString()}</div>
                                 </div>
                                 <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase mb-2">Monthly Payment</div>
                                    <div className="text-xl font-black text-white">₦{selectedUser.stats.monthly.toLocaleString()}</div>
                                 </div>
                                 <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase mb-2">Interest Rate</div>
                                    <div className="text-xl font-black text-blue-400">{selectedUser.loan?.interest_rate || '3.5%'}</div>
                                 </div>
                                 <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase mb-2">Tenure</div>
                                    <div className="text-xl font-black text-white">{selectedUser.loan?.tenure || 0} Months</div>
                                 </div>
                                 <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase mb-2">Remaining Balance</div>
                                    <div className="text-xl font-black text-red-400">₦{selectedUser.stats.remaining.toLocaleString()}</div>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-card/40 border border-white/5 rounded-[3rem] p-10">
                              <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Clock className="w-5 h-5 text-primary" /> Active Repayment Plan</h3>
                              <div className="space-y-4">
                                 {selectedUser.loan ? (
                                   <div className="overflow-hidden border border-white/5 rounded-2xl">
                                      <table className="w-full text-left">
                                         <thead>
                                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                               <th className="px-6 py-4">Installment</th>
                                               <th className="px-6 py-4">Amount</th>
                                               <th className="px-6 py-4">Due Date</th>
                                               <th className="px-6 py-4">Status</th>
                                            </tr>
                                         </thead>
                                         <tbody className="divide-y divide-white/5">
                                            {(selectedUser.loan?.repayment_plan || []).map((item: any, i: number) => (
                                               <tr key={i} className="hover:bg-white/5 transition-colors">
                                                  <td className="px-6 py-4 text-sm font-bold">{item.month}</td>
                                                  <td className="px-6 py-4 text-sm font-black text-white">₦{Number(item.amount).toLocaleString()}</td>
                                                  <td className="px-6 py-4 text-xs text-slate-400">{new Date(item.due_date).toLocaleDateString()}</td>
                                                  <td className="px-6 py-4">
                                                     {item.status === 'Paid' ? (
                                                        <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full text-[8px] font-black uppercase tracking-widest">Paid</span>
                                                     ) : item.status === 'Missed' ? (
                                                        <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[8px] font-black uppercase tracking-widest">Missed</span>
                                                     ) : (
                                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400">Upcoming</span>
                                                     )}
                                                  </td>
                                               </tr>
                                            ))}
                                         </tbody>
                                      </table>
                                   </div>
                                 ) : (
                                   <div className="py-20 text-center text-muted-foreground italic border border-dashed border-white/10 rounded-3xl">No active repayment plan found.</div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <div className="bg-primary border border-primary/20 rounded-[3rem] p-10 text-primary-foreground shadow-2xl shadow-primary/20">
                              <h3 className="text-xl font-black mb-8">Service Summary</h3>
                              <div className="space-y-6">
                                 <div className="flex justify-between items-center border-b border-primary-foreground/10 pb-4">
                                    <div className="text-[10px] font-black uppercase text-primary-foreground/60">Next Payment</div>
                                    <div className="text-lg font-black">{selectedUser.loan?.next_payment_date ? new Date(selectedUser.loan.next_payment_date).toLocaleDateString() : 'N/A'}</div>
                                 </div>
                                 <div className="flex justify-between items-center border-b border-primary-foreground/10 pb-4">
                                    <div className="text-[10px] font-black uppercase text-primary-foreground/60">Final Payout</div>
                                    <div className="text-lg font-black">{selectedUser.loan?.final_payout_date ? new Date(selectedUser.loan.final_payout_date).toLocaleDateString() : 'N/A'}</div>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <div className="text-[10px] font-black uppercase text-primary-foreground/60">Total Duration</div>
                                    <div className="text-lg font-black">{selectedUser.loan?.tenure || 0} Months</div>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
                              <h3 className="text-xl font-black mb-6">User Context</h3>
                              <div className="space-y-4">
                                 <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary"><ShieldCheck className="w-5 h-5" /></div>
                                    <div>
                                       <div className="text-[10px] font-bold text-muted-foreground uppercase">Identity Status</div>
                                       <div className="text-sm font-black">Verified Customer</div>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400"><TrendingUp className="w-5 h-5" /></div>
                                    <div>
                                       <div className="text-[10px] font-bold text-muted-foreground uppercase">Credit Health</div>
                                       <div className="text-sm font-black">Tier 1 Borrower</div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </motion.div>
            )}

            {activeTab === "Loans" && (
              <motion.div key="loans">
                {loanViewMode === 'list' ? (
                  <div className="space-y-8">
                     <div className="bg-card/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left min-w-[800px]">
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
                                     <button onClick={() => { setSelectedLoan(loan); setLoanViewMode('detail'); }} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">Inspect</button>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                        </table>
                     </div>
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
                                      <div className="grid grid-cols-2 gap-4">
                                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="text-[10px] text-muted-foreground uppercase mb-1">Year</div>
                                            <div className="text-sm font-bold">{selectedLoan.year}</div>
                                         </div>
                                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="text-[10px] text-muted-foreground uppercase mb-1">Plate</div>
                                            <div className="text-sm font-bold text-primary font-mono">{selectedLoan.plate_number || 'N/A'}</div>
                                         </div>
                                      </div>
                                      <div className="p-5 bg-primary/10 rounded-2xl border border-primary/20">
                                         <div className="text-[10px] text-primary/60 uppercase mb-1">Estimated Value</div>
                                         <div className="text-2xl font-black text-primary">₦{(selectedLoan.valuation || selectedLoan.amount * 1.5).toLocaleString()}</div>
                                      </div>
                                  </div>
                               </div>
                           </div>

                           <div className="grid md:grid-cols-2 gap-10 mt-12">
                               <div>
                                  <div className="text-[10px] font-black uppercase text-primary tracking-widest mb-4">Payout Destination</div>
                                  <div className="space-y-4">
                                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                         <div className="text-[10px] text-muted-foreground uppercase mb-1">Bank Account</div>
                                         <div className="text-xl font-black">{selectedLoan.account_name || 'N/A'}</div>
                                         <div className="text-sm font-bold text-primary">{selectedLoan.bank_name || 'Generic Bank'} • {selectedLoan.account_number || 'N/A'}</div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="text-[10px] text-muted-foreground uppercase mb-1">BVN</div>
                                            <div className="text-sm font-bold">{selectedLoan.bvn || 'N/A'}</div>
                                         </div>
                                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="text-[10px] text-muted-foreground uppercase mb-1">NIN</div>
                                            <div className="text-sm font-bold">{selectedLoan.nin || 'N/A'}</div>
                                         </div>
                                      </div>
                                  </div>
                               </div>
                               <div>
                                  <div className="text-[10px] font-black uppercase text-primary tracking-widest mb-4">Next of Kin</div>
                                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                      <div className="text-xl font-black">{selectedLoan.nok_name || 'N/A'}</div>
                                      <div className="text-sm font-bold text-slate-400 mt-1">{selectedLoan.nok_phone || 'N/A'}</div>
                                      <div className="text-sm text-slate-500">{selectedLoan.nok_address}{selectedLoan.nok_city && `, ${selectedLoan.nok_city}`}</div>
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
                                        <button key={doc.id} onClick={() => setSelectedDoc(doc)} className="group relative flex flex-col bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:bg-white/10 hover:border-primary/30 transition-all text-left overflow-hidden">
                                           <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
                                           <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform"><FileText className="w-5 h-5" /></div>
                                           <div className="text-xs font-black uppercase tracking-tight mb-1 truncate pr-8">{doc.type.replace(/_/g, ' ')}</div>
                                           <div className="text-[10px] text-muted-foreground font-bold">Verified Capture</div>
                                           <div className="mt-4 flex items-center gap-1.5 text-primary text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">Click to View <ArrowRight className="w-3 h-3" /></div>
                                        </button>
                                     ))
                                  ) : <div className="col-span-full py-16 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] text-center text-muted-foreground italic">No documentation uploaded.</div>}
                               </div>
                           </div>
                        </div>

                        <div className="w-full lg:w-96 space-y-6">
                           <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-10">
                              <h3 className="text-xl font-black mb-6">Management Panel</h3>
                              <div className="space-y-4">
                                 {selectedLoan.status === 'approved' && (
                                   <button onClick={() => handleUpdateStatus(selectedLoan.id, 'disbursed')} className="w-full py-5 bg-green-500 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 animate-pulse"><Zap className="w-5 h-5 fill-current" /> Disburse Funds</button>
                                 )}
                                 {selectedLoan.status === 'pending' && (
                                   <button onClick={() => handleUpdateStatus(selectedLoan.id, 'approved')} className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-105 transition-all ">Approve Loan</button>
                                 )}
                                 {selectedLoan.status === 'pending' && (
                                   <button onClick={() => setShowRejectModal(true)} className="w-full py-5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-white transition-all">Decline Request</button>
                                 )}
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
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8">
                       <div className="text-xs font-black text-primary uppercase tracking-widest mb-4">Portfolio Value</div>
                       <div className="text-4xl font-black mb-4">{formatCompact(totalCapital)}</div>
                       <div className="text-xs font-bold text-green-400">Total Capital</div>
                    </div>
                    <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8 text-blue-400">
                       <div className="text-xs font-black uppercase tracking-widest mb-4 opacity-70">Disbursed Funds</div>
                       <div className="text-4xl font-black mb-4 text-white">{formatCompact(totalDisbursed)}</div>
                       <div className="text-xs font-bold">Live Disbursement</div>
                    </div>
                    <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8 text-red-400">
                       <div className="text-xs font-black uppercase tracking-widest mb-4 opacity-70">Total Repayments</div>
                       <div className="text-4xl font-black mb-4 text-white">{formatCompact(Number(stats?.payments?.total_received || 0))}</div>
                       <div className="text-xs font-bold text-green-500">Collected</div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card/40 border border-white/5 rounded-[3rem] p-10 h-[400px] flex flex-col justify-between">
                       <div><h3 className="text-xl font-bold mb-1">Growth Index</h3><p className="text-xs text-muted-foreground">Capital deployment velocity (30d).</p></div>
                       <div className="flex-1 flex items-end gap-3 mt-10">
                          {[0, 0, 0, 0, 0, 0, 0].map((h, i) => <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h+20}%` }} className="flex-1 bg-gradient-to-t from-primary to-blue-600 rounded-t-xl opacity-80" />)}
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
                         {auditLogs.slice(0, 20).map((log, index) => (
                            <tr key={index} className="hover:bg-white/5">
                               <td className="px-8 py-5">
                                 <div className="text-sm font-bold">{log.action.replace(/_/g, ' ').toUpperCase()}</div>
                                 <div className="text-[10px] text-muted-foreground">Loan Ref: #{log.loan_id.substring(0, 8)}</div>
                               </td>
                               <td className="px-8 py-5 text-xs text-muted-foreground">{log.user_name || 'System Admin'}</td>
                               <td className="px-8 py-5"><span className="text-[10px] font-black text-green-400 uppercase">Logged</span></td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                 </div>

                 <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-10 mt-12 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-10 opacity-5"><AlertCircle className="w-40 h-40 text-red-500" /></div>
                    <div className="relative z-10 max-w-2xl">
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase mb-4 tracking-widest">Administrative Action Required</div>
                       <h3 className="text-3xl font-black mb-4">Reset Platform Data</h3>
                       <p className="text-slate-400 font-medium mb-8">System wipe of consumer data while preserving admin accounts.</p>
                       <button onClick={handleCleanupSystem} className="px-10 py-5 bg-red-500 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all">Execute System Wipe</button>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === "Settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-10">
                 <SectionTitle title="Platform Settings" subtitle="Configure platform-wide parameters." />
                 <div className="bg-card/40 border border-white/5 rounded-3xl p-10">
                    <h3 className="text-xl font-bold mb-8">Loan Parameters</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Base Rate (%)</label><input type="text" defaultValue="3.5" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" /></div>
                       <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Review Threshold (₦)</label><input type="text" defaultValue="5,000,000" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" /></div>
                    </div>
                    <button className="mt-10 px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-xl shadow-primary/20">Save Configuration</button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRejectModal(false)} className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" />
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md bg-card border border-white/10 rounded-[3rem] p-12 relative z-10 shadow-2xl">
                <h3 className="text-3xl font-black mb-4">Decline Application</h3>
                <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Reason for rejection..." className="w-full h-32 p-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none" />
                <div className="flex gap-4 mt-8">
                   <button onClick={() => setShowRejectModal(false)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold">Cancel</button>
                   <button disabled={!rejectionReason.trim()} onClick={() => handleUpdateStatus(selectedLoan.id, 'rejected', rejectionReason)} className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl">Decline</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal.show && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]" onClick={() => setModal({ ...modal, show: false })} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0f172a] border border-white/10 rounded-[3rem] p-10 z-[210] shadow-2xl">
               <div className="flex flex-col items-center text-center">
                  <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-8 border-2 shadow-xl", modal.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : modal.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-primary/10 border-primary/20 text-primary")}>
                     {modal.type === 'success' ? <ShieldCheck className="w-10 h-10" /> : modal.type === 'error' ? <AlertCircle className="w-10 h-10" /> : <Zap className="w-10 h-10" />}
                  </div>
                  <h3 className="text-3xl font-black mb-4">{modal.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed mb-10">{modal.message}</p>
                  <div className="flex gap-4 w-full">
                     {modal.type === 'confirm' ? (
                       <>
                         <button onClick={() => setModal({ ...modal, show: false })} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm">Cancel</button>
                         <button onClick={() => { modal.onConfirm?.(); setModal({ ...modal, show: false }); }} className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-xl shadow-primary/20">Confirm</button>
                       </>
                     ) : <button onClick={() => setModal({ ...modal, show: false })} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm">Close</button>}
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDoc && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[300]" onClick={() => setSelectedDoc(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-10 z-[310] flex flex-col items-center justify-center pointer-events-none">
               <div className="relative w-full max-w-4xl max-h-full bg-[#0f172a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl pointer-events-auto">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#0f172a]/80 backdrop-blur-md">
                     <div><h3 className="text-2xl font-black text-white">{selectedDoc.type.replace(/_/g, ' ').toUpperCase()}</h3></div>
                     <button onClick={() => setSelectedDoc(null)} className="p-3 bg-white/5 border border-white/10 rounded-2xl"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-10 overflow-auto flex justify-center bg-black/20"><img src={selectedDoc.url} className="max-w-full h-auto rounded-2xl border border-white/5" alt="Document" /></div>
                  <div className="p-8 border-t border-white/5 bg-[#0f172a]/80 backdrop-blur-md flex justify-end gap-4">
                     <a href={selectedDoc.url} download className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm flex items-center gap-2"><Download className="w-4 h-4" /> Download Original</a>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLiveFeed && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLiveFeed(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#020617]/95 backdrop-blur-xl border-l border-white/10 z-[70] flex flex-col shadow-2xl">
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
                         {i !== 9 && <div className="w-[1px] h-full bg-white/5 mt-2 transition-colors" />}
                       </div>
                       <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{new Date(l.created_at).toLocaleTimeString()}</div>
                          <div className="text-sm font-bold">{l.user_name}</div>
                          <div className="text-xs text-slate-400 mt-1">{l.status === 'disbursed' ? `Asset funded: ₦${Number(l.amount).toLocaleString()}` : l.status === 'approved' ? `Passed verification.` : `New application for ${l.make} ${l.model}.`}</div>
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
