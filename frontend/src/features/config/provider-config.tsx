// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ExternalLink, Trash2 } from "lucide-react";
// import { MODEL_LIST, type ModelInfo } from "@/lib/model-list";
// import { toast } from "sonner";
// import { Spinner } from "@/components/ui/spinner";

// interface Provider {
//   id: string;
//   name: string;
//   enabled: boolean;
//   apiKey: string;
//   models: ModelInfo[];
//   activeModels: string[];
//   pendingActiveModels: string[];
//   loadingModels: boolean;
//   savingModels: boolean;
//   link: string;
// }

// const AVAILABLE_PROVIDERS = [
//   { id: "openai", name: "OpenAI", link: "https://platform.openai.com/api-keys" },
//   { id: "gemini", name: "Gemini", link: "https://aistudio.google.com/api-keys" },
//   { id: "groq", name: "Groq", link: "https://console.groq.com/keys" },
//   // { id: "openrouter", name: "OpenRouter" },
//   // { id: "replicate", name: "Replicate" },
//   // { id: "mistral", name: "Mistral" },
// ];

// export function ProviderConfig() {
//   const [providers, setProviders] = useState<Provider[]>(
//     AVAILABLE_PROVIDERS.map((p) => ({
//       ...p,
//       enabled: false,
//       apiKey: "",
//       models: [],
//       activeModels: [],
//       pendingActiveModels: [],
//       loadingModels: false,
//       savingModels: false,
//     }))
//   );

//   const { data: providersData, isLoading: isLoadingProviders, refetch: refetchProviders } = api.config.getProviders.useQuery();
//   const { data: activeModelsData, refetch: refetchActiveModels } = api.config.getProviderActiveModels.useQuery();
//   const setApiKeyMutation = api.config.setProviderApiKey.useMutation();
//   const setActiveModelsMutation = api.config.setProviderActiveModels.useMutation();

//   // Initialize providers from database
//   useEffect(() => {
//     if (providersData && activeModelsData) {
//       setProviders((prev) =>
//         prev.map((p) => {
//           const dbProvider = providersData.find((dp: { name: string; apiKey: string | null }) => dp.name === p.id);
//           const models = MODEL_LIST[p.id] || [];
//           const activeModels = (activeModelsData[p.id] as string[]) || [];

//           return {
//             ...p,
//             enabled: dbProvider ? !!dbProvider.apiKey : false,
//             apiKey: dbProvider?.apiKey || "",
//             models,
//             activeModels,
//             pendingActiveModels: activeModels,
//           };
//         })
//       );
//     }
//   }, [providersData, activeModelsData]);

//   const updateProvider = (id: string, updates: Partial<Provider>) => {
//     setProviders((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
//     );
//   };

//   const handleApiKeySave = async (providerId: string) => {
//     const provider = providers.find((p) => p.id === providerId);
//     if (!provider?.apiKey) return;

//     updateProvider(providerId, { loadingModels: true });

//     try {
//       const dbProvider = providersData?.find((p: { name: string; id: string }) => p.name === providerId);
//       if (!dbProvider) {
//         throw new Error("Provider not found in database");
//       }

//       await setApiKeyMutation.mutateAsync({
//         id: dbProvider.id,
//         apiKey: provider.apiKey,
//       });

//       const models = MODEL_LIST[providerId] || [];
//       const defaultActiveModels = models.slice(0, 1).map((m) => m.id);

//       await setActiveModelsMutation.mutateAsync({
//         id: dbProvider.id,
//         activeModels: defaultActiveModels,
//       });

//       updateProvider(providerId, {
//         enabled: true,
//         models,
//         activeModels: defaultActiveModels,
//         pendingActiveModels: defaultActiveModels,
//         loadingModels: false,
//       });

//       toast.success("Clé API enregistrée avec succès");
//       refetchProviders();
//       refetchActiveModels();
//     } catch (error) {
//       console.error("Error saving API key:", error);
//       toast.error("Erreur lors de l'enregistrement de la clé API");
//       updateProvider(providerId, { loadingModels: false });
//     }
//   };

//   const handleDeleteApiKey = async (providerId: string) => {
//     const dbProvider = providersData?.find((p: { name: string; id: string }) => p.name === providerId);
//     if (!dbProvider) return;

//     try {
//       await setApiKeyMutation.mutateAsync({
//         id: dbProvider.id,
//         apiKey: "",
//       });

//       updateProvider(providerId, {
//         enabled: false,
//         apiKey: "",
//         models: [],
//         activeModels: [],
//         pendingActiveModels: [],
//       });

