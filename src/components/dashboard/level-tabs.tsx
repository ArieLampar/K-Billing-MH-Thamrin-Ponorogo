import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LevelTabsProps {
    currentLevel: string;
    onLevelChange: (level: string) => void;
}

const LEVELS = ["All", "7A", "6A", "5A", "4A", "3A", "2A", "A", "B", "C", "D", "E", "F"];

export function LevelTabs({ currentLevel, onLevelChange }: LevelTabsProps) {
    return (
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
            <Tabs value={currentLevel} onValueChange={onLevelChange} className="w-max">
                <TabsList className="bg-transparent p-0 gap-2 h-auto">
                    {LEVELS.map((level) => (
                        <TabsTrigger
                            key={level}
                            value={level}
                            className="rounded-full px-6 py-2.5 data-[state=active]:bg-[#005197] data-[state=active]:text-white border border-transparent data-[state=inactive]:border-gray-200 data-[state=inactive]:bg-white shadow-sm"
                        >
                            {level}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}
