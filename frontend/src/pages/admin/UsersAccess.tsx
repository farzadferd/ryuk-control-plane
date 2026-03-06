import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Link2, UserPlus, Ban, Eye, Shield, Clock, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface PendingInvite {
  id: string;
  email: string;
  role: "sandbox_user" | "admin";
  sandboxDuration: string;
  inviteExpiration: string;
  createdBy: string;
  status: "pending" | "expired" | "redeemed";
}

interface ActiveUser {
  id: string;
  name: string;
  email: string;
  role: "sandbox_user" | "admin";
  sandboxStatus: "active" | "expiring" | "locked";
  accessExpiration: string;
  lastLogin: string;
}

const PENDING_INVITES: PendingInvite[] = [
  {
    id: "inv-001",
    email: "analyst@corp.io",
    role: "sandbox_user",
    sandboxDuration: "7 days",
    inviteExpiration: "23:14:02",
    createdBy: "admin@ryuk.sys",
    status: "pending",
  },
  {
    id: "inv-002",
    email: "security@audit.com",
    role: "admin",
    sandboxDuration: "3 days",
    inviteExpiration: "47:30:15",
    createdBy: "admin@ryuk.sys",
    status: "pending",
  },
  {
    id: "inv-003",
    email: "intern@summer.co",
    role: "sandbox_user",
    sandboxDuration: "1 day",
    inviteExpiration: "00:00:00",
    createdBy: "ops@ryuk.sys",
    status: "expired",
  },
];

const ACTIVE_USERS: ActiveUser[] = [
  {
    id: "usr-001",
    name: "Sarah Chen",
    email: "s.chen@corp.io",
    role: "admin",
    sandboxStatus: "active",
    accessExpiration: "14d 06:32:11",
    lastLogin: "2 hours ago",
  },
  {
    id: "usr-002",
    name: "Marcus Webb",
    email: "m.webb@security.net",
    role: "sandbox_user",
    sandboxStatus: "expiring",
    accessExpiration: "0d 04:15:33",
    lastLogin: "15 minutes ago",
  },
  {
    id: "usr-003",
    name: "Priya Sharma",
    email: "p.sharma@analytics.co",
    role: "sandbox_user",
    sandboxStatus: "active",
    accessExpiration: "5d 18:45:00",
    lastLogin: "1 day ago",
  },
  {
    id: "usr-004",
    name: "James Morton",
    email: "j.morton@legacy.sys",
    role: "sandbox_user",
    sandboxStatus: "locked",
    accessExpiration: "Expired",
    lastLogin: "3 days ago",
  },
];

