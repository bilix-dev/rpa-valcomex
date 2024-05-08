import Root from "./Root";

export const metadata = {
  title: {
    default: "TatcPro",
    template: "TatcPro - %s",
  },
  description: "Por Bilix",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-inter  custom-tippy dashcode-app">
        <Root>{children}</Root>
      </body>
    </html>
  );
}
