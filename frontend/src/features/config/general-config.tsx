// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
// import { api } from "@/trpc/react";
// import { toast } from "sonner";
// import { Spinner } from "@/components/ui/spinner";

// interface PreConfiguredPrompt {
//   id: number;
//   name: string;
//   content: string;
// }

// export function GeneralConfig() {
//   const [preConfiguredPrompts, setPreConfiguredPrompts] = useState<PreConfiguredPrompt[]>([]);
//   const [newPromptName, setNewPromptName] = useState("");
//   const [newPromptContent, setNewPromptContent] = useState("");
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editName, setEditName] = useState("");
//   const [editContent, setEditContent] = useState("");

//   const { data: promptsData, isLoading, refetch } = api.config.getPreConfiguredPrompts.useQuery();
//   const createPromptMutation = api.config.createPreConfiguredPrompt.useMutation();
//   const setPromptMutation = api.config.setPreConfiguredPrompts.useMutation();
//   const deletePromptMutation = api.config.deletePreConfiguredPrompt.useMutation();

//   // Initialize from database
//   useEffect(() => {
//     if (promptsData) {
//       setPreConfiguredPrompts(promptsData);
//     }
//   }, [promptsData]);

//   const addPrompt = async () => {
//     if (newPromptName.trim() && newPromptContent.trim()) {
//       try {
//         const newPrompt = await createPromptMutation.mutateAsync({
//           name: newPromptName,
//           content: newPromptContent,
//         });
        
//         if (newPrompt) {
//           setPreConfiguredPrompts([...preConfiguredPrompts, newPrompt]);
//         }
        
//         setNewPromptName("");
//         setNewPromptContent("");
//         toast.success("Prompt ajouté");
//         refetch();
//       } catch (error) {
//         console.error("Error adding prompt:", error);
//         toast.error("Erreur lors de l'ajout du prompt");
//       }
//     }
//   };

//   const startEdit = (prompt: PreConfiguredPrompt) => {
//     setEditingId(prompt.id);
//     setEditName(prompt.name);
//     setEditContent(prompt.content);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditName("");
//     setEditContent("");
//   };

//   const saveEdit = async (id: number) => {
//     try {
//       await setPromptMutation.mutateAsync({
//         id,
//         name: editName,
//         content: editContent,
//       });
      
//       setPreConfiguredPrompts(
//         preConfiguredPrompts.map((p) =>
//           p.id === id ? { ...p, name: editName, content: editContent } : p
//         )
//       );
      
//       setEditingId(null);
//       toast.success("Prompt mis à jour");
//       refetch();
//     } catch (error) {
//       console.error("Error updating prompt:", error);
//       toast.error("Erreur lors de la mise à jour");
//     }
//   };

//   const removePrompt = async (id: number) => {
//     try {
//       await deletePromptMutation.mutateAsync({ id });
//       setPreConfiguredPrompts(preConfiguredPrompts.filter((p) => p.id !== id));
//       toast.success("Prompt supprimé");
//       refetch();
//     } catch (error) {
//       console.error("Error deleting prompt:", error);
//       toast.error("Erreur lors de la suppression");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">Prompts</h1>
//         <p className="text-muted-foreground">
//           Gérez vos prompts pré-configurés.
//         </p>
//       </div>
//       <div className="space-y-6">
//         {/* Add new prompt */}
//         <div className="space-y-4 pt-4">
//           <div className="space-y-2">
//             <Label htmlFor="prompt-name">Nom du prompt</Label>
//             <Input
//               id="prompt-name"
//               placeholder="Ex: Assistant de code"
//               value={newPromptName}
//               onChange={(e) => setNewPromptName(e.target.value)}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="prompt-content">Contenu</Label>
//             <Textarea
//               id="prompt-content"
//               placeholder="Entrez le contenu du prompt..."
//               value={newPromptContent}
//               onChange={(e) => setNewPromptContent(e.target.value)}
//               rows={4}
//               className="resize-none"
//             />
//           </div>
//           <Button 
//             onClick={addPrompt} 
//             variant="outline" 
//             disabled={!newPromptName.trim() || !newPromptContent.trim() || createPromptMutation.isPending}
//           >
//             {createPromptMutation.isPending ? (
//               <>
//                 <Spinner className="mr-2" />
//                 Ajout...
//               </>
//             ) : (
//               <>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Ajouter un prompt
//               </>
//             )}
//           </Button>
//         </div>
//         {/* Existing prompts */}
//         {preConfiguredPrompts.length > 0 && (
//           <div className="space-y-4">
//             {preConfiguredPrompts.map((prompt) => (
//               <div
//                 key={prompt.id}
//                 className="flex items-start gap-4 p-4 border rounded-lg"
//               >
//                 {editingId === prompt.id ? (
//                   <div className="flex-1 space-y-2">
//                     <Input
//                       value={editName}
//                       onChange={(e) => setEditName(e.target.value)}
//                       placeholder="Nom du prompt"
//                     />
//                     <Textarea
//                       value={editContent}
//                       onChange={(e) => setEditContent(e.target.value)}
//                       placeholder="Contenu du prompt"
//                       rows={4}
//                       className="resize-none"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex-1 space-y-2">
//                     <div className="font-medium">{prompt.name}</div>
//                     <div className="text-sm text-muted-foreground">
//                       {prompt.content}
//                     </div>
//                   </div>
//                 )}
//                 <div className="flex gap-2">
//                   {editingId === prompt.id ? (
//                     <>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => saveEdit(prompt.id)}
//                         disabled={setPromptMutation.isPending}
//                       >
//                         {setPromptMutation.isPending ? (
//                           <Spinner />
//                         ) : (
//                           <Check className="h-4 w-4" />
//                         )}
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={cancelEdit}
//                         disabled={setPromptMutation.isPending}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => startEdit(prompt)}
//                       >
//                         <Edit2 className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => removePrompt(prompt.id)}
//                         disabled={deletePromptMutation.isPending}
//                       >
//                         {deletePromptMutation.isPending ? (
//                           <Spinner />
//                         ) : (
//                           <Trash2 className="h-4 w-4" />
//                         )}
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

