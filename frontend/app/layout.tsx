import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SWARMIQ — Autonomous Market Intelligence Engine",
  description: "Simulate the market before you enter it. Model 10,000 persistent AI personas calibrated on empirical market data to run agentic simulations, opinion dynamics, and Bayesian strategy search.",
  keywords: ["market simulation", "AI personas", "agentic market intelligence", "Bayesian strategy", "opinion dynamics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
