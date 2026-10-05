import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white py-8 mt-24">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
        <div className="md:col-span-2 space-y-4">
          <Logo />
          <p className="text-muted-foreground text-sm max-w-sm mt-3">
            Next-generation VPN infrastructure. Engineered for speed, privacy, and absolute security on any network.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Product</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/pricing" className="hover:text-emerald-600 transition-colors">Pricing</Link></li>
            <li><Link to="/#features" className="hover:text-emerald-600 transition-colors">Features</Link></li>
            <li><Link to="/servers" className="hover:text-emerald-600 transition-colors">Servers</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Support</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/faq" className="hover:text-emerald-600 transition-colors">FAQ</Link></li>
            <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ProjectVPN. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
