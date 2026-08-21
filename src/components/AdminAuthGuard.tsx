import React, { useEffect, useState } from 'react';
import { Lock, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';
import { supabase, AUTHORIZED_ADMIN_EMAIL } from '../lib/supabase';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check local session cache
    const cachedAdmin = localStorage.getItem('smsaad_admin_session');
    if (cachedAdmin === AUTHORIZED_ADMIN_EMAIL) {
      setUserEmail(AUTHORIZED_ADMIN_EMAIL);
      setLoading(false);
      return;
    }

    // 2. Check Supabase auth session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        }
      } catch (err) {
        console.warn('Supabase auth session check:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for OAuth redirects
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        if (session.user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
          localStorage.setItem('smsaad_admin_session', AUTHORIZED_ADMIN_EMAIL);
        }
      } else if (cachedAdmin !== AUTHORIZED_ADMIN_EMAIL) {
        setUserEmail(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setAuthError(err.message || 'Failed to initialize Google Auth. Use local admin bypass below.');
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem('smsaad_admin_session');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUserEmail(null);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-north-bg text-north-black">
        <div className="w-10 h-10 border-4 border-north-black border-t-north-lime rounded-full animate-spin"></div>
        <p className="font-heading font-bold text-xs uppercase tracking-wider">Verifying Admin Permissions...</p>
      </div>
    );
  }

  // Check if authenticated as authorized admin email
  const isAuthorized = userEmail && userEmail.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  if (isAuthorized) {
    return (
      <div>
        {/* Admin Bar Status */}
        <div className="bg-north-black text-white px-6 py-2 border-b border-north-black flex items-center justify-between text-xs font-heading font-bold">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-north-lime rounded-full animate-pulse"></span>
            <span className="text-north-lime">AUTHENTICATED ADMIN</span>
          </div>
          <button
            onClick={handleSignOut}
            className="hover:text-north-lime inline-flex items-center space-x-1 text-[11px] uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            <span>Sign Out</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-north-bg text-north-black">
      <div className="border border-north-black bg-white max-w-md w-full p-8 space-y-6 shadow-2xl text-center">
        
        <div className="w-16 h-16 bg-north-lime text-north-black rounded-full flex items-center justify-center mx-auto border border-north-black shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="bg-north-black text-north-lime font-heading font-bold text-[10px] uppercase px-3 py-1 border border-north-black inline-block">
            RESTRICTED ADMIN ACCESS
          </span>
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight">Admin Sign In</h2>
          <p className="text-north-gray text-xs leading-relaxed">
            Only the authorized administrator can manage blogs and digital assets.
          </p>
        </div>

        {userEmail && !isAuthorized && (
          <div className="border border-red-500 bg-red-50 p-4 text-xs text-red-700 text-left space-y-1">
            <div className="font-bold flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
              <span>Access Denied ({userEmail})</span>
            </div>
            <p>This account is not authorized to manage smsaad.online. Please sign in with the authorized admin account.</p>
          </div>
        )}

        {authError && (
          <div className="border border-amber-400 bg-amber-50 p-3 text-[11px] text-amber-900 text-left">
            {authError}
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Official Google OAuth Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-4 bg-north-black text-white hover:bg-north-lime hover:text-north-black border border-north-black font-heading font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center space-x-3 shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign In with Google</span>
          </button>
        </div>

        <div className="pt-4 border-t border-north-dark-sand text-[11px] text-north-gray">
          Authorized for SM SAAD • smsaad.online
        </div>

      </div>
    </div>
  );
};
