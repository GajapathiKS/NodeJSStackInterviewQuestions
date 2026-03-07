import './globals.css';

export const metadata = {
  title: 'Interview Mastery UI · Next.js',
  description: 'Beginner-to-expert full-stack interview prep with 550+ questions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