//       toast.success("Clé API supprimée");
//       refetchProviders();
//     } catch (error) {
//       console.error("Error deleting API key:", error);
//       toast.error("Erreur lors de la suppression");
//     }
//   };

//   const toggleModel = (providerId: string, modelId: string) => {
//     const provider = providers.find((p) => p.id === providerId);
//     if (!provider) return;

//     let updatedPendingModels = [...provider.pendingActiveModels];

//     if (updatedPendingModels.includes(modelId)) {
//       updatedPendingModels = updatedPendingModels.filter((id) => id !== modelId);
//     } else {
//       updatedPendingModels.push(modelId);
//     }

//     // Ensure at least one model is selected
//     if (updatedPendingModels.length === 0 && provider.models.length > 0) {
//       updatedPendingModels = [provider.models[0]!.id];
//     }

//     updateProvider(providerId, { pendingActiveModels: updatedPendingModels });
//   };

//   const saveActiveModels = async (providerId: string) => {
//     const provider = providers.find((p) => p.id === providerId);
//     if (!provider) return;

//     const dbProvider = providersData?.find((p: { name: string; id: string }) => p.name === providerId);
//     if (!dbProvider) return;

//     updateProvider(providerId, { savingModels: true });

//     try {
//       await setActiveModelsMutation.mutateAsync({
//         id: dbProvider.id,
//         activeModels: provider.pendingActiveModels,
//       });

//       updateProvider(providerId, {
//         activeModels: provider.pendingActiveModels,
//         savingModels: false
//       });

//       toast.success("Modèles enregistrés");
//       refetchActiveModels();
//     } catch (error) {
//       console.error("Error updating active models:", error);
//       toast.error("Erreur lors de la mise à jour des modèles");
//       updateProvider(providerId, { savingModels: false });
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">Clés APIs</h1>
//         <p className="text-muted-foreground">
//           Gérez vos Clés APIs et les modèles que vous souhaitez utiliser pour chaque provider.
//         </p>
//       </div>
//       {providers.map((provider) => (
//         <Card key={provider.id} >
//           <CardContent className="space-y-6">
//             <div className="space-y-4 pb-6 border-b last:border-b-0 last:pb-0">
//               <a href={provider.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-fit">
//                 <h3 className="text-lg font-semibold">{provider.name}</h3>
//                 <ExternalLink className="h-4 w-4 text-muted-foreground" />
//               </a>

//               <div className="flex gap-4">
//                 <div className="flex-1 space-y-2">
//                   <Label htmlFor={`${provider.id}-key`}>Clé API</Label>
//                   <Input
//                     id={`${provider.id}-key`}
//                     type="password"
//                     placeholder="sk-..."
//                     value={provider.apiKey}
//                     onChange={(e) =>
//                       updateProvider(provider.id, { apiKey: e.target.value })
//                     }
//                     disabled={provider.enabled}
//                   />
//                 </div>
//                 <div className="flex items-end gap-2">
//                   {!provider.enabled ? (
//                     <Button
//                       onClick={() => handleApiKeySave(provider.id)}
//                       disabled={!provider.apiKey || provider.loadingModels}
//                     >
//                       {provider.loadingModels ? (
//                         <>
//                           <Spinner className="mr-2" />
//                           Chargement...
//                         </>
//                       ) : (
//                         "Enregistrer"
//                       )}
//                     </Button>
//                   ) : (
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleDeleteApiKey(provider.id)}
//                     >
//                       <Trash2 className="h-4 w-4 text-destructive" />
//                     </Button>
//                   )}
//                 </div>
//               </div>

//               {provider.enabled && provider.models.length > 0 && (
//                 <div className="space-y-3 pt-2">
//                   <Label>Modèles disponibles</Label>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                     {provider.models.map((model) => (
//                       <div onClick={() => toggleModel(provider.id, model.id)}
//                         key={model.id}
//                         className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent transition-colors cursor-pointer"
//                       >
//                         <Checkbox
//                           id={`${provider.id}-${model.id}`}
//                           checked={provider.pendingActiveModels.includes(model.id)}
//                         />
//                         <Label
//                           className="cursor-pointer"
//                         >
//                           {model.id}
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                   <Button
//                     onClick={() => saveActiveModels(provider.id)}
//                     disabled={
//                       provider.savingModels ||
//                       JSON.stringify(provider.activeModels) === JSON.stringify(provider.pendingActiveModels)
//                     }
//                   >
//                     {provider.savingModels ? (
//                       <>
//                         <Spinner className="mr-2" />
//                         Enregistrement...
//                       </>
//                     ) : (
//                       "Enregistrer les modèles"
//                     )}
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

