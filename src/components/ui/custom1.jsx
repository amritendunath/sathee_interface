import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"


export function QuickResponseDropdown({ value, onChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
        //   className="bg-[#23283a] text-white rounded-full px-4 py-2 min-w-[160px] flex justify-between items-center"
          className=" text-sm bg-transparent hover:bg-[#23283a] text-white rounded-[32px] border border-[#23283a] appearance-none pr-8"
        >
          {value === "deep" ? "Deep Research" : "Quick response"}
          <span className="ml-1">
            <i className="fas fa-caret-down"></i>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-38 bg-[#23283a] text-white rounded-2xl shadow-lg border border-[#23283a] mt-2">
        <DropdownMenuItem
          onClick={() => onChange("quick")}
          className={`px-4 py-2 cursor-pointer hover:bg-[#31374a] rounded-xl ${
            value === "quick" ? "bg-[#31374a] font-semibold" : ""
          }`}
        >
        ⚡Quick Response
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onChange("deep")}
          className={`px-4 py-2 cursor-pointer hover:bg-[#31374a] rounded-xl mt-1 ${
            value === "deep" ? "bg-[#31374a] font-semibold" : ""
          }`}
        >
        🧠Deep Research
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}