import localFont from 'next/font/local'

const font = localFont({
  src: [
    {
      path: './Tomorrow-Regular.ttf',  // Regular для weight 400
      weight: '400',
      style: 'normal',
    },
    {
      path: './Tomorrow-Bold.ttf',     // Bold для weight 700
      weight: '700',
      style: 'normal',
    }
  ],
  display: 'swap',
  variable: '--font-tomorrow',
})

export const tomorrow = font; 