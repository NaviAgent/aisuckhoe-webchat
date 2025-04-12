import { SignIn } from '@clerk/nextjs'

export default function AuthSignin() {
  console.log('AuthSignin')
  return (<div className="flex justify-center py-24">
    <SignIn />
  </div>)
}          {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
  <SignedOut>
    <SignInButton />
    <SignUpButton />
  </SignedOut>
  <SignedIn>
    <UserButton />
  </SignedIn>
</header> */}