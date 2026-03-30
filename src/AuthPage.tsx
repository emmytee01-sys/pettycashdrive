import { useState, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ChevronLeft,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AuthPageProps {
  onLogin: (role: 'admin' | 'user') => void;
  onBack: () => void;
}

export const AuthPage: FC<AuthPageProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulated Auth Logic
    setTimeout(() => {
      setIsLoading(false);
      
      // Determine role based on email for simulation
      if (email.includes('admin')) {
        setIsSuccess(true);
        setTimeout(() => onLogin('admin'), 1500);
      } else if (email.includes('@')) {
        setIsSuccess(true);
        setTimeout(() => onLogin('user'), 1500);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden">
      {/* Left Branding Side */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center p-20 overflow-hidden bg-gradient-to-br from-[#020617] to-[#0f172a]">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 space-y-12">
          <motion.button 
            onClick={onBack}
            whileHover={{ x: -10 }}
            className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-wide">Back to Home</span>
          </motion.button>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="PettyCash" className="w-16 h-16 object-contain" />
              <h1 className="text-4xl font-black tracking-tight">Petty<span className="text-primary italic">Cash</span></h1>
            </div>
            <h2 className="text-6xl font-black leading-tight">
              Unlock your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Financial Future.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Secure, fast, and transparent lending for car owners and dealers. Manage your applications and funds in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-12">
            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md">
               <Shield className="w-8 h-8 text-primary mb-4" />
               <div className="font-bold text-lg mb-1">Bank-Grade Security</div>
               <p className="text-sm text-muted-foreground">Your data is encrypted and secure with us.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md">
               <Lock className="w-8 h-8 text-blue-400 mb-4" />
               <div className="font-bold text-lg mb-1">Instant Verification</div>
               <p className="text-sm text-muted-foreground">Get approved in minutes with AI-powered checks.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Side */}
      <div className="w-full lg:w-1/2 relative bg-white flex items-center justify-center p-8 md:p-20">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-12"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
             <div className="flex items-center gap-2">
                <img src="/logo.png" alt="PettyCash" className="w-10 h-10 object-contain" />
                <span className="text-slate-900 font-extrabold text-2xl tracking-tighter">PettyCash</span>
             </div>
          </div>

          <div className="text-center lg:text-left space-y-4">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h3>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 tracking-wide uppercase px-1">Email Address</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                       <input 
                         required
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="e.g. admin@pettycash.com" 
                         className="w-full p-5 pl-12 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-300 font-medium text-slate-900" 
                       />
                    </div>
                    <p className="text-[10px] text-slate-400 px-1 italic">Try "admin@pettycash.com" for admin dashboard.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">Password</label>
                      <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot Password?</button>
                    </div>
                    <div className="relative group">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                       <input 
                         required
                         type={showPassword ? "text" : "password"} 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="••••••••" 
                         className="w-full p-5 pl-12 pr-12 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-300 font-medium text-slate-900" 
                       />
                       <button 
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                       >
                         {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                       </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1">
                   <input type="checkbox" id="remember" className="w-5 h-5 accent-primary rounded-md border-slate-200" />
                   <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer select-none">Remember this device</label>
                </div>

                <button 
                  disabled={isLoading}
                  className={cn(
                    "w-full py-5 rounded-[2rem] font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95",
                    isLoading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-[#020617] text-white hover:bg-slate-900"
                  )}
                >
                  {isLoading ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-4 border-slate-300 border-t-primary rounded-full shadow-inner" 
                    />
                  ) : (
                    <>Sign In Now <ArrowRight className="w-6 h-6" /></>
                  )}
                </button>

                <div className="text-center pt-4">
                  <p className="text-slate-500 font-medium">
                    Don't have an account? <button type="button" className="text-primary font-bold hover:underline">Get started today</button>
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4">Success!</h2>
                <p className="text-slate-500 text-lg">Authenticating your profile, please wait...</p>
                <div className="mt-8 flex justify-center gap-2">
                   <motion.div animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 bg-primary rounded-full" />
                   <motion.div animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-3 h-3 bg-primary rounded-full" />
                   <motion.div animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-3 h-3 bg-primary rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Role Select (Optional, for demo) */}
          <div className="pt-12 border-t border-slate-100">
             <p className="text-center text-[10px] uppercase tracking-widest font-black text-slate-300 mb-6">Quick Role Access</p>
             <div className="flex gap-4">
                <button 
                  onClick={() => onLogin('admin')}
                  className="flex-1 flex items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-primary/10 hover:border-primary/20 transition-all group"
                >
                   <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                   <span className="text-xs font-bold text-slate-600 group-hover:text-primary">Admin Portal</span>
                </button>
                <button 
                  onClick={() => onLogin('user')}
                  className="flex-1 flex items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-primary/10 hover:border-primary/20 transition-all group"
                >
                   <User className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                   <span className="text-xs font-bold text-slate-600 group-hover:text-primary">User Portal</span>
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
