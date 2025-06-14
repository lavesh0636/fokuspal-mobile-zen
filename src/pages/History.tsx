import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Target } from "lucide-react";

interface FocusSession {
  id: string;
  date: Date;
  duration: number; // in minutes
  completed: boolean;
  type: "work" | "break" | "long-break";
}

const History = () => {
  // Mock data - replace with real data later
  const sessions: FocusSession[] = [
    {
      id: "1",
      date: new Date(2024, 5, 14, 9, 0),
      duration: 25,
      completed: true,
      type: "work",
    },
    {
      id: "2",
      date: new Date(2024, 5, 14, 9, 30),
      duration: 5,
      completed: true,
      type: "break",
    },
    {
      id: "3",
      date: new Date(2024, 5, 14, 10, 0),
      duration: 25,
      completed: true,
      type: "work",
    },
    {
      id: "4",
      date: new Date(2024, 5, 14, 10, 30),
      duration: 5,
      completed: true,
      type: "break",
    },
    {
      id: "5",
      date: new Date(2024, 5, 14, 11, 0),
      duration: 25,
      completed: false,
      type: "work",
    },
    {
      id: "6",
      date: new Date(2024, 5, 13, 14, 0),
      duration: 25,
      completed: true,
      type: "work",
    },
    {
      id: "7",
      date: new Date(2024, 5, 13, 14, 30),
      duration: 15,
      completed: true,
      type: "long-break",
    },
  ];

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case "work":
        return "Focus Session";
      case "break":
        return "Short Break";
      case "long-break":
        return "Long Break";
      default:
        return "Session";
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "work":
        return "bg-primary text-primary-foreground";
      case "break":
        return "bg-secondary text-secondary-foreground";
      case "long-break":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Group sessions by date
  const groupedSessions = sessions.reduce((groups, session) => {
    const dateKey = session.date.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
    return groups;
  }, {} as Record<string, FocusSession[]>);

  const totalSessions = sessions.filter(s => s.type === "work").length;
  const completedSessions = sessions.filter(s => s.type === "work" && s.completed).length;
  const totalFocusTime = sessions
    .filter(s => s.type === "work" && s.completed)
    .reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Session History</h1>
        <p className="text-muted-foreground">Review your focus journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">Focus sessions started</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{completedSessions}</div>
            <p className="text-xs text-muted-foreground">{Math.round((completedSessions / totalSessions) * 100)}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m</div>
            <p className="text-xs text-muted-foreground">Time well spent</p>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-6">
              {Object.entries(groupedSessions)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([dateKey, dateSessions]) => (
                  <div key={dateKey} className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground sticky top-0 bg-background py-1">
                      {formatDate(new Date(dateKey))}
                    </h3>
                    <div className="space-y-2">
                      {dateSessions
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <Badge className={getSessionTypeColor(session.type)}>
                                {getSessionTypeLabel(session.type)}
                              </Badge>
                              <div>
                                <div className="text-sm font-medium">
                                  {session.duration} minutes
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatTime(session.date)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={session.completed ? "default" : "destructive"}>
                                {session.completed ? "Completed" : "Incomplete"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;