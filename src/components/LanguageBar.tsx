import { Globe } from "lucide-react";

const LANGUAGES = [
  "English","Bangla","Hindi","Urdu","Arabic","Spanish","French","German","Chinese",
  "Japanese","Korean","Turkish","Malay","Indonesian","Portuguese","Italian","Russian",
  "Thai","Vietnamese","Dutch"
];

interface Props {
  value: string;
  onChange: (lang: string) => void;
}

const LanguageBar = ({ value, onChange }: Props) => (
  <div className="fixed top-0 left-0 right-0 z-[60] bg-primary/95 backdrop-blur-sm text-primary-foreground">
    <div className="container max-w-6xl mx-auto flex items-center justify-end gap-2 px-4 py-1.5">
      <Globe className="w-3.5 h-3.5 opacity-80" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-primary-foreground text-xs font-medium border-none outline-none cursor-pointer appearance-none pr-4"
        style={{ backgroundImage: "none" }}
      >
        {LANGUAGES.map((l) => (
          <option key={l} value={l} className="text-foreground bg-background">{l}</option>
        ))}
      </select>
    </div>
  </div>
);

export default LanguageBar;
