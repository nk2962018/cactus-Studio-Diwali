"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, LogOut, MessageCircle, Phone, ShieldCheck, UserRound } from "lucide-react";
import { emptyDelivery, type DeliveryDetails, whatsappUrl } from "@/lib/commerce";
import { getSupabase } from "@/lib/supabase";
import { useStore } from "./store-provider";

export function Login({ checkout = false }: { checkout?: boolean }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const client = getSupabase();
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(current => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  async function sendOtp(event?: FormEvent) {
    event?.preventDefault();
    if (!client) return;
    if (!/^[6-9]\d{9}$/.test(phone)) { setError("Please enter a valid 10-digit Indian mobile number."); return; }
    setBusy(true); setError("");
    try {
      const { error: sendError } = await client.auth.signInWithOtp({ phone: `+91${phone}` });
      if (sendError) throw sendError;
      setStage("otp"); setCooldown(60);
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Unable to send your code. Please try again."); }
    finally { setBusy(false); }
  }
  async function verifyOtp(event: FormEvent) {
    event.preventDefault();
    if (!client) return;
    if (!/^\d{6}$/.test(otp)) { setError("Please enter the six-digit code."); return; }
    setBusy(true); setError("");
    try {
      const { error: verifyError } = await client.auth.verifyOtp({ phone: `+91${phone}`, token: otp, type: "sms" });
      if (verifyError) throw verifyError;
    } catch (issue) { setError(issue instanceof Error ? issue.message : "That code could not be verified. Please try again."); }
    finally { setBusy(false); }
  }
  return <section className="auth-panel"><div className="auth-icon"><Phone size={25} strokeWidth={1.3} /></div><span className="small-eyebrow">A WARM WELCOME TO THE STUDIO</span><h2>{stage === "phone" ? "Login to Continue" : "Enter OTP"}</h2><p>{stage === "phone" ? checkout ? "Please login with your mobile number to continue." : "Enter your mobile number to receive a 6-digit OTP." : `Enter the 6-digit OTP sent to +91 ${phone}.`}</p>
    {!client && <div className="notice" role="status">Phone login is not available yet. Contact the studio while we get things ready.<button type="button" className="text-link" onClick={() => window.open(whatsappUrl("Hi Cactus Studios, I would like help with a Diwali gift order."), "_blank", "noopener,noreferrer")}>Contact the studio <MessageCircle size={16} /></button></div>}
    <form onSubmit={stage === "phone" ? sendOtp : verifyOtp} className="auth-form">
      {stage === "phone" ? <label className="form-field">Mobile number<div className="phone-input"><span>+91</span><input type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" maxLength={10} required placeholder="Your 10-digit mobile number" value={phone} onChange={event => setPhone(event.target.value.replace(/\D/g, ""))} /></div></label> : <fieldset className="otp-fieldset"><legend>Verification code</legend><div className="otp-digits">{Array.from({ length: 6 }, (_, index) => <input key={index} ref={element => { otpInputs.current[index] = element; }} aria-label={`OTP digit ${index + 1}`} type="text" inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} pattern="[0-9]" maxLength={index === 0 ? 6 : 1} required autoFocus={index === 0} value={otp[index]?.trim() ?? ""} onChange={event => {
        const value = event.target.value.replace(/\D/g, "");
        if (value.length > 1) { setOtp(value.slice(0, 6)); otpInputs.current[Math.min(value.length, 6) - 1]?.focus(); return; }
        const digits = Array.from({ length: 6 }, (_, position) => otp[position] ?? " ");
        digits[index] = value || " ";
        setOtp(digits.join(""));
        if (value && index < 5) otpInputs.current[index + 1]?.focus();
      }} onFocus={event => event.currentTarget.select()} onKeyDown={event => { if (event.key === "Backspace" && !otp[index]?.trim() && index > 0) otpInputs.current[index - 1]?.focus(); if (event.key === "ArrowLeft" && index > 0) otpInputs.current[index - 1]?.focus(); if (event.key === "ArrowRight" && index < 5) otpInputs.current[index + 1]?.focus(); }} onPaste={event => { const value = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); if (value) { event.preventDefault(); setOtp(value); otpInputs.current[value.length - 1]?.focus(); } }} />)}</div></fieldset>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button primary" disabled={!client || busy} type="submit">{busy ? <><LoaderCircle size={18} className="spin" /> Please wait</> : <>{stage === "phone" ? "Send OTP" : "Verify & continue"}<ArrowRight size={17} /></>}</button>
    </form>
    {stage === "otp" && <div className="otp-actions"><button className="text-link" onClick={() => { setStage("phone"); setOtp(""); setError(""); }} disabled={busy}><ArrowLeft size={14} /> Change number</button><button className="text-link" disabled={cooldown > 0 || busy} onClick={() => sendOtp()}>{cooldown ? `Resend in ${cooldown}s` : "Resend code"}</button></div>}
    <span className="auth-reassurance"><ShieldCheck size={15} /> Your details stay between you and our studio.</span>
  </section>;
}

