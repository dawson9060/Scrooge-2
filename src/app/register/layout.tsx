export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    // URL -> /shop/shoes/nike-air-max-97
    // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
    return <>{children}</>
  }