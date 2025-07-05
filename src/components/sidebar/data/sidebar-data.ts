import {
  AlertCircle,
  AppWindow,
  AudioWaveform,
  Ban,
  Bug,
  CheckSquare,
  Command,
  GalleryVerticalEnd,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LockKeyhole,
  MessageSquare,
  Settings,
  ServerCrash,
  UserX,
  Users,
} from &ldquo;lucide-react&rdquo;;
import type { SidebarData } from &ldquo;../types&rdquo;;

export const sidebarData: SidebarData = {
  user: {
    name: &ldquo;satnaing&rdquo;,
    email: &ldquo;satnaingdev@gmail.com&rdquo;,
    avatar: &ldquo;/avatars/shadcn.jpg&rdquo;,
  },
  teams: [
    {
      name: &ldquo;Shadcn Admin&rdquo;,
      logo: Command,
      plan: &ldquo;Vite + ShadcnUI&rdquo;,
    },
    {
      name: &ldquo;Acme Inc&rdquo;,
      logo: GalleryVerticalEnd,
      plan: &ldquo;Enterprise&rdquo;,
    },
    {
      name: &ldquo;Acme Corp.&rdquo;,
      logo: AudioWaveform,
      plan: &ldquo;Startup&rdquo;,
    },
  ],
  navGroups: [
    {
      title: &ldquo;General&rdquo;,
      items: [
        {
          title: &ldquo;Dashboard&rdquo;,
          url: &ldquo;/&rdquo;,
          icon: LayoutDashboard,
        },
        {
          title: &ldquo;Tasks&rdquo;,
          url: &ldquo;/tasks&rdquo;,
          icon: CheckSquare,
        },
        {
          title: &ldquo;Apps&rdquo;,
          url: &ldquo;/apps&rdquo;,
          icon: AppWindow,
        },
        {
          title: &ldquo;Chats&rdquo;,
          url: &ldquo;/chats&rdquo;,
          badge: &ldquo;3&rdquo;,
          icon: MessageSquare,
        },
        {
          title: &ldquo;Users&rdquo;,
          url: &ldquo;/users&rdquo;,
          icon: Users,
        },
      ],
    },
    {
      title: &ldquo;Pages&rdquo;,
      items: [
        {
          title: &ldquo;Auth&rdquo;,
          icon: Lock,
          items: [
            {
              title: &ldquo;Sign In&rdquo;,
              url: &ldquo;/sign-in&rdquo;,
            },
            {
              title: &ldquo;Sign In (2 Col)&rdquo;,
              url: &ldquo;/sign-in-2&rdquo;,
            },
            {
              title: &ldquo;Sign Up&rdquo;,
              url: &ldquo;/sign-up&rdquo;,
            },
            {
              title: &ldquo;Forgot Password&rdquo;,
              url: &ldquo;/forgot-password&rdquo;,
            },
            {
              title: &ldquo;OTP&rdquo;,
              url: &ldquo;/otp&rdquo;,
            },
          ],
        },
        {
          title: &ldquo;Errors&rdquo;,
          icon: Bug,
          items: [
            {
              title: &ldquo;Unauthorized&rdquo;,
              url: &ldquo;/401&rdquo;,
              icon: LockKeyhole,
            },
            {
              title: &ldquo;Forbidden&rdquo;,
              url: &ldquo;/403&rdquo;,
              icon: UserX,
            },
            {
              title: &ldquo;Not Found&rdquo;,
              url: &ldquo;/404&rdquo;,
              icon: AlertCircle,
            },
            {
              title: &ldquo;Internal Server Error&rdquo;,
              url: &ldquo;/500&rdquo;,
              icon: ServerCrash,
            },
            {
              title: &ldquo;Maintenance Error&rdquo;,
              url: &ldquo;/503&rdquo;,
              icon: Ban,
            },
          ],
        },
      ],
    },
    {
      title: &ldquo;Other&rdquo;,
      items: [
        {
          title: &ldquo;Settings&rdquo;,
          icon: Settings,
          url: &ldquo;/settings&rdquo;,
        },
        {
          title: &ldquo;Help Center&rdquo;,
          url: &ldquo;/help-center&rdquo;,
          icon: HelpCircle,
        },
      ],
    },
  ],
};
