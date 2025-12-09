// "use client";

// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardContent,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { CircleUserRound, PlusIcon } from "lucide-react";
// import { Spinner } from "@/components/ui/spinner";
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { ModeToggle } from "@/components/ui/mode-toggle";
// import { toast } from "sonner";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { api } from "@/trpc/react";
// import { useUserStore } from "@/store/user.store";
// import type { User } from "@/server/db/types";


// export function HomePage() {
//     const [name, setName] = useState("");
//     const router = useRouter();
//     const { currentUser, setCurrentUser } = useUserStore();

//     const { mutateAsync: createUser, isPending: isLoading } = api.user.create.useMutation();
//     const { data: users = [] } = api.user.getAll.useQuery();

//     const handleSelectUser = (user: User) => {
//         setCurrentUser(user);
//         router.push("/chat");
//     }

//     const handleCreateUser = async () => {
//         const user = await createUser({ name: name });
//         if (user) {
//             setCurrentUser(user);
//             router.push("/chat");
//         } else {
//             toast.error("Erreur lors de la création de l'utilisateur");
//         }
//     }

//     return (
//         <main className="relative flex flex-col items-center justify-center h-screen">
//             <ModeToggle className="absolute top-4 right-4" />
//             <div className="w-full max-w-md p-8 mx-auto pb-24">
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-foreground mb-2">Brainroot</h1>
//                     <p className="text-muted-foreground">
//                         Traiter des vidéos et apprendre avec l'IA.
//                     </p>
//                 </div>
//                 <div className="space-y-6">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Sélectionner un utilisateur</CardTitle>
//                             <CardDescription>
//                                 Choisissez votre profil existant ou créez-en un nouveau.
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-4">

//                             {/* Dialog to create a new user */}
//                             <Dialog>
//                                 <div className="flex gap-2 items-start">
//                                     {users.map((user: User) => (
//                                         <div key={user.id} className="flex flex-col gap-2 items-center">

//                                             <Tooltip>
//                                                 <TooltipTrigger asChild>
//                                                     <Button size="icon" className="rounded-full" onClick={() => handleSelectUser(user)}>
//                                                         <p>
//                                                             {user.name.charAt(0).toUpperCase()}
//                                                         </p>
//                                                     </Button>
//                                                 </TooltipTrigger>
//                                                 <TooltipContent>{user.name}</TooltipContent>
//                                             </Tooltip>
//                                         </div>
//                                     ))}

//                                     <DialogTrigger asChild>
//                                         <Button size="icon" variant="outline" className="rounded-full">
//                                             <PlusIcon className="w-4 h-4" />
//                                         </Button>
//                                     </DialogTrigger>
//                                 </div>
//                                 <DialogContent>
//                                     <DialogHeader>

//                                         <DialogTitle className="flex gap-2 items-center"><CircleUserRound className="w-6 h-6 text-muted-foreground" />Créer un nouvel utilisateur</DialogTitle>
//                                         <DialogDescription>
//                                             Entrez votre nom pour créer un nouvel utilisateur.
//                                         </DialogDescription>
//                                     </DialogHeader>
//                                     <div className="space-y-2 pt-4">
//                                         <Label htmlFor="name">Votre nom</Label>
//                                         <Input
//                                             id="name"
//                                             type="text"
//                                             placeholder="Entrez votre nom"
//                                             value={name}
//                                             onChange={(e) => setName(e.target.value)}
//                                             className="text-center"
//                                         />
//                                     </div>

//                                     <Button
//                                         onClick={handleCreateUser}
//                                         disabled={!name.trim() || isLoading}
//                                         className="w-full"
//                                     >
//                                         {isLoading ? (
//                                             <>
//                                                 <Spinner />
//                                                 Création en cours...
//                                             </>
//                                         ) : (
//                                             "Créer mon profil"
//                                         )}
//                                     </Button>
//                                 </DialogContent>
//                             </Dialog >
//                         </CardContent>
//                     </Card>

//                 </div>
//             </div>
//         </main>
//     );
// }