export function useProfile() {
  const { user, notify } = useStore();
  const [details, setDetails] = useState<DeliveryDetails>(emptyDelivery);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    const client = getSupabase();
    if (!user || !client) { setDetails(emptyDelivery); setLoading(false); return; }
    const currentUser = user;
    const currentClient = client;
    let active = true;
    const phone = currentUser.phone ? `+${currentUser.phone.replace(/^\+/, "")}` : "";
    setLoading(true); setLoadError("");
    setDetails({ ...emptyDelivery, phone });
    async function load() {
      const { data, error } = await currentClient.from("profiles").select("name,email,address,city,state,pincode").eq("id", currentUser.id).maybeSingle();
      if (!active) return;
      if (error) setLoadError("We couldn't load your saved address. You can still enter your details below.");
      if (data) setDetails({ name: data.name ?? "", email: data.email ?? "", address: data.address ?? "", city: data.city ?? "", state: data.state ?? "", pincode: data.pincode ?? "", phone });
      setLoading(false);
    }
    load().catch(() => { if (active) { setLoading(false); setLoadError("Your saved details are unavailable right now."); } });
    return () => { active = false; };
  }, [user]);
  async function save(values: DeliveryDetails) {
    const client = getSupabase();
    if (!user || !client) throw new Error("Please login to save your address.");
    const { error } = await client.from("profiles").upsert({ id: user.id, name: values.name.trim(), email: values.email.trim(), address: values.address.trim(), city: values.city.trim(), state: values.state.trim(), pincode: values.pincode.trim(), updated_at: new Date().toISOString() });
    if (error) throw new Error("Your address couldn't be saved. Please try again or continue without saving.");
    setDetails(values);
    notify("Your details have been saved");
  }
  return { details, setDetails, loading, loadError, save };
}

export function AddressForm({ details, onChange, onSubmit, busy = false, profile = false, saveAddress = false, onSaveAddressChange }: {
  details: DeliveryDetails;
  onChange: (details: DeliveryDetails) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  busy?: boolean;
  profile?: boolean;
  saveAddress?: boolean;
  onSaveAddressChange?: (value: boolean) => void;
}) {
  function field(key: keyof DeliveryDetails, label: string, autoComplete: string, required = !profile, placeholder = "") {
    return <label className={`form-field ${key === "address" ? "span-two" : ""}`}>{label}{key === "email" && <span className="optional">Optional, recommended for order updates</span>}<input name={key} type={key === "email" ? "email" : "text"} autoComplete={autoComplete} required={key === "email" ? false : required} maxLength={key === "pincode" ? 6 : key === "address" ? 500 : 120} minLength={key === "name" ? 2 : key === "address" && !profile ? 8 : undefined} pattern={key === "pincode" ? "[1-9][0-9]{5}" : undefined} inputMode={key === "pincode" ? "numeric" : undefined} value={details[key]} onChange={event => onChange({ ...details, [key]: event.target.value })} placeholder={placeholder} /></label>;
  }
  return <form className="address-form" onSubmit={onSubmit}><div className="form-grid">{field("name", "Full name", "name", !profile, "Your name")}<label className="form-field">Phone number<span className="optional verified"><Check size={12} /> Verified mobile</span><input name="phone" autoComplete="tel" value={details.phone} readOnly aria-readonly="true" /></label>{field("email", "Email address", "email", false, "you@example.com")}{field("pincode", "Pincode", "postal-code", !profile, "6-digit pincode")}{field("address", "Delivery address", "street-address", !profile, "House / flat, street, locality")}{field("city", "City", "address-level2", !profile, "City")}{field("state", "State", "address-level1", !profile, "State")}</div>{onSaveAddressChange && <label className="checkbox-label"><input type="checkbox" checked={saveAddress} onChange={event => onSaveAddressChange(event.target.checked)} />Save this address for next time</label>}<button type="submit" className="button primary" disabled={busy}>{busy ? <><LoaderCircle size={17} className="spin" /> Saving</> : <>{profile ? "Save my details" : "Review my order"}<ArrowRight size={17} /></>}</button></form>;
}
export function UserProfile() {
  const { user, authReady, notify } = useStore();
  const { details, setDetails, loading, loadError, save } = useProfile();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!authReady) return <div className="loading-state"><LoaderCircle className="spin" /> One little moment...</div>;
  if (!user) return <Login />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try { await save(details); }
    catch (issue) { setError(issue instanceof Error ? issue.message : "Unable to save details."); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true);
    try {
      const { error: logoutError } = await getSupabase()!.auth.signOut();
      if (logoutError) throw logoutError;
      notify("You have been logged out");
    } catch { setError("Unable to log out. Please try again."); }
    finally { setBusy(false); }
  }
  return <section className="profile-panel"><div className="profile-heading"><div><UserRound size={25} strokeWidth={1.3} /><span className="small-eyebrow">YOUR LITTLE CORNER</span><h1>{details.name ? `Hello, ${details.name.split(" ")[0]}.` : "Make yourself at home."}</h1></div><button className="text-link" disabled={busy} onClick={logout}><LogOut size={15} /> Logout</button></div><p className="muted">A few details now, a little less to fill in next time. All profile details are optional.</p>{loadError && <p className="notice" role="alert">{loadError}</p>}{error && <p className="form-error" role="alert">{error}</p>}{loading ? <div className="loading-state"><LoaderCircle className="spin" /> Finding your saved details...</div> : <AddressForm details={details} onChange={setDetails} onSubmit={submit} busy={busy} profile />}</section>;
}