export default function UsersAccess() {
  const navigate = useNavigate();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("sandbox_user");
  const [sandboxDuration, setSandboxDuration] = useState<string>("7");
  const [inviteExpiration, setInviteExpiration] = useState<string>("24");
  const [inviteReason, setInviteReason] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const { toast } = useToast();

  const handleCreateInvite = () => {
    const linkId = Math.random().toString(36).substring(2, 15);
    setGeneratedLink(`https://ryuk.sys/invite/${linkId}`);
    setInviteModalOpen(false);
    setConfirmationOpen(true);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Invite link copied to clipboard.",
    });
  };

  const handleRevokeInvite = (id: string) => {
    toast({
      title: "Invite revoked",
      description: `Invite ${id} has been revoked and logged.`,
    });
  };

  const resetInviteForm = () => {
    setInviteEmail("");
    setInviteRole("sandbox_user");
    setSandboxDuration("7");
    setInviteExpiration("24");
    setInviteReason("");
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-muted text-muted-foreground";
      case "expired":
        return "bg-destructive/20 text-destructive";
      case "redeemed":
        return "bg-primary/20 text-primary";
      case "active":
        return "bg-[hsl(120_40%_45%)/20] text-[hsl(120_40%_45%)]";
      case "expiring":
        return "bg-[hsl(45_100%_51%)/20] text-[hsl(45_100%_40%)]";
      case "locked":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="px-12 py-8 border-b border-border">
        <div className="flex items-baseline gap-4 mb-1">
          <h1 className="display-system text-foreground">Users & Access</h1>
          <span className="label-system">Provisioning</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-muted-foreground text-sm max-w-xl">
            Provision access to Ryuk securely using time-bound invites.
          </p>
          <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
            <DialogTrigger asChild>
              <button 
                onClick={() => {
                  resetInviteForm();
                  setInviteModalOpen(true);
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-3 h-3" />
                + Invite User
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-mono">Provision New Access</DialogTitle>
                <DialogDescription>
                  Create a time-bound invite for secure onboarding.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="label-system">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@organization.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-system">Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox_user">sandbox_user</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="label-system">Sandbox Duration</Label>
                    <Select value={sandboxDuration} onValueChange={setSandboxDuration}>
                      <SelectTrigger className="font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="label-system">Invite Expiration</Label>
                    <Select value={inviteExpiration} onValueChange={setInviteExpiration}>
                      <SelectTrigger className="font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                        <SelectItem value="72">72 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason" className="label-system">Reason (optional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Summer intern – analytics access"
                    value={inviteReason}
                    onChange={(e) => setInviteReason(e.target.value)}
                    className="font-mono text-sm resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>All provisioning actions are logged for audit.</span>
                </div>
              </div>
              <DialogFooter>
                <button 
                  onClick={() => setInviteModalOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateInvite} 
                  disabled={!inviteEmail}
                  className="text-xs text-foreground hover:text-muted-foreground transition-colors px-4 py-2 border border-border disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create Invite →
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Invite Confirmation Modal */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Invite Created
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-md font-mono text-xs break-all">
              {generatedLink}
            </div>
            <button 
              className="w-full gap-2 flex items-center justify-center text-xs border border-border py-2.5 hover:bg-muted transition-colors"
              onClick={() => handleCopyLink(generatedLink)}
            >
              <Copy className="w-3 h-3" />
              Copy Invite Link
            </button>
            <div className="flex items-start gap-2 p-3 border border-[hsl(45_100%_51%)/30] bg-[hsl(45_100%_51%)/5] rounded-md">
              <AlertTriangle className="w-4 h-4 text-[hsl(45_100%_40%)] shrink-0 mt-0.5" />
              <p className="text-xs text-[hsl(45_100%_40%)]">
                This link will not be shown again. Store it securely.
              </p>
            </div>
            <div className="space-y-3 text-sm pt-2">
              <div className="flex justify-between">
                <span className="label-system">Role</span>
                <Badge variant="outline" className="font-mono text-xs">{inviteRole}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="label-system">Duration</span>
                <span className="font-mono text-xs">{sandboxDuration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="label-system">Expires In</span>
                <span className="font-mono text-xs">{inviteExpiration}h</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button 
              onClick={() => setConfirmationOpen(false)} 
              className="w-full text-xs border border-border py-2.5 hover:bg-muted transition-colors"
            >
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tabbed Content */}
      <div className="flex-1 overflow-y-auto px-12 py-8">
        <Tabs defaultValue="pending" className="w-full max-w-5xl">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start gap-8 h-auto p-0 mb-8">
            <TabsTrigger 
              value="pending" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 pb-3"
            >
              <span className="font-mono text-xs mr-2 opacity-50">01</span>
              Pending Invites
            </TabsTrigger>
            <TabsTrigger 
              value="active"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 pb-3"
            >
              <span className="font-mono text-xs mr-2 opacity-50">02</span>
              Active Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-0">
            {PENDING_INVITES.length > 0 ? (
              <div className="space-y-px">
                {/* Header */}
                <div className="grid grid-cols-7 gap-4 py-3 text-[10px] text-muted-foreground uppercase tracking-wider">
                  <span>Email</span>
                  <span>Role</span>
                  <span>Sandbox</span>
                  <span>Expires In</span>
                  <span>Created By</span>
                  <span>Status</span>
                  <span className="text-right">Actions</span>
                </div>

                {/* Rows */}
                {PENDING_INVITES.map((invite) => (
                  <div 
                    key={invite.id}
                    className="grid grid-cols-7 gap-4 py-4 border-t border-border text-sm group hover:bg-secondary/30 -mx-4 px-4 items-center"
                  >
                    <span className="font-mono text-foreground truncate">{invite.email}</span>
                    <span>
                      <Badge 
                        variant="outline" 
                        className={`font-mono text-[10px] ${invite.role === 'admin' ? 'border-foreground' : ''}`}
                      >
                        {invite.role}
                      </Badge>
                    </span>
                    <span className="font-mono text-muted-foreground">{invite.sandboxDuration}</span>
                    <span className="font-mono flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {invite.inviteExpiration}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground truncate">{invite.createdBy}</span>
                    <span>
                      <Badge className={`font-mono text-[10px] uppercase ${getStatusClass(invite.status)}`}>
                        {invite.status}
                      </Badge>
                    </span>
                    <span className="flex items-center justify-end gap-3">
                      <button 
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 flex items-center gap-1"
                        onClick={() => handleCopyLink(`https://ryuk.sys/invite/${invite.id}`)}
                        disabled={invite.status !== "pending"}
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                      <button 
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 flex items-center gap-1"
                        onClick={() => handleRevokeInvite(invite.id)}
                        disabled={invite.status !== "pending"}
                      >
                        <Ban className="w-3 h-3" />
                        Revoke
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-sm">No pending invites. Create an invite to onboard a new user.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            <div className="space-y-px">
              {/* Header */}
              <div className="grid grid-cols-7 gap-4 py-3 text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Sandbox</span>
                <span>Expires</span>
                <span>Last Login</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Rows */}
              {ACTIVE_USERS.map((user) => (
                <div 
                  key={user.id}
                  className="grid grid-cols-7 gap-4 py-4 border-t border-border text-sm group hover:bg-secondary/30 -mx-4 px-4 items-center"
                >
                  <span
                    className="font-medium text-foreground cursor-pointer hover:underline"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    {user.name}
                  </span>
                  <span className="font-mono text-muted-foreground truncate">{user.email}</span>
                  <span>
                    <Badge 
                      variant="outline" 
                      className={`font-mono text-[10px] ${user.role === 'admin' ? 'border-foreground' : ''}`}
                    >
                      {user.role}
                    </Badge>
                  </span>
                  <span>
                    <Badge className={`font-mono text-[10px] uppercase ${getStatusClass(user.sandboxStatus)}`}>
                      {user.sandboxStatus}
                    </Badge>
                  </span>
                  <span className="font-mono text-muted-foreground">{user.accessExpiration}</span>
                  <span className="text-muted-foreground">{user.lastLogin}</span>
                  <span className="flex items-center justify-end gap-3">
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Audit
                    </button>
                    <button 
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 flex items-center gap-1"
                      disabled={user.sandboxStatus === "locked"}
                    >
                      <Ban className="w-3 h-3" />
                      Disable
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}