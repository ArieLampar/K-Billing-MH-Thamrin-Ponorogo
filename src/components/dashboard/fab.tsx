import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingActionButton() {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95"
            >
                <Plus className="h-8 w-8" />
                <span className="sr-only">Input Payment</span>
            </Button>
        </div>
    );
}
