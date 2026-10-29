import { UserProfile } from "@/components/auth-profile";
export const metadata = { title: "Your Account", robots: { index: false, follow: false } };
export default function AccountPage() { return <div className="account-page page-width"><UserProfile /></div>; }