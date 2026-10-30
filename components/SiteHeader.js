"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, CarFront } from "lucide-react";
import { getCurrentSession, signOut } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentSession());
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) setMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleSignOut() {
    signOut();
    setUser(null);
    closeMenu();
    window.location.href = "/";
  }

  const dashboardByRole = {
    renter: "/renter/dashboard",
    owner: "/owner/dashboard",
    admin: "/admin/dashboard",
  };
  const links = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Browse Cars" },
    ...(user?.activeRole && dashboardByRole[user.activeRole]
      ? [{ href: dashboardByRole[user.activeRole], label: "My Dashboard" }]
      : []),
    ...(user?.roles?.includes("owner") ? [{ href: "/owner", label: "Owner Hub" }] : []),
    ...(user?.roles?.includes("admin") ? [{ href: "/admin", label: "Admin Panel" }] : []),
  ];
  const showFavorites = user?.activeRole === "renter";

  return (
    <header className="site-header">
      <div className="header-content">
        <Link href="/" className="logo" onClick={closeMenu}>
          <CarFront size={26} aria-hidden="true" />
          <span>Sheggar Wheels</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>

        {showFavorites && <Link href="/favorites" className="header-favorites">Favorites ♡</Link>}

        <div className="auth-actions">
          {user ? (
            <>
              <button type="button" className="btn-secondary desktop-signout" onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/signin" className="header-signin">Sign in</Link>
              <Link href="/signup" className="header-signup">Sign up</Link>
            </>
          )}
          <ThemeToggle />
          <button type="button" className="mobile-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={closeMenu}>{link.label}</Link>)}
          {showFavorites && <Link href="/favorites" onClick={closeMenu}>Favorites ♡</Link>}
          {user ? (
            <button type="button" onClick={handleSignOut}>Sign out</button>
          ) : (
            <>
              <Link href="/signin" onClick={closeMenu}>Sign in</Link>
              <Link href="/signup" onClick={closeMenu}>Sign up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
