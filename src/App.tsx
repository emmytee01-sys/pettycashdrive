import { FC, ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Clock, 
  Car, 
  CreditCard, 
  ChevronRight, 
  CheckCircle2, 
  Menu, 
  X, 
  ArrowRight,
  User,
  Star,
  Users,
  Zap
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Components
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="PettyCash Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-2xl tracking-tight text-white">
            Petty<span className="text-primary">Cash</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#" className="hover:text-primary transition-colors">For Dealers</a>
          <a href="#" className="hover:text-primary transition-colors">About Us</a>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openForm'))}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-primary/20"
          >
            Apply Now
          </button>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-white/5 p-6 space-y-4"
          >
            <a href="#" className="block text-lg font-medium">How It Works</a>
            <a href="#" className="block text-lg font-medium">For Dealers</a>
            <a href="#" className="block text-lg font-medium">About Us</a>
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold">
              Apply Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FeatureCard: FC<{ title: string; desc: string; icon: ReactNode }> = ({ title, desc, icon }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-card/50 p-8 rounded-2xl border border-white/5 hover:border-primary/50 transition-all group"
  >
    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{desc}</p>
  </motion.div>
);

const StatCard: FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <div className="text-4xl font-extrabold text-white mb-2">{value}</div>
    <div className="text-sm text-muted-foreground uppercase tracking-widest">{label}</div>
  </div>
);

