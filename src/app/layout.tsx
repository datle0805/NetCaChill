import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#E50914",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://netcachill.com'),
  title: "NetCaChill - Xem Phim Thả Ga | Netflix Clone",
  description: "Website xem phim trực tuyến chất lượng cao với hàng ngàn bộ phim mới nhất. Giao diện mượt mà, tốc độ cực nhanh.",
  keywords: "xem phim, phim moi, phim le, phim bo, netcachill, netflix clone",
  openGraph: {
    title: "NetCaChill - Xem Phim Thả Ga",
    description: "Website xem phim trực tuyến chất lượng cao",
    url: "https://netcachill.com",
    siteName: "NetCaChill",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
