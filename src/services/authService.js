import { supabase } from './supabaseClient';
import { apiService } from './api';

export const authService = {
  /**
   * Register a new citizen account with email/password OR phone/password.
   * Syncs user profile to local backend after Supabase account creation.
   */
  async register({ email, phone, password, fullName }) {
    // Build Supabase sign-up payload
    const signUpData = email
      ? { email, password }
      : { phone, password };

    try {
      const { data, error } = await supabase.auth.signUp({
        ...signUpData,
        options: { data: { full_name: fullName } }
      });

      if (error) throw new Error(error.message);

      const supabaseUser = data?.user;
      const userId = supabaseUser?.id;

      // Sync profile to our backend
      const backendUser = await apiService.registerUser({
        user_id: userId,
        email: email || null,
        phone_number: phone || null,
        full_name: fullName
      });

      apiService.saveCurrentUser(backendUser);
      return backendUser;
    } catch (err) {
      // Fallback for local dev (Supabase not configured)
      const fallbackUser = await apiService.registerUser({
        user_id: null,
        email: email || null,
        phone_number: phone || null,
        full_name: fullName
      });
      apiService.saveCurrentUser(fallbackUser);
      return fallbackUser;
    }
  },

  /**
   * Login with email/password or phone/password via Supabase Auth.
   */
  async login({ emailOrPhone, password }) {
    const isEmail = emailOrPhone.includes('@');

    try {
      let data, error;
      if (isEmail) {
        ({ data, error } = await supabase.auth.signInWithPassword({ email: emailOrPhone, password }));
      } else {
        ({ data, error } = await supabase.auth.signInWithPassword({ phone: emailOrPhone, password }));
      }

      if (error) throw new Error(error.message);

      const supabaseUser = data?.user;

      // Fetch or sync backend profile
      const backendUser = await apiService.getMe(supabaseUser?.id || 'local');
      apiService.saveCurrentUser(backendUser);
      return backendUser;
    } catch (err) {
      // Fallback for local dev
      const fallbackUser = await apiService.loginFallback(emailOrPhone);
      if (!fallbackUser) throw new Error('Login failed. Check your credentials.');
      apiService.saveCurrentUser(fallbackUser);
      return fallbackUser;
    }
  },

  /**
   * Sign out of Supabase session and clear local storage.
   */
  async logout() {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    apiService.logoutUser();
  },

  /**
   * Get current Supabase session user ID.
   */
  async getSessionUserId() {
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.user?.id || null;
    } catch (_) {
      return null;
    }
  }
};
