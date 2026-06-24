/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { 
  LogIn, Mail, Key, Shield, AlertCircle, CheckCircle2, 
  Sparkles, ShieldAlert, ArrowRight, UserCheck, LogOut, Info, Settings
} from "lucide-react";

interface LoginViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function LoginView({ onNavigate }: LoginViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "user">("admin");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Store bindings
  const [role, setRole] = useState(store.getRole());
  const [currentUserEmail, setCurrentUserEmail] = useState(store.getCurrentUserEmail());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRole(store.getRole());
      setCurrentUserEmail(store.getCurrentUserEmail());
    });
    return unsub;
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      // Graceful local simulated sandbox mode when keys are absent
      setTimeout(() => {
        setLoading(false);
        store.setRole(selectedRole === "admin" ? "Admin" : "User");
        setSuccessMsg(`${isSignUp ? "Simulated Account Created" : "Logged in"}! Active role: ${selectedRole.toUpperCase()}. Configure Supabase Secrets to test live OAuth & database connection.`);
      }, 800);
      return;
    }

    try {
      if (isSignUp) {
        // Sign up with option metadata role
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: selectedRole
            }
          }
        });

        if (error) throw error;
        
        if (data.user) {
          // Check if auto-confirmed or requires verification
          const isAwaitingVerification = data.session === null;
          if (isAwaitingVerification) {
            setSuccessMsg("Registration complete! Check your email inbox for a verification link, or log in if your project auto-confirms users.");
          } else {
            setSuccessMsg(`Success! Registered and logged in as ${selectedRole.toUpperCase()}.`);
          }
        }
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (data.user) {
          const actualRole = data.user.user_metadata?.role || "user";
          setSuccessMsg(`Welcome back! Authenticated as ${actualRole.toUpperCase()}.`);
          
          // Redirect to home or admin
          setTimeout(() => {
            if (actualRole === "admin") {
              onNavigate("admin");
            } else {
              onNavigate("home");
            }
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error("Authentication action failed:", err);
      setErrorMsg(err.message || "An authentication error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Create a safety fallback timeout of 1.5 seconds to force local signout if Supabase hangs
    const fallbackTimeout = setTimeout(() => {
      console.warn("Sign out request taking longer than expected. Force-clearing local session.");
      // Force store local logout
      store.clearSession();
      setLoading(false);
    }, 1500);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        clearTimeout(fallbackTimeout);
        if (error) throw error;
        setSuccessMsg("Signed out from Supabase Cloud Auth successfully.");
      } catch (err: any) {
        clearTimeout(fallbackTimeout);
        console.error("Supabase signOut error, force-clearing locally:", err);
        // Force-clear locally on error
        store.clearSession();
        setErrorMsg(err.message || "Sign out failed, but local session was cleared.");
      } finally {
        setLoading(false);
      }
    } else {
      clearTimeout(fallbackTimeout);
      // Local simulated reset
      store.clearSession();
      setSuccessMsg("Cleared simulated credentials session.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 py-8" id="login-container-view">
      
      {/* Branding and Greeting */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E10600]/10 border border-[#E10600]/20 text-xs font-mono font-bold text-[#E10600] uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 animate-pulse" /> F1 Paddock Access Control
        </div>
        <h1 className="font-display font-black text-3xl text-white uppercase tracking-tight mt-3">
          {currentUserEmail ? "Paddock Member Card" : isSignUp ? "Apply for Credentials" : "Enter the Grid"}
        </h1>
        <p className="text-zinc-400 text-xs font-sans max-w-sm mx-auto leading-relaxed">
          {currentUserEmail 
            ? "Inspect your authenticated identity, security token roles, and active paddock permissions below." 
            : "Sign in with your email to log telemetry data, publish race summaries, and access admin settings."}
        </p>
      </div>

      {/* Already Logged In Session State Card */}
      {currentUserEmail ? (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-6 shadow-2xl relative overflow-hidden" id="auth-status-card">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center text-[#E10600] font-display font-black italic text-xl">
              1G
            </div>
            <div>
              <p className="text-white font-mono font-bold text-sm truncate max-w-[240px]">{currentUserEmail}</p>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase mt-1 ${
                role === "Admin" 
                  ? "bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30" 
                  : "bg-white/5 text-zinc-300 border border-white/10"
              }`}>
                <Shield className="w-3 h-3" /> Role: {role}
              </span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-3">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Paddock Access Privileges</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-white/2 border border-white/5 rounded p-2.5 space-y-0.5">
                <span className="text-[10px] text-zinc-500 block uppercase">View Archives</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Allowed</span>
              </div>
              <div className="bg-white/2 border border-white/5 rounded p-2.5 space-y-0.5">
                <span className="text-[10px] text-zinc-500 block uppercase">Write / Edit rows</span>
                <span className={role === "Admin" ? "text-emerald-400 font-bold flex items-center gap-1" : "text-amber-500 font-bold flex items-center gap-1"}>
                  {role === "Admin" ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Allowed</>
                  ) : (
                    <><ShieldAlert className="w-3.5 h-3.5" /> Read-Only</>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {role === "Admin" && (
              <button
                onClick={() => onNavigate("admin")}
                className="flex-grow py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4" /> Go to Admin Panel
              </button>
            )}
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="flex-grow py-2.5 bg-[#E10600] hover:bg-[#ff0700] text-white rounded font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" /> {loading ? "Signing Out..." : "Sign Out Credentials"}
            </button>
          </div>
        </div>
      ) : (
        /* Sign In / Sign Up Card */
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-6 shadow-2xl relative overflow-hidden" id="auth-form-card">
          
          {/* Tabs switch */}
          <div className="flex border-b border-white/5 pb-2">
            <button
              onClick={() => { setIsSignUp(false); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-grow py-2 font-mono text-xs font-bold uppercase transition-all cursor-pointer border-b-2 text-center ${
                !isSignUp 
                  ? "border-[#E10600] text-white" 
                  : "border-transparent text-zinc-500 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-grow py-2 font-mono text-xs font-bold uppercase transition-all cursor-pointer border-b-2 text-center ${
                isSignUp 
                  ? "border-[#E10600] text-white" 
                  : "border-transparent text-zinc-500 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Email field */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-zinc-500 uppercase block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@racingdb.com"
                  className="w-full bg-[#111] border border-white/10 rounded px-3 py-2.5 pl-10 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-zinc-500 uppercase block">Secure Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
                  <Key className="w-4 h-4" />
                </span>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111] border border-white/10 rounded px-3 py-2.5 pl-10 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            {/* Meta role choice on Sign Up (always) and Sign In (sandbox mode only) */}
            {(isSignUp || !isSupabaseConfigured) && (
              <div className="bg-white/2 border border-white/5 rounded-lg p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center gap-1 text-[#E10600] font-bold uppercase text-[10px] tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" /> {isSignUp ? "Assign Account Security Role" : "Select Simulation Role"}
                </div>
                <p className="text-zinc-500 text-[10px] font-sans leading-relaxed">
                  {isSignUp
                    ? <>This sets the <code className="bg-white/5 text-zinc-300 px-1 py-0.5 rounded">user_metadata.role</code> claim. If registered as **Admin**, the database RLS policies will permit complete CRUD actions.</>
                    : <>Sandbox mode — choose the role for this simulated session.</>
                  }
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`py-2 rounded font-bold transition-all border ${
                      selectedRole === "admin" 
                        ? "bg-[#E10600]/10 border-[#E10600] text-[#E10600]" 
                        : "bg-black/50 border-white/5 text-zinc-500 hover:text-white"
                    }`}
                  >
                    Admin CRUD Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("user")}
                    className={`py-2 rounded font-bold transition-all border ${
                      selectedRole === "user" 
                        ? "bg-[#E10600]/10 border-[#E10600] text-[#E10600]" 
                        : "bg-black/50 border-white/5 text-zinc-500 hover:text-white"
                    }`}
                  >
                    Regular Reader
                  </button>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {errorMsg && (
              <div className="bg-red-500/5 border border-red-500/10 p-3 rounded text-xs text-red-400 font-mono space-y-1">
                <p className="font-bold flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> Authentication Failed</p>
                <p className="text-[10px] leading-relaxed">{errorMsg}</p>
              </div>
            )}

            {/* Success Notification */}
            {successMsg && (
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded text-xs text-emerald-400 font-mono space-y-1">
                <p className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Success</p>
                <p className="text-[10px] leading-relaxed">{successMsg}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E10600] hover:bg-[#ff0700] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed font-mono font-bold text-xs text-white uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <span>Verifying Security Keys...</span>
              ) : (
                <>
                  <span>{isSignUp ? "Submit Credentials Request" : "Connect to Secure Server"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Fallback Sandbox Information Banner */}
          {!isSupabaseConfigured && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 font-mono text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold uppercase text-[10px]">
                <Info className="w-3.5 h-3.5" /> Sandbox Simulated Mode
              </div>
              <p className="text-[10px] font-sans leading-relaxed">
                Supabase URL & Anon Key are currently absent from secrets. You can type any credentials to simulate successful login:
              </p>
              <ul className="list-disc pl-4 text-[10px] font-sans space-y-1">
                <li>Use the <strong>Select Simulation Role</strong> chooser above to pick Admin or Reader.</li>
                <li>Any email/password combination works — no real authentication occurs.</li>
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
