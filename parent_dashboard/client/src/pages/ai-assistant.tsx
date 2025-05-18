import SimpleChat from "@/components/SimpleChat";

export default function AIAssistantPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Parenting Assistant</h1>
      </div>
      <div className="max-w-4xl mx-auto">
        <SimpleChat />
      </div>
    </div>
  );
}