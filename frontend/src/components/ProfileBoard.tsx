import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User, Mail, Calendar, LogOut } from "lucide-react";

interface ProfileBoardProps {
  user: any;
  onClose: () => void;
}

export const ProfileBoard: React.FC<ProfileBoardProps> = ({ user, onClose }) => {
  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No user data available.
      </div>
    );
  }

  const joinedDate = user.iat
    ? new Date(user.iat * 1000).toLocaleDateString()
    : "Unknown";

  return (
    <div className="p-6 bg-gradient-to-br from-purple-700/80 to-yellow-500/40 rounded-2xl shadow-lg text-white space-y-6">
      <Card className="bg-purple-800/40 border border-purple-400/30 shadow-md backdrop-blur-sm">
        <CardHeader className="text-center border-b border-purple-300/20 pb-4">
          <div className="flex flex-col items-center">
            <div className="bg-yellow-400 text-purple-900 font-bold text-3xl w-20 h-20 flex items-center justify-center rounded-full shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h2 className="text-2xl font-semibold mt-3">{user.name}</h2>
            <p className="text-yellow-200/80 text-sm">Active Member</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 mt-4">
          <div className="flex items-center gap-3 text-slate-100">
            <Mail className="w-5 h-5 text-yellow-300" />
            <span>{user.email || "No email found"}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-100">
            <Calendar className="w-5 h-5 text-yellow-300" />
            <span>Joined: {joinedDate}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          onClick={onClose}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
        >
          Close
        </Button>
        <Button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="bg-red-500 hover:bg-red-400 text-white flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
