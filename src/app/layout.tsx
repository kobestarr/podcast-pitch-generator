/** @type {import('next').Metadata} */
export const metadata = {
  title: 'Podcast Guest Pitch Generator | Write Pitches That Get Replies',
  description: 'Generate 3 personalized podcast guest pitch emails in 60 seconds. Free tool for founders and experts.',
  metadataBase: new URL('https://dealflow.media'),
  openGraph: {
    title: 'Podcast Guest Pitch Generator',
    description: 'Write pitches that actually get replies.',
    url: 'https://dealflow.media/tools/podcast-pitch-generator',
    siteName: 'DealFlow',
  },
  other: {
    'twitter:card': 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel - loads on page load for retargeting */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID');
            `,
          }}
        />
        {/* LinkedIn Insight Tag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "YOUR_LINKEDIN_ID";
              window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[];
            `,
          }}
        />
        <script
          async
          src="https://snap.licdn.com/li.lms-analytics/insight.min.js"
        />
      </head>
      <body className="bg-dealflow-cream text-dealflow-midnight antialiased">
        {children}
      </body>
    </html>
  );
}
