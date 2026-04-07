import { useState, useEffect, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  CreditCard, 
  Car, 
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
  Info,
  X
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UserPortalProps {
  onLogout: () => void;
  userId: string;
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

export const UserPortal: FC<UserPortalProps> = ({ onLogout, userId }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [modal, setModal] = useState<{ show: boolean, title: string, message: string, type: 'confirm' | 'success' | 'error', onConfirm?: () => void }>({
    show: false, title: '', message: '', type: 'success'
  });
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: 'Welcome Back', text: 'Your loan verification is currently active.', time: 'Just now', type: 'info' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/loans/user/${userId}`);
      const loans = await res.json();
      
      if (loans && Array.isArray(loans) && loans.length > 0) {
         const loanRes = await fetch(`http://localhost:5001/api/loans/${loans[0].id}`);
         const fullData = await loanRes.json();
         setData(fullData);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
         <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userStatus = data?.status || 'pending';
  const userName = data?.name || "User";
  const loanAmount = data?.amount ? `₦${Number(data.amount).toLocaleString()}` : "₦0";
  const carInfo = data?.car || { make: "Vehicle", model: "Pending", year: "2024", plate_number: "N/A", valuation: 0 };
  const loanRef = data?.loan_reference || "#PC-PENDING";
  const adminNotes = data?.admin_notes || "Your application did not meet our criteria at this time.";

  const totalLoanVal = Number(data?.amount || 0);
  const paidVal = data?.paid || 0;
  const remainingVal = totalLoanVal - paidVal;
  const progressPercent = totalLoanVal > 0 ? Math.round((paidVal / totalLoanVal) * 100) : 0;
  const creditScore = data?.credit_score || 650;
  const monthlyRepayment = Math.round((totalLoanVal * 1.035) / (data?.tenure || 12)); 

  const handlePayment = async () => {
    if (remainingVal <= 0) return setModal({
      show: true, title: 'Loan Completed', message: 'This loan has already been fully paid. Congratulations!', type: 'success'
    });

    setModal({
      show: true, 
      title: 'Confirm Repayment', 
      message: `Are you ready to make your instant monthly payment of ₦${monthlyRepayment.toLocaleString()}?`,
      type: 'confirm',
      onConfirm: async () => {
        try {
            const res = await fetch(`http://localhost:5001/api/loans/${data.id}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: monthlyRepayment, method: "Instant Card Transfer" })
            });
            if (res.ok) {
                setModal({ show: true, title: 'Payment Success', message: 'Your payment was recorded successfully! Your dashboard has been updated.', type: 'success' });
                setNotifications(prev => [{ id: Date.now(), title: 'Payment Received', text: `Successful payment of ₦${monthlyRepayment.toLocaleString()}`, time: 'Just now', type: 'success' }, ...prev]);
                fetchUserData();
            } else {
                setModal({ show: true, title: 'Payment Failed', message: 'There was an error processing your payment on the server. Please try again later.', type: 'error' });
            }
        } catch(err) {
            setModal({ show: true, title: 'Network Error', message: 'Could not connect to the payment gateway. Please check your internet.', type: 'error' });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col fixed h-screen z-50 bg-[#020617]">
        <div className="p-8">
           <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                 <Zap className="text-primary-foreground w-6 h-6" />
              </div>
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
                onClick={() => (userStatus === 'approved' || userStatus === 'disbursed') && setActiveTab("Payments")} 
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
              <h1 className="text-4xl font-black text-white mb-2">Welcome, {userName === "User" ? "User" : userName.split(' ')[0]} 👋</h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                User ID: <span className="font-mono text-xs font-bold text-primary">{loanRef}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                {userStatus === 'pending' ? 'Review in progress' : 'Updated Today'}
              </p>
           </div>
           
           <div className="flex items-center gap-4">
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
                          <div className="flex justify-between items-center mb-6 text-left">
                             <h3 className="font-black text-sm uppercase tracking-widest text-white">Notifications</h3>
                             <button onClick={() => setNotifications([])} className="text-[10px] font-bold text-primary hover:underline">Clear All</button>
                          </div>
                          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                             {notifications.length > 0 ? notifications.map(n => (
                               <div key={n.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-default text-left">
                                  <div className="font-bold text-xs mb-1 text-white">{n.title}</div>
                                  <div className="text-[10px] text-muted-foreground">{n.text}</div>
                                  <div className="text-[8px] font-black uppercase text-primary mt-2">{n.time}</div>
                               </div>
                             )) : (
                               <div className="text-center py-10 text-muted-foreground text-xs italic">No new alerts.</div>
                             )}
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                 <div className={cn("w-2 h-2 rounded-full", userStatus === 'pending' ? "bg-yellow-400 animate-pulse" : userStatus === 'rejected' ? "bg-red-400" : "bg-green-400")} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">
                    {userStatus === 'pending' ? 'Status: Under Review' : `Status: ${userStatus.toUpperCase()}`}
                 </span>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="flex items-center gap-3 pl-2">
                 <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 p-0.5">
                    <img src="https://i.pravatar.cc/150?u=user" className="w-full h-full object-cover rounded-xl" />
                 </div>
              </div>
           </div>
        </header>

        <AnimatePresence mode="wait">
          {userStatus === 'pending' ? (
            <motion.div
              key="pending-review"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[3rem] p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                   <ShieldCheck className="w-64 h-64 text-primary" />
                </div>
                
                <div className="max-w-2xl relative z-10">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 text-yellow-500 rounded-full text-[10px] font-black uppercase mb-6 tracking-widest animate-pulse border border-yellow-500/20">
                      Processing Application
                   </div>
                   <h2 className="text-5xl font-black mb-6 leading-tight">We're verifying your <br />loan request.</h2>
                   <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                     Hang tight, {userName.split(' ')[0]}! Our team is currently reviewing your car valuation and uploaded documents. This process usually takes <span className="text-white font-bold">24–48 hours</span>.
                   </p>
                   
                   {/* Application Tracker */}
                   <div className="flex items-center gap-2 mb-10">
                      {[
                        { label: 'Submitted', status: 'completed' },
                        { label: 'Review', status: 'current' },
                        { label: 'Approval', status: 'pending' },
                        { label: 'Disbursal', status: 'pending' },
                      ].map((step, i, arr) => (
                        <div key={i} className="flex items-center flex-1 last:flex-none">
                           <div className="flex flex-col items-center">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                step.status === 'completed' ? "bg-primary border-primary text-white" : 
                                step.status === 'current' ? "border-primary bg-primary/10 text-primary animate-pulse" : 
                                "border-white/10 bg-white/5 text-muted-foreground"
                              )}>
                                 {step.status === 'completed' ? <ShieldCheck className="w-5 h-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                              </div>
                              <span className={cn("text-[10px] font-black mt-2 uppercase tracking-widest", step.status === 'pending' ? "text-muted-foreground" : "text-white")}>
                                 {step.label}
                              </span>
                           </div>
                           {i < arr.length - 1 && (
                             <div className={cn("flex-1 h-0.5 mx-4 -mt-4", step.status === 'completed' ? "bg-primary" : "bg-white/10")} />
                           )}
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                       <Car className="w-6 h-6 text-primary" /> Submission Summary
                    </h3>
                    <div className="space-y-6">
                       <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div>
                             <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">Requested Amount</div>
                             <div className="text-lg font-black text-white">{loanAmount}</div>
                          </div>
                          <div className="text-right">
                             <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">Proposed Tenure</div>
                             <div className="text-lg font-black text-white">{data?.tenure || 12} Months</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div>
                             <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">Vehicle Details</div>
                             <div className="text-lg font-black text-white">{carInfo.make} {carInfo.model} ({carInfo.year})</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between">
                    <div>
                       <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                          <Plus className="w-6 h-6 text-primary" /> Document Check
                       </h3>
                       <div className="space-y-4 mb-8">
                          {[
                            'Roadworthiness Certificate',
                            'Vehicle License',
                            'Proof of Ownership',
                            'Vehicle Photos (Front & Back)'
                          ].map((doc, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                               <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                  <ShieldCheck className="w-3 h-3" />
                               </div>
                               {doc}
                            </div>
                          ))}
                       </div>
                    </div>
                    <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                       Need to update documents? Contact Support <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </motion.div>
          ) : userStatus === 'rejected' ? (
            <motion.div
              key="rejected-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-[3rem] p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                   <X className="w-64 h-64 text-red-500" />
                </div>
                
                <div className="relative z-10">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-400/10 text-red-400 rounded-full text-[10px] font-black uppercase mb-6 tracking-widest border border-red-500/20">
                      Application Declined
                   </div>
                   <h2 className="text-5xl font-black mb-6 leading-tight">We couldn't approve <br />your request.</h2>
                   <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                     Hello {userName.split(' ')[0]}, after reviewing your application and vehicle valuation, we are unable to proceed with this loan request at this time.
                   </p>

                   <div className="bg-[#020617] border border-white/5 rounded-3xl p-8 mb-10">
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Reason for Decision</div>
                      <p className="text-white font-medium italic">"{adminNotes}"</p>
                   </div>

                   <div className="flex gap-4">
                      <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-sm hover:bg-white/10 transition-all">
                        Appeal Decision
                      </button>
                      <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20">
                        View Alternatives
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "Dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 relative h-64 rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 p-10 flex flex-col justify-between group">
                   <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <Zap className="w-40 h-40 text-primary" />
                   </div>
                   <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Total Outstanding</div>
                        <div className="text-5xl font-black text-white mb-2">₦{remainingVal.toLocaleString()}</div>
                        <div className="text-sm font-medium text-slate-400">Next payment of <span className="text-white font-bold">₦{monthlyRepayment.toLocaleString()}</span> due on the <span className="text-primary font-bold">15th of next month</span>.</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl text-center">
                         <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Credit Score</div>
                         <div className="text-2xl font-black text-green-400">{creditScore}</div>
                         <div className="text-[8px] font-bold text-slate-500">{creditScore > 750 ? 'EXCELLENT' : creditScore > 650 ? 'GOOD' : 'FAIR'}</div>
                      </div>
                   </div>
                   <div className="relative z-10 flex gap-4">
                      <button onClick={handlePayment} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
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
                      <div className="text-xs font-bold text-primary">{progressPercent}%</div>
                   </div>
                   <div className="relative h-4 w-full bg-white/5 rounded-full mb-8 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${progressPercent}%` }} 
                        className="h-full bg-primary shadow-[0_0_15px_var(--primary)]" 
                      />
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-muted-foreground font-medium">Principal Paid</span>
                         <span className="font-bold">₦{paidVal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-muted-foreground font-medium">Tenure Remaining</span>
                         <span className="font-bold">{data?.tenure || 12} Months</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-muted-foreground font-medium">Interest Accrued</span>
                         <span className="font-bold text-primary">{data?.interest_rate || '3.5%'}</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatBox icon={<DollarSign className="w-5 h-5" />} label="Approved Loan" value={loanAmount} sub={`Disbursed ${new Date(data?.created_at).toLocaleDateString()}`} />
                 <StatBox icon={<Car className="w-5 h-5" />} label="Car Value" value={`₦${(carInfo.valuation || 0).toLocaleString()}`} sub={`${carInfo.make} ${carInfo.model}`} color="blue-400" />
                 <StatBox icon={<TrendingUp className="w-5 h-5" />} label="Total Repayable" value={`₦${Math.round(totalLoanVal * 1.035).toLocaleString()}`} sub="Incl. Interest" color="purple-400" />
                 <StatBox icon={<ShieldCheck className="w-5 h-5" />} label="Protection" value="Active" sub={carInfo.insurance_type || 'Comprehensive'} color="green-400" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-1 group relative rounded-[3rem] overflow-hidden bg-card/40 border border-white/5">
                    <img src="https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=1000" className="w-full h-64 object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] font-black uppercase mb-3">Your Vehicle</div>
                       <h3 className="text-2xl font-black mb-1">{carInfo.make} {carInfo.model}</h3>
                       <div className="text-sm font-bold text-muted-foreground mb-4">{carInfo.year} • {carInfo.plate_number}</div>
                       <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                          Manage Asset <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                 </div>

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
                             {data?.history && data.history.length > 0 ? data.history.map((h: any, i: number) => (
                               <tr key={i} className="group hover:bg-white/5 transition-colors">
                                  <td className="px-8 py-5 text-sm font-bold">{new Date(h.date).toLocaleDateString()}</td>
                                  <td className="px-8 py-5 text-xs font-mono text-muted-foreground">#{h.id}</td>
                                  <td className="px-8 py-5 text-sm font-black text-white">₦{Number(h.amount).toLocaleString()}</td>
                                  <td className="px-8 py-5 text-sm text-muted-foreground">{h.method}</td>
                                  <td className="px-8 py-5">
                                     <span className={cn(
                                       "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                                       h.status === 'Successful' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                     )}>
                                        {h.status}
                                     </span>
                                  </td>
                               </tr>
                             )) : (
                                <tr>
                                   <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground italic text-sm font-medium tracking-wide">
                                      No payment transactions found on record.
                                   </td>
                                </tr>
                             )}
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

          {activeTab === "Car" && (
            <motion.div
              key="car"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
               <h2 className="text-3xl font-black">Car & Valuation</h2>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-card/40 border border-white/5 rounded-[3rem] p-10">
                     <Car className="w-12 h-12 text-blue-400 mb-6" />
                     <h3 className="text-xl font-black mb-4">Vehicle Identity</h3>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                           <span className="text-muted-foreground font-medium">Make & Model</span>
                           <span className="font-bold">{carInfo.make} {carInfo.model}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                           <span className="text-muted-foreground font-medium">Manufacturing Year</span>
                           <span className="font-bold">{carInfo.year}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                           <span className="text-muted-foreground font-medium">Plate Number</span>
                           <span className="font-mono text-primary font-bold">{carInfo.plate_number}</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-card/40 border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between">
                     <div>
                        <ShieldCheck className="w-12 h-12 text-green-400 mb-6" />
                        <h3 className="text-xl font-black mb-4">Asset Valuation</h3>
                        <p className="text-muted-foreground mb-6">Your vehicle's verified market value used to collateralize this loan.</p>
                        <div className="text-3xl font-black text-white mb-8">₦{(carInfo.valuation || 0).toLocaleString()}</div>
                     </div>
                     <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                        Request Valuation Review <ChevronRight className="w-4 h-4" />
                      </button>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === "Payments" && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
               <h2 className="text-3xl font-black">Payments Directory</h2>
               <div className="bg-card/40 border border-white/5 rounded-[3rem] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                       <h3 className="text-xl font-black">Full Transaction Ledger</h3>
                       <button className="text-xs font-bold text-primary flex items-center gap-2 hover:underline">
                          <Download className="w-4 h-4" /> Export CSV
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
                             {data?.history && data.history.length > 0 ? data.history.map((h: any, i: number) => (
                               <tr key={i} className="group hover:bg-white/5 transition-colors">
                                  <td className="px-8 py-5 text-sm font-bold">{new Date(h.date).toLocaleDateString()}</td>
                                  <td className="px-8 py-5 text-xs font-mono text-muted-foreground">#{h.id}</td>
                                  <td className="px-8 py-5 text-sm font-black text-white">₦{Number(h.amount).toLocaleString()}</td>
                                  <td className="px-8 py-5 text-sm text-muted-foreground">{h.method}</td>
                                  <td className="px-8 py-5">
                                     <span className={cn(
                                       "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                                       h.status === 'successful' || h.status === 'Successful' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                     )}>
                                        {h.status}
                                     </span>
                                  </td>
                               </tr>
                             )) : (
                                <tr>
                                   <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground italic text-sm font-medium tracking-wide">
                                      No payment transactions found on record.
                                   </td>
                                </tr>
                             )}
                          </tbody>
                       </table>
                    </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                      modal.type === 'error' ? <Info className="w-10 h-10" /> : 
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
    </div>
  );
};
