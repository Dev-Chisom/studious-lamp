import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  type LightbulbIcon as LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  User,
  X,
  RefreshCwIcon as Refresh,
  type LucideIcon,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export type Icon = LucideIcon

const Google = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <g>
      <path fill="#4285F4" d="M21.805 10.023h-9.765v3.955h5.627c-.243 1.3-1.51 3.82-5.627 3.82-3.386 0-6.145-2.8-6.145-6.25s2.759-6.25 6.145-6.25c1.93 0 3.23.82 3.97 1.53l2.71-2.63C17.09 2.7 14.97 1.5 12.04 1.5 6.48 1.5 2 5.98 2 11.5s4.48 10 10.04 10c5.77 0 9.56-4.04 9.56-9.74 0-.66-.07-1.16-.16-1.64z"/>
      <path fill="#34A853" d="M3.153 7.345l3.27 2.4c.89-1.7 2.59-2.8 4.62-2.8 1.13 0 2.13.39 2.92 1.03l2.71-2.63C15.09 2.7 13.09 1.5 10.04 1.5c-3.86 0-7.1 2.7-8.36 6.34z"/>
      <path fill="#FBBC05" d="M12.04 21.5c2.97 0 5.45-.98 7.27-2.67l-3.34-2.74c-.93.63-2.13 1.01-3.93 1.01-3.01 0-5.57-2.01-6.48-4.7l-3.27 2.53c1.25 3.6 4.49 6.57 9.75 6.57z"/>
      <path fill="#EA4335" d="M21.805 10.023h-9.765v3.955h5.627c-.243 1.3-1.51 3.82-5.627 3.82-3.386 0-6.145-2.8-6.145-6.25s2.759-6.25 6.145-6.25c1.93 0 3.23.82 3.97 1.53l2.71-2.63C17.09 2.7 14.97 1.5 12.04 1.5 6.48 1.5 2 5.98 2 11.5s4.48 10 10.04 10c5.77 0 9.56-4.04 9.56-9.74 0-.66-.07-1.16-.16-1.64z"/>
    </g>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.46 5.924c-.793.352-1.646.59-2.54.698a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.48 0-4.49 2.014-4.49 4.496 0 .352.04.696.116 1.025C7.728 9.37 4.1 7.6 1.67 4.905c-.386.664-.607 1.437-.607 2.26 0 1.56.793 2.94 2.003 3.75-.736-.023-1.428-.225-2.034-.563v.057c0 2.18 1.55 4.002 3.604 4.418-.377.104-.775.16-1.186.16-.29 0-.567-.028-.84-.08.568 1.77 2.22 3.06 4.18 3.09A8.98 8.98 0 0 1 2 19.54a12.68 12.68 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.77 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z" />
  </svg>
);

export const Icons = {
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertCircle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  twitter: TwitterIcon,
  check: Check,
  alertCircle: AlertCircle,
  refresh: Refresh,
  google: Google,
  eye: Eye,
  eyeOff: EyeOff,
  mail: Mail,
  lock: Lock,
  search: Search,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
}
