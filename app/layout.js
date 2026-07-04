import "./globals.css";

export const metadata = {
  title: "AetherPulse | Decision Intelligence Platform",
  description:
    "An AI-powered city decision intelligence platform with mock ingestion, anomaly detection, retrieval, and automated recommendations."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
