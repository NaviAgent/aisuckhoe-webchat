// "use client"
// import { CreditCard, LogOut, Moon, Monitor, Settings, Sun, User } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export function ProfilePopup() {
//   return (
//     <div className="relative">
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="flex w-full items-center justify-start p-0 hover:bg-transparent">
//             <Avatar className="h-10 w-10 rounded">
//               <AvatarImage
//                 src="/placeholder.svg?height=40&width=40"
//                 alt="User"
//                 className="rounded bg-gradient-to-br from-blue-400 to-purple-400"
//               />
//               <AvatarFallback className="rounded bg-gradient-to-br from-blue-400 to-purple-400">IN</AvatarFallback>
//             </Avatar>
//             <div className="ml-3 text-left">
//               <p className="text-sm font-medium">ivannguyendev</p>
//               <p className="text-xs text-muted-foreground">Free</p>
//             </div>
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="ml-auto"
//             >
//               <path
//                 d="M6 9L12 15L18 9"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-80" align="end">
//           <div className="px-4 py-2 text-sm text-muted-foreground">ivannguyenit@gmail.com</div>
//           <div className="flex items-center px-4 py-2">
//             <Avatar className="h-12 w-12 rounded">
//               <AvatarImage
//                 src="/placeholder.svg?height=48&width=48"
//                 alt="User"
//                 className="rounded bg-gradient-to-br from-blue-400 to-purple-400"
//               />
//               <AvatarFallback className="rounded bg-gradient-to-br from-blue-400 to-purple-400">IN</AvatarFallback>
//             </Avatar>
//             <div className="ml-3">
//               <p className="text-base font-medium">ivannguyendev</p>
//               <p className="text-sm text-muted-foreground">Free</p>
//             </div>
//           </div>
//           <DropdownMenuItem className="mt-2 w-full focus:bg-transparent hover:bg-transparent cursor-default">
//             <Button variant="outline" className="w-full justify-center py-2">
//               Switch Team
//             </Button>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <CreditCard className="mr-2 h-4 w-4" />
//             <span>Billing</span>
//           </DropdownMenuItem>

//           <Dialog>
//             <DialogTrigger asChild>
//               <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//                 <User className="mr-2 h-4 w-4" />
//                 <span>Profile</span>
//               </DropdownMenuItem>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle>Edit Profile</DialogTitle>
//                 <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
//               </DialogHeader>
//               <Tabs defaultValue="profile" className="w-full">
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger value="profile">Profile</TabsTrigger>
//                   <TabsTrigger value="preferences">Preferences</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="profile" className="space-y-4 pt-4">
//                   <div className="flex flex-col items-center space-y-4">
//                     <Avatar className="h-24 w-24 rounded">
//                       <AvatarImage
//                         src="/placeholder.svg?height=96&width=96"
//                         alt="User"
//                         className="rounded bg-gradient-to-br from-blue-400 to-purple-400"
//                       />
//                       <AvatarFallback className="rounded bg-gradient-to-br from-blue-400 to-purple-400">
//                         IN
//                       </AvatarFallback>
//                     </Avatar>
//                     <Button variant="outline" size="sm">
//                       Change Avatar
//                     </Button>
//                   </div>
//                   <div className="space-y-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="name">Display Name</Label>
//                       <Input id="name" defaultValue="ivannguyendev" />
//                     </div>
//                     <div className="grid gap-2">
//                       <Label htmlFor="email">Email</Label>
//                       <Input id="email" defaultValue="ivannguyenit@gmail.com" />
//                     </div>
//                     <div className="grid gap-2">
//                       <Label htmlFor="bio">Bio</Label>
//                       <Input id="bio" placeholder="Tell us about yourself" />
//                     </div>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="preferences" className="space-y-4 pt-4">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <Label htmlFor="theme">Theme</Label>
//                       <div className="flex items-center gap-1">
//                         <Button variant="outline" size="icon" className="h-8 w-8 bg-background">
//                           <Monitor className="h-4 w-4" />
//                           <span className="sr-only">System theme</span>
//                         </Button>
//                         <Button variant="outline" size="icon" className="h-8 w-8">
//                           <Sun className="h-4 w-4" />
//                           <span className="sr-only">Light theme</span>
//                         </Button>
//                         <Button variant="outline" size="icon" className="h-8 w-8">
//                           <Moon className="h-4 w-4" />
//                           <span className="sr-only">Dark theme</span>
//                         </Button>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <Label htmlFor="vibe">Vibe</Label>
//                       <Switch id="vibe" />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <Label htmlFor="language">Language</Label>
//                       <Select defaultValue="english">
//                         <SelectTrigger className="w-[140px]">
//                           <SelectValue placeholder="Select language" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="english">English</SelectItem>
//                           <SelectItem value="vietnamese">Vietnamese</SelectItem>
//                           <SelectItem value="spanish">Spanish</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//               <DialogFooter>
//                 <Button type="submit">Save changes</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>

//           <DropdownMenuItem>
//             <Settings className="mr-2 h-4 w-4" />
//             <span>Settings</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <LogOut className="mr-2 h-4 w-4" />
//             <span>Sign Out</span>
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <div className="px-4 py-2">
//             <p className="mb-2 text-sm text-muted-foreground">Preferences</p>
//             <div className="mb-4">
//               <div className="mb-2 flex items-center justify-between">
//                 <span className="text-sm">Theme</span>
//                 <div className="flex items-center gap-1">
//                   <Button variant="outline" size="icon" className="h-8 w-8 bg-background">
//                     <Monitor className="h-4 w-4" />
//                     <span className="sr-only">System theme</span>
//                   </Button>
//                   <Button variant="outline" size="icon" className="h-8 w-8">
//                     <Sun className="h-4 w-4" />
//                     <span className="sr-only">Light theme</span>
//                   </Button>
//                   <Button variant="outline" size="icon" className="h-8 w-8">
//                     <Moon className="h-4 w-4" />
//                     <span className="sr-only">Dark theme</span>
//                   </Button>
//                 </div>
//               </div>
//               <div className="mb-2 flex items-center justify-between">
//                 <span className="text-sm">Vibe</span>
//                 <Switch />
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm">Language</span>
//                 <Select defaultValue="english">
//                   <SelectTrigger className="w-[140px]">
//                     <SelectValue placeholder="Select language" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="english">English</SelectItem>
//                     <SelectItem value="vietnamese">Vietnamese</SelectItem>
//                     <SelectItem value="spanish">Spanish</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <Button className="w-full bg-black text-white hover:bg-black/90">Upgrade Plan</Button>
//           </div>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }

