'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase, storeLoginTimestamp } from '@/lib/supabase';
import FormInput from '@/app/components/FormInput';
import Button from '@/app/components/Button';

import styles from './page.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 for email step, 2 for password step
  const router = useRouter();
  const passwordInputRef = useRef(null);

  // Autofocus password input when step 2 is reached
  useEffect(() => {
    if (step === 2 && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [step]);

  const handleEmailStep = (e) => {
    e.preventDefault();
    setError(null);

    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Move to password step
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Supabase Authentication
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      // Replace 'users' with your actual table name
      const { data, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (queryError) {
        console.warn('Could not fetch user data:', queryError);
        // Continue even if query fails - auth was successful
      }

      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      if (authData?.session) {
        localStorage.setItem(
          'supabaseSession',
          JSON.stringify(authData.session)
        );
      }

      // Store login timestamp for session age checking
      storeLoginTimestamp();

      // Redirect to factoring page
      router.push('/factoring/home');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <Image
          src="/images/logo.png"
          className={styles.logo}
          alt="Logo"
          width={138}
          height={52}
        />
        <h1 className={styles.mainTitle}>
          {step === 1 ? 'Welcome' : 'Enter Your Password'}
        </h1>
        <p className={styles.formDescription}>
          {step === 1
            ? 'Enter your email to log in to RTS Pro web.'
            : 'Enter your password to continue to RTS Pro web'}
        </p>

        <form
          onSubmit={step === 1 ? handleEmailStep : handleSubmit}
          className={styles.loginForm}
        >
          <FormInput
            type="email"
            id="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            showEditBtn={step === 2}
            onEditBtnClick={() => setStep(1)}
            required
            disabled={step === 2}
          />
          {step === 2 && (
            <FormInput
              ref={passwordInputRef}
              type="password"
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.passwordInput}
              required
            />
          )}
          {error && <div className={styles.errorMessage}>Invalid email or password</div>}
          <Button
            type="submit"
            disabled={loading}
            className={styles.loginButton}
          >
            Continue
          </Button>
        </form>

        <p className={styles.helpText}>
          Need help? Email{' '}
          <a href="mailto:support@rts.support">support@rts.support</a> or call{' '}
          <a href="tel:8888757051">888-875-7051</a>.
        </p>
      </div>
    </div>
  );
}
