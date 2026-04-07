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
  AlertCircle,
  Phone
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AuthPageProps {
  onLogin: (data: { role: 'admin' | 'user', id: string }) => void;
  onBack: () => void;
}

export const AuthPage: FC<AuthPageProps> = ({ onLogin, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login' 
      ? { email, password } 
      : { email, password, name: fullName, phone };

    try {
      const res = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        const user = data.user || data; // Handle different response shapes
        setTimeout(() => onLogin({ role: user.role || 'user', id: user.id }), 1500);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Could not connect to the authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden">
      {/* Left Branding Side */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center p-20 overflow-hidden bg-gradient-to-br from-[#020617] to-[#0f172a]">
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
              {mode === 'login' ? "Welcome Back to" : "Join the"} <br />
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

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 relative bg-white flex items-center justify-center p-8 md:p-20 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-10 py-10"
        >
          <div className="lg:hidden flex justify-center mb-8">
             <div className="flex items-center gap-2">
                <img src="/logo.png" alt="PettyCash" className="w-10 h-10 object-contain" />
                <span className="text-slate-900 font-extrabold text-2xl tracking-tighter">PettyCash</span>
             </div>
          </div>

          <div className="text-center lg:text-left space-y-4">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                {mode === 'login' ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-slate-500 font-medium">
                {mode === 'login' ? "Please enter your details to sign in." : "Get started with your PettyCash account today."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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

                <div className="space-y-5">
                  {mode === 'register' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 tracking-wide uppercase px-1">Full Name</label>
                            <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                required
                                type="text" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your Name" 
                                className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-[1.2rem] focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-300 font-medium text-slate-900" 
                            />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 tracking-wide uppercase px-1">Phone Number</label>
                            <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                required
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="080 1234 5678" 
                                className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-[1.2rem] focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-300 font-medium text-slate-900" 
                            />
                            </div>
                        </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 tracking-wide uppercase px-1">Email Address</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                       <input 
                         required
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="name@example.com" 
                         className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-[1.2rem] focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-300 font-medium text-slate-900" 
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">Password</label>
                      {mode === 'login' && <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot?</button>}
                    </div>
                    <div className="relative group">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                       <input 
                         required
                         type={showPassword ? "text" : "password"} 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="••••••••" 
                         className="w-full p-4 pl-12 pr-12 bg-slate-50 border border-slate-100 rounded-[1.2rem] focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-300 font-medium text-slate-900" 
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

                <button 
                  disabled={isLoading}
                  className={cn(
                    "w-full py-4 rounded-[1.5rem] font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95",
                    isLoading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-[#020617] text-white hover:bg-slate-900"
                  )}
                >
                  {isLoading ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-4 border-slate-300 border-t-primary rounded-full" 
                    />
                  ) : (
                    <>{mode === 'login' ? 'Sign In Now' : 'Create Account'} <ArrowRight className="w-6 h-6" /></>
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-slate-500 font-medium">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button 
                        type="button" 
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className="text-primary font-bold hover:underline"
                    >
                        {mode === 'login' ? 'Get started today' : 'Sign in here'}
                    </button>
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
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Success!</h2>
                <p className="text-slate-500">Authenticating your profile...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-8 border-t border-slate-100">
             <div className="flex gap-4">
                <button 
                  onClick={() => onLogin({ role: 'admin', id: 'admin-seed-id' })}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-primary/10 hover:border-primary/20 transition-all group"
                >
                   <ShieldCheck className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                   <span className="text-[10px] font-black text-slate-400 group-hover:text-primary uppercase tracking-tighter">Demo Admin</span>
                </button>
                <button 
                  onClick={() => onLogin({ role: 'user', id: 'tosin-001-uuid-999-888' })}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-primary/10 hover:border-primary/20 transition-all group"
                >
                   <User className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                   <span className="text-[10px] font-black text-slate-400 group-hover:text-primary uppercase tracking-tighter">Demo User</span>
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