const LoanForm: FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);

  const steps = [
    { label: "Loan Details", icon: <CreditCard className="w-5 h-5" /> },
    { label: "Car Valuation", icon: <Car className="w-5 h-5" /> },
    { label: "Indicative Offer", icon: <CheckCircle2 className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Left Branding Side */}
      <div className="lg:w-[40%] bg-gradient-to-br from-[#020617] to-[#0f172a] p-12 lg:p-20 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-20 group">
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
               <ArrowRight className="w-4 h-4 rotate-180" />
             </div>
             Back to Home
          </button>
          
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-8" />
          <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-8">
            {step === 1 ? (
              <>Your loan offer <br /> is just a <span className="text-primary">few simple</span> <br /> steps away.</>
            ) : step === 2 ? (
              <>Valuing your car <br /> can get you a <span className="text-primary">loan offer</span> <br /> tailored to its worth.</>
            ) : (
              <>Application <br /> successfully <span className="text-primary">submitted.</span></>
            )}
          </h1>
          <p className="text-white/60 text-xl max-w-sm mb-12">
            {step === 1 
              ? "Tell us a little about yourself, and we'll prepare your instant loan offer right where you are."
              : step === 2 
              ? "Let's value your car together and show you how much you can access instantly."
              : "Great job! Your application is now being processed by our automated systems."
            }
          </p>
          
          <div className="relative mt-auto">
             <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="h-2 w-32 bg-white/10 rounded-full flex overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }} className="h-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/5 rounded-full" />
                  <div className="h-4 w-4/5 bg-white/5 rounded-full" />
                </div>
             </div>
             {/* Decorative floating percent */}
             <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/20 backdrop-blur-xl rounded-full flex items-center justify-center text-4xl font-black text-primary shadow-2xl border border-white/10 rotate-12">
               %
             </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 p-8 lg:p-20 flex flex-col items-center justify-center bg-white relative">
        <div className="w-full max-w-2xl">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-20 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div 
                  onClick={() => i + 1 < step && setStep(i + 1)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer",
                    step > i + 1 ? "bg-green-500 text-white" : (step === i + 1 ? "bg-primary text-primary-foreground shadow-[0_0_20px_var(--primary)]" : "bg-slate-50 text-slate-400 border border-slate-100")
                  )}
                >
                  {step > i + 1 ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
                </div>
                <div className="absolute top-16 whitespace-nowrap text-center">
                   <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Step {i+1}</div>
                   <div className={cn("text-xs font-bold", step === i + 1 ? "text-slate-900" : "text-slate-400")}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-32"
          >
            {step === 1 ? (
              <>
                <h2 className="text-3xl font-black mb-4">Loan Details</h2>
                <p className="text-slate-500 mb-12">Help us get to know you and understand the loan you're looking for.</p>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-6">
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-400">Personal Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">What's your first name?</label>
                        <input type="text" placeholder="Enter First Name" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">What's your last name?</label>
                        <input type="text" placeholder="Enter Last Name" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">What's your phone number?</label>
                        <input type="tel" placeholder="Enter Phone Number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">What's your email address?</label>
                        <input type="email" placeholder="Enter Email Address" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-400">Loan Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">How much do you need?</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">NGN</span>
                          <input type="number" placeholder="0" className="w-full p-4 pl-16 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">For how long do you need this loan?</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none">
                          <option>Select Tenure</option>
                          <option>3 Months</option>
                          <option>6 Months</option>
                          <option>12 Months</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">How would you like to repay your loan?</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none">
                          <option>Repayment Plan</option>
                          <option>Monthly</option>
                          <option>Quarterly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="w-5 h-5 accent-primary cursor-pointer"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <label htmlFor="terms" className="text-sm text-slate-500 cursor-pointer">
                    I agree to the following <span className="text-primary font-bold">Terms & Conditions, Electronic Disclosure</span>
                  </label>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className={cn(
                    "mt-12 w-full py-5 rounded-[2rem] font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3",
                    agreed ? "bg-[#020617] text-white hover:scale-[1.02]" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                  disabled={!agreed}
                >
                  Next Step <ArrowRight className="w-6 h-6" />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black mb-4">Car Valuation</h2>
                <p className="text-slate-500 mb-12">Kindly provide your car details in the form below.</p>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-6">
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-400">Car Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">What make is your car?</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none">
                          <option>Select Car Make</option>
                          <option>Toyota</option>
                          <option>Mercedes-Benz</option>
                          <option>Lexus</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Which model is your car?</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none">
                          <option>Select Car Model</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">When was your car produced?</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none">
                          <option>Select Production Year</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">What's the condition of your car?</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none">
                          <option>Select Car Condition</option>
                        </select>
                      </div>
                      
                      <div className="pt-4">
                        <p className="text-sm font-bold text-slate-700 mb-4">Are you the registered owner of the car?</p>
                        <div className="flex gap-8">
                          <label className="flex items-center gap-2 cursor-pointer group">
                             <input type="radio" name="owner" className="w-5 h-5 accent-primary" />
                             <span className="font-bold text-slate-600 group-hover:text-primary transition-colors">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                             <input type="radio" name="owner" className="w-5 h-5 accent-primary" />
                             <span className="font-bold text-slate-600 group-hover:text-primary transition-colors">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-400">Registration Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Which state do you reside in?</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none">
                          <option>Select State Of Residence</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">What is your car's license plate number? (Optional)</label>
                        <input type="text" placeholder="Enter License Plate Number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Does your car have Insurance? (Optional)</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none">
                          <option>Select Option</option>
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">What type of insurance do you have? (Optional)</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none">
                          <option>Insurance Type</option>
                          <option>Third Party</option>
                          <option>Comprehensive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(3)}
                  className="mt-12 w-full py-5 bg-[#020617] text-white rounded-[2rem] font-black text-xl hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Submit Application <ArrowRight className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce font-bold text-4xl">
                   <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black mb-4">Application Submitted!</h2>
                <p className="text-slate-500 text-xl mb-12">
                   Kindly check your email for confirmation. Your unique reference is <span className="text-[#020617] font-bold">#PC-67902</span>
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 text-left mb-12 shadow-sm">
                   <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Owner Summary</h3>
                         <div className="space-y-3">
                            <div className="flex justify-between border-b border-slate-200/50 pb-2">
                               <span className="text-slate-400 text-sm">Full Name</span>
                               <span className="font-bold text-slate-900">Tosin Akindele</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200/50 pb-2">
                               <span className="text-slate-400 text-sm">Phone</span>
                               <span className="font-bold text-slate-900">+234 812 345 6789</span>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Car Summary</h3>
                         <div className="space-y-3">
                            <div className="flex justify-between border-b border-slate-200/50 pb-2">
                               <span className="text-slate-400 text-sm">Vehicle</span>
                               <span className="font-bold text-slate-900">Mercedes G63 (2022)</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200/50 pb-2">
                               <span className="text-slate-400 text-sm">Plate No.</span>
                               <span className="font-bold text-slate-900">LND-456-AA</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={onBack}
                  className="px-12 py-5 bg-[#020617] text-white rounded-[2rem] font-bold flex items-center gap-3 mx-auto hover:scale-105 transition-transform"
                >
                  Return to Dashboard <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleOpenForm = () => setShowForm(true);
    window.addEventListener('openForm', handleOpenForm);
    return () => window.removeEventListener('openForm', handleOpenForm);
  }, []);

  if (showForm) {
    return <LoanForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 scroll-smooth">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              <span>Fast Cash within 24 Hours</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-8">
              Unlock Fast Cash with <br />
              <span className="text-primary italic">Your Car.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
              When you need it most, we make it simple. Apply in minutes, get approved fast, and receive funds within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                Get Cash Now <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-card border border-white/10 rounded-xl font-bold text-lg hover:bg-white/5 transition-all text-white flex items-center justify-center gap-2">
                View Requirements
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-[#020617] bg-muted flex items-center justify-center overflow-hidden">
                    <User className="text-muted-foreground w-6 h-6" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Trusted by 10,000+ car owners
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl glass p-2">
              <img 
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000" 
                alt="Modern Car" 
                className="w-full h-auto rounded-[1.8rem]"
              />
              <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Max Loan Amount</div>
                  <div className="text-2xl font-bold font-mono">₦15,000,000+</div>
                </div>
                <div className="h-10 w-[1px] bg-white/10" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Interest Rate</div>
                  <div className="text-2xl font-bold text-primary">From 3%</div>
                </div>
              </div>
            </div>
            
            {/* Decortive elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </motion.div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Who We Serve</h2>
            <p className="text-xl text-muted-foreground">
              At PettyCash, we help car owners and dealers unlock fast, flexible funding using their vehicles—no unnecessary stress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Car Owners */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="group relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-sm"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000" 
                  alt="Car owner financing" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>
              <div className="p-10 relative -mt-32">
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                  For Car Owners
                </div>
                <h3 className="text-3xl font-bold mb-4">Need quick cash for bills, school fees, or your business?</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Use your car to access fast, reliable funding with flexible terms that work for you.
                </p>
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center gap-2">
                  Get Cash Now <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* For Car Dealers */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="group relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-sm"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=1000" 
                  alt="Car dealership" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>
              <div className="p-10 relative -mt-32">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                  For Car Dealers
                </div>
                <h3 className="text-3xl font-bold mb-4">Running a dealership and need inventory funding?</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Get quick, flexible credit to restock inventory, manage operations, or take advantage of new opportunities—without the usual bank stress.
                </p>
                <button className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                  Check Eligibility <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-[#020617]">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-6xl font-black mb-6 tracking-tight"
            >
              How It <span className="text-primary">Works</span>
            </motion.h2>
            <p className="text-xl text-muted-foreground uppercase tracking-[0.2em] font-bold text-sm">
              Simple • Fast • Transparent
            </p>
          </div>

          <div className="relative">
            {/* Connection Arrows (Large Screens) */}
            <div className="hidden lg:block absolute top-1/4 left-1/3 w-[30%] h-1 z-0">
              <svg className="w-full h-24 overflow-visible">
                <motion.path 
                  d="M0,0 C50,0 50,40 100,40" 
                  fill="none" 
                  stroke="url(#grad1)" 
                  strokeWidth="3" 
                  strokeDasharray="8 8"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--primary)" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="40" r="4" fill="var(--primary)" />
              </svg>
              <div className="absolute right-0 top-10 transform translate-x-1/2">
                 <ArrowRight className="text-primary w-8 h-8" />
              </div>
            </div>

            <div className="hidden lg:block absolute top-[60%] left-2/3 w-[30%] h-1 z-0">
               <svg className="w-full h-24 overflow-visible">
                <motion.path 
                  d="M0,0 C50,0 50,-40 100,-40" 
                  fill="none" 
                  stroke="url(#grad2)" 
                  strokeWidth="3" 
                  strokeDasharray="8 8"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--primary)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute right-0 -top-10 transform translate-x-1/2">
                 <ArrowRight className="text-primary w-8 h-8" />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 relative z-10">
              {/* Step 1 */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-white/10 to-transparent rounded-[3rem] p-1 border border-white/10 overflow-hidden group">
                  <div className="w-full h-full bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.8rem] p-8 flex flex-col">
                    <div className="flex-1 relative flex items-center justify-center">
                       {/* Ultra-modern Form Mockup */}
                       <div className="relative w-40 h-52 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 transform -rotate-6">
                          <div className="text-[8px] font-bold text-slate-300 mb-3 uppercase tracking-tighter">Loan Form</div>
                          <div className="space-y-2">
                            <div className="w-full h-2 bg-slate-100 rounded" />
                            <div className="w-4/5 h-2 bg-slate-100 rounded" />
                            <div className="w-full h-8 bg-primary/10 rounded-lg flex items-center px-2">
                               <div className="w-full h-1 bg-primary/30 rounded" />
                            </div>
                          </div>
                       </div>
                       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-44 h-56 bg-slate-50 rounded-2xl border border-primary p-5 shadow-2xl rotate-3">
                          <div className="flex justify-between items-center mb-4">
                            <div className="text-[10px] font-black text-slate-800 uppercase">Apply Now</div>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-1">
                               <div className="text-[7px] text-slate-400">Car Model</div>
                               <div className="w-full h-6 bg-slate-100 rounded flex items-center px-2 text-[9px] font-bold text-slate-700">Mercedes G63</div>
                            </div>
                            <div className="space-y-1">
                               <div className="text-[7px] text-slate-400">Value</div>
                               <div className="w-full h-6 bg-slate-100 rounded flex items-center px-2 text-[9px] font-bold text-slate-700">₦45,000,000</div>
                            </div>
                            <div className="w-full h-10 bg-primary rounded-xl" />
                          </div>
                          {/* Badges */}
                          <div className="absolute -left-6 top-10 bg-[#0f172a] text-white text-[9px] px-3 py-1.5 rounded-full font-bold shadow-2xl border border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Tosin
                          </div>
                       </div>
                    </div>
                    <div className="pt-8">
                      <div className="text-4xl font-black text-white/10 mb-2">01</div>
                      <h3 className="text-2xl font-bold mb-3 text-white">Apply in Minutes</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Share a few details about you and your car or dealership, and receive an instant offer from our AI-powered valuation system.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative lg:mt-20"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 to-transparent rounded-[3rem] p-1 border border-white/10 overflow-hidden group">
                  <div className="w-full h-full bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.8rem] p-8 flex flex-col">
                    <div className="flex-1 relative flex flex-col items-center justify-center">
                       {/* Inspection Visual */}
                       <div className="flex -space-x-4 mb-10">
                         {[1,2,3].map(i => (
                           <div key={i} className="w-14 h-14 rounded-full border-4 border-[#0f172a] overflow-hidden shadow-2xl transform hover:z-10 hover:scale-110 transition-transform">
                             <img src={`https://i.pravatar.cc/150?u=${i+10}`} className="w-full h-full object-cover" />
                           </div>
                         ))}
                       </div>
                       <div className="relative text-center">
                          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                          <div className="relative bg-white text-[#0f172a] px-8 py-3 rounded-2xl font-black text-sm shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
                            Team Inspection
                          </div>
                          {/* Floating dots */}
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 space-y-2">
                            <motion.div animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-primary" />
                            <motion.div animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                       </div>
                    </div>
                    <div className="pt-8">
                      <div className="text-4xl font-black text-white/10 mb-2">02</div>
                      <h3 className="text-2xl font-bold mb-3 text-white">Quick Inspection</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        We carry out a professional and respectful assessment of your vehicle or inventory—either at our office or your dealership.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 to-transparent rounded-[3rem] p-1 border border-white/10 overflow-hidden group">
                  <div className="w-full h-full bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.8rem] p-8 flex flex-col">
                    <div className="flex-1 relative flex items-center justify-center">
                       {/* Payout Mockup */}
                       <div className="relative w-64 h-40 bg-gradient-to-br from-slate-900 to-black rounded-3xl border border-white/10 p-6 shadow-2xl overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl" />
                          <div className="flex justify-between items-start mb-6">
                            <div>
                               <div className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1">Status</div>
                               <div className="text-xs font-bold text-green-400">Paid Out</div>
                            </div>
                            <img src="/logo.png" className="w-6 h-6 object-contain opacity-50" />
                          </div>
                          <div className="text-2xl font-mono font-bold text-white mb-2">₦45,000,000</div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: '100%' }}
                               transition={{ duration: 2 }}
                               className="h-full bg-primary shadow-[0_0_10px_var(--primary)]" 
                             />
                          </div>
                          <div className="flex items-center gap-2 mt-4 text-[8px] text-white/40">
                             <Clock className="w-3 h-3" /> Sent within 24 hours
                          </div>
                       </div>
                    </div>
                    <div className="pt-8">
                      <div className="text-4xl font-black text-white/10 mb-2">03</div>
                      <h3 className="text-2xl font-bold mb-3 text-white">Receive Funds</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Funds are disbursed immediately after inspection. Experience the fastest turnaround in Nigeria.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-card border-y border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <StatCard value="₦15B+" label="Loans Disbursed" />
          <StatCard value="10k+" label="Happy Customers" />
          <StatCard value="24h" label="Average Payout" />
          <StatCard value="100%" label="Transparency" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/20 blur-[120px] rounded-full" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl rounded-[4rem] p-12 lg:p-24 border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Inner decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            {/* Floating Card Mockups for 'Aesthetic' */}
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [-10, -5, -10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="hidden lg:block absolute right-20 top-20 w-48 h-32 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-2xl p-6 border border-white/20"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg mb-8" />
              <div className="w-full h-1 bg-white/40 rounded-full mb-2" />
              <div className="w-1/2 h-1 bg-white/20 rounded-full" />
            </motion.div>

            <div className="max-w-3xl relative z-10">
              <h2 className="text-4xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-white">
                Ready to unlock your <span className="text-primary italic">car's value?</span>
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed font-medium">
                Join thousands of Nigerians who trust <span className="text-white font-bold">PettyCash</span> for their emergency and business funding needs. Fast, fair, and reliable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-primary text-primary-foreground rounded-2xl font-black text-xl hover:bg-primary-dark transition-all shadow-[0_20px_40px_rgba(156,226,212,0.3)] flex items-center justify-center gap-3"
                >
                  Get Started Now <ArrowRight className="w-6 h-6" />
                </motion.button>
                <button className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                  Contact Support
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-black text-xl"><Shield className="w-6 h-6" /> SECURED</div>
              <div className="flex items-center gap-2 font-black text-xl"><CheckCircle2 className="w-6 h-6" /> CBN LICENSED</div>
              <div className="flex items-center gap-2 font-black text-xl"><Clock className="w-6 h-6" /> 24H PAYOUT</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <img src="/logo.png" alt="PettyCash Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-xl tracking-tight">PettyCash</span>
            </div>
            <p className="text-muted-foreground max-w-xs mb-8">
              Nigeria's most trusted car equity lending platform. Helping you fund your dreams without losing your drive.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Car Dealers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Loan Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-muted-foreground text-sm">
          © 2026 PettyCash. All rights reserved. Registered with CBN.
        </div>
      </footer>
    </div>
  );
}
