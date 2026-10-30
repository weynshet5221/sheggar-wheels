import Link from "next/link";
import { CarFront } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Link href="/" className="logo">
            <CarFront size={25} aria-hidden="true" />
            Sheggar Wheels
          </Link>

          <p>
            Discover local car rentals around Addis Ababa.
            Connect renters and vehicle owners through one
            convenient marketplace.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/cars">Browse cars</Link></li>
            <li><Link href="/signin">Demo sign in</Link></li>
            <li><Link href="/signup">Create account</Link></li>
          </ul>
        </div>

        <div>
          <h4>Portals</h4>
          <ul>
            <li><Link href="/dashboard">Renter dashboard</Link></li>
            <li><Link href="/owner">Owner workspace</Link></li>
            <li><Link href="/admin">Admin management</Link></li>
          </ul>
        </div>

        <div>
          <h4>About this demo</h4>
          <p>
            Frontend capstone using browser storage and demo
            authentication. No real payments are processed.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Sheggar Wheels. Built for the frontend capstone.
      </div>
    </footer>
  );